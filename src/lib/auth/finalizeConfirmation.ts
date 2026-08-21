// src/lib/auth/finalizeConfirmation.ts
// Runs once a user has a verified session — after /auth/confirm or
// /auth/callback exchanges their confirmation link. Idempotent: safe
// to run on every hit of either route, including retries.
//
// Responsibilities:
//   1. Self-heal a missing profile row (covers a partial /api/register
//      failure — signUp() can succeed while a later write fails).
//   2. Flip pending parental consent to verified, for parent_led
//      registrations — the parent's own email confirmation IS the
//      verification event.
//   3. Stamp auth.users.app_metadata so middleware can gate on it with
//      no extra DB round trip.
//   4. Send the welcome email exactly once, via an atomic claim.
//
// Never throws — a failure here should not strand the user on an
// error page after they've legitimately confirmed their email.

import type { User } from "@supabase/supabase-js"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  createParentProfile,
  createStudentProfile,
  createEducatorProfile,
  recordPendingConsent,
  verifyConsent,
  hasVerifiedConsent,
} from "@/lib/auth/profiles"
import { sendWelcomeEmail } from "@/lib/email"
import type { RegistrationMetadata } from "@/lib/auth/registrationMetadata"

export interface FinalizeResult {
  destination: string
}

export async function finalizeConfirmation(user: User, ip: string | null): Promise<FinalizeResult> {
  const admin = createAdminClient()
  const meta = (user.user_metadata ?? {}) as Partial<RegistrationMetadata>
  const role = meta.role ?? "student"
  const flow = meta.flow ?? "self_led"

  // ── 1. Self-heal a missing profile row ───────────────────────────
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle()

  const legal = {
    eulaVersion:       meta.eula_version ?? "",
    eulaAcceptedAt:    meta.eula_accepted_at ?? new Date().toISOString(),
    privacyVersion:    meta.privacy_version ?? "",
    privacyAcceptedAt: meta.privacy_accepted_at ?? new Date().toISOString(),
  }

  if (!existingProfile && meta.first_name) {
    if (flow === "parent_led") {
      await createParentProfile(
        admin, user.id, meta.first_name, meta.last_name ?? "", user.email ?? "", legal,
        { firstName: meta.child_first_name ?? "", grade: meta.child_grade ?? 0 },
      )
    } else if (flow === "educator_led") {
      await createEducatorProfile(
        admin, user.id, meta.first_name, meta.last_name ?? "", user.email ?? "",
        meta.school_name ?? "", legal,
      )
    } else {
      await createStudentProfile(admin, user.id, meta.first_name, meta.grade ?? 8, legal, null)
    }
  }

  // ── 2. Verify parental consent (parent_led only) ─────────────────
  const consentRequired = flow === "parent_led"
  // Only true once actually confirmed present in the DB below — never
  // assumed. Setting this to true unconditionally would unlock the
  // account even if the verification write failed.
  let consentVerified = !consentRequired

  if (consentRequired) {
    const { data: existingConsent } = await admin
      .from("parental_consents")
      .select("id")
      .eq("parent_id", user.id)
      .eq("consent_revoked", false)
      .limit(1)
      .maybeSingle()

    if (!existingConsent) {
      // Self-heal: the pending row from /api/register never landed.
      await recordPendingConsent(
        admin, user.id, meta.child_first_name ?? "", meta.child_grade ?? 0,
      )
    }

    const result = await verifyConsent(admin, user.id, ip)
    if (!result.success) {
      console.error("[finalizeConfirmation] consent verification failed", result.error)
    }

    consentVerified = await hasVerifiedConsent(admin, user.id)
  }

  // ── 3. Stamp app_metadata for the middleware gate ────────────────
  const { data: authUserLookup } = await admin.auth.admin.getUserById(user.id)
  const prevAppMeta = (authUserLookup?.user?.app_metadata ?? {}) as Record<string, unknown>

  await admin.auth.admin.updateUserById(user.id, {
    app_metadata: {
      ...prevAppMeta,
      role,
      consent_required: consentRequired,
      consent_verified: consentVerified,
      profile_ready: true,
    },
  })

  // ── 4. Welcome email, claimed atomically ─────────────────────────
  await claimAndSendWelcomeEmail(admin, user.id, user.email ?? null, meta.first_name ?? "there", role)

  const destination = role === "parent" || role === "educator" ? "/dashboard" : "/onboarding"
  return { destination }
}

async function claimAndSendWelcomeEmail(
  admin:     ReturnType<typeof createAdminClient>,
  userId:    string,
  email:     string | null,
  firstName: string,
  role:      "parent" | "educator" | "student",
) {
  if (!email) return

  const { data: claimed, error: claimError } = await admin
    .from("profiles")
    .update({ welcome_email_sent_at: new Date().toISOString() })
    .eq("id", userId)
    .is("welcome_email_sent_at", null)
    .select("id")

  // Postgres row-locks the UPDATE, so exactly one concurrent caller
  // gets a row back. Zero rows means either already sent, or the
  // profile row doesn't exist — either way, don't send.
  if (claimError || !claimed || claimed.length !== 1) return

  try {
    await sendWelcomeEmail({ to: email, firstName, role })
  } catch (err) {
    console.error("[finalizeConfirmation] welcome email send failed, resetting claim", err)
    await admin.from("profiles").update({ welcome_email_sent_at: null }).eq("id", userId)
  }
}
