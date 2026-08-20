// src/components/notebook/MissionNudge.tsx
// Nudge displayed when a mission is completed without a notebook entry.
// The documentation IS the science — mirrors the professional standard
// that an uncalibrated instrument without a record is not calibrated.

"use client"

import { CharacterPanel } from "@/components/characters/CharacterPanel"
import type { CertificationLevel } from "@/lib/levels/config"

interface MissionNudgeProps {
  missionTitle: string
  missionSlug:  string
  certLevel:    CertificationLevel
  onCreateEntry: (missionSlug: string) => void
  onDismiss:     () => void
}

const NUDGE_MESSAGES: Record<CertificationLevel, string> = {
  Explorer:
    "You finished the mission — awesome! But Teddy noticed you didn't write anything in your notebook yet. Can you draw what you measured and write the number?",
  Investigator:
    "Great job completing the mission! Your notebook is still empty for this one, though. Scientists always write down what they measured — the record is how you prove what happened.",
  Innovator:
    "Mission complete, but your notebook doesn't have an entry for it yet. In science, a measurement without documentation might as well not exist. Take a few minutes to record your data and reflections.",
  Metrologist:
    "You completed the mission, but there's no notebook entry. ISO 17025 §7.5 is clear: if you didn't write it down, it didn't happen. Document your procedure, data, and uncertainty evaluation.",
}

export function MissionNudge({
  missionTitle,
  missionSlug,
  certLevel,
  onCreateEntry,
  onDismiss,
}: MissionNudgeProps) {
  return (
    <div
      className="met-card p-4 border-l-4"
      style={{ borderLeftColor: "var(--met-amber-400)" }}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <CharacterPanel
            metExpression="guide"
            teddyBodyLanguage="nudging"
            certLevel={certLevel}
            layout="stacked"
            size="sm"
          />
        </div>
        <div className="flex-1">
          <h4
            className="font-semibold text-sm mb-1"
            style={{ color: "var(--met-text-primary)" }}
          >
            📓 Notebook entry missing for: {missionTitle}
          </h4>
          <p
            className="text-sm mb-3"
            style={{ color: "var(--met-text-secondary)" }}
          >
            {NUDGE_MESSAGES[certLevel]}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onCreateEntry(missionSlug)}
              className="met-btn-primary px-4 py-2 text-sm"
            >
              Open Notebook
            </button>
            <button
              onClick={onDismiss}
              className="px-4 py-2 text-sm rounded-lg"
              style={{
                background: "var(--met-surface-muted)",
                color: "var(--met-text-muted)",
              }}
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
