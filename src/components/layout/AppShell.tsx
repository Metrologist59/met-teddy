// src/components/layout/AppShell.tsx
// MET Universe app shell — wraps all authenticated pages with
// navigation, branding, and responsive layout.

"use client"

import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { NavBar } from "./NavBar"

interface AppShellProps {
  children: React.ReactNode
  studentName?: string
  certLevel?: string
  gradeBand?: string
}

export function AppShell({
  children,
  studentName = "Explorer",
  certLevel = "Explorer",
  gradeBand = "K-2",
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: "var(--met-surface)" }}>
      <NavBar
        studentName={studentName}
        certLevel={certLevel}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex" style={{ paddingTop: "var(--met-nav-height)" }}>
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          certLevel={certLevel}
          gradeBand={gradeBand}
        />

        <main className="flex-1 min-h-[calc(100vh-var(--met-nav-height))]">
          {children}
        </main>
      </div>

      <footer
        className="text-center py-4 text-xs"
        style={{ color: "var(--met-text-muted)" }}
      >
        MET Universe — A MET Scientia Experience · © 2026 MET Scientia, LLC
      </footer>
    </div>
  )
}
