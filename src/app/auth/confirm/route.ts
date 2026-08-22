// src/app/auth/confirm/route.ts
// Handles Supabase auth confirmation AND password recovery links.
//
// Accepts BOTH the PKCE `code` param and a `token_hash`+`type` param.
// PKCE binds confirmation to the browser that submitted signUp(), so
// "register on the laptop, open the email on the phone" dead-ends —
// verifyOtp with a token_hash is stateless and device-independent.
// Supporting both here means the flow is correct today (code), and
// switching the Supabase "Confirm signup" email template to the
// token_hash form later unlocks cross-device confirmation with zero
// code change.
//
// PASSWORD RECOVERY: a reset-password link lands here too — Supabase
// exchanges it the same way (code or token_hash). It must NOT run
// finalizeConfirmation: that function creates/self-heals a profile,
// verifies parental consent, and sends a welcome email — all correct
// for a first-time signup confirmation, all wrong to re-run every
// time an existing user resets their password. Recovery is detected
// two ways: token_hash-style links carry type=recovery explicitly;
// the PKCE code-style flow (what /forgot-password currently uses,
// matching how signup confirmation already works here) does not
// carry a type param at all, so /forgot-password sets redirectTo to
// include next=/reset-password as an explicit, self-controlled
// signal instead of relying on undocumented code+type combinations
// that may vary by supabase-js version.

import { NextResponse } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { finalizeConfirmation } from "@/lib/auth/finalizeConfirmation"
import { safeNext, firstIp } from "@/lib/http/request"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const requestedNext = safeNext(searchParams.get("next"))

  const isRecovery = type === "recovery" || requestedNext === "/reset-password"

  const supabase = await createClient()

  let user = null
  if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) user = data.user
  } else if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) user = data.user
  }

  if (!user) {
    // Recovery failures go to /forgot-password (request a new link),
    // not /verify-email (signup-specific messaging, wrong context here).
    const failureDestination = isRecovery ? "/forgot-password" : "/verify-email"
    return NextResponse.redirect(`${origin}${failureDestination}?error=expired`)
  }

  if (isRecovery) {
    // Session is now live from the exchange above — /reset-password
    // reads it directly. finalizeConfirmation never runs for recovery.
    return NextResponse.redirect(`${origin}/reset-password`)
  }

  const result = await finalizeConfirmation(user, firstIp(request))
  return NextResponse.redirect(`${origin}${requestedNext ?? result.destination}`)
}
