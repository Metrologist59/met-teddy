// src/lib/levels/detection.ts
// Level Detection Engine for MET and Teddy.
//
// Determines the student's effective certification level from:
//   1. Grade band (default mapping)
//   2. Parent/educator override (dashboard-set)
//   3. Flex rules (student working ±1 level)
//
// Key rules from the Brand Ecosystem Profile §8.5:
//   - Level is not locked. A student may work ±1 level from their grade band.
//   - Advancement requires demonstrated competency, not birthdays.
//   - Parent/educator override takes precedence over grade band default.
//   - MET never tells a student they are behind or at a younger level.

import {
  type CertificationLevel,
  type GradeBand,
  LEVELS,
  BAND_TO_LEVEL,
} from "./config"

// ── Types ────────────────────────────────────────────────────────────────────

export interface StudentProfile {
  studentId:     string
  gradeBand:     GradeBand
  overrideLevel: CertificationLevel | null  // set by parent/educator
  flexLevel:     CertificationLevel | null  // earned by demonstrated competency
}

export interface DetectedLevel {
  effectiveLevel: CertificationLevel
  effectiveBand:  GradeBand
  source:         "default" | "override" | "flex"
  canFlexUp:      boolean   // student is eligible to work one level above
  canFlexDown:    boolean   // student is eligible to work one level below
}

// ── Level ordering (for ±1 flex logic) ───────────────────────────────────────

const LEVEL_ORDER: CertificationLevel[] = [
  "Explorer",
  "Investigator",
  "Innovator",
  "Metrologist",
]

const LEVEL_INDEX: Record<CertificationLevel, number> = {
  Explorer:     0,
  Investigator: 1,
  Innovator:    2,
  Metrologist:  3,
}

const BAND_FOR_LEVEL: Record<CertificationLevel, GradeBand> = {
  Explorer:     "K-2",
  Investigator: "3-5",
  Innovator:    "6-8",
  Metrologist:  "9-12",
}

// ── Detection ────────────────────────────────────────────────────────────────

/**
 * Determines the student's effective certification level.
 *
 * Priority:
 *   1. Parent/educator override (highest — they see the full picture)
 *   2. Flex level (earned by demonstrated competency through missions)
 *   3. Default grade band mapping (the starting point for everyone)
 *
 * The ±1 flex rule: a student may work one level above or below their
 * grade band default. A curious fourth-grader running repeatability
 * trials is an Investigator working into Innovator content, and MET
 * supports that without comment.
 */
export function detectLevel(profile: StudentProfile): DetectedLevel {
  const defaultLevel = BAND_TO_LEVEL[profile.gradeBand]
  const defaultIndex = LEVEL_INDEX[defaultLevel]

  // Priority 1: Parent/educator override
  if (profile.overrideLevel) {
    const overrideIndex = LEVEL_INDEX[profile.overrideLevel]

    // Validate: override must be within ±1 of the grade band default
    // (educators can set any level; the ±1 rule is for student self-flex)
    return {
      effectiveLevel: profile.overrideLevel,
      effectiveBand:  BAND_FOR_LEVEL[profile.overrideLevel],
      source:         "override",
      canFlexUp:      overrideIndex < LEVEL_ORDER.length - 1,
      canFlexDown:    overrideIndex > 0,
    }
  }

  // Priority 2: Flex level (demonstrated competency)
  if (profile.flexLevel) {
    const flexIndex = LEVEL_INDEX[profile.flexLevel]

    // Validate: flex must be within ±1 of the grade band default
    if (Math.abs(flexIndex - defaultIndex) <= 1) {
      return {
        effectiveLevel: profile.flexLevel,
        effectiveBand:  BAND_FOR_LEVEL[profile.flexLevel],
        source:         "flex",
        canFlexUp:      flexIndex < LEVEL_ORDER.length - 1,
        canFlexDown:    flexIndex > 0,
      }
    }
    // If flex is more than ±1 from default, ignore it (data error)
  }

  // Priority 3: Default grade band mapping
  return {
    effectiveLevel: defaultLevel,
    effectiveBand:  BAND_FOR_LEVEL[defaultLevel],
    source:         "default",
    canFlexUp:      defaultIndex < LEVEL_ORDER.length - 1,
    canFlexDown:    defaultIndex > 0,
  }
}

/**
 * Returns the level one step above the given level, or null if
 * already at Metrologist.
 */
export function levelAbove(level: CertificationLevel): CertificationLevel | null {
  const idx = LEVEL_INDEX[level]
  return idx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[idx + 1] : null
}

/**
 * Returns the level one step below the given level, or null if
 * already at Explorer.
 */
export function levelBelow(level: CertificationLevel): CertificationLevel | null {
  const idx = LEVEL_INDEX[level]
  return idx > 0 ? LEVEL_ORDER[idx - 1] : null
}

/**
 * Checks whether a target level is within the ±1 flex range of
 * the student's grade band default.
 */
export function isWithinFlexRange(
  gradeBand: GradeBand,
  targetLevel: CertificationLevel,
): boolean {
  const defaultIndex = LEVEL_INDEX[BAND_TO_LEVEL[gradeBand]]
  const targetIndex = LEVEL_INDEX[targetLevel]
  return Math.abs(targetIndex - defaultIndex) <= 1
}
