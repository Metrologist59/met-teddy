// src/components/badges/BadgeCard.tsx
// Individual badge display — earned, in-progress, or locked.
// Uses the MET Universe brand palette per badge category.

"use client"

import type { BadgeDefinition } from "@/lib/badges/catalog"

interface BadgeCardProps {
  badge:       BadgeDefinition
  earned:      boolean
  earnedDate?: string
  progress?:   number // 0–100
  onClick?:    () => void
}

const CATEGORY_COLORS: Record<string, { ring: string; glow: string }> = {
  mission:       { ring: "var(--met-teal-400)",  glow: "rgba(42, 184, 171, 0.25)" },
  domain:        { ring: "var(--met-blue-400)",  glow: "rgba(96, 165, 250, 0.25)" },
  notebook:      { ring: "var(--met-amber-400)", glow: "rgba(245, 158, 11, 0.25)" },
  certification: { ring: "var(--met-teal-900)",  glow: "rgba(6, 44, 40, 0.3)" },
  special:       { ring: "var(--met-amber-200)", glow: "rgba(252, 211, 77, 0.25)" },
}

export function BadgeCard({ badge, earned, earnedDate, progress, onClick }: BadgeCardProps) {
  const colors = CATEGORY_COLORS[badge.category] ?? CATEGORY_COLORS.mission

  return (
    <button
      onClick={onClick}
      className="met-card p-4 text-center w-full transition-all"
      style={{
        opacity: earned ? 1 : 0.7,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {/* Badge icon */}
      <div
        className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl transition-all"
        style={{
          background: earned
            ? `linear-gradient(135deg, ${colors.ring}, ${colors.glow})`
            : "var(--met-surface-muted)",
          boxShadow: earned ? `0 0 16px ${colors.glow}` : "none",
          border: earned ? `2px solid ${colors.ring}` : "2px solid transparent",
        }}
      >
        {earned ? badge.icon : "🔒"}
      </div>

      {/* Badge name */}
      <h3
        className="font-semibold text-sm mb-0.5"
        style={{ color: "var(--met-text-primary)" }}
      >
        {badge.name}
      </h3>

      {/* Category pill */}
      <span
        className="met-badge text-[10px] mb-2"
        style={{
          background: earned ? `${colors.ring}18` : "var(--met-surface-muted)",
          color: earned ? colors.ring : "var(--met-text-muted)",
        }}
      >
        {badge.category}
      </span>

      {/* Description */}
      <p
        className="text-xs mt-1 leading-relaxed"
        style={{ color: "var(--met-text-secondary)" }}
      >
        {badge.description}
      </p>

      {/* Earned date */}
      {earned && earnedDate && (
        <p className="text-[10px] mt-2" style={{ color: "var(--met-text-muted)" }}>
          Earned {new Date(earnedDate).toLocaleDateString()}
        </p>
      )}

      {/* Progress bar (not earned) */}
      {!earned && progress !== undefined && progress > 0 && (
        <div className="mt-3">
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--met-surface-muted)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: colors.ring }}
            />
          </div>
          <p className="text-[10px] mt-1" style={{ color: "var(--met-text-muted)" }}>
            {progress}%
          </p>
        </div>
      )}
    </button>
  )
}
