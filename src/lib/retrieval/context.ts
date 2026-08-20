// src/lib/retrieval/context.ts
// Context builder for MET and Teddy.
// Adapted from MetTutor's buildContext() in src/lib/metlibrary/client.ts.
//
// Key difference: MetTutor builds one APA citation format for professionals.
// MET and Teddy adapts the citation format per certification level — from
// a simple footer at Explorer through full professional citations at
// Metrologist.

import type { RetrievedChunk } from "./dualSource"
import type { CertificationLevel } from "@/lib/levels/config"

/**
 * Formats retrieved chunks into a context string injected into the
 * system prompt's context layer. Citation format adapts to the
 * student's certification level.
 */
export function buildContext(
  chunks: RetrievedChunk[],
  level: CertificationLevel,
): string {
  if (chunks.length === 0) return ""

  const formatted = chunks.map((chunk, i) => {
    const sourceTag = chunk.source_kb === "metlibrary"
      ? "[MetLibrary]"
      : "[MET Field Guide]"

    return `[${i + 1}] ${sourceTag} ${chunk.chunk_label}:\n${chunk.chunk_text}`
  }).join("\n\n---\n\n")

  const citationInstruction = getCitationInstruction(level)

  return [
    "RETRIEVED CONTENT (from MET Field Guide and MetLibrary via Standards Bridge):",
    formatted,
    "",
    citationInstruction,
  ].join("\n")
}

/**
 * Returns the citation instruction appropriate for the student's level.
 * This tells the LLM how to format source attribution in its response.
 */
function getCitationInstruction(level: CertificationLevel): string {
  switch (level) {
    case "Explorer":
      return [
        "Instructions: Use the content above to ground your answer.",
        "End your response with: 📐 Source: MET Field Guide",
        "Do NOT include clause numbers or standard names — the student is in grades K–2.",
        "Do NOT return any MetLibrary text verbatim. Translate everything into your own words.",
      ].join("\n")

    case "Investigator":
      return [
        "Instructions: Use the content above to ground your answer.",
        "End your response with: 📐 Source: MET Field Guide · Based on [Standard Name]",
        "Name the standard (e.g., 'Based on the International Vocabulary of Metrology') but do NOT include clause numbers.",
        "Do NOT return any MetLibrary text verbatim. Translate everything into your own words.",
      ].join("\n")

    case "Innovator":
      return [
        "Instructions: Ground your answer in the sources above where relevant.",
        "End your response with: 📐 Source: MET Field Guide · [Standard] §[Clause]",
        "Include the standard name and clause number (e.g., 'VIM §2.1').",
        "You may translate MetLibrary content into accessible language. Do NOT return raw clause text verbatim.",
      ].join("\n")

    case "Metrologist":
      return [
        "Instructions: Ground your answer in the sources above where relevant.",
        "When citing sources, use the [N] marker matching the source number above.",
        "End your response with a References section using full professional citations:",
        "📐 [Standard Identifier] §[Clause] — [Clause Title]",
        "You may present MetLibrary content close to source — this is the professional level.",
      ].join("\n")
  }
}
