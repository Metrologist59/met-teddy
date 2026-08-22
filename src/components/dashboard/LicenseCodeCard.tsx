// src/components/dashboard/LicenseCodeCard.tsx
// Paste-and-activate card for a metuniverse.com license code.
//
// Self-contained: authenticates via the real session cookie through
// /api/license/activate, so it works correctly wherever it's placed
// regardless of whether the surrounding page uses real or demo data
// for anything else.

"use client"

import { useState } from "react"

interface LicenseCodeCardProps {
  role: "parent" | "educator"
}

type Status = "idle" | "loading" | "success" | "error"

export function LicenseCodeCard({ role }: LicenseCodeCardProps) {
  const [code, setCode] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState<string | null>(null)

  const planHint =
    role === "parent"
      ? "Family license codes are emailed after purchase on MET Universe."
      : "Classroom, School, and District license codes are emailed after purchase on MET Universe."

  async function handleActivate() {
    const trimmed = code.trim()
    if (!trimmed) {
      setStatus("error")
      setMessage("Paste your license code first.")
      return
    }

    setStatus("loading")
    setMessage(null)

    try {
      const res = await fetch("/api/license/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus("error")
        setMessage(data.error ?? "Something went wrong. Please try again.")
        return
      }

      setStatus("success")
      setMessage(data.message ?? "License activated!")
      setCode("")
    } catch {
      setStatus("error")
      setMessage("Couldn't reach the server. Please check your connection and try again.")
    }
  }

  return (
    <div className="met-card p-5">
      <h3
        className="text-sm font-semibold mb-1"
        style={{ color: "var(--met-text-primary)" }}
      >
        Have a License Code?
      </h3>
      <p className="text-xs mb-3" style={{ color: "var(--met-text-muted)" }}>
        {planHint}
      </p>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your license code here"
        rows={3}
        disabled={status === "loading"}
        className="w-full px-3 py-2 rounded-lg text-xs font-mono outline-none transition-colors focus:ring-2 focus:ring-[#2AB8AB] resize-none"
        style={{
          background: "var(--met-surface)",
          border: "1px solid rgba(42, 184, 171, 0.2)",
          color: "var(--met-text-primary)",
        }}
      />

      {status === "error" && message && (
        <div
          className="mt-3 px-3 py-2 rounded-lg text-xs"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            color: "#EF4444",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          {message}
        </div>
      )}

      {status === "success" && message && (
        <div
          className="mt-3 px-3 py-2 rounded-lg text-xs"
          style={{
            background: "rgba(42, 184, 171, 0.1)",
            color: "var(--met-teal-400)",
            border: "1px solid rgba(42, 184, 171, 0.2)",
          }}
        >
          ✓ {message}
        </div>
      )}

      <button
        onClick={handleActivate}
        disabled={status === "loading"}
        className="w-full mt-3 py-2 rounded-lg text-xs font-semibold transition-opacity disabled:opacity-50"
        style={{
          background: "var(--met-teal-400)",
          color: "white",
        }}
      >
        {status === "loading" ? "Activating..." : "Activate License"}
      </button>
    </div>
  )
}
