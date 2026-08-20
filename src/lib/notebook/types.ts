// src/lib/notebook/types.ts
// My Field Notebook data types for MET and Teddy.
//
// The notebook is user-generated content stored in the application's
// user data layer, separate from both knowledge bases. These types
// define what MET can see about a student's notebook entries.
//
// Phase 3 builds the actual notebook UI and data model.
// Phase 2 implements awareness against mock data.

import type { CertificationLevel, GradeBand } from "@/lib/levels/config"

export interface NotebookEntry {
  id:            string
  studentId:     string
  missionId:     string | null    // linked Field Mission, if any
  missionTitle:  string | null
  entryDate:     string           // ISO date string
  level:         CertificationLevel
  gradeBand:     GradeBand
  entryType:     "observation" | "experiment" | "calculation" | "reflection"

  // What was measured
  measuredItem:  string           // "the pendulum", "Teddy's height", "a marble"
  toolUsed:      string | null    // "ruler", "caliper", "digital scale"
  domain:        string | null    // "length", "time", "mass", etc.

  // Measurement data (level-adaptive)
  measurements:  number[]         // the raw values recorded
  unit:          string           // "cm", "s", "g", etc.
  mean:          number | null    // calculated at Investigator+
  stdDev:        number | null    // calculated at Innovator+
  uncertainty:   number | null    // expanded uncertainty at Metrologist

  // Reflection
  notes:         string | null    // student's own words
  sourcesOfError: string | null   // Innovator+ field
  whatIdDoDifferently: string | null  // Innovator+ field

  // Status
  hasBadge:      boolean          // whether a badge was earned for this entry
}

export interface NotebookSummary {
  totalEntries:    number
  recentEntries:   NotebookEntry[]   // last 5 entries
  domainsExplored: string[]          // domains the student has measured in
  missionsCompleted: number
  missionsWithoutEntry: number       // completed missions with no notebook entry
  streakDays:      number            // consecutive days with an entry
}
