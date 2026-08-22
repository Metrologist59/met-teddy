// src/lib/auth/registrationMetadata.ts
// Shape of the data passed into supabase.auth.signUp()'s
// options.data during registration. Stored as auth.users
// user_metadata (readable, not user-writable after the fact via the
// normal client) and used by finalizeConfirmation() to self-heal a
// profile row if the post-signUp writes in /api/register partially
// failed.

export type RegistrationFlow = "parent_led" | "educator_led" | "self_led"
export type RegistrationRole = "parent" | "educator" | "student"

export interface RegistrationMetadata {
  first_name:          string
  last_name?:          string
  role:                RegistrationRole
  flow:                RegistrationFlow
  grade?:              number
  child_first_name?:   string
  child_grade?:        number
  school_name?:        string
  eula_version:        string
  eula_accepted_at:    string
  privacy_version:     string
  privacy_accepted_at: string
  // Only ever set for self_led (13+) registrations — the "I certify
  // I am 13 or older" attestation. Absent for parent_led/educator_led.
  coppa_version?:      string
  coppa_accepted_at?:  string
}
