// src/app/dashboard/page.tsx
// Parent/Educator Dashboard page.

"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/AppShell"
import { ParentDashboard } from "@/components/dashboard/ParentDashboard"
import { ClassroomView } from "@/components/dashboard/ClassroomView"
import { LevelOverride } from "@/components/dashboard/LevelOverride"
import type { StudentProgressData } from "@/components/dashboard/StudentProgressCard"

// TODO: Load from authenticated profile
const DEMO_ROLE = "parent" as "parent" | "educator"

// ── Demo data ────────────────────────────────────────────────────

const DEMO_CHILD: StudentProgressData = {
  studentId:        "child-1",
  name:             "Sophia",
  certLevel:        "Explorer",
  gradeBand:        "K-2",
  missionsCompleted: 3,
  missionsTotal:    10,
  notebookEntries:  4,
  badgesEarned:     2,
  badgesTotal:      15,
  totalReadings:    12,
  streakDays:       2,
  lastActiveDate:   new Date().toISOString(),
}

const DEMO_CLASSROOM: StudentProgressData[] = [
  { studentId: "s1", name: "Sophia",   certLevel: "Explorer",     gradeBand: "K-2", missionsCompleted: 3, missionsTotal: 10, notebookEntries: 4, badgesEarned: 2, badgesTotal: 15, totalReadings: 12, streakDays: 2, lastActiveDate: new Date().toISOString() },
  { studentId: "s2", name: "Marcus",   certLevel: "Explorer",     gradeBand: "K-2", missionsCompleted: 5, missionsTotal: 10, notebookEntries: 6, badgesEarned: 4, badgesTotal: 15, totalReadings: 18, streakDays: 5, lastActiveDate: new Date().toISOString() },
  { studentId: "s3", name: "Aisha",    certLevel: "Investigator", gradeBand: "3-5", missionsCompleted: 2, missionsTotal: 10, notebookEntries: 3, badgesEarned: 1, badgesTotal: 15, totalReadings: 9,  streakDays: 0, lastActiveDate: new Date(Date.now() - 86400000 * 2).toISOString() },
  { studentId: "s4", name: "James",    certLevel: "Explorer",     gradeBand: "K-2", missionsCompleted: 1, missionsTotal: 10, notebookEntries: 1, badgesEarned: 0, badgesTotal: 15, totalReadings: 3,  streakDays: 0, lastActiveDate: null },
  { studentId: "s5", name: "Lily",     certLevel: "Investigator", gradeBand: "3-5", missionsCompleted: 7, missionsTotal: 10, notebookEntries: 8, badgesEarned: 6, badgesTotal: 15, totalReadings: 34, streakDays: 7, lastActiveDate: new Date().toISOString() },
  { studentId: "s6", name: "Carlos",   certLevel: "Investigator", gradeBand: "3-5", missionsCompleted: 4, missionsTotal: 10, notebookEntries: 5, badgesEarned: 3, badgesTotal: 15, totalReadings: 21, streakDays: 1, lastActiveDate: new Date().toISOString() },
]

export default function DashboardPage() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [overrideStudent, setOverrideStudent] = useState<string | null>(null)

  const overrideData = overrideStudent
    ? (DEMO_ROLE === "educator"
        ? DEMO_CLASSROOM.find(s => s.studentId === overrideStudent)
        : DEMO_CHILD)
    : null

  return (
    <AppShell
      studentName={DEMO_ROLE === "parent" ? "Parent" : "Educator"}
      certLevel="Explorer"
      gradeBand="K-2"
    >
      <div className="p-4 lg:p-6 max-w-4xl mx-auto">
        {/* Level override modal */}
        {overrideData && (
          <div className="mb-6">
            <LevelOverride
              studentName={overrideData.name}
              currentLevel={overrideData.certLevel}
              gradeBand={overrideData.gradeBand as any}
              onSave={() => setOverrideStudent(null)}
              onCancel={() => setOverrideStudent(null)}
            />
          </div>
        )}

        {!overrideData && DEMO_ROLE === "parent" && (
          <ParentDashboard
            student={DEMO_CHILD}
            notebookEntries={[]}
            recentActivity={[
              { date: new Date().toISOString(), action: "Completed mission: Measure Teddy!" },
              { date: new Date().toISOString(), action: "Created notebook entry" },
              { date: new Date(Date.now() - 86400000).toISOString(), action: "Earned badge: Teddy Measured!" },
              { date: new Date(Date.now() - 86400000).toISOString(), action: "Started mission: Heavy or Light?" },
            ]}
            onLevelOverride={() => setOverrideStudent(DEMO_CHILD.studentId)}
          />
        )}

        {!overrideData && DEMO_ROLE === "educator" && (
          <ClassroomView
            classroomName="Mrs. Chen's 2nd Grade — Measurement Explorers"
            students={DEMO_CLASSROOM}
            onSelectStudent={setSelectedStudent}
            onOverrideLevel={setOverrideStudent}
          />
        )}
      </div>
    </AppShell>
  )
}
