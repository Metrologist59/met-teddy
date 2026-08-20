// src/components/dashboard/LevelOverride.tsx
// Level override control for parents and educators.
// Students may work one level above or below their grade band.
// Level is never described as a ranking.

"use client"

import { useState } from "react"
import type { CertificationLevel, GradeBand } from "@/lib/levels/config"

interface LevelOverrideProps {
  studentName:  string
  currentLevel: CertificationLevel
  gradeBand:    GradeBand
  onSave:       (newLevel: CertificationLevel | null) => void
  onCancel:     () => void
}

const LEVELS: CertificationLevel[] = ["Explorer", "Investigator", "Innovator", "Metrologist"]

const BAND_DEFAULT: Record<GradeBand, CertificationLevel> = {
  "K-2": "Explorer",
  "3-5": "Investigator",
  "6-8": "Innovator",
  "9-12": "Metrologist",
}

const LEVEL_DESCRIPTIONS: Record<CertificationLevel, string> = {
  Explorer:     "Hands-on discovery. Teddy is the experiment. Simple measurements with one reading.",
  Investigator: "Multiple readings, averages, comparison. Learning why measurements vary.",
  Innovator:    "Uncertainty analysis, standard deviation, sources of error. Scientific reasoning.",
  Metrologist:  "Professional-level. GUM uncertainty budgets, ISO 17025, calibration procedures.",
}

export function LevelOverride({
  studentName,
  currentLevel,
  gradeBand,
  onSave,
  onCancel,
}: LevelOverrideProps) {
  const defaultLevel = BAND_DEFAULT[gradeBand]
  const defaultIndex = LEVELS.indexOf(defaultLevel)
  const [selected, setSelected] = useState<CertificationLevel>(currentLevel)

  // Allow ±1 from default
  const allowedLevels = LEVELS.filter((_, i) =>
    i >= Math.max(0, defaultIndex - 1) && i <= Math.min(LEVELS.length - 1, defaultIndex + 1)
  )

  return (
    <div className="max-w-md mx-auto">
      <h2
        className="text-lg font-bold mb-1"
        style={{ color: "var(--met-text-primary)" }}
      >
        Adjust Level for {studentName}
      </h2>
      <p
        className="text-sm mb-5"
        style={{ color: "var(--met-text-secondary)" }}
      >
        {studentName}'s grade band ({gradeBand}) defaults to {defaultLevel}.
        You can set the level one step above or below to match their readiness.
        This is not a ranking — each level is a different approach to measurement.
      </p>

      <div className="space-y-2 mb-5">
        {allowedLevels.map(level => {
          const isDefault = level === defaultLevel
          const isSelected = level === selected

          return (
            <button
              key={level}
              onClick={() => setSelected(level)}
              className="w-full text-left p-4 rounded-xl transition-all"
              style={{
                background: isSelected ? "var(--met-teal-400)" : "var(--met-surface-card)",
                color: isSelected ? "white" : "var(--met-text-primary)",
                border: isSelected
                  ? "2px solid var(--met-teal-400)"
                  : "2px solid rgba(42,184,171,0.08)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{level}</span>
                {isDefault && (
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: isSelected ? "rgba(255,255,255,0.2)" : "var(--met-surface-muted)",
                      color: isSelected ? "white" : "var(--met-text-muted)",
                    }}
                  >
                    Grade default
                  </span>
                )}
              </div>
              <p
                className="text-xs"
                style={{ opacity: isSelected ? 0.9 : 0.7 }}
              >
                {LEVEL_DESCRIPTIONS[level]}
              </p>
            </button>
          )
        })}
      </div>

      {selected !== defaultLevel && (
        <div
          className="p-3 rounded-lg text-xs mb-4"
          style={{
            background: "var(--met-citation-bg)",
            color: "var(--met-citation-text)",
          }}
        >
          Setting {studentName} to {selected} (instead of the default {defaultLevel}).
          Content, missions, and Teddy's behavior will adjust to match.
          You can change this at any time.
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => onSave(selected === defaultLevel ? null : selected)}
          className="met-btn-primary flex-1 py-3"
        >
          {selected === defaultLevel ? "Use Default" : `Set to ${selected}`}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-lg font-medium"
          style={{ background: "var(--met-surface-muted)", color: "var(--met-text-secondary)" }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
