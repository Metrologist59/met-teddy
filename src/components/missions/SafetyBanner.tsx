// src/components/missions/SafetyBanner.tsx
// Band-appropriate safety statements for Field Missions.
// Source: Brand Ecosystem Profile v2.0 §8.11

import type { GradeBand } from "@/lib/levels/config"

interface SafetyBannerProps {
  gradeBand:       GradeBand
  missionSafety?:  string  // mission-specific safety note
}

const SAFETY_BY_BAND: Record<GradeBand, {
  supervision: string
  constraints: string
}> = {
  "K-2": {
    supervision: "Adult co-pilot required throughout this mission.",
    constraints: "Blunt, unbreakable, room-temperature materials only. No glass, blades, heat sources, or small parts.",
  },
  "3-5": {
    supervision: "Adult present while you work.",
    constraints: "Household tools permitted. Hot liquids, glassware, and cutting require direct adult handling.",
  },
  "6-8": {
    supervision: "Adult available nearby. Classroom or lab supervision for equipment.",
    constraints: "Digital instruments and supervised low-voltage measurement permitted. Chemicals limited to food-safe household materials.",
  },
  "9-12": {
    supervision: "Standard school laboratory supervision rules apply.",
    constraints: "Full instrument set within school lab safety policy. Follow PPE requirements where stated.",
  },
}

export function SafetyBanner({ gradeBand, missionSafety }: SafetyBannerProps) {
  const safety = SAFETY_BY_BAND[gradeBand]

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "rgba(245, 158, 11, 0.08)",
        border: "1px solid rgba(245, 158, 11, 0.2)",
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">⚠️</span>
        <div>
          <p
            className="font-semibold text-sm mb-1"
            style={{ color: "var(--met-amber-500)" }}
          >
            Safety First
          </p>
          <p className="text-sm" style={{ color: "var(--met-text-primary)" }}>
            {safety.supervision}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--met-text-secondary)" }}>
            {safety.constraints}
          </p>
          {missionSafety && (
            <p
              className="text-xs mt-2 font-medium"
              style={{ color: "var(--met-amber-500)" }}
            >
              {missionSafety}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
