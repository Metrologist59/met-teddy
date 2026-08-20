// src/lib/levels/config.ts
// Certification levels and grade bands for MET and Teddy.
// Single source of truth for the four-level system.

export type CertificationLevel = "Explorer" | "Investigator" | "Innovator" | "Metrologist"
export type GradeBand = "K-2" | "3-5" | "6-8" | "9-12"

export interface LevelConfig {
  certLevel:      CertificationLevel
  gradeBand:      GradeBand
  ageRange:       string
  teddyProminence: "central" | "active" | "selective" | "minimal"
  metProminence:   "interpreter" | "guide" | "instructor" | "primary_voice"
  retrievalBlend: { fieldGuide: number; metLibrary: number }
}

export const LEVELS: Record<CertificationLevel, LevelConfig> = {
  Explorer: {
    certLevel:       "Explorer",
    gradeBand:       "K-2",
    ageRange:        "ages 5–8",
    teddyProminence: "central",
    metProminence:   "interpreter",
    retrievalBlend:  { fieldGuide: 0.95, metLibrary: 0.05 },
  },
  Investigator: {
    certLevel:       "Investigator",
    gradeBand:       "3-5",
    ageRange:        "ages 8–11",
    teddyProminence: "active",
    metProminence:   "guide",
    retrievalBlend:  { fieldGuide: 0.85, metLibrary: 0.15 },
  },
  Innovator: {
    certLevel:       "Innovator",
    gradeBand:       "6-8",
    ageRange:        "ages 11–14",
    teddyProminence: "selective",
    metProminence:   "instructor",
    retrievalBlend:  { fieldGuide: 0.60, metLibrary: 0.40 },
  },
  Metrologist: {
    certLevel:       "Metrologist",
    gradeBand:       "9-12",
    ageRange:        "ages 14–18",
    teddyProminence: "minimal",
    metProminence:   "primary_voice",
    retrievalBlend:  { fieldGuide: 0.40, metLibrary: 0.60 },
  },
}

export const BAND_TO_LEVEL: Record<GradeBand, CertificationLevel> = {
  "K-2": "Explorer",
  "3-5": "Investigator",
  "6-8": "Innovator",
  "9-12": "Metrologist",
}

export const LEVEL_TO_BAND: Record<CertificationLevel, GradeBand> = {
  Explorer:     "K-2",
  Investigator: "3-5",
  Innovator:    "6-8",
  Metrologist:  "9-12",
}
