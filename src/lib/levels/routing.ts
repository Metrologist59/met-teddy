// src/lib/levels/routing.ts
// Level Routing for MET and Teddy.
//
// Takes the detected level and produces a complete session configuration
// that drives every downstream decision: prompt composition, retrieval
// parameters, Teddy prominence, citation format, and safety level.

import { LEVELS, type CertificationLevel, type GradeBand } from "./config"
import { detectLevel, type StudentProfile, type DetectedLevel } from "./detection"

// ── Types ────────────────────────────────────────────────────────────────────

export type CitationFormat = "footer_only" | "named_standard" | "standard_clause" | "full_professional"
export type SafetyLevel = "adult_copilot" | "adult_present" | "adult_available" | "lab_supervision"

export interface SessionConfig {
  // Level identity
  certLevel:       CertificationLevel
  gradeBand:       GradeBand
  levelSource:     "default" | "override" | "flex"

  // Prompt composition
  teddyProminence: "central" | "active" | "selective" | "minimal"
  metProminence:   "interpreter" | "guide" | "instructor" | "primary_voice"

  // Retrieval
  retrievalBlend:  { fieldGuide: number; metLibrary: number }

  // Citation
  citationFormat:  CitationFormat

  // Safety
  safetyLevel:     SafetyLevel

  // Flex
  canFlexUp:       boolean
  canFlexDown:     boolean
}

// ── Citation format per level ────────────────────────────────────────────────

const CITATION_FORMATS: Record<CertificationLevel, CitationFormat> = {
  Explorer:     "footer_only",
  Investigator: "named_standard",
  Innovator:    "standard_clause",
  Metrologist:  "full_professional",
}

// ── Safety level per level ───────────────────────────────────────────────────

const SAFETY_LEVELS: Record<CertificationLevel, SafetyLevel> = {
  Explorer:     "adult_copilot",
  Investigator: "adult_present",
  Innovator:    "adult_available",
  Metrologist:  "lab_supervision",
}

// ── Main routing function ────────────────────────────────────────────────────

/**
 * Produces a complete session configuration from a student profile.
 * This is the single function that the chat endpoint calls to get
 * everything it needs for prompt composition, retrieval, and safety.
 */
export function routeSession(profile: StudentProfile): SessionConfig {
  const detected = detectLevel(profile)
  const levelConfig = LEVELS[detected.effectiveLevel]

  return {
    certLevel:       detected.effectiveLevel,
    gradeBand:       detected.effectiveBand,
    levelSource:     detected.source,
    teddyProminence: levelConfig.teddyProminence,
    metProminence:   levelConfig.metProminence,
    retrievalBlend:  levelConfig.retrievalBlend,
    citationFormat:  CITATION_FORMATS[detected.effectiveLevel],
    safetyLevel:     SAFETY_LEVELS[detected.effectiveLevel],
    canFlexUp:       detected.canFlexUp,
    canFlexDown:     detected.canFlexDown,
  }
}

/**
 * Convenience: route directly from a grade band with no overrides.
 * Used when the student profile is not yet loaded (first message,
 * unauthenticated preview, etc.).
 */
export function routeFromBand(gradeBand: GradeBand): SessionConfig {
  return routeSession({
    studentId:     "anonymous",
    gradeBand,
    overrideLevel: null,
    flexLevel:     null,
  })
}
