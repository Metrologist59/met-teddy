// src/lib/notebook/progression.ts
// Notebook progression aggregation for dashboards.
// Summarizes the student's notebook activity for parent,
// educator, and student views.

import type { NotebookEntry } from "./notebookTypes"
import type { CertificationLevel } from "@/lib/levels/config"

// ── Progression summary ──────────────────────────────────────────

export interface ProgressionSummary {
  totalEntries:      number
  completedEntries:  number
  draftEntries:      number
  missionEntries:    number
  freeEntries:       number
  totalReadings:     number
  domainsExplored:   string[]
  entriesByDomain:   Record<string, number>
  entriesByWeek:     { week: string; count: number }[]
  avgReadingsPerEntry: number
  reflectionRate:    number   // % of entries with at least one reflection
  streakDays:        number   // consecutive days with entries
  lastEntryDate:     string | null
}

export function computeProgression(entries: NotebookEntry[]): ProgressionSummary {
  if (entries.length === 0) {
    return {
      totalEntries: 0,
      completedEntries: 0,
      draftEntries: 0,
      missionEntries: 0,
      freeEntries: 0,
      totalReadings: 0,
      domainsExplored: [],
      entriesByDomain: {},
      entriesByWeek: [],
      avgReadingsPerEntry: 0,
      reflectionRate: 0,
      streakDays: 0,
      lastEntryDate: null,
    }
  }

  const completed = entries.filter(e => e.status === "complete")
  const drafts = entries.filter(e => e.status === "draft")
  const missions = entries.filter(e => e.entryType === "mission")
  const free = entries.filter(e => e.entryType === "free" || e.entryType === "practice")
  const totalReadings = entries.reduce((sum, e) => sum + e.measurements.length, 0)

  // Domains
  const domainCounts: Record<string, number> = {}
  for (const e of entries) {
    const d = e.domain ?? "general"
    domainCounts[d] = (domainCounts[d] ?? 0) + 1
  }

  // Entries by week
  const weekMap: Record<string, number> = {}
  for (const e of entries) {
    const date = new Date(e.createdAt)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const weekKey = weekStart.toISOString().split("T")[0]
    weekMap[weekKey] = (weekMap[weekKey] ?? 0) + 1
  }
  const entriesByWeek = Object.entries(weekMap)
    .map(([week, count]) => ({ week, count }))
    .sort((a, b) => a.week.localeCompare(b.week))

  // Reflection rate
  const entriesWithReflections = entries.filter(
    e => e.reflections.length > 0 && e.reflections.some(r => r.response.trim() !== "")
  )

  // Streak
  const dates = [...new Set(
    entries.map(e => new Date(e.createdAt).toISOString().split("T")[0])
  )].sort().reverse()
  let streakDays = 0
  const today = new Date().toISOString().split("T")[0]
  for (let i = 0; i < dates.length; i++) {
    const expected = new Date()
    expected.setDate(expected.getDate() - i)
    const expectedStr = expected.toISOString().split("T")[0]
    if (dates[i] === expectedStr) {
      streakDays++
    } else {
      break
    }
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return {
    totalEntries: entries.length,
    completedEntries: completed.length,
    draftEntries: drafts.length,
    missionEntries: missions.length,
    freeEntries: free.length,
    totalReadings,
    domainsExplored: Object.keys(domainCounts),
    entriesByDomain: domainCounts,
    entriesByWeek,
    avgReadingsPerEntry: entries.length > 0 ? totalReadings / entries.length : 0,
    reflectionRate: entries.length > 0 ? (entriesWithReflections.length / entries.length) * 100 : 0,
    streakDays,
    lastEntryDate: sorted[0]?.createdAt ?? null,
  }
}

// ── Level-specific progress insights ─────────────────────────────

export interface ProgressInsight {
  label: string
  value: string
  icon:  string
}

export function getProgressInsights(
  summary: ProgressionSummary,
  certLevel: CertificationLevel,
): ProgressInsight[] {
  const insights: ProgressInsight[] = [
    { label: "Total entries",    value: String(summary.totalEntries),     icon: "📓" },
    { label: "Total readings",   value: String(summary.totalReadings),    icon: "📊" },
    { label: "Domains explored", value: String(summary.domainsExplored.length), icon: "🧭" },
  ]

  if (certLevel !== "Explorer") {
    insights.push({
      label: "Avg readings/entry",
      value: summary.avgReadingsPerEntry.toFixed(1),
      icon: "📈",
    })
    insights.push({
      label: "Reflection rate",
      value: `${summary.reflectionRate.toFixed(0)}%`,
      icon: "💭",
    })
  }

  if (summary.streakDays > 0) {
    insights.push({
      label: "Day streak",
      value: `${summary.streakDays} day${summary.streakDays > 1 ? "s" : ""}`,
      icon: "🔥",
    })
  }

  return insights
}
