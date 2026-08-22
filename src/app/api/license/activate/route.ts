// src/app/api/license/activate/route.ts
//
// POST /api/license/activate
//
// Authenticated endpoint for applying a metuniverse.com license code
// from the account page. The user pastes their activation code (the
// raw JWT), and this validates it and applies the license to their
// own account.
//
// Adapted from MetTutor's /api/activate/code pattern:
//   - Requires an authenticated session
//   - Verifies the JWT's RS256 signature against METUNIVERSE_LICENSE_PUBLIC_KEY
//   - Checks the nonce hasn't been used before
//   - Applies the license
//
// Departs from that pattern in two ways specific to MET and Teddy's
// seat-pool model:
//   1. A "family" code UPDATES the caller's existing family license
//      in place (created automatically as a trial at registration —
//      O2), rather than creating a second row. This keeps every
//      child's existing profiles.license_id pointing at a license
//      that's now upgraded, instead of orphaning them on the old row.
//   2. A "classroom"/"school"/"district" code always INSERTS a new
//      license row — an educator legitimately holds multiple license
//      rows over time (one per section, one per grant year, etc.),
//      and there's no single "the" existing license to update.

import { NextRequest, NextResponse } from "next/server"
import * as jose from "jose"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { loadProfileByAuthUserId } from "@/lib/auth/profiles"

interface LicensePayload {
  iss: string
  sub: string
  plan: "family" | "classroom" | "school" | "district"
  seats: number
  billing_cycle: string
  iat: number
  exp: number
  valid_until: string
  nonce: string
  license_id: string
  order_id: number
  distributable?: boolean
}

const VALID_PLANS = ["family", "classroom", "school", "district"] as const

const PLAN_LABELS: Record<string, string> = {
  family: "Family",
  classroom: "Classroom",
  school: "School",
  district: "District",
}

// Which profile role is allowed to redeem which plan. A mismatch
// means the code (or the account) is wrong, not a permissions edge
// case worth quietly allowing.
const PLAN_REQUIRES_ROLE: Record<string, "parent" | "educator"> = {
  family: "parent",
  classroom: "educator",
  school: "educator",
  district: "educator",
}

function getPublicKey(): string {
  const key = process.env.METUNIVERSE_LICENSE_PUBLIC_KEY
  if (!key) throw new Error("METUNIVERSE_LICENSE_PUBLIC_KEY not set.")
  return key.replace(/\\n/g, "\n")
}

/**
 * Extract the JWT from user input — either a raw token or (in case a
 * future email template includes one) a URL with ?token=.
 */
function extractToken(input: string): string | null {
  const trimmed = input.trim()

  try {
    const url = new URL(trimmed)
    const tokenParam = url.searchParams.get("token")
    if (tokenParam) return tokenParam
  } catch {
    // Not a URL — continue
  }

  if (/^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(trimmed)) {
    return trimmed
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    // ── Auth: require logged-in user ──
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const admin = createAdminClient()

    // Resolve the caller's OWN profile via auth_user_id (not by
    // assuming profiles.id === user.id — see profiles.ts header note
    // on why that assumption no longer holds post-migration-0005).
    const callerProfile = await loadProfileByAuthUserId(admin, user.id)
    if (!callerProfile) {
      return NextResponse.json({ error: "No profile found for this account." }, { status: 404 })
    }

    // ── Parse request body ──
    const body = await request.json()
    const rawInput = body?.code || body?.token || ""

    if (!rawInput || typeof rawInput !== "string") {
      return NextResponse.json(
        { error: "Please paste your license code." },
        { status: 400 }
      )
    }

    const token = extractToken(rawInput)
    if (!token) {
      return NextResponse.json(
        { error: "That doesn't look like a valid license code. Paste the code exactly as it appeared in your email." },
        { status: 400 }
      )
    }

    // ── Verify JWT ──
    const publicKeyPem = getPublicKey()
    const publicKey = await jose.importSPKI(publicKeyPem, "RS256")

    let payload: LicensePayload
    try {
      const { payload: decoded } = await jose.jwtVerify(token, publicKey, {
        issuer: "metuniverse.com",
        algorithms: ["RS256"],
      })
      payload = decoded as unknown as LicensePayload
    } catch (jwtError: any) {
      if (jwtError.code === "ERR_JWT_EXPIRED") {
        return NextResponse.json(
          { error: "This license code has expired. Please check your MET Universe order page for a current code, or contact support." },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: "Invalid license code. Please check and try again." },
        { status: 400 }
      )
    }

    // ── Validate plan ──
    if (!VALID_PLANS.includes(payload.plan)) {
      return NextResponse.json({ error: "Invalid plan in license code." }, { status: 400 })
    }

    // ── Verify email matches logged-in user (skip for distributable) ──
    const tokenEmail = payload.sub.toLowerCase().trim()
    const userEmail = user.email?.toLowerCase().trim()

    if (!payload.distributable && tokenEmail !== userEmail) {
      return NextResponse.json(
        { error: `This license was issued for ${tokenEmail}. You're logged in as ${userEmail}. Log in with the email used for the purchase, or ask whoever bought it for the code if it's meant to be shared.` },
        { status: 403 }
      )
    }

    // ── Verify role matches plan ──
    const requiredRole = PLAN_REQUIRES_ROLE[payload.plan]
    if (callerProfile.role !== requiredRole) {
      return NextResponse.json(
        { error: `This is a ${PLAN_LABELS[payload.plan]} code, which needs a ${requiredRole} account to redeem. You're logged in as a ${callerProfile.role}.` },
        { status: 403 }
      )
    }

    // ── Check nonce (replay prevention) ──
    const { data: existingNonce } = await admin
      .from("used_license_nonces")
      .select("nonce")
      .eq("nonce", payload.nonce)
      .maybeSingle()

    if (existingNonce) {
      return NextResponse.json(
        { error: "This license code has already been applied." },
        { status: 400 }
      )
    }

    // ── Apply the license ──
    let licenseError: string | undefined

    if (payload.plan === "family") {
      // Upgrade-in-place: find the caller's existing family license
      // (the auto-created trial, if this is their first activation).
      const { data: existing } = await admin
        .from("licenses")
        .select("id")
        .eq("owner_id", callerProfile.id)
        .eq("license_type", "family")
        .maybeSingle()

      if (existing) {
        const { error } = await admin
          .from("licenses")
          .update({
            seats_total: payload.seats,
            status: "active",
            valid_from: new Date().toISOString(),
            valid_until: payload.valid_until,
            external_license_id: payload.license_id,
            source: "metuniverse_key",
          })
          .eq("id", existing.id)
        licenseError = error?.message
      } else {
        const { error } = await admin.from("licenses").insert({
          license_type: "family",
          owner_id: callerProfile.id,
          seats_total: payload.seats,
          status: "active",
          valid_until: payload.valid_until,
          external_license_id: payload.license_id,
          source: "metuniverse_key",
        })
        licenseError = error?.message
      }
    } else {
      // classroom/school/district: always a new row — an educator may
      // legitimately hold several license rows over time.
      const { error } = await admin.from("licenses").insert({
        license_type: payload.plan,
        owner_id: callerProfile.id,
        seats_total: payload.seats,
        status: "active",
        valid_until: payload.valid_until,
        external_license_id: payload.license_id,
        source: "metuniverse_key",
      })
      licenseError = error?.message
    }

    if (licenseError) {
      console.error("[license/activate] failed to apply license:", licenseError)
      return NextResponse.json(
        { error: "Failed to apply license. Please try again or contact support." },
        { status: 500 }
      )
    }

    // ── Record nonce ──
    await admin.from("used_license_nonces").insert({
      nonce: payload.nonce,
      license_id: payload.license_id,
      event_type: "activate_code",
    })

    const planLabel = PLAN_LABELS[payload.plan] ?? payload.plan
    console.log(`License applied via code: ${userEmail} → ${payload.plan} (${payload.seats} seats)`)

    return NextResponse.json({
      success: true,
      plan: payload.plan,
      planLabel,
      seats: payload.seats,
      message: `Your ${planLabel} license (${payload.seats} seats) has been activated!`,
    })
  } catch (error: any) {
    console.error("License code error:", error.message)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
