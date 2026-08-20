// src/lib/auth/profiles.ts
// Profile and consent management for MET and Teddy.
// COPPA-compliant: data minimization for under-13, consent verification.

import { createClient } from "@/lib/supabase/server"

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

// ── Load profile ─────────────────────────────────────────────────

export async function loadProfile(userId: string): Promise<StudentProfile | null> {
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error || !profile) return null

  // Check consent for under-13
  let consentGiven = true
  if (profile.is_under_13) {
    const { data: consent } = await supabase
      .from("parental_consents")
      .select("consent_given")
      .eq("student_id", userId)
      .eq("consent_given", true)
      .eq("consent_revoked", false)
      .limit(1)
      .single()

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
  userId:    string,
  firstName: string,
  lastName:  string,
  email:     string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.from("profiles").insert({
    id:         userId,
    role:       "parent",
    first_name: firstName,
    last_name:  lastName,
    display_name: firstName,
    email,
    is_under_13: false,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Create student account (under parent) ────────────────────────

export async function createStudentProfile(
  userId:   string,
  firstName: string,
  grade:     number,
  parentId:  string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.from("profiles").insert({
    id:           userId,
    role:         "student",
    first_name:   firstName,
    display_name: firstName,
    grade,
    is_under_13:  grade <= 7,
    parent_id:    parentId,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Record parental consent ──────────────────────────────────────

export async function recordConsent(
  studentId:     string,
  parentId:      string,
  consentMethod: string,
  ipAddress?:    string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.from("parental_consents").insert({
    student_id:     studentId,
    parent_id:      parentId,
    consent_method: consentMethod,
    consent_given:  true,
    consent_date:   new Date().toISOString(),
    ip_address:     ipAddress ?? null,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Revoke consent (triggers data handling) ──────────────────────

export async function revokeConsent(
  studentId: string,
  parentId:  string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("parental_consents")
    .update({
      consent_revoked: true,
      revoked_date:    new Date().toISOString(),
    })
    .eq("student_id", studentId)
    .eq("parent_id", parentId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Create educator account ──────────────────────────────────────

export async function createEducatorProfile(
  userId:     string,
  firstName:  string,
  lastName:   string,
  email:      string,
  schoolName: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.from("profiles").insert({
    id:          userId,
    role:        "educator",
    first_name:  firstName,
    last_name:   lastName,
    display_name: firstName,
    email,
    is_under_13: false,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}
