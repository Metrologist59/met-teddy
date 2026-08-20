// src/lib/mediation/conflicts.ts
// Conflict resolution between MET Field Guide and MetLibrary.
//
// When the two sources disagree, this module provides the directive
// that tells Claude how to resolve the conflict. Injected into the
// context layer of the system prompt.
//
// Rule: MetLibrary is authoritative on technical fact. MET Field Guide
// governs pedagogical framing. The student never sees "sources disagree."

import type { CertificationLevel } from "@/lib/levels/config"

/**
 * Returns the conflict resolution directive for the system prompt.
 * This tells Claude how to handle disagreements between sources.
 */
export function getConflictDirective(level: CertificationLevel): string {
  const base = [
    "SOURCE CONFLICT RESOLUTION:",
    "If the MET Field Guide and MetLibrary content in the context above disagree:",
    "- On a technical fact (definition, formula, numerical value, procedure): defer to MetLibrary. It is the authoritative standards source.",
    "- On pedagogical approach (how to explain, what analogy to use): use the MET Field Guide's framing. You decide how to teach; MetLibrary provides the science.",
    "- On terminology: use the term appropriate for the student's level, not the most technical term available.",
    "- Never reveal the disagreement to the student. Present one consistent, correct answer.",
  ].join("\n")

  if (level === "Metrologist") {
    return base + "\n" + [
      "",
      "At the Metrologist level, if there is a genuine ambiguity in the standards (which does occur),",
      "you may note it: 'The VIM and GUM use slightly different framing here — the VIM says X while",
      "the GUM approaches it as Y. Both are correct.' This is professional training; ambiguity is real.",
    ].join("\n")
  }

  return base
}

/**
 * Returns the MetLibrary fallback directive when MetLibrary is unavailable.
 */
export function getFallbackDirective(
  level:     CertificationLevel,
  available: boolean,
): string {
  if (available) return ""

  switch (level) {
    case "Explorer":
    case "Investigator":
      // No impact — Field Guide has the content
      return ""

    case "Innovator":
      return [
        "NOTE: MetLibrary is currently unavailable. Use the MET Field Guide content and",
        "Standards Bridge cached citations for this response. Definitions may be from",
        "cached content rather than live resolution.",
      ].join("\n")

    case "Metrologist":
      return [
        "NOTE: MetLibrary is currently unavailable. Use the MET Field Guide and Standards",
        "Bridge cached content. If the student asks for specific clause text that you do not",
        "have in the provided context, say: 'The live standards connection is temporarily",
        "unavailable. I can work with the cached references I have, or we can return to this",
        "when the connection is restored.' Never fabricate clause text.",
      ].join("\n")
  }
}
