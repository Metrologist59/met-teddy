// src/app/verify-email/page.tsx
// "Check your email" screen. Reached two ways: the terminal state
// after registration, and a middleware redirect for anyone with a
// session but an unconfirmed email (?email= is populated in the
// latter case; ?error=expired covers a dead/used confirmation link).

"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

const RESEND_COOLDOWN_SECONDS = 60

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const emailFromQuery = searchParams.get("email") ?? ""
  const expired = searchParams.get("error") === "expired"

  const [email, setEmail] = useState(emailFromQuery)
  const [cooldown, setCooldown] = useState(0)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleResend() {
    setError(null)
    if (!email) {
      setError("Enter the email address you registered with.")
      return
    }

    const supabase = createBrowserSupabaseClient()
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    })

    // Generic response either way — this endpoint must not confirm or
    // deny whether an address is registered.
    setSent(true)
    setCooldown(RESEND_COOLDOWN_SECONDS)
    const timer = setInterval(() => {
      setCooldown(c => {
        if (c <= 1) { clearInterval(timer); return 0 }
        return c - 1
      })
    }, 1000)

    if (resendError) {
      // Still show the generic success state to the user; log for us.
      console.error("[verify-email] resend error", resendError.message)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "var(--met-text-primary)" }}>
          Check your <span style={{ color: "var(--met-teal-400)" }}>email</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--met-text-secondary)" }}>
          One more step before you can explore MET Universe
        </p>
      </div>

      <div className="met-card p-6 space-y-4">
        {expired && (
          <div
            className="px-4 py-3 rounded-lg text-sm"
            style={{ background: "rgba(245, 158, 11, 0.1)", color: "var(--met-warning)" }}
          >
            That confirmation link expired or was already used. Request a new one below.
          </div>
        )}

        <p className="text-sm" style={{ color: "var(--met-text-secondary)" }}>
          {emailFromQuery
            ? <>We sent a confirmation link to <strong>{emailFromQuery}</strong>. Click it to activate your account.</>
            : "We sent a confirmation link to the email address you registered with. Click it to activate your account."}
        </p>

        {!emailFromQuery && (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2AB8AB]"
            style={{
              background: "var(--met-surface)",
              border: "1px solid rgba(42, 184, 171, 0.2)",
              color: "var(--met-text-primary)",
            }}
          />
        )}

        {error && (
          <div
            className="px-4 py-3 rounded-lg text-sm"
            style={{ background: "rgba(239, 68, 68, 0.1)", color: "#EF4444" }}
          >
            {error}
          </div>
        )}

        {sent && (
          <div
            className="px-4 py-3 rounded-lg text-sm"
            style={{ background: "var(--met-citation-bg)", color: "var(--met-citation-text)" }}
          >
            If that address is registered, we&apos;ve sent another confirmation link.
          </div>
        )}

        <button
          onClick={handleResend}
          disabled={cooldown > 0}
          className="w-full py-3 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
          style={{ background: "var(--met-teal-400)", color: "white" }}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend confirmation email"}
        </button>
      </div>

      <p className="text-center mt-6 text-sm" style={{ color: "var(--met-text-muted)" }}>
        Already confirmed?{" "}
        <a href="/login" className="font-medium" style={{ color: "var(--met-teal-400)" }}>
          Log in
        </a>
      </p>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "var(--met-surface)" }}
    >
      <Suspense fallback={<p style={{ color: "var(--met-text-muted)" }}>Loading...</p>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}
