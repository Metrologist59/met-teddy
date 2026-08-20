// src/components/dashboard/ParentDashboard.tsx
// Parent dashboard — detailed view of one child's progress.
// Shows progress overview, notebook entries, badges, missions,
// and level override control.

"use client"

import { useState } from "react"
import { StudentProgressCard, type StudentProgressData } from "./StudentProgressCard"
import { ProgressionView } from "@/components/notebook/ProgressionView"
import { LevelOverride } from "./LevelOverride"
import type { NotebookEntry } from "@/lib/notebook/notebookTypes"
import type { CertificationLevel, GradeBand } from "@/lib/levels/config"

interface ParentDashboardProps {
  student:         StudentProgressData
  notebookEntries: NotebookEntry[]
  recentActivity:  { date: string; action: string }[]
  onLevelOverride: (level: CertificationLevel | null) => void
}

export function ParentDashboard({
  student,
  notebookEntries,
  recentActivity,
  onLevelOverride,
}: ParentDashboardProps) {
  const [showOverride, setShowOverride] = useState(false)

  if (showOverride) {
    return (
      <LevelOverride
        studentName={student.name}
        currentLevel={student.certLevel}
        gradeBand={student.gradeBand as GradeBand}
        onSave={(level) => { onLevelOverride(level); setShowOverride(false) }}
        onCancel={() => setShowOverride(false)}
      />
    )
  }

  return (
    <div>
      <h2
        className="text-xl font-bold mb-4"
        style={{ color: "var(--met-text-primary)" }}
      >
        {student.name}'s Progress
      </h2>

      {/* Progress card */}
      <div className="mb-5">
        <StudentProgressCard
          student={student}
          onOverride={() => setShowOverride(true)}
        />
      </div>

      {/* Notebook progression */}
      <div className="mb-5">
        <ProgressionView
          entries={notebookEntries}
          certLevel={student.certLevel}
        />
      </div>

      {/* Recent activity */}
      <div className="met-card p-4 mb-5">
        <h3
          className="text-xs font-semibold uppercase tracking-wide mb-3"
          style={{ color: "var(--met-text-muted)" }}
        >
          Recent Activity
        </h3>
        {recentActivity.length > 0 ? (
          <div className="space-y-2">
            {recentActivity.slice(0, 10).map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <span style={{ color: "var(--met-text-primary)" }}>
                  {activity.action}
                </span>
                <span className="text-xs" style={{ color: "var(--met-text-muted)" }}>
                  {new Date(activity.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "var(--met-text-muted)" }}>
            No activity yet. Once {student.name} starts exploring, you'll see updates here.
          </p>
        )}
      </div>

      {/* Privacy note */}
      <div className="met-citation-footer">
        As {student.name}'s parent, you can view all notebook entries,
        badges, and progress data. You can adjust their level or
        revoke consent from this dashboard.{" "}
        <a href="/privacy" className="underline">Privacy Policy</a>
      </div>
    </div>
  )
}
