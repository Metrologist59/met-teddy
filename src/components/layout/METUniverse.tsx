// src/components/layout/METUniverse.tsx
// MET Universe application wrapper.
// The top-level shell where all things MET and Teddy reside.
// No MetTutor shell components, routes, or shared navigation.
// © 2026 MET Scientia, LLC

"use client"

import { useState, useEffect, type ReactNode } from "react"
import { AppShell } from "./AppShell"
import type { CertificationLevel, GradeBand } from "@/lib/levels/config"

interface METUniverseProps {
  children: ReactNode
  studentName?:  string
  certLevel?:    CertificationLevel
  gradeBand?:    GradeBand
  authenticated?: boolean
}

export function METUniverse({
  children,
  studentName = "Explorer",
  certLevel = "Explorer",
  gradeBand = "K-2",
  authenticated = false,
}: METUniverseProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Loading state — brief brand flash
  if (!mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--met-teal-900)" }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold" style={{ color: "var(--met-text-inverse)" }}>
            <span style={{ color: "var(--met-teal-400)" }}>MET</span> Universe
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--met-teal-400)", opacity: 0.7 }}>
            Where measurement comes alive
          </p>
        </div>
      </div>
    )
  }

  // Unauthenticated — show public content directly (landing, login, register, privacy)
  if (!authenticated) {
    return <>{children}</>
  }

  // Authenticated — wrap in the full app shell
  return (
    <AppShell
      studentName={studentName}
      certLevel={certLevel}
      gradeBand={gradeBand}
    >
      {children}
    </AppShell>
  )
}
