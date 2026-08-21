// src/app/api/register/route.ts
// Registration API for MET and Teddy — the single server-side entry
// point for account creation.
//
// Deliberately does NOT accept a userId from the client. It calls
// auth.signUp() itself (via the cookie-bound @supabase/ssr server
// client — required so the PKCE verifier cookie lands correctly, see
// docs on /auth/confirm), then writes the profile and any pending
// COPPA consent with the service-role admin client, since the
// registering user has no session yet: email confirmation is
// mandatory, and Supabase does not issue a session for an unconfirmed
// signUp.

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSiteOrigin, firstIp, safeNext } from "@/lib/http/request"
import { isRateLimited } from "@/lib/http/rateLimit"
import { EULA_VERSION, PRIVACY_VERSION } from "@/lib/legal"
import {
  createParentProfile,
  createStudentProfile,
  createEducatorProfile,
  recordPendingConsent,
} from "@/lib/auth/profiles"
import type { RegistrationMetadata } from "@/lib/auth/registrationMetadata"

const bodySchema = z.object({
  flow:             z.enum(["parent_led", "educator_led", "self_led"]),
  email:            z.string().email(),
  password:         z.string().min(8),
  firstName:        z.string().trim().min(1),
  lastName:         z.string().trim().optional().default(""),
  grade:            z.number().int().min(0).max(12),
  childFirstName:   z.string().trim().optional().default(""),
  schoolName:       z.string().trim().optional().default(""),
  eulaAccepted:     z.literal(true),
  eulaVersion:      z.literal(EULA_VERSION),
  privacyAccepted:  z.literal(true),
  privacyVersion:   z.literal(PRIVACY_VERSION),
  next:             z.string().optional(),
})

function roleForFlow(flow: "parent_led" | "educator_led" | "self_led") {
  if (flow === "parent_led") return "parent" as const
  if (flow === "educator_led") return "educator" as const
  return "student" as const
}

export async function POST(req: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Registration is not configured." }, { status: 503 })
  }

  let body: z.infer<typeof bodySchema>
  try {
    const json = await req.json()
    body = bodySchema.parse(json)
  } catch {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 })
  }

  const {
    flow, email, password, firstName, lastName, grade,
    childFirstName, schoolName, eulaVersion, privacyVersion,
  } = body

  // Re-enforce COPPA age routing server-side — the client-side AgeGate
  // is trivially bypassable, so a self_led (13+) registration for a
  // grade that maps to under-13 must be rejected, not merely warned.
  if (flow === "self_led" && grade <= 7) {
    return NextResponse.json(
      { error: "Students under 13 need a parent or guardian to create their account." },
      { status: 400 },
    )
  }
  if (flow === "parent_led" && !childFirstName) {
    return NextResponse.json({ error: "Please enter your child's first name." }, { status: 400 })
  }

  const ip = firstIp(req)
  if (isRateLimited(ip, email)) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 })
  }

  const origin = getSiteOrigin(req)
  const dest = safeNext(body.next) ?? (flow === "self_led" ? "/onboarding" : "/dashboard")
  const now = new Date().toISOString()

  const metadata: RegistrationMetadata = {
    first_name:          firstName,
    last_name:           lastName || undefined,
    role:                roleForFlow(flow),
    flow,
    grade,
    child_first_name:    flow === "parent_led" ? childFirstName : undefined,
    child_grade:         flow === "parent_led" ? grade : undefined,
    school_name:         flow === "educator_led" ? schoolName : undefined,
    eula_version:        eulaVersion,
    eula_accepted_at:    now,
    privacy_version:     privacyVersion,
    privacy_accepted_at: now,
  }

  // Cookie-bound server client — NOT a bare anon client. @supabase/ssr
  // hard-sets flowType: "pkce" and persists the code-verifier cookie
  // immediately on this response; a bare client defaults to the
  // implicit flow, whose tokens land in a URL fragment the server
  // never sees, and every confirmation link would dead-end.
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(dest)}`,
      data: metadata,
    },
  })

  if (error) {
    console.error("[register] signUp failed", error.message)
    const status = error.status === 429 ? 429 : 400
    return NextResponse.json(
      { error: status === 429 ? "Too many attempts. Please try again later." : "Registration failed. Please try again." },
      { status },
    )
  }

  if (data.session) {
    // "Confirm email" is off in this Supabase project — signUp handed
    // back a live session, which the cookie client just wrote onto
    // this response, silently bypassing the whole confirmation gate.
    console.error("[register] signUp returned a session — email confirmation is disabled in Supabase Auth.")
  }

  if (!data.user || data.user.identities?.length === 0) {
    // Existing, already-confirmed email: Supabase returns a decoy user
    // with no identities and an id that doesn't exist in auth.users.
    // Writing a profile for it would FK-violate. This response is also
    // the correct anti-enumeration behavior — identical to a real signup.
    return NextResponse.json({ status: "check_email", email })
  }

  const userId = data.user.id
  const admin = createAdminClient()
  const legal = {
    eulaVersion,
    eulaAcceptedAt: now,
    privacyVersion,
    privacyAcceptedAt: now,
  }

  if (flow === "parent_led") {
    const parentResult = await createParentProfile(
      admin, userId, firstName, lastName, email, legal,
      { firstName: childFirstName, grade },
    )
    if (!parentResult.success) {
      console.error("[register] parent profile insert failed", parentResult.error)
    }

    const consentResult = await recordPendingConsent(admin, userId, childFirstName, grade)
    if (!consentResult.success) {
      console.error("[register] pending consent insert failed", consentResult.error)
    }
  } else if (flow === "educator_led") {
    const result = await createEducatorProfile(admin, userId, firstName, lastName, email, schoolName, legal)
    if (!result.success) {
      console.error("[register] educator profile insert failed", result.error)
    }
  } else {
    const result = await createStudentProfile(admin, userId, firstName, grade, legal, null)
    if (!result.success) {
      console.error("[register] student profile insert failed", result.error)
    }
  }

  await admin.auth.admin.updateUserById(userId, {
    app_metadata: {
      role: roleForFlow(flow),
      flow,
      consent_required: flow === "parent_led",
      consent_verified: flow !== "parent_led",
    },
  })

  return NextResponse.json({ status: "check_email", email })
}
