// src/app/login/page.tsx
// Login page for MET and Teddy.

"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") ?? "/chat"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [unconfirmed, setUnconfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resent, setResent] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setUnconfirmed(false)
    setLoading(true)

    const supabase = createBrowserSupabaseClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setLoading(false)
      if (signInError.message.toLowerCase().includes("email not confirmed")) {
        setUnconfirmed(true)
      } else {
        setError("Incorrect email or password.")
      }
      return
    }

    router.push(redirectTo)
  }

  async function handleResend() {
    const supabase = createBrowserSupabaseClient()
    await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    })
    setResent(true)
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "var(--met-text-primary)" }}>
          Welcome back to{" "}
          <span style={{ color: "var(--met-teal-400)" }}>MET</span> Universe
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--met-text-secondary)" }}>
          Every measurement tells a story
        </p>
      </div>

      <div className="met-card p-6">
        {error && (
          <div
            className="mb-4 p-3 rounded-lg text-sm"
            style={{ background: "rgba(239,68,68,0.1)", color: "var(--met-error)" }}
          >
            {error}
          </div>
        )}

        {unconfirmed && (
          <div
            className="mb-4 p-3 rounded-lg text-sm space-y-2"
            style={{ background: "rgba(245, 158, 11, 0.1)", color: "var(--met-warning)" }}
          >
            <p>Please confirm your email before logging in.</p>
            {resent ? (
              <p>Confirmation email sent — check your inbox.</p>
            ) : (
              <button onClick={handleResend} className="underline font-medium">
                Resend confirmation email
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--met-text-primary)" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{
                background: "var(--met-surface-muted)",
                border: "1px solid rgba(42,184,171,0.15)",
                color: "var(--met-text-primary)",
              }}
              placeholder="parent@example.com"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--met-text-primary)" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{
                background: "var(--met-surface-muted)",
                border: "1px solid rgba(42,184,171,0.15)",
                color: "var(--met-text-primary)",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="met-btn-primary w-full py-3 text-base disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>

      <p
        className="text-center mt-6 text-sm"
        style={{ color: "var(--met-text-muted)" }}
      >
        New here?{" "}
        <a href="/register" className="font-medium" style={{ color: "var(--met-teal-400)" }}>
          Create an account
        </a>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "var(--met-surface)" }}
    >
      <Suspense fallback={<p style={{ color: "var(--met-text-muted)" }}>Loading...</p>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
