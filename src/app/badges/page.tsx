// src/app/badges/page.tsx
// Badge Gallery page.

"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/AppShell"
import { BadgeGallery } from "@/components/badges/BadgeGallery"
import { BadgeCelebration } from "@/components/badges/BadgeCelebration"
import { getBadgesByLevel, getBadgeBySlug, type EarnedBadge, type BadgeProgress, type BadgeDefinition } from "@/lib/badges/catalog"

// TODO: Load from profile
const DEMO_LEVEL = "Explorer" as const

export default function BadgesPage() {
  const allBadges = getBadgesByLevel(DEMO_LEVEL)
  const [celebrating, setCelebrating] = useState<BadgeDefinition | null>(null)

  // Demo: no badges earned yet, some progress
  const earnedBadges: EarnedBadge[] = []
  const progress: (BadgeProgress & { badge: BadgeDefinition })[] = [
    { badgeId: "first-entry", currentValue: 0, targetValue: 1, percentage: 0, badge: getBadgeBySlug("first-entry")! },
    { badgeId: "three-day-streak", currentValue: 0, targetValue: 3, percentage: 0, badge: getBadgeBySlug("three-day-streak")! },
  ].filter(p => p.badge)

  return (
    <AppShell
      studentName="Explorer"
      certLevel={DEMO_LEVEL}
      gradeBand="K-2"
    >
      <div className="p-4 lg:p-6 max-w-3xl mx-auto">
        <BadgeGallery
          allBadges={allBadges}
          earnedBadges={earnedBadges}
          progress={progress}
          certLevel={DEMO_LEVEL}
          onBadgeClick={(slug) => {
            const badge = getBadgeBySlug(slug)
            if (badge) setCelebrating(badge)
          }}
        />
      </div>

      {/* Celebration overlay */}
      {celebrating && (
        <BadgeCelebration
          badge={celebrating}
          certLevel={DEMO_LEVEL}
          onDismiss={() => setCelebrating(null)}
        />
      )}
    </AppShell>
  )
}
