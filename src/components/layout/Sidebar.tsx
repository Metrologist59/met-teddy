// src/components/layout/Sidebar.tsx
// MET Universe sidebar navigation.

"use client"

import { createBrowserSupabaseClient } from "@/lib/supabase/client"

interface SidebarProps {
  open: boolean
  onClose: () => void
  certLevel: string
  gradeBand: string
}

interface NavItem {
  label: string
  href: string
  icon: string
  description: string
}

const NAV_ITEMS: NavItem[] = [
  { label: "Talk to MET",       href: "/chat",      icon: "💬", description: "Chat with MET and Teddy" },
  { label: "Field Missions",    href: "/missions",  icon: "🧭", description: "Hands-on measurement adventures" },
  { label: "My Field Notebook", href: "/notebook",  icon: "📓", description: "Your measurement journal" },
  { label: "Badges",            href: "/badges",    icon: "🏅", description: "Earned achievements" },
  { label: "Dashboard",         href: "/dashboard", icon: "📊", description: "Progress & settings" },
]

export function Sidebar({ open, onClose, certLevel, gradeBand }: SidebarProps) {
  async function handleLogout() {
    const supabase = createBrowserSupabaseClient()
    await supabase.auth.signOut()
    // Full reload (not router.push) so any client-side cached state
    // from the previous session is guaranteed to be gone, not just
    // the auth cookie.
    window.location.href = "/login"
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-40
          lg:sticky lg:top-[var(--met-nav-height)] lg:h-[calc(100vh-var(--met-nav-height))]
          transition-transform duration-200 ease-out
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          width: "var(--met-sidebar-width)",
          paddingTop: open ? "var(--met-nav-height)" : "0",
          background: "var(--met-surface-card)",
          borderRight: "1px solid rgba(42, 184, 171, 0.08)",
        }}
      >
        <nav className="p-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors hover:bg-[var(--met-surface-muted)]"
              style={{ color: "var(--met-text-primary)" }}
            >
              <span className="text-lg">{item.icon}</span>
              <div>
                <div className="font-medium text-sm">{item.label}</div>
                <div
                  className="text-xs"
                  style={{ color: "var(--met-text-muted)" }}
                >
                  {item.description}
                </div>
              </div>
            </a>
          ))}
        </nav>

        {/* Level indicator + Log Out at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4 border-t"
          style={{ borderColor: "rgba(42, 184, 171, 0.08)" }}
        >
          <div
            className="text-xs"
            style={{ color: "var(--met-text-muted)" }}
          >
            Certification Level
          </div>
          <div
            className="font-semibold text-sm"
            style={{ color: "var(--met-teal-400)" }}
          >
            {certLevel} · {gradeBand}
          </div>
          <div
            className="text-xs mt-1 mb-3"
            style={{ color: "var(--met-text-muted)" }}
          >
            Every measurement tells a story.
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--met-surface-muted)]"
            style={{
              color: "var(--met-text-secondary)",
              borderTop: "1px solid rgba(42, 184, 171, 0.08)",
              paddingTop: "0.75rem",
            }}
          >
            <span className="text-base">🚪</span>
            Log Out
          </button>
        </div>
      </aside>
    </>
  )
}
