// src/lib/badges/notebookIntegration.ts
// Badge-Notebook Integration
// © 2026 MET Scientia, LLC
//
// Core rule: completing a Field Mission without a notebook entry
// earns no mission badge. The documentation is part of the
// achievement — mirroring the professional standard that an
// uncalibrated instrument without a record is not calibrated.

import type { NotebookEntry } from "@/lib/notebook/notebookTypes"
import type { CertificationLevel } from "@/lib/levels/config"

// ── Mission-Notebook enforcement ─────────────────────────────────

export interface MissionBadgeCheck {
  missionSlug:    string
  missionComplete: boolean
  hasNotebookEntry: boolean
  entryQuality:   EntryQuality | null
  badgeEligible:  boolean
  reason:         string
}

/**
 * Checks whether a completed mission qualifies for its badge.
 * The mission must be complete AND have a linked notebook entry
 * that meets minimum quality for the student's level.
 */
export function checkMissionBadgeEligibility(
  missionSlug:     string,
  missionComplete: boolean,
  entries:         NotebookEntry[],
  certLevel:       CertificationLevel,
): MissionBadgeCheck {
  if (!missionComplete) {
    return {
      missionSlug,
      missionComplete: false,
      hasNotebookEntry: false,
      entryQuality: null,
      badgeEligible: false,
      reason: "Mission not yet completed.",
    }
  }

  const linkedEntry = entries.find(e => e.missionSlug === missionSlug)

  if (!linkedEntry) {
    return {
      missionSlug,
      missionComplete: true,
      hasNotebookEntry: false,
      entryQuality: null,
      badgeEligible: false,
      reason: "Mission complete, but no notebook entry found. Create a notebook entry to earn this badge.",
    }
  }

  const quality = scoreEntryQuality(linkedEntry, certLevel)

  if (!quality.meetsMinimum) {
    return {
      missionSlug,
      missionComplete: true,
      hasNotebookEntry: true,
      entryQuality: quality,
      badgeEligible: false,
      reason: `Notebook entry exists but doesn't meet minimum quality. ${quality.feedback}`,
    }
  }

  return {
    missionSlug,
    missionComplete: true,
    hasNotebookEntry: true,
    entryQuality: quality,
    badgeEligible: true,
    reason: "Mission complete with qualifying notebook entry. Badge earned!",
  }
}

// ── Notebook entry quality scoring ───────────────────────────────

export interface EntryQuality {
  score:        number   // 0–100
  meetsMinimum: boolean
  checks:       QualityCheck[]
  feedback:     string
}

interface QualityCheck {
  name:    string
  passed:  boolean
  weight:  number
  detail?: string
}

/**
 * Scores a notebook entry's quality against level-appropriate criteria.
 * Each level has different minimum requirements.
 */
export function scoreEntryQuality(
  entry: NotebookEntry,
  certLevel: CertificationLevel,
): EntryQuality {
  const checks: QualityCheck[] = []
  const values = entry.measurements.map(m => m.value)

  // ── Universal checks ───────────────────────────────────────────

  checks.push({
    name: "Has measurement",
    passed: values.length > 0,
    weight: 25,
  })

  checks.push({
    name: "Unit recorded",
    passed: !!(entry.unit && entry.unit.trim() !== ""),
    weight: 20,
  })

  checks.push({
    name: "What measured identified",
    passed: !!(entry.whatMeasured && entry.whatMeasured.trim() !== ""),
    weight: 10,
  })

  // ── Level-specific checks ──────────────────────────────────────

  if (certLevel === "Explorer") {
    checks.push({
      name: "Title present",
      passed: !!(entry.title && entry.title.trim() !== ""),
      weight: 10,
    })
    // Explorer minimum: at least one measurement with a unit
  }

  if (certLevel === "Investigator" || certLevel === "Innovator" || certLevel === "Metrologist") {
    checks.push({
      name: "Multiple readings (≥ 3)",
      passed: values.length >= 3,
      weight: 15,
      detail: `${values.length} reading${values.length !== 1 ? "s" : ""} recorded`,
    })

    checks.push({
      name: "Reflection completed",
      passed: entry.reflections.length > 0 && entry.reflections.some(r => r.response.trim() !== ""),
      weight: 10,
    })

    checks.push({
      name: "Instrument identified",
      passed: !!(entry.instrument && entry.instrument.trim() !== ""),
      weight: 10,
    })
  }

  if (certLevel === "Innovator" || certLevel === "Metrologist") {
    checks.push({
      name: "Five or more readings",
      passed: values.length >= 5,
      weight: 10,
      detail: `${values.length} of 5 minimum`,
    })
  }

  if (certLevel === "Metrologist") {
    checks.push({
      name: "Uncertainty budget present",
      passed: !!(entry.uncertainty && entry.uncertainty.length > 0),
      weight: 15,
    })

    checks.push({
      name: "At least 2 uncertainty components",
      passed: !!(entry.uncertainty && entry.uncertainty.length >= 2),
      weight: 10,
      detail: entry.uncertainty ? `${entry.uncertainty.length} component${entry.uncertainty.length !== 1 ? "s" : ""}` : "0 components",
    })
  }

  // ── Score calculation ──────────────────────────────────────────

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0)
  const earnedWeight = checks.filter(c => c.passed).reduce((s, c) => s + c.weight, 0)
  const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0

  // Minimum thresholds per level
  const minimums: Record<CertificationLevel, number> = {
    Explorer: 50,       // measurement + unit is enough
    Investigator: 60,   // need multiple readings + reflection
    Innovator: 65,      // need 5+ readings + instrument
    Metrologist: 70,    // need uncertainty budget
  }

  const meetsMinimum = score >= minimums[certLevel]

  // Build feedback
  const failed = checks.filter(c => !c.passed)
  const feedback = failed.length === 0
    ? "All quality checks passed."
    : `Missing: ${failed.map(c => c.name.toLowerCase()).join(", ")}.`

  return { score, meetsMinimum, checks, feedback }
}

// ── Bulk check for dashboard ─────────────────────────────────────

export interface NotebookBadgeSummary {
  totalMissions:       number
  completedMissions:   number
  missionsWithEntries: number
  missionsWithoutEntries: string[]  // slugs
  avgEntryQuality:     number
}

export function summarizeNotebookBadgeStatus(
  completedMissions: string[],
  entries:          NotebookEntry[],
  certLevel:        CertificationLevel,
): NotebookBadgeSummary {
  const missionEntries = new Set(
    entries.filter(e => e.missionSlug).map(e => e.missionSlug!)
  )

  const missionsWithoutEntries = completedMissions.filter(
    slug => !missionEntries.has(slug)
  )

  const qualityScores = entries
    .filter(e => e.missionSlug && completedMissions.includes(e.missionSlug))
    .map(e => scoreEntryQuality(e, certLevel).score)

  const avgQuality = qualityScores.length > 0
    ? qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length
    : 0

  return {
    totalMissions: completedMissions.length + missionsWithoutEntries.length,
    completedMissions: completedMissions.length,
    missionsWithEntries: completedMissions.length - missionsWithoutEntries.length,
    missionsWithoutEntries,
    avgEntryQuality: Math.round(avgQuality),
  }
}
