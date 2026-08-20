// src/lib/badges/types.ts
// Digital Badge System types for MET and Teddy.
// Open Badges 3.0 compliant credentials issued by MET Scientia, LLC.
//
// Badge categories from Product Architecture §10.1:
//   Mission Badges — completing individual Field Missions
//   Domain Badges — competency across a measurement domain
//   Notebook Badges — documentation quality habits
//   Explorer Badges — engaging with real-world content

import type { CertificationLevel } from "@/lib/levels/config"

export type BadgeCategory = "mission" | "domain" | "notebook" | "explorer"

export interface Badge {
  id:          string
  name:        string
  category:    BadgeCategory
  description: string
  level:       CertificationLevel
  domain:      string | null     // for domain badges
  earnedAt:    string | null     // ISO date, null if not yet earned
  iconUrl:     string | null     // Phase 3 — visual asset
}

export interface BadgeProgress {
  badgeId:       string
  badgeName:     string
  category:      BadgeCategory
  totalRequired: number
  completed:     number
  percentDone:   number
  isNearComplete: boolean  // within 1 step of earning
}

export interface BadgeSummary {
  earned:        Badge[]
  inProgress:    BadgeProgress[]
  totalEarned:   number
  recentBadge:   Badge | null     // most recently earned
  nearComplete:  BadgeProgress[]  // badges within 1 step
}
