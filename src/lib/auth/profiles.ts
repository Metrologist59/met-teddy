// src/lib/auth/profiles.ts
// Profile and consent management for MET and Teddy.
// COPPA-compliant: data minimization for under-13, consent verification.
//
// Every function takes an already-constructed Supabase client as its
// first argument rather than creating one internally. This makes the
// anon-vs-service-role choice explicit at each call site: profile and
// consent writes happen before the registering user has a session
// (email confirmation is mandatory), so they must go through the
// service-role admin client. Passing the client in also means this
// module has no opinion on cookies, Edge-runtime safety, or which
// client factory is in scope — the caller decides.

import type { SupabaseClient } from "@supabase/supabase-js"

// ── Types ────────────────────────────────────────────────────────

export interface StudentProfile {
  id:            string
  role:          "student" | "parent" | "educator"
  firstName:     string
  displayName:   string
  grade:         number | null
  gradeBand:     string | null
  certLevel:     string | null
  overrideLevel: string | null
  isUnder13:     boolean
  parentId:      string | null
  educatorId:    string | null
  onboardedAt:   string | null
  consentGiven:  boolean
}

export interface LegalAcceptance {
  eulaVersion:        string
  eulaAcceptedAt:     string
  privacyVersion:     string
  privacyAcceptedAt:  string
}

// ── Load profile ─────────────────────────────────────────────────

export async function loadProfile(db: SupabaseClient, userId: string): Promise<StudentProfile | null> {
  const { data: profile, error } = await db
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle()

  if (error || !profile) return null

  // Check consent for under-13
  let consentGiven = true
  if (profile.is_under_13) {
    const { data: consent } = await db
      .from("parental_consents")
      .select("consent_given")
      .eq("student_id", userId)
      .eq("consent_given", true)
      .eq("consent_revoked", false)
      .limit(1)
      .maybeSingle()

    consentGiven = !!consent
  }

  return {
    id:            profile.id,
    role:          profile.role,
    firstName:     profile.first_name,
    displayName:   profile.display_name ?? profile.first_name,
    grade:         profile.grade,
    gradeBand:     profile.grade_band,
    certLevel:     profile.cert_level,
    overrideLevel: profile.override_level,
    isUnder13:     profile.is_under_13,
    parentId:      profile.parent_id,
    educatorId:    profile.educator_id,
    onboardedAt:   profile.onboarded_at,
    consentGiven,
  }
}

// ── Create parent account ────────────────────────────────────────

export async function createParentProfile(
  db:        SupabaseClient,
  userId:    string,
  firstName: string,
  lastName:  string,
  email:     string,
  legal:     LegalAcceptance,
  pendingChild: { firstName: string; grade: number },
): Promise<{ success: boolean; error?: string }> {
  const { error } = await db.from("profiles").upsert({
    id:                       userId,
    role:                     "parent",
    first_name:               firstName,
    last_name:                lastName,
    display_name:             firstName,
    email,
    is_under_13:              false,
    registration_flow:        "parent_led",
    // Deliberately not profiles.grade — see migration 0004 comment.
    pending_child_first_name: pendingChild.firstName,
    pending_child_grade:      pendingChild.grade,
    eula_version:             legal.eulaVersion,
    eula_accepted_at:         legal.eulaAcceptedAt,
    privacy_version:          legal.privacyVersion,
    privacy_accepted_at:      legal.privacyAcceptedAt,
  }, { onConflict: "id" })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Create student account (self-led, 13+) ────────────────────────

export async function createStudentProfile(
  db:        SupabaseClient,
  userId:    string,
  firstName: string,
  grade:     number,
  legal:     LegalAcceptance,
  parentId?: string | null,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await db.from("profiles").upsert({
    id:                userId,
    role:              "student",
    first_name:        firstName,
    display_name:      firstName,
    grade,
    is_under_13:       grade <= 7,
    parent_id:         parentId || null,   // "" must become null — an empty string is not a valid uuid
    registration_flow: "self_led",
    eula_version:        legal.eulaVersion,
    eula_accepted_at:    legal.eulaAcceptedAt,
    privacy_version:     legal.privacyVersion,
    privacy_accepted_at: legal.privacyAcceptedAt,
  }, { onConflict: "id" })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Record pending parental consent (COPPA) ───────────────────────
//
// Inserted PENDING at registration (consent_given = false). Flipped
// to verified by verifyConsent() when the parent confirms their own
// email — see src/lib/auth/finalizeConfirmation.ts. This is the
// actual enforcement: previously the app set consent_given = true
// unconditionally, so a checked box was trusted as if it were
// verified consent.

export async function recordPendingConsent(
  db:              SupabaseClient,
  parentId:        string,
  childFirstName:  string,
  childGrade:      number,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await db.from("parental_consents").insert({
    parent_id:        parentId,
    student_id:       null,
    child_first_name:  childFirstName,
    child_grade:       childGrade,
    consent_method:    "email_confirmation",
    consent_given:     false,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Verify pending consent (called on parent email confirmation) ──

export async function verifyConsent(
  db:       SupabaseClient,
  parentId: string,
  ip:       string | null,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await db
    .from("parental_consents")
    .update({
      consent_given: true,
      consent_date:  new Date().toISOString(),
      verified_at:   new Date().toISOString(),
      verified_via:  "parent_email_confirmation",
      verified_ip:   ip,
    })
    .eq("parent_id", parentId)
    .eq("consent_given", false)
    .eq("consent_revoked", false)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function hasVerifiedConsent(
  db:       SupabaseClient,
  parentId: string,
): Promise<boolean> {
  const { data } = await db
    .from("parental_consents")
    .select("id")
    .eq("parent_id", parentId)
    .eq("consent_given", true)
    .eq("consent_revoked", false)
    .limit(1)
    .maybeSingle()

  return !!data
}

// ── Revoke consent (triggers data handling) ──────────────────────
//
// Note: this only updates the DB row. The caller is also responsible
// for flipping the corresponding auth.users app_metadata.consent_verified
// to false (via the admin client's updateUserById) so the middleware
// gate re-locks the account — profiles.ts has no opinion on auth
// admin operations.

export async function revokeConsent(
  db:        SupabaseClient,
  studentIdOrParentId: string,
  parentId:  string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await db
    .from("parental_consents")
    .update({
      consent_revoked: true,
      revoked_date:    new Date().toISOString(),
    })
    .eq("parent_id", parentId)
    .or(`student_id.eq.${studentIdOrParentId},student_id.is.null`)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Create educator account ──────────────────────────────────────

export async function createEducatorProfile(
  db:         SupabaseClient,
  userId:     string,
  firstName:  string,
  lastName:   string,
  email:      string,
  schoolName: string,
  legal:      LegalAcceptance,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await db.from("profiles").upsert({
    id:                userId,
    role:              "educator",
    first_name:        firstName,
    last_name:         lastName,
    display_name:      firstName,
    email,
    is_under_13:       false,
    school_name:       schoolName || null,
    registration_flow: "educator_led",
    eula_version:        legal.eulaVersion,
    eula_accepted_at:    legal.eulaAcceptedAt,
    privacy_version:     legal.privacyVersion,
    privacy_accepted_at: legal.privacyAcceptedAt,
  }, { onConflict: "id" })

  if (error) return { success: false, error: error.message }
  return { success: true }
}
