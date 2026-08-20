// src/app/login/page.tsx
// Login page for MET and Teddy.

"use client"

import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    // Supabase auth login — wired in integration
    setError("Login integration pending — connect to Supabase Auth.")
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "var(--met-surface)" }}
    >
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

          <div className="space-y-4">
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
              onClick={handleLogin}
              className="met-btn-primary w-full py-3 text-base"
            >
              Log In
            </button>
          </div>
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
    </div>
  )
}
