// src/components/dashboard/StudentProgressCard.tsx
// Summary card for one student's progress.
// Used in parent dashboard (single child) and
// educator dashboard (per student in classroom).

"use client"

import type { CertificationLevel } from "@/lib/levels/config"

export interface StudentProgressData {
  studentId:        string
  name:             string
  certLevel:        CertificationLevel
  gradeBand:        string
  overrideLevel?:   string
  missionsCompleted: number
  missionsTotal:    number
  notebookEntries:  number
  badgesEarned:     number
  badgesTotal:      number
  totalReadings:    number
  streakDays:       number
  lastActiveDate:   string | null
}

interface StudentProgressCardProps {
  student:    StudentProgressData
  onSelect?:  (id: string) => void
  onOverride?: (id: string) => void
  compact?:   boolean
}

const LEVEL_COLORS: Record<string, string> = {
  Explorer: "#2AB8AB",
  Investigator: "#60A5FA",
  Innovator: "#F59E0B",
  Metrologist: "#062C28",
}

export function StudentProgressCard({
  student,
  onSelect,
  onOverride,
  compact = false,
}: StudentProgressCardProps) {
  const missionPct = student.missionsTotal > 0
    ? Math.round((student.missionsCompleted / student.missionsTotal) * 100)
    : 0
  const badgePct = student.badgesTotal > 0
    ? Math.round((student.badgesEarned / student.badgesTotal) * 100)
    : 0
  const levelColor = LEVEL_COLORS[student.certLevel] ?? "#2AB8AB"

  return (
    <div
      className="met-card p-4 transition-all"
      style={{ cursor: onSelect ? "pointer" : "default" }}
      onClick={onSelect ? () => onSelect(student.studentId) : undefined}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: `${levelColor}20`, color: levelColor }}
          >
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3
              className="font-semibold text-sm"
              style={{ color: "var(--met-text-primary)" }}
            >
              {student.name}
            </h3>
            <div className="flex items-center gap-1.5">
              <span
                className="met-badge text-[10px]"
                style={{ background: `${levelColor}18`, color: levelColor }}
              >
                {student.certLevel}
              </span>
              <span className="text-[10px]" style={{ color: "var(--met-text-muted)" }}>
                {student.gradeBand}
              </span>
              {student.overrideLevel && (
                <span className="text-[10px]" style={{ color: "var(--met-amber-500)" }}>
                  (override)
                </span>
              )}
            </div>
          </div>
        </div>

        {student.streakDays > 0 && (
          <span className="text-xs" style={{ color: "var(--met-amber-500)" }}>
            🔥 {student.streakDays}d
          </span>
        )}
      </div>

      {/* Progress bars */}
      <div className="space-y-2.5">
        {/* Missions */}
        <div>
          <div className="flex items-center justify-between text-xs mb-0.5">
            <span style={{ color: "var(--met-text-muted)" }}>
              🧭 Missions
            </span>
            <span style={{ color: "var(--met-text-primary)" }}>
              {student.missionsCompleted}/{student.missionsTotal}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--met-surface-muted)" }}>
            <div className="h-full rounded-full" style={{ width: `${missionPct}%`, background: "var(--met-teal-400)" }} />
          </div>
        </div>

        {/* Badges */}
        <div>
          <div className="flex items-center justify-between text-xs mb-0.5">
            <span style={{ color: "var(--met-text-muted)" }}>
              🏅 Badges
            </span>
            <span style={{ color: "var(--met-text-primary)" }}>
              {student.badgesEarned}/{student.badgesTotal}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--met-surface-muted)" }}>
            <div className="h-full rounded-full" style={{ width: `${badgePct}%`, background: "var(--met-amber-400)" }} />
          </div>
        </div>

        {!compact && (
          <div className="flex gap-4 pt-1">
            <div className="text-center flex-1">
              <p className="text-lg font-bold" style={{ color: "var(--met-text-primary)" }}>
                {student.notebookEntries}
              </p>
              <p className="text-[10px]" style={{ color: "var(--met-text-muted)" }}>
                Notebook entries
              </p>
            </div>
            <div className="text-center flex-1">
              <p className="text-lg font-bold" style={{ color: "var(--met-text-primary)" }}>
                {student.totalReadings}
              </p>
              <p className="text-[10px]" style={{ color: "var(--met-text-muted)" }}>
                Readings
              </p>
            </div>
            <div className="text-center flex-1">
              <p className="text-xs" style={{ color: "var(--met-text-muted)" }}>
                {student.lastActiveDate
                  ? `Active ${new Date(student.lastActiveDate).toLocaleDateString()}`
                  : "Not yet active"
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Level override button */}
      {onOverride && (
        <button
          onClick={(e) => { e.stopPropagation(); onOverride(student.studentId) }}
          className="mt-3 w-full text-xs py-1.5 rounded-lg font-medium transition-colors"
          style={{ background: "var(--met-surface-muted)", color: "var(--met-text-muted)" }}
        >
          Adjust Level
        </button>
      )}
    </div>
  )
}
