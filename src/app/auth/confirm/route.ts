// src/app/auth/confirm/route.ts
// Handles Supabase auth confirmation links.
//
// Accepts BOTH the PKCE `code` param and a `token_hash`+`type` param.
// PKCE binds confirmation to the browser that submitted signUp(), so
// "register on the laptop, open the email on the phone" dead-ends —
// verifyOtp with a token_hash is stateless and device-independent.
// Supporting both here means the flow is correct today (code), and
// switching the Supabase "Confirm signup" email template to the
// token_hash form later unlocks cross-device confirmation with zero
// code change.

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
    return NextResponse.redirect(`${origin}/verify-email?error=expired`)
  }

  const result = await finalizeConfirmation(user, firstIp(request))
  return NextResponse.redirect(`${origin}${requestedNext ?? result.destination}`)
}
