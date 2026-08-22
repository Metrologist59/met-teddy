// src/app/forgot-password/page.tsx
// Request a password reset email.

"use client"

import { useState } from "react"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setError(null)

    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }

    setLoading(true)

    try {
      const supabase = createBrowserSupabaseClient()
      const origin = window.location.origin

      // next=/reset-password is a deliberate, self-controlled signal
      // read by /auth/confirm to distinguish this from a signup
      // confirmation link — see that route for why.
      await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/auth/confirm?next=/reset-password`,
      })

      // Always show success, whether or not the email exists —
      // revealing account existence via this form is an enumeration
      // risk. If it's a real account, an email is on its way; if not,
      // nothing happens, and the person sees the same message either way.
      setSent(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: "var(--met-surface)",
    border: "1px solid rgba(42, 184, 171, 0.2)",
    color: "var(--met-text-primary)",
  }
  const inputFocusClass =
    "w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors focus:ring-2 focus:ring-[#2AB8AB]"

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "var(--met-surface)" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "var(--met-text-primary)" }}>
            Reset your <span style={{ color: "var(--met-teal-400)" }}>password</span>
          </h1>
        </div>

        <div className="met-card p-6">
          {!sent ? (
            <>
              <p className="text-sm mb-6" style={{ color: "var(--met-text-secondary)" }}>
                Enter the email address on your account and we&apos;ll send you a link to reset your password.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--met-text-secondary)" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputFocusClass}
                    style={inputStyle}
                  />
                </div>

                {error && (
                  <div
                    className="px-4 py-3 rounded-lg text-sm"
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      color: "#EF4444",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
                  style={{ background: "var(--met-teal-400)", color: "white" }}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📧</div>
              <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--met-text-primary)" }}>
                Check your email
              </h2>
              <p className="text-sm" style={{ color: "var(--met-text-muted)" }}>
                If an account exists for {email}, a password reset link is on its way.
              </p>
            </div>
          )}
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: "var(--met-text-muted)" }}>
          <a href="/login" className="font-medium" style={{ color: "var(--met-teal-400)" }}>
            Back to login
          </a>
        </p>
      </div>
    </div>
  )
}
