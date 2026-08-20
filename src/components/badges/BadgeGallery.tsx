// src/components/badges/BadgeGallery.tsx
// Badge gallery with category tabs, earned/in-progress display,
// and certification milestone tracker.

"use client"

import { useState } from "react"
import { BadgeCard } from "./BadgeCard"
import type { BadgeDefinition, EarnedBadge, BadgeProgress } from "@/lib/badges/catalog"
import type { CertificationLevel } from "@/lib/levels/config"

interface BadgeGalleryProps {
  allBadges:    BadgeDefinition[]
  earnedBadges: EarnedBadge[]
  progress:     (BadgeProgress & { badge: BadgeDefinition })[]
  certLevel:    CertificationLevel
  onBadgeClick?: (slug: string) => void
}

type Tab = "all" | "mission" | "domain" | "notebook" | "certification" | "special"

const TABS: { value: Tab; label: string }[] = [
  { value: "all",           label: "All" },
  { value: "mission",       label: "Missions" },
  { value: "domain",        label: "Domains" },
  { value: "notebook",      label: "Notebook" },
  { value: "certification", label: "Certification" },
  { value: "special",       label: "Special" },
]

export function BadgeGallery({
  allBadges,
  earnedBadges,
  progress,
  certLevel,
  onBadgeClick,
}: BadgeGalleryProps) {
  const [tab, setTab] = useState<Tab>("all")

  const earnedSlugs = new Set(earnedBadges.map(e => e.badgeId))
  const progressMap = new Map(progress.map(p => [p.badgeId, p]))

  const filtered = tab === "all"
    ? allBadges
    : allBadges.filter(b => b.category === tab)

  // Sort: earned first, then by progress, then locked
  const sorted = [...filtered].sort((a, b) => {
    const aEarned = earnedSlugs.has(a.slug) ? 0 : 1
    const bEarned = earnedSlugs.has(b.slug) ? 0 : 1
    if (aEarned !== bEarned) return aEarned - bEarned

    const aProgress = progressMap.get(a.slug)?.percentage ?? 0
    const bProgress = progressMap.get(b.slug)?.percentage ?? 0
    return bProgress - aProgress
  })

  const earnedCount = allBadges.filter(b => earnedSlugs.has(b.slug)).length

  // Certification progress
  const certBadge = allBadges.find(
    b => b.category === "certification" && b.certLevel === certLevel
  )
  const certProgress = certBadge ? progressMap.get(certBadge.slug) : undefined

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--met-text-primary)" }}
        >
          Badge Gallery
        </h2>
        <span className="met-badge met-badge-teal">
          {earnedCount} earned
        </span>
      </div>

      {/* Certification milestone */}
      {certBadge && (
        <div
          className="met-card p-4 mb-5"
          style={{
            background: "var(--met-teal-900)",
            color: "var(--met-text-inverse)",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{certBadge.icon}</span>
            <div className="flex-1">
              <h3 className="font-bold text-sm">{certBadge.name}</h3>
              <p className="text-xs" style={{ opacity: 0.8 }}>
                {certBadge.description}
              </p>
            </div>
            {earnedSlugs.has(certBadge.slug) && (
              <span className="met-badge" style={{ background: "rgba(42,184,171,0.2)", color: "var(--met-teal-400)" }}>
                ✓ Certified
              </span>
            )}
          </div>

          {certProgress && !earnedSlugs.has(certBadge.slug) && (
            <div>
              <div className="flex items-center justify-between text-xs mb-1" style={{ opacity: 0.7 }}>
                <span>Progress toward {certLevel} certification</span>
                <span>{certProgress.currentValue}/{certProgress.targetValue}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${certProgress.percentage}%`,
                    background: "var(--met-teal-400)",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {TABS.map(t => {
          const count = t.value === "all"
            ? allBadges.length
            : allBadges.filter(b => b.category === t.value).length
          if (count === 0 && t.value !== "all") return null

          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: tab === t.value ? "var(--met-teal-400)" : "var(--met-surface-muted)",
                color: tab === t.value ? "white" : "var(--met-text-secondary)",
              }}
            >
              {t.label} ({t.value === "all"
                ? earnedCount
                : allBadges.filter(b => b.category === t.value && earnedSlugs.has(b.slug)).length
              }/{count})
            </button>
          )
        })}
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {sorted.map(badge => {
          const earned = earnedSlugs.has(badge.slug)
          const earnedData = earnedBadges.find(e => e.badgeId === badge.slug)
          const prog = progressMap.get(badge.slug)

          return (
            <BadgeCard
              key={badge.slug}
              badge={badge}
              earned={earned}
              earnedDate={earnedData?.earnedAt}
              progress={prog?.percentage}
              onClick={onBadgeClick ? () => onBadgeClick(badge.slug) : undefined}
            />
          )
        })}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-12" style={{ color: "var(--met-text-muted)" }}>
          <p className="text-3xl mb-2">🏅</p>
          <p className="text-sm">No badges in this category yet.</p>
        </div>
      )}
    </div>
  )
}
