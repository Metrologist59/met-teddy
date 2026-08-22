// src/app/api/license/webhook/route.ts
//
// POST /api/license/webhook
//
// Receives signed lifecycle event payloads from metuniverse.com's
// WooCommerce Subscriptions plugin. Each payload is an RS256-signed
// JWT with a 5-minute expiry window (anti-replay only — see the
// plugin's class-license-generator.php for why this is separate from
// the license's actual valid_until).
//
// Simpler than the pattern this was adapted from: MetTutor's webhook
// looked up a student by email, then updated flat columns on that one
// row (or looped every row sharing that license across a team). MET
// and Teddy's licenses table already carries external_license_id, so
// this just finds ONE license row directly and updates it — every
// profile referencing that license_id inherits the change for free
// via license_allows_writes() reading the row live.
//
// Events handled:
//   license.updated       — renewal: fresh valid_until
//   license.suspended     — payment failed: valid_until = now, starts grace
//   license.reactivated   — payment recovered: fresh valid_until
//   license.revoked       — cancelled/expired: canceled, no grace
//   license.seats_changed — seats_total update

import { NextRequest, NextResponse } from "next/server"
import * as jose from "jose"
import { createAdminClient } from "@/lib/supabase/admin"

interface LifecyclePayload {
  iss: string
  sub: string
  event: string
  plan: string
  license_id: string
  valid_until: string | null
  nonce: string
  iat: number
  exp: number
  reason?: string
  seats?: number
}

const VALID_EVENTS = [
  "license.updated",
  "license.suspended",
  "license.reactivated",
  "license.revoked",
  "license.seats_changed",
]

function getPublicKey(): string {
  const key = process.env.METUNIVERSE_LICENSE_PUBLIC_KEY
  if (!key) throw new Error("METUNIVERSE_LICENSE_PUBLIC_KEY not set.")
  return key.replace(/\\n/g, "\n")
}

export async function POST(request: NextRequest) {
  const signatureHeader = request.headers.get("X-METUniverse-Signature")
  const eventHeader = request.headers.get("X-METUniverse-Event")

  if (!signatureHeader || !eventHeader) {
    return NextResponse.json({ error: "Missing required headers" }, { status: 400 })
  }

  const signedPayload = signatureHeader.startsWith("Bearer ")
    ? signatureHeader.slice(7)
    : signatureHeader

  try {
    // ── Step 1: Verify RS256 signature ──
    const publicKeyPem = getPublicKey()
    const publicKey = await jose.importSPKI(publicKeyPem, "RS256")

    let payload: LifecyclePayload
    try {
      const { payload: decoded } = await jose.jwtVerify(signedPayload, publicKey, {
        issuer: "metuniverse.com",
        algorithms: ["RS256"],
      })
      payload = decoded as unknown as LifecyclePayload
    } catch (jwtError: any) {
      console.error("Webhook JWT verification failed:", jwtError.message)
      return NextResponse.json({ error: "Invalid signature or expired payload" }, { status: 401 })
    }

    // ── Step 2: Validate event type + header match ──
    if (!VALID_EVENTS.includes(payload.event)) {
      console.warn("Unknown lifecycle event:", payload.event)
      return NextResponse.json({ error: "Unknown event type" }, { status: 400 })
    }

    if (payload.event !== eventHeader) {
      console.warn("Event header mismatch:", eventHeader, "!==", payload.event)
      return NextResponse.json({ error: "Event header mismatch" }, { status: 400 })
    }

    const admin = createAdminClient()

    // ── Step 3: Nonce check (replay prevention, idempotent 200 on repeat) ──
    const { data: existingNonce } = await admin
      .from("used_license_nonces")
      .select("nonce")
      .eq("nonce", payload.nonce)
      .maybeSingle()

    if (existingNonce) {
      // Idempotent — return 200 so metuniverse.com doesn't retry.
      console.warn("Webhook nonce already consumed:", payload.nonce)
      return NextResponse.json({ status: "already_processed" }, { status: 200 })
    }

    // ── Step 4: Find the target license ──
    const { data: license, error: lookupError } = await admin
      .from("licenses")
      .select("id, status, seats_total")
      .eq("external_license_id", payload.license_id)
      .maybeSingle()

    if (lookupError) {
      console.error("Webhook: license lookup error:", lookupError.message)
      return NextResponse.json({ error: "Database lookup failed" }, { status: 500 })
    }

    if (!license) {
      console.error("Webhook: no license found for external_license_id:", payload.license_id)
      return NextResponse.json({ error: `License not found: ${payload.license_id}` }, { status: 404 })
    }

    // ── Step 5: Route by event type ──
    let updateFields: Record<string, any> = {}

    switch (payload.event) {
      case "license.updated": {
        // Renewal — real new period end, sent explicitly by the
        // plugin (not reconstructed from the anti-replay exp).
        updateFields = {
          status: "active",
          valid_until: payload.valid_until,
        }
        console.log(`Webhook: license.updated for ${payload.license_id} → valid_until ${payload.valid_until}`)
        break
      }

      case "license.suspended": {
        // Payment failed. valid_until = now starts the 10-day grace
        // period (license_allows_writes()) immediately.
        updateFields = {
          status: "expired",
          valid_until: payload.valid_until ?? new Date().toISOString(),
        }
        console.log(`Webhook: license.suspended for ${payload.license_id} (was ${license.status})`)
        break
      }

      case "license.reactivated": {
        updateFields = {
          status: "active",
          valid_until: payload.valid_until,
        }
        console.log(`Webhook: license.reactivated for ${payload.license_id} → valid_until ${payload.valid_until}`)
        break
      }

      case "license.revoked": {
        // Cancelled or expired for good. No grace period — immediate
        // read-only per the licensing design doc's O3 decision.
        updateFields = {
          status: "canceled",
          valid_until: payload.valid_until ?? new Date().toISOString(),
        }
        console.log(`Webhook: license.revoked for ${payload.license_id} (reason: ${payload.reason})`)
        break
      }

      case "license.seats_changed": {
        if (typeof payload.seats === "number" && payload.seats > 0) {
          updateFields = { seats_total: payload.seats }
        }
        console.log(`Webhook: license.seats_changed for ${payload.license_id} → ${payload.seats} seats`)
        break
      }

      default:
        return NextResponse.json({ error: "Unhandled event" }, { status: 400 })
    }

    // ── Step 6: Apply update ──
    if (Object.keys(updateFields).length > 0) {
      const { error: updateError } = await admin
        .from("licenses")
        .update(updateFields)
        .eq("id", license.id)

      if (updateError) {
        console.error("Webhook: failed to update license:", updateError.message)
        return NextResponse.json({ error: "Database update failed" }, { status: 500 })
      }
    }

    // ── Step 7: Record nonce ──
    await admin.from("used_license_nonces").insert({
      nonce: payload.nonce,
      license_id: payload.license_id,
      event_type: payload.event,
    })

    return NextResponse.json(
      { status: "processed", event: payload.event, license_id: payload.license_id },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Webhook error:", error.message)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
