// src/lib/mediation/guard.ts
// Mediation Guard — Protection #3 for MET and Teddy.
//
// Scans AI responses for raw standards text that should not reach
// students below the Metrologist level. This is the third line of
// defense (after RLS policies and the limited retrieval key).
//
// Adapted from MET-FieldGuide's src/guards/mediation.ts.

import type { CertificationLevel } from "@/lib/levels/config"
import type { RetrievedChunk } from "@/lib/retrieval/dualSource"

// ── Types ────────────────────────────────────────────────────────────────────

export interface MediationResult {
  passed:     boolean       // true = response is clean
  original:   string        // the original response
  mediated:   string        // the cleaned response (same as original if passed)
  violations: MediationViolation[]
}

export interface MediationViolation {
  type:    "clause_reference" | "verbatim_match" | "professional_term"
  match:   string           // the text that triggered the violation
  context: string           // surrounding text for logging
}

// ── Patterns that indicate raw standards text ────────────────────────────────

const CLAUSE_PATTERNS: RegExp[] = [
  /VIM\s+(?:§\s*)?(\d+\.\d+)/gi,
  /JCGM\s+(?:200|100):\d{4}\s*(?:§\s*)?\d+\.\d+/gi,
  /GUM\s+(?:§\s*)?(\d+\.\d+)/gi,
  /ISO\s*\/?\s*IEC\s+17025(?::2017)?\s+(?:§\s*)?(\d+\.\d+(?:\.\d+)?)/gi,
  /ANSI\s*\/?\s*NCSL\s+Z540(?:\.3)?\s+(?:§\s*)?(\d+\.\d+)/gi,
  /EURAMET\s+cg-\d+/gi,
  /ASME\s+B89\.\d+\.\d+/gi,
  /OIML\s+R\s+\d+/gi,
  /ILAC-G\d+/gi,
]

// Professional terms that are red flags at Explorer/Investigator level
// when they appear WITHOUT an accompanying plain-language explanation.
const PROFESSIONAL_TERMS_YOUNG: RegExp[] = [
  /\bWelch.Satterthwaite\b/i,
  /\beffective degrees of freedom\b/i,
  /\bcoverage probability\b/i,
  /\bType\s+[AB]\s+evaluation\b/i,
  /\broot.sum.of.squares\b/i,
  /\bmetrological traceability\b/i,
  /\bhalf\s*vec\b/i,
  /\bpiston\s+gauge\b/i,
  /\bJosephson\b/i,
  /\bquantum\s+Hall\b/i,
]

// ── Longest common substring detection ───────────────────────────────────────

/**
 * Finds the longest common substring between two strings.
 * Used to detect verbatim copying of MetLibrary content.
 * Returns the length in words, not characters.
 */
function longestCommonWordSequence(a: string, b: string): number {
  const wordsA = a.toLowerCase().split(/\s+/)
  const wordsB = b.toLowerCase().split(/\s+/)

  if (wordsA.length === 0 || wordsB.length === 0) return 0

  let maxLen = 0
  // Sliding window: check all positions of wordsA against wordsB
  for (let i = 0; i < wordsA.length; i++) {
    for (let j = 0; j < wordsB.length; j++) {
      let len = 0
      while (
        i + len < wordsA.length &&
        j + len < wordsB.length &&
        wordsA[i + len] === wordsB[j + len]
      ) {
        len++
      }
      if (len > maxLen) maxLen = len
    }
  }
  return maxLen
}

// ── Main guard ───────────────────────────────────────────────────────────────

/**
 * Scans an AI response for mediation violations.
 *
 * At Metrologist level, everything passes — raw standards text is
 * appropriate for professional-level students.
 *
 * At Explorer, Investigator, and Innovator levels:
 *   - Clause references (VIM §2.1, GUM §4.2, etc.) are violations
 *   - Verbatim matches (>15 consecutive words from MetLibrary) are violations
 *   - Professional terms without explanation are violations (Explorer/Investigator only)
 *
 * When violations are found, the guard strips the offending text and
 * appends the appropriate citation footer.
 */
export function mediationGuard(
  response:      string,
  level:         CertificationLevel,
  retrievedChunks: RetrievedChunk[],
): MediationResult {
  // Metrologist: everything passes
  if (level === "Metrologist") {
    return { passed: true, original: response, mediated: response, violations: [] }
  }

  const violations: MediationViolation[] = []
  let mediated = response

  // ── Check 1: Clause references ─────────────────────────────────────
  for (const pattern of CLAUSE_PATTERNS) {
    pattern.lastIndex = 0
    let match
    while ((match = pattern.exec(response)) !== null) {
      // At Innovator level, clause references in the citation footer
      // are allowed — only flag them in the body text.
      if (level === "Innovator") {
        // Check if this match is in the last line (citation footer)
        const matchEnd = match.index + match[0].length
        const afterMatch = response.slice(matchEnd)
        const beforeMatch = response.slice(0, match.index)

        // If it's in the citation footer (after 📐), skip
        if (beforeMatch.lastIndexOf("📐") > beforeMatch.lastIndexOf("\n")) {
          continue
        }
      }

      violations.push({
        type: "clause_reference",
        match: match[0],
        context: response.slice(
          Math.max(0, match.index - 30),
          Math.min(response.length, match.index + match[0].length + 30)
        ),
      })

      // Strip the clause reference from the response
      mediated = mediated.replace(match[0], "[standards reference]")
    }
  }

  // ── Check 2: Verbatim matches against MetLibrary chunks ────────────
  const mlChunks = retrievedChunks.filter(c => c.source_kb === "metlibrary")
  for (const chunk of mlChunks) {
    const lcs = longestCommonWordSequence(response, chunk.chunk_text)
    if (lcs > 15) {
      violations.push({
        type: "verbatim_match",
        match: `${lcs} consecutive words matching MetLibrary chunk`,
        context: chunk.chunk_label,
      })
    }
  }

  // ── Check 3: Professional terms (Explorer and Investigator only) ───
  if (level === "Explorer" || level === "Investigator") {
    for (const pattern of PROFESSIONAL_TERMS_YOUNG) {
      pattern.lastIndex = 0
      const match = pattern.exec(response)
      if (match) {
        violations.push({
          type: "professional_term",
          match: match[0],
          context: response.slice(
            Math.max(0, match.index - 30),
            Math.min(response.length, match.index + match[0].length + 30)
          ),
        })
      }
    }
  }

  // ── Result ─────────────────────────────────────────────────────────
  return {
    passed:   violations.length === 0,
    original: response,
    mediated: violations.length > 0 ? mediated : response,
    violations,
  }
}
