// src/lib/supabase/admin.ts
// Service-role Supabase client for MET and Teddy.
// Server-only — bypasses RLS. Never import into a "use client" file
// or into middleware (which runs on the Edge runtime and should not
// hold this key).

import { createClient } from "@supabase/supabase-js"

export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("createAdminClient() must never run in the browser.")
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
