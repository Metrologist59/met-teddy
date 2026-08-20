// src/lib/notebook/mock.ts
// Mock Field Notebook data for testing notebook awareness.
// Replaced by real database queries in Phase 3.

import type { NotebookEntry, NotebookSummary } from "./types"

// ── Mock entries at each level ───────────────────────────────────────────────

export const MOCK_ENTRIES: NotebookEntry[] = [
  // Explorer
  {
    id: "nb-001",
    studentId: "student-explorer",
    missionId: "mission-measure-teddy",
    missionTitle: "Measure Teddy",
    entryDate: "2026-08-15",
    level: "Explorer",
    gradeBand: "K-2",
    entryType: "experiment",
    measuredItem: "Teddy (stuffed animal)",
    toolUsed: "ruler",
    domain: "length",
    measurements: [12],
    unit: "inches",
    mean: null,
    stdDev: null,
    uncertainty: null,
    notes: "Teddy is 12 inches tall!",
    sourcesOfError: null,
    whatIdDoDifferently: null,
    hasBadge: true,
  },
  // Investigator
  {
    id: "nb-002",
    studentId: "student-investigator",
    missionId: "mission-pendulum-period",
    missionTitle: "Pendulum Period",
    entryDate: "2026-08-16",
    level: "Investigator",
    gradeBand: "3-5",
    entryType: "experiment",
    measuredItem: "pendulum (1 meter string)",
    toolUsed: "stopwatch",
    domain: "time",
    measurements: [20.1, 19.8, 20.3, 19.9, 20.2],
    unit: "seconds (10 swings)",
    mean: 20.06,
    stdDev: null,
    uncertainty: null,
    notes: "Period = 20.06 / 10 = 2.006 seconds per swing",
    sourcesOfError: null,
    whatIdDoDifferently: null,
    hasBadge: true,
  },
  // Innovator
  {
    id: "nb-003",
    studentId: "student-innovator",
    missionId: "mission-scale-repeatability",
    missionTitle: "Scale Repeatability Study",
    entryDate: "2026-08-17",
    level: "Innovator",
    gradeBand: "6-8",
    entryType: "experiment",
    measuredItem: "sealed metal container",
    toolUsed: "digital scale (0.1 g)",
    domain: "mass",
    measurements: [245.3, 245.2, 245.3, 245.4, 245.3, 245.2, 245.3, 245.3, 245.4, 245.3],
    unit: "g",
    mean: 245.30,
    stdDev: 0.063,
    uncertainty: null,
    notes: "Repeatability is good — std dev is close to the resolution",
    sourcesOfError: "Placement on the platform varied slightly; air currents from the window",
    whatIdDoDifferently: "Close the window next time and always place the object in the center",
    hasBadge: true,
  },
  // Metrologist
  {
    id: "nb-004",
    studentId: "student-metrologist",
    missionId: "mission-measure-teddy",
    missionTitle: "Measure Teddy (GUM-compliant)",
    entryDate: "2026-08-18",
    level: "Metrologist",
    gradeBand: "9-12",
    entryType: "experiment",
    measuredItem: "aluminum cylinder",
    toolUsed: "micrometer (0.001 mm)",
    domain: "dimensional",
    measurements: [25.401, 25.403, 25.400, 25.402, 25.401, 25.403, 25.402, 25.400, 25.401, 25.402],
    unit: "mm",
    mean: 25.4015,
    stdDev: 0.0011,
    uncertainty: 0.003,
    notes: "Density = 2.698 g/cm³ ± 0.015 g/cm³ (k=2), consistent with aluminum 6061",
    sourcesOfError: "Micrometer calibration uncertainty, thermal expansion (measured at 22.1 °C, not 20 °C), resolution",
    whatIdDoDifferently: "Measure at 20 °C or apply the thermal correction (α = 23.1 × 10⁻⁶/°C)",
    hasBadge: true,
  },
]

// ── Mock summaries ───────────────────────────────────────────────────────────

export function getMockSummary(studentId: string): NotebookSummary {
  const entries = MOCK_ENTRIES.filter(e => e.studentId === studentId)
  const domains = [...new Set(entries.map(e => e.domain).filter(Boolean))] as string[]

  return {
    totalEntries:         entries.length,
    recentEntries:        entries.slice(-5),
    domainsExplored:      domains,
    missionsCompleted:    entries.filter(e => e.missionId).length,
    missionsWithoutEntry: 0,
    streakDays:           entries.length, // simplified for mock
  }
}

/**
 * Mock: get a specific student's most recent entry.
 * In Phase 3, this queries the database.
 */
export function getMockRecentEntry(studentId: string): NotebookEntry | null {
  const entries = MOCK_ENTRIES.filter(e => e.studentId === studentId)
  return entries.length > 0 ? entries[entries.length - 1] : null
}
