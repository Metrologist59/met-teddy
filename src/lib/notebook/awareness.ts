// src/lib/notebook/awareness.ts
// Notebook Awareness Module for MET and Teddy.
//
// Generates prompt blocks from the student's Field Notebook data.
// These blocks are injected into the context layer so MET can:
//   - Reference the student's own measurement data
//   - Nudge documentation when missions lack entries
//   - Provide data-specific feedback
//   - Connect past entries to current concepts
//
// Phase 2: runs against mock data.
// Phase 3: wired to the real notebook database.

import type { CertificationLevel } from "@/lib/levels/config"
import type { NotebookEntry, NotebookSummary } from "./types"

// ── Types ────────────────────────────────────────────────────────────────────

export interface NotebookDirective {
  hasData:     boolean
  promptBlock: string
}

// ── Main awareness function ──────────────────────────────────────────────────

/**
 * Generates a notebook awareness prompt block from the student's
 * notebook summary and recent entries.
 *
 * This block is injected into the system prompt context layer so
 * MET knows what the student has measured, when, and how.
 */
export function notebookAwareness(
  summary: NotebookSummary | null,
  level:   CertificationLevel,
): NotebookDirective {
  if (!summary || summary.totalEntries === 0) {
    return {
      hasData: false,
      promptBlock: buildEmptyNotebookBlock(level),
    }
  }

  const parts: string[] = [
    "STUDENT'S FIELD NOTEBOOK:",
  ]

  // ── Summary stats ──────────────────────────────────────────────────
  parts.push(`Total entries: ${summary.totalEntries}`)
  parts.push(`Domains explored: ${summary.domainsExplored.join(", ") || "none yet"}`)
  parts.push(`Missions completed: ${summary.missionsCompleted}`)

  if (summary.streakDays > 2) {
    parts.push(`Recording streak: ${summary.streakDays} days — acknowledge this!`)
  }

  // ── Missions without entries (nudge) ───────────────────────────────
  if (summary.missionsWithoutEntry > 0) {
    parts.push("")
    parts.push(`⚠ ${summary.missionsWithoutEntry} completed mission(s) without a notebook entry.`)
    parts.push("Gently remind the student that a mission without a notebook entry earns no badge.")
    parts.push("Frame warmly: 'Don't forget to log it — a good measurement without a record is like a treasure map with no X.'")
  }

  // ── Recent entries (data MET can reference) ────────────────────────
  if (summary.recentEntries.length > 0) {
    parts.push("")
    parts.push("RECENT NOTEBOOK ENTRIES (reference these when relevant):")

    for (const entry of summary.recentEntries) {
      parts.push(formatEntry(entry, level))
    }
  }

  // ── Level-specific instructions ────────────────────────────────────
  parts.push("")
  parts.push(getNotebookInstruction(level))

  return {
    hasData: true,
    promptBlock: parts.join("\n"),
  }
}

// ── Format a single entry for the prompt ─────────────────────────────────────

function formatEntry(entry: NotebookEntry, level: CertificationLevel): string {
  const parts: string[] = []

  const dateStr = entry.entryDate
  const mission = entry.missionTitle ? ` (${entry.missionTitle})` : ""

  parts.push(`  • ${dateStr}${mission}: measured ${entry.measuredItem} with ${entry.toolUsed ?? "unknown tool"}`)

  switch (level) {
    case "Explorer":
      // Simple: what and the number
      if (entry.measurements.length > 0) {
        parts.push(`    Result: ${entry.measurements[0]} ${entry.unit}`)
      }
      break

    case "Investigator":
      // Show measurements and average
      if (entry.measurements.length > 1) {
        parts.push(`    Measurements: ${entry.measurements.join(", ")} ${entry.unit}`)
        if (entry.mean !== null) {
          parts.push(`    Average: ${entry.mean} ${entry.unit}`)
        }
      } else if (entry.measurements.length === 1) {
        parts.push(`    Result: ${entry.measurements[0]} ${entry.unit}`)
      }
      break

    case "Innovator":
      // Show measurements, mean, std dev, error analysis
      if (entry.measurements.length > 1) {
        parts.push(`    Measurements (${entry.measurements.length}): ${entry.measurements.join(", ")} ${entry.unit}`)
        if (entry.mean !== null) parts.push(`    Mean: ${entry.mean} ${entry.unit}`)
        if (entry.stdDev !== null) parts.push(`    Std dev: ${entry.stdDev} ${entry.unit}`)
      }
      if (entry.sourcesOfError) {
        parts.push(`    Sources of error: ${entry.sourcesOfError}`)
      }
      break

    case "Metrologist":
      // Full data with uncertainty
      if (entry.measurements.length > 1) {
        parts.push(`    n = ${entry.measurements.length}: ${entry.measurements.join(", ")} ${entry.unit}`)
        if (entry.mean !== null) parts.push(`    Mean: ${entry.mean} ${entry.unit}`)
        if (entry.stdDev !== null) parts.push(`    s = ${entry.stdDev} ${entry.unit}`)
        if (entry.uncertainty !== null) parts.push(`    U (k=2): ± ${entry.uncertainty} ${entry.unit}`)
      }
      if (entry.sourcesOfError) {
        parts.push(`    Error sources: ${entry.sourcesOfError}`)
      }
      break
  }

  if (entry.notes) {
    parts.push(`    Notes: "${entry.notes}"`)
  }

  return parts.join("\n")
}

// ── Empty notebook block ─────────────────────────────────────────────────────

function buildEmptyNotebookBlock(level: CertificationLevel): string {
  switch (level) {
    case "Explorer":
      return [
        "STUDENT'S FIELD NOTEBOOK: Empty — no entries yet.",
        "When the student completes a measurement, encourage them to draw and record it.",
        "Make the notebook feel exciting: 'Time to add to your Field Notebook! Draw what you measured!'",
      ].join("\n")

    case "Investigator":
      return [
        "STUDENT'S FIELD NOTEBOOK: Empty — no entries yet.",
        "After any measurement activity, prompt the student to fill in their notebook template.",
        "'Every great scientist keeps a notebook. Yours is ready for its first entry!'",
      ].join("\n")

    case "Innovator":
      return [
        "STUDENT'S FIELD NOTEBOOK: Empty — no entries yet.",
        "Encourage the student to begin documenting measurements with multiple trials and error analysis.",
      ].join("\n")

    case "Metrologist":
      return [
        "STUDENT'S FIELD NOTEBOOK: Empty — no entries yet.",
        "Encourage the student to begin professional documentation: structured data with uncertainty evaluation.",
      ].join("\n")
  }
}

// ── Level-specific notebook instructions ─────────────────────────────────────

function getNotebookInstruction(level: CertificationLevel): string {
  switch (level) {
    case "Explorer":
      return [
        "NOTEBOOK GUIDANCE:",
        "When referencing the student's data, keep it simple and visual.",
        "Example: 'I see you measured Teddy and got 12 inches — that's about as long as a school ruler!'",
        "Celebrate every entry: 'Great job writing it down!'",
      ].join("\n")

    case "Investigator":
      return [
        "NOTEBOOK GUIDANCE:",
        "Reference specific numbers from the student's entries.",
        "Example: 'Your five pendulum times ranged from 19.8 to 20.3 seconds — that spread is called variation, and it's totally normal.'",
        "Connect entries to concepts: 'Remember when you measured the book and got different numbers each time? That's repeatability.'",
      ].join("\n")

    case "Innovator":
      return [
        "NOTEBOOK GUIDANCE:",
        "Reference the student's statistics — mean, standard deviation, error analysis.",
        "Example: 'Your standard deviation of 0.063 g is very close to the scale's resolution of 0.1 g — that tells me your technique is solid.'",
        "Build on their error analysis: 'You identified air currents as a source — how would you quantify that as an uncertainty component?'",
      ].join("\n")

    case "Metrologist":
      return [
        "NOTEBOOK GUIDANCE:",
        "Reference the student's uncertainty budgets, measurement models, and professional documentation.",
        "Example: 'Your expanded uncertainty of ±0.003 mm at k=2 is well-characterized. The dominant component appears to be the micrometer calibration — is that what you found?'",
        "Challenge them to connect entries to standards: 'How does this documentation align with ISO 17025 §7.5 requirements?'",
      ].join("\n")
  }
}
