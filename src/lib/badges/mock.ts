// src/lib/badges/mock.ts
// Mock badge data for testing badge awareness.
// Replaced by real database queries in Phase 3.

import type { Badge, BadgeProgress, BadgeSummary } from "./types"
import type { CertificationLevel } from "@/lib/levels/config"

// ── Badge catalog (subset for mock) ──────────────────────────────────────────

const BADGE_CATALOG: Badge[] = [
  // Mission badges
  { id: "b-mt", name: "First Measurement", category: "mission", description: "Complete the Measure Teddy mission", level: "Explorer", domain: "general", earnedAt: null, iconUrl: null },
  { id: "b-pp", name: "Pendulum Pioneer", category: "mission", description: "Complete the Pendulum Period mission", level: "Investigator", domain: "time", earnedAt: null, iconUrl: null },
  { id: "b-pc", name: "Parallax Detective", category: "mission", description: "Complete the Parallax Challenge mission", level: "Innovator", domain: "length", earnedAt: null, iconUrl: null },
  { id: "b-sr", name: "Repeatability Pro", category: "mission", description: "Complete the Scale Repeatability Study", level: "Innovator", domain: "mass", earnedAt: null, iconUrl: null },
  { id: "b-bv", name: "Voltage Verified", category: "mission", description: "Complete the Battery Voltage Check", level: "Metrologist", domain: "electrical", earnedAt: null, iconUrl: null },

  // Domain badges
  { id: "b-dl", name: "Length Master", category: "domain", description: "Complete all length domain missions and concepts", level: "Investigator", domain: "length", earnedAt: null, iconUrl: null },
  { id: "b-dm", name: "Mass Master", category: "domain", description: "Complete all mass domain missions and concepts", level: "Investigator", domain: "mass", earnedAt: null, iconUrl: null },
  { id: "b-dt", name: "Temperature Master", category: "domain", description: "Complete all temperature domain missions and concepts", level: "Innovator", domain: "temperature", earnedAt: null, iconUrl: null },

  // Notebook badges
  { id: "b-n1", name: "First Entry", category: "notebook", description: "Record your first Field Notebook entry", level: "Explorer", domain: null, earnedAt: null, iconUrl: null },
  { id: "b-n5", name: "Consistent Recorder", category: "notebook", description: "Record 5 notebook entries", level: "Investigator", domain: null, earnedAt: null, iconUrl: null },
  { id: "b-n10", name: "Data Scientist", category: "notebook", description: "Record 10 notebook entries with calculated statistics", level: "Innovator", domain: null, earnedAt: null, iconUrl: null },

  // Explorer badges
  { id: "b-e1", name: "Career Explorer", category: "explorer", description: "Read about 3 measurement science careers", level: "Investigator", domain: null, earnedAt: null, iconUrl: null },
]

// ── Mock summaries by level ──────────────────────────────────────────────────

export function getMockBadgeSummary(
  studentId: string,
  level: CertificationLevel,
): BadgeSummary {
  switch (level) {
    case "Explorer":
      return {
        earned: [
          { ...BADGE_CATALOG[0], earnedAt: "2026-08-15" },  // First Measurement
          { ...BADGE_CATALOG[8], earnedAt: "2026-08-15" },  // First Entry
        ],
        inProgress: [
          { badgeId: "b-dl", badgeName: "Length Master", category: "domain", totalRequired: 3, completed: 1, percentDone: 33, isNearComplete: false },
        ],
        totalEarned: 2,
        recentBadge: { ...BADGE_CATALOG[0], earnedAt: "2026-08-15" },
        nearComplete: [],
      }

    case "Investigator":
      return {
        earned: [
          { ...BADGE_CATALOG[0], earnedAt: "2026-08-15" },
          { ...BADGE_CATALOG[1], earnedAt: "2026-08-16" },
          { ...BADGE_CATALOG[8], earnedAt: "2026-08-15" },
          { ...BADGE_CATALOG[9], earnedAt: "2026-08-17" },
        ],
        inProgress: [
          { badgeId: "b-dl", badgeName: "Length Master", category: "domain", totalRequired: 3, completed: 2, percentDone: 67, isNearComplete: true },
          { badgeId: "b-dm", badgeName: "Mass Master", category: "domain", totalRequired: 3, completed: 1, percentDone: 33, isNearComplete: false },
        ],
        totalEarned: 4,
        recentBadge: { ...BADGE_CATALOG[9], earnedAt: "2026-08-17" },
        nearComplete: [
          { badgeId: "b-dl", badgeName: "Length Master", category: "domain", totalRequired: 3, completed: 2, percentDone: 67, isNearComplete: true },
        ],
      }

    case "Innovator":
      return {
        earned: [
          { ...BADGE_CATALOG[0], earnedAt: "2026-08-10" },
          { ...BADGE_CATALOG[1], earnedAt: "2026-08-11" },
          { ...BADGE_CATALOG[2], earnedAt: "2026-08-14" },
          { ...BADGE_CATALOG[3], earnedAt: "2026-08-17" },
          { ...BADGE_CATALOG[5], earnedAt: "2026-08-15" },
          { ...BADGE_CATALOG[8], earnedAt: "2026-08-10" },
          { ...BADGE_CATALOG[9], earnedAt: "2026-08-13" },
        ],
        inProgress: [
          { badgeId: "b-dt", badgeName: "Temperature Master", category: "domain", totalRequired: 3, completed: 2, percentDone: 67, isNearComplete: true },
          { badgeId: "b-n10", badgeName: "Data Scientist", category: "notebook", totalRequired: 10, completed: 8, percentDone: 80, isNearComplete: true },
        ],
        totalEarned: 7,
        recentBadge: { ...BADGE_CATALOG[3], earnedAt: "2026-08-17" },
        nearComplete: [
          { badgeId: "b-dt", badgeName: "Temperature Master", category: "domain", totalRequired: 3, completed: 2, percentDone: 67, isNearComplete: true },
          { badgeId: "b-n10", badgeName: "Data Scientist", category: "notebook", totalRequired: 10, completed: 8, percentDone: 80, isNearComplete: true },
        ],
      }

    case "Metrologist":
      return {
        earned: Array.from({ length: 10 }, (_, i) => ({
          ...BADGE_CATALOG[Math.min(i, BADGE_CATALOG.length - 1)],
          earnedAt: `2026-08-${String(10 + i).padStart(2, "0")}`,
        })),
        inProgress: [
          { badgeId: "b-bv", badgeName: "Voltage Verified", category: "mission", totalRequired: 1, completed: 0, percentDone: 0, isNearComplete: false },
        ],
        totalEarned: 10,
        recentBadge: { ...BADGE_CATALOG[4], earnedAt: "2026-08-18" },
        nearComplete: [],
      }
  }
}
