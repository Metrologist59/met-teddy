// src/components/missions/MissionCatalog.tsx
// Filterable Field Missions catalog.
// Shows missions available for the student's certification level.

"use client"

import { useState } from "react"
import { MissionCard } from "./MissionCard"
import type { CertificationLevel, GradeBand } from "@/lib/levels/config"

export interface MissionSummary {
  slug:         string
  title:        string
  domain:       string
  certLevel:    CertificationLevel
  gradeBand:    GradeBand
  description:  string
  timeEstimate: string
  completed:    boolean
}

interface MissionCatalogProps {
  missions:  MissionSummary[]
  certLevel: CertificationLevel
  onSelect:  (slug: string) => void
}

const DOMAIN_FILTERS = [
  { value: "all",                  label: "All Domains" },
  { value: "length",               label: "Length" },
  { value: "mass",                 label: "Mass" },
  { value: "temperature",          label: "Temperature" },
  { value: "time",                 label: "Time" },
  { value: "volume",               label: "Volume" },
  { value: "electrical",           label: "Electrical" },
  { value: "dimensional",          label: "Dimensional" },
  { value: "force_and_pressure",   label: "Force & Pressure" },
  { value: "general",              label: "General" },
]

export function MissionCatalog({ missions, certLevel, onSelect }: MissionCatalogProps) {
  const [domainFilter, setDomainFilter] = useState("all")
  const [showCompleted, setShowCompleted] = useState(true)

  const filtered = missions.filter(m => {
    if (domainFilter !== "all" && m.domain !== domainFilter) return false
    if (!showCompleted && m.completed) return false
    return true
  })

  const completedCount = missions.filter(m => m.completed).length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--met-text-primary)" }}
          >
            Field Missions
          </h2>
          <p
            className="text-sm"
            style={{ color: "var(--met-text-muted)" }}
          >
            {completedCount} of {missions.length} completed
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-32">
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: "var(--met-surface-muted)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${missions.length > 0 ? (completedCount / missions.length) * 100 : 0}%`,
                background: "var(--met-teal-400)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {DOMAIN_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setDomainFilter(value)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: domainFilter === value
                ? "var(--met-teal-400)"
                : "var(--met-surface-muted)",
              color: domainFilter === value
                ? "white"
                : "var(--met-text-secondary)",
            }}
          >
            {label}
          </button>
        ))}

        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="ml-auto px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{
            background: "var(--met-surface-muted)",
            color: "var(--met-text-secondary)",
          }}
        >
          {showCompleted ? "Hide completed" : "Show completed"}
        </button>
      </div>

      {/* Mission grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(mission => (
            <div
              key={mission.slug}
              onClick={() => onSelect(mission.slug)}
              className="cursor-pointer"
            >
              <MissionCard
                title={mission.title}
                domain={mission.domain}
                level={mission.certLevel}
                description={mission.description}
              />
              {mission.completed && (
                <div
                  className="flex items-center gap-1 mt-1 ml-1 text-xs"
                  style={{ color: "var(--met-success)" }}
                >
                  ✓ Completed
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          className="text-center py-12"
          style={{ color: "var(--met-text-muted)" }}
        >
          <p className="text-3xl mb-2">🧭</p>
          <p className="text-sm">No missions match these filters.</p>
        </div>
      )}
    </div>
  )
}
