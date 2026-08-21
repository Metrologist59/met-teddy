// src/lib/supabase/client.ts
// Browser-side Supabase client for MET and Teddy app.
// Used in "use client" components for auth operations.

import { createBrowserClient } from "@supabase/ssr"

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
