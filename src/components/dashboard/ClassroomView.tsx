// src/components/dashboard/ClassroomView.tsx
// Educator classroom view — multiple students, mixed grades.
// Overview of all students with progress, sortable, filterable.

"use client"

import { useState } from "react"
import { StudentProgressCard, type StudentProgressData } from "./StudentProgressCard"

interface ClassroomViewProps {
  classroomName: string
  students:      StudentProgressData[]
  onSelectStudent: (id: string) => void
  onOverrideLevel: (id: string) => void
}

type SortBy = "name" | "level" | "missions" | "badges" | "activity"

export function ClassroomView({
  classroomName,
  students,
  onSelectStudent,
  onOverrideLevel,
}: ClassroomViewProps) {
  const [sortBy, setSortBy] = useState<SortBy>("name")
  const [filterLevel, setFilterLevel] = useState<string>("all")

  const filtered = filterLevel === "all"
    ? students
    : students.filter(s => s.certLevel === filterLevel)

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "name":     return a.name.localeCompare(b.name)
      case "level":    return a.certLevel.localeCompare(b.certLevel)
      case "missions": return b.missionsCompleted - a.missionsCompleted
      case "badges":   return b.badgesEarned - a.badgesEarned
      case "activity": {
        const aDate = a.lastActiveDate ? new Date(a.lastActiveDate).getTime() : 0
        const bDate = b.lastActiveDate ? new Date(b.lastActiveDate).getTime() : 0
        return bDate - aDate
      }
      default: return 0
    }
  })

  // Summary stats
  const totalMissions = students.reduce((s, st) => s + st.missionsCompleted, 0)
  const totalEntries = students.reduce((s, st) => s + st.notebookEntries, 0)
  const totalBadges = students.reduce((s, st) => s + st.badgesEarned, 0)
  const activeToday = students.filter(s => {
    if (!s.lastActiveDate) return false
    return new Date(s.lastActiveDate).toDateString() === new Date().toDateString()
  }).length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--met-text-primary)" }}
          >
            {classroomName}
          </h2>
          <p className="text-sm" style={{ color: "var(--met-text-muted)" }}>
            {students.length} student{students.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { label: "Active today", value: activeToday, icon: "👥" },
          { label: "Missions done", value: totalMissions, icon: "🧭" },
          { label: "Notebook entries", value: totalEntries, icon: "📓" },
          { label: "Badges earned", value: totalBadges, icon: "🏅" },
        ].map(stat => (
          <div key={stat.label} className="met-card p-3 text-center">
            <span className="text-lg">{stat.icon}</span>
            <p className="text-lg font-bold" style={{ color: "var(--met-text-primary)" }}>
              {stat.value}
            </p>
            <p className="text-[10px]" style={{ color: "var(--met-text-muted)" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filters and sort */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex gap-1">
          {["all", "Explorer", "Investigator", "Innovator", "Metrologist"].map(level => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className="px-2.5 py-1 rounded-full text-[10px] font-medium transition-all"
              style={{
                background: filterLevel === level ? "var(--met-teal-400)" : "var(--met-surface-muted)",
                color: filterLevel === level ? "white" : "var(--met-text-secondary)",
              }}
            >
              {level === "all" ? "All levels" : level}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortBy)}
          className="ml-auto text-xs px-2 py-1 rounded-lg"
          style={{
            background: "var(--met-surface-muted)",
            color: "var(--met-text-secondary)",
            border: "1px solid rgba(42,184,171,0.1)",
          }}
        >
          <option value="name">Sort: Name</option>
          <option value="level">Sort: Level</option>
          <option value="missions">Sort: Missions</option>
          <option value="badges">Sort: Badges</option>
          <option value="activity">Sort: Recent activity</option>
        </select>
      </div>

      {/* Student grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sorted.map(student => (
          <StudentProgressCard
            key={student.studentId}
            student={student}
            onSelect={onSelectStudent}
            onOverride={onOverrideLevel}
            compact
          />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-12" style={{ color: "var(--met-text-muted)" }}>
          <p className="text-3xl mb-2">👥</p>
          <p className="text-sm">No students match this filter.</p>
        </div>
      )}
    </div>
  )
}
