// src/app/reset-password/page.tsx
// Set a new password. Reached only after /auth/confirm exchanges a
// valid recovery link and establishes a session — see that route.

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [validSession, setValidSession] = useState(false)

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function checkSession() {
      const supabase = createBrowserSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      setValidSession(!!session)
      setChecking(false)
    }
    checkSession()
  }, [])

  async function handleSubmit() {
    setError(null)

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      const supabase = createBrowserSupabaseClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => router.push("/login"), 2000)
    } catch {
      setError("Something went wrong. Please try again.")
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
            Set a new <span style={{ color: "var(--met-teal-400)" }}>password</span>
          </h1>
        </div>

        <div className="met-card p-6">
          {checking ? (
            <p className="text-sm text-center" style={{ color: "var(--met-text-muted)" }}>
              Checking your link...
            </p>
          ) : !validSession ? (
            <div className="text-center py-4">
              <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--met-text-primary)" }}>
                This link has expired
              </h2>
              <p className="text-sm mb-4" style={{ color: "var(--met-text-muted)" }}>
                Password reset links are only valid for a short time. Request a new one below.
              </p>
              <a
                href="/forgot-password"
                className="inline-block py-2 px-6 rounded-lg text-sm font-semibold"
                style={{ background: "var(--met-teal-400)", color: "white" }}
              >
                Request New Link
              </a>
            </div>
          ) : success ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">✓</div>
              <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--met-text-primary)" }}>
                Password updated
              </h2>
              <p className="text-sm" style={{ color: "var(--met-text-muted)" }}>
                Taking you to log in...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--met-text-secondary)" }}>
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className={inputFocusClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--met-text-secondary)" }}>
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
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
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
