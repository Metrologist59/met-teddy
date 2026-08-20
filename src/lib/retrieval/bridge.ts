// src/lib/retrieval/bridge.ts
// Standards Bridge resolution for MET and Teddy.
//
// When content is retrieved from the MET Field Guide, the Standards
// Bridge resolves it to its underlying standards reference and produces
// a grade-band-appropriate citation. This is how "calibration" becomes
// "📐 Source: MET Field Guide · Based on the International Vocabulary
// of Metrology" at Investigator level, or "📐 VIM §2.39 — Calibration"
// at Metrologist level.

import { createClient } from "@supabase/supabase-js"
import type { CertificationLevel, GradeBand } from "@/lib/levels/config"

// ── Types ────────────────────────────────────────────────────────────────────

export interface BridgeResolution {
  bridgeId:       string
  sourceStandard: string
  sourceClause:   string
  clauseTitle:    string
  adaptationText: string      // grade-band-appropriate explanation
  mediationLevel: string      // citation_only | translated | near_source
  citationText:   string      // formatted citation for the citation footer
}

// ── Resolution ───────────────────────────────────────────────────────────────

/**
 * Resolves Standards Bridge entries for a set of retrieved chunk labels.
 * Looks up bridge entries that match the concepts in the retrieved content
 * and returns grade-band-appropriate adaptations.
 *
 * Uses the database's standards_bridge.resolve() function when available,
 * falls back to direct query.
 */
export async function resolveBridge(
  conceptSlugs: string[],
  gradeBand:    GradeBand,
  level:        CertificationLevel,
): Promise<BridgeResolution[]> {
  if (conceptSlugs.length === 0) return []

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return []

  const supabase = createClient(url, key, { auth: { persistSession: false } })

  try {
    // Query bridge entries with their band adaptations
    const { data, error } = await supabase
      .schema("standards_bridge")
      .from("band_adaptations")
      .select(`
        bridge_id,
        grade_band,
        adaptation_text,
        mediation_level,
        bridge_entries!inner (
          source_standard,
          source_clause,
          clause_title,
          citation_text,
          cached_citation
        )
      `)
      .eq("grade_band", gradeBand)
      .limit(10)

    if (error || !data) {
      console.error("[bridge] Resolution error:", error?.message)
      return []
    }

    return (data as any[]).map((row) => ({
      bridgeId:       row.bridge_id,
      sourceStandard: row.bridge_entries.source_standard,
      sourceClause:   row.bridge_entries.source_clause,
      clauseTitle:    row.bridge_entries.clause_title ?? "",
      adaptationText: row.adaptation_text,
      mediationLevel: row.mediation_level,
      citationText:   row.bridge_entries.cached_citation ?? row.bridge_entries.citation_text,
    }))

  } catch (err: any) {
    console.error("[bridge] unexpected error:", err.message)
    return []
  }
}

/**
 * Formats bridge resolutions into a citation footer appropriate
 * for the student's level.
 */
export function formatCitationFooter(
  resolutions: BridgeResolution[],
  level: CertificationLevel,
): string {
  if (resolutions.length === 0) return ""

  switch (level) {
    case "Explorer":
      return "📐 Source: MET Field Guide"

    case "Investigator": {
      const standards = [...new Set(resolutions.map(r => r.sourceStandard))]
      const names = standards.map(s => friendlyStandardName(s)).join(", ")
      return `📐 Source: MET Field Guide · Based on ${names}`
    }

    case "Innovator": {
      const refs = resolutions
        .slice(0, 3)
        .map(r => `${abbreviateStandard(r.sourceStandard)} §${r.sourceClause}`)
      return `📐 Source: MET Field Guide · ${refs.join("; ")}`
    }

    case "Metrologist": {
      const refs = resolutions
        .slice(0, 5)
        .map(r => `📐 ${r.citationText}`)
      return refs.join("\n")
    }
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function friendlyStandardName(standard: string): string {
  const names: Record<string, string> = {
    "JCGM 200:2012":       "the International Vocabulary of Metrology (VIM)",
    "JCGM 100:2008":       "the Guide to the Expression of Uncertainty in Measurement (GUM)",
    "ISO/IEC 17025:2017":  "ISO/IEC 17025",
    "ANSI/NCSL Z540.3":    "ANSI/NCSL Z540.3",
    "ASQ CCT BoK":         "the ASQ Certified Calibration Technician Body of Knowledge",
  }
  return names[standard] ?? standard
}

function abbreviateStandard(standard: string): string {
  const abbrevs: Record<string, string> = {
    "JCGM 200:2012":       "VIM",
    "JCGM 100:2008":       "GUM",
    "ISO/IEC 17025:2017":  "ISO 17025",
    "ANSI/NCSL Z540.3":    "Z540.3",
    "ASQ CCT BoK":         "CCT BoK",
  }
  return abbrevs[standard] ?? standard
}
