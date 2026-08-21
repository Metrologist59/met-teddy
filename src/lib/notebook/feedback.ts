// src/lib/notebook/feedback.ts
// MET feedback on notebook entries.
// Sends entry data to the AI engine and gets level-appropriate
// review comments. MET never grades — MET guides.

import type { NotebookEntry } from "./notebookTypes"
import type { CertificationLevel } from "@/lib/levels/config"

// ── Feedback request/response ────────────────────────────────────

export interface FeedbackRequest {
  entry:     NotebookEntry
  certLevel: CertificationLevel
}

export interface FeedbackResponse {
  feedbackText:   string
  suggestions:    string[]
  encouragement:  string
  teddyReaction:  string  // body language action
  metExpression:  string  // MET expression
}

// ── Build the feedback prompt ────────────────────────────────────

export function buildFeedbackPrompt(entry: NotebookEntry, certLevel: CertificationLevel): string {
  const values = entry.measurements.map(m => m.value)
  const mean = values.length > 0
    ? values.reduce((a, b) => a + b, 0) / values.length
    : null
  const stdev = values.length > 1
    ? Math.sqrt(values.map(v => (v - mean!) ** 2).reduce((a, b) => a + b, 0) / (values.length - 1))
    : null

  const parts: string[] = []

  parts.push(`NOTEBOOK ENTRY REVIEW REQUEST`)
  parts.push(`Student level: ${certLevel}`)
  parts.push(`Title: ${entry.title}`)
  parts.push(`What measured: ${entry.whatMeasured}`)
  if (entry.instrument) parts.push(`Instrument: ${entry.instrument}`)
  parts.push(`Number of readings: ${values.length}`)

  if (values.length > 0) {
    parts.push(`Readings: ${values.map((v, i) => `${v} ${entry.unit ?? ""}`).join(", ")}`)
  }
  if (mean !== null) parts.push(`Mean: ${mean.toFixed(4)}`)
  if (stdev !== null) parts.push(`Standard deviation: ${stdev.toFixed(4)}`)

  if (entry.reflections.length > 0) {
    parts.push(`\nStudent reflections:`)
    for (const r of entry.reflections) {
      parts.push(`Q: ${r.prompt}`)
      parts.push(`A: ${r.response}`)
    }
  }

  if (entry.uncertainty && entry.uncertainty.length > 0) {
    parts.push(`\nUncertainty components:`)
    for (const u of entry.uncertainty) {
      parts.push(`  ${u.componentName} (Type ${u.evalType}): ${u.value} ${u.unit ?? ""}`)
    }
  }

  parts.push(`\nProvide feedback appropriate for a ${certLevel} student.`)
  parts.push(`Do NOT grade or rank. Encourage and guide.`)
  parts.push(`Point out what was done well. Suggest one specific improvement.`)

  if (certLevel === "Explorer") {
    parts.push(`Keep it simple and enthusiastic. Focus on: did they include the unit?`)
  } else if (certLevel === "Investigator") {
    parts.push(`Focus on: did they take multiple readings? Did they notice variation?`)
  } else if (certLevel === "Innovator") {
    parts.push(`Focus on: is the uncertainty analysis reasonable? Are sources of error identified?`)
  } else {
    parts.push(`Focus on: is the uncertainty budget complete? Are references correct? Is the procedure traceable?`)
  }

  return parts.join("\n")
}

// ── Quick local checks (before calling AI) ───────────────────────

export interface QuickCheck {
  label:  string
  passed: boolean
  tip:    string
}

export function runQuickChecks(entry: NotebookEntry, certLevel: CertificationLevel): QuickCheck[] {
  const checks: QuickCheck[] = []
  const values = entry.measurements.map(m => m.value)

  // Universal: did they include a unit?
  checks.push({
    label: "unit recorded",
    passed: !!(entry.unit && entry.unit.trim() !== ""),
    tip: "The number means nothing without the unit!",
  })

  // Universal: at least one measurement
  checks.push({
    label: "Measurement recorded",
    passed: values.length > 0,
    tip: "Record at least one measurement value.",
  })

  if (certLevel === "Explorer") {
    // Explorer: that's enough
    checks.push({
      label: "Title filled in",
      passed: !!(entry.title && entry.title.trim() !== ""),
      tip: "Give your entry a name so you can find it later.",
    })
  }

  if (certLevel === "Investigator" || certLevel === "Innovator" || certLevel === "Metrologist") {
    // Multiple readings
    checks.push({
      label: "Multiple readings",
      passed: values.length >= 3,
      tip: certLevel === "Investigator"
        ? "Take at least 3 readings to see if they repeat."
        : "At least 3 readings for a meaningful Type A evaluation.",
    })

    // Reflection answered
    checks.push({
      label: "Reflection completed",
      passed: entry.reflections.length > 0 && entry.reflections.some(r => r.response.trim() !== ""),
      tip: "Answer at least one reflection question.",
    })
  }

  if (certLevel === "Innovator" || certLevel === "Metrologist") {
    // Instrument recorded
    checks.push({
      label: "Instrument identified",
      passed: !!(entry.instrument && entry.instrument.trim() !== ""),
      tip: "Record the instrument used, including model if known.",
    })
  }

  if (certLevel === "Metrologist") {
    // Uncertainty budget present
    checks.push({
      label: "Uncertainty budget",
      passed: !!(entry.uncertainty && entry.uncertainty.length > 0),
      tip: "Include at least repeatability and resolution components.",
    })
  }

  return checks
}
