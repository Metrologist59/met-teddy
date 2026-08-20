// src/components/layout/NavBar.tsx
// MET Universe top navigation bar.

"use client"

interface NavBarProps {
  studentName: string
  certLevel: string
  onMenuToggle: () => void
}

const LEVEL_COLORS: Record<string, string> = {
  Explorer: "#2AB8AB",
  Investigator: "#60A5FA",
  Innovator: "#F59E0B",
  Metrologist: "#062C28",
}

export function NavBar({ studentName, certLevel, onMenuToggle }: NavBarProps) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-6"
      style={{
        height: "var(--met-nav-height)",
        background: "var(--met-teal-900)",
        color: "var(--met-text-inverse)",
      }}
    >
      {/* Left: menu + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">
            <span style={{ color: "var(--met-teal-400)" }}>MET</span>
            {" "}Universe
          </span>
        </div>
      </div>

      {/* Right: level badge + name */}
      <div className="flex items-center gap-3">
        <span
          className="met-badge text-xs"
          style={{
            background: `${LEVEL_COLORS[certLevel] ?? "#2AB8AB"}22`,
            color: LEVEL_COLORS[certLevel] ?? "#2AB8AB",
            border: `1px solid ${LEVEL_COLORS[certLevel] ?? "#2AB8AB"}44`,
          }}
        >
          {certLevel}
        </span>
        <span className="text-sm hidden sm:inline" style={{ color: "var(--met-teal-400)" }}>
          {studentName}
        </span>
      </div>
    </nav>
  )
}
