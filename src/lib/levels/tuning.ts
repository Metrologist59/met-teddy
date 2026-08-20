// src/lib/levels/tuning.ts
// Level-Adaptation Tuning Configuration
// © 2026 MET Scientia, LLC
//
// Centralizes all tunable parameters for level adaptation.
// Updated from beta data per Step 4.12.
//
// BASELINE values are the pre-beta defaults.
// REFINED values are updated after beta analysis.
// Switch between them by setting ACTIVE_PROFILE.

export type TuningProfile = "baseline" | "refined"
export const ACTIVE_PROFILE: TuningProfile = "baseline"

// ── Blend Ratios ─────────────────────────────────────────────────

export interface BlendConfig {
  fieldGuideWeight: number   // 0.0–1.0
  metLibraryWeight: number   // 0.0–1.0 (must sum to 1.0 with above)
  maxMetLibraryChunks: number
  maxFieldGuideChunks: number
}

const BLEND_BASELINE: Record<string, BlendConfig> = {
  Explorer:     { fieldGuideWeight: 0.95, metLibraryWeight: 0.05, maxMetLibraryChunks: 1, maxFieldGuideChunks: 5 },
  Investigator: { fieldGuideWeight: 0.85, metLibraryWeight: 0.15, maxMetLibraryChunks: 2, maxFieldGuideChunks: 5 },
  Innovator:    { fieldGuideWeight: 0.60, metLibraryWeight: 0.40, maxMetLibraryChunks: 3, maxFieldGuideChunks: 4 },
  Metrologist:  { fieldGuideWeight: 0.40, metLibraryWeight: 0.60, maxMetLibraryChunks: 5, maxFieldGuideChunks: 3 },
}

const BLEND_REFINED: Record<string, BlendConfig> = {
  // Updated after beta — copy baseline and adjust
  Explorer:     { fieldGuideWeight: 0.95, metLibraryWeight: 0.05, maxMetLibraryChunks: 1, maxFieldGuideChunks: 5 },
  Investigator: { fieldGuideWeight: 0.85, metLibraryWeight: 0.15, maxMetLibraryChunks: 2, maxFieldGuideChunks: 5 },
  Innovator:    { fieldGuideWeight: 0.60, metLibraryWeight: 0.40, maxMetLibraryChunks: 3, maxFieldGuideChunks: 4 },
  Metrologist:  { fieldGuideWeight: 0.40, metLibraryWeight: 0.60, maxMetLibraryChunks: 5, maxFieldGuideChunks: 3 },
}

export function getBlendConfig(level: string): BlendConfig {
  const source = ACTIVE_PROFILE === "refined" ? BLEND_REFINED : BLEND_BASELINE
  return source[level] ?? BLEND_BASELINE["Explorer"]
}

// ── Response Parameters ──────────────────────────────────────────

export interface ResponseConfig {
  maxResponseWords: number
  vocabularyCeiling: "common" | "introduce_terms" | "technical" | "professional"
  analogyStyle: "concrete_sensory" | "everyday_comparison" | "scientific_analogy" | "professional_reference"
  sentenceComplexity: "simple" | "compound" | "complex" | "professional"
  humorDensity: number        // 0.0–1.0 (how often humor appears)
  encouragementFrequency: number  // 0.0–1.0
}

const RESPONSE_BASELINE: Record<string, ResponseConfig> = {
  Explorer: {
    maxResponseWords: 150,
    vocabularyCeiling: "common",
    analogyStyle: "concrete_sensory",
    sentenceComplexity: "simple",
    humorDensity: 0.7,
    encouragementFrequency: 0.9,
  },
  Investigator: {
    maxResponseWords: 250,
    vocabularyCeiling: "introduce_terms",
    analogyStyle: "everyday_comparison",
    sentenceComplexity: "compound",
    humorDensity: 0.5,
    encouragementFrequency: 0.7,
  },
  Innovator: {
    maxResponseWords: 400,
    vocabularyCeiling: "technical",
    analogyStyle: "scientific_analogy",
    sentenceComplexity: "complex",
    humorDensity: 0.3,
    encouragementFrequency: 0.5,
  },
  Metrologist: {
    maxResponseWords: 500,
    vocabularyCeiling: "professional",
    analogyStyle: "professional_reference",
    sentenceComplexity: "professional",
    humorDensity: 0.1,
    encouragementFrequency: 0.3,
  },
}

const RESPONSE_REFINED: Record<string, ResponseConfig> = {
  // Updated after beta — copy baseline and adjust
  ...RESPONSE_BASELINE,
}

export function getResponseConfig(level: string): ResponseConfig {
  const source = ACTIVE_PROFILE === "refined" ? RESPONSE_REFINED : RESPONSE_BASELINE
  return source[level] ?? RESPONSE_BASELINE["Explorer"]
}

// ── Teddy Prominence ─────────────────────────────────────────────

export interface TeddyConfig {
  appearanceRate: number     // 0.0–1.0 (probability Teddy appears in response)
  bodyLanguageVariety: number // 1–10 (how many different actions to use)
  mistakeMakerRate: number   // 0.0–1.0 (probability of mistake-maker pattern)
}

const TEDDY_BASELINE: Record<string, TeddyConfig> = {
  Explorer:     { appearanceRate: 0.90, bodyLanguageVariety: 8, mistakeMakerRate: 0.30 },
  Investigator: { appearanceRate: 0.70, bodyLanguageVariety: 6, mistakeMakerRate: 0.20 },
  Innovator:    { appearanceRate: 0.30, bodyLanguageVariety: 4, mistakeMakerRate: 0.10 },
  Metrologist:  { appearanceRate: 0.10, bodyLanguageVariety: 2, mistakeMakerRate: 0.05 },
}

const TEDDY_REFINED: Record<string, TeddyConfig> = {
  ...TEDDY_BASELINE,
}

export function getTeddyConfig(level: string): TeddyConfig {
  const source = ACTIVE_PROFILE === "refined" ? TEDDY_REFINED : TEDDY_BASELINE
  return source[level] ?? TEDDY_BASELINE["Explorer"]
}

// ── Citation Format ──────────────────────────────────────────────

export interface CitationConfig {
  showCitationFooter: boolean
  expandableClause: boolean
  showStandardName: boolean
  showClauseNumber: boolean
  bridgeExplanation: "none" | "simple" | "detailed"
}

const CITATION_BASELINE: Record<string, CitationConfig> = {
  Explorer:     { showCitationFooter: true, expandableClause: false, showStandardName: false, showClauseNumber: false, bridgeExplanation: "none" },
  Investigator: { showCitationFooter: true, expandableClause: false, showStandardName: true,  showClauseNumber: false, bridgeExplanation: "none" },
  Innovator:    { showCitationFooter: true, expandableClause: true,  showStandardName: true,  showClauseNumber: true,  bridgeExplanation: "simple" },
  Metrologist:  { showCitationFooter: true, expandableClause: true,  showStandardName: true,  showClauseNumber: true,  bridgeExplanation: "detailed" },
}

const CITATION_REFINED: Record<string, CitationConfig> = {
  ...CITATION_BASELINE,
}

export function getCitationConfig(level: string): CitationConfig {
  const source = ACTIVE_PROFILE === "refined" ? CITATION_REFINED : CITATION_BASELINE
  return source[level] ?? CITATION_BASELINE["Explorer"]
}
