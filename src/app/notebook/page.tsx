// src/app/notebook/page.tsx
// My Field Notebook page.

"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/AppShell"
import { NotebookList } from "@/components/notebook/NotebookList"
import { NotebookEntryForm, type EntryFormData } from "@/components/notebook/NotebookEntryForm"
import { NotebookEntryView } from "@/components/notebook/NotebookEntryView"
import type { NotebookEntry } from "@/lib/notebook/notebookTypes"

// TODO: Load from profile
const DEMO_LEVEL = "Explorer" as const
const DEMO_BAND  = "K-2" as const

type View = "list" | "create" | "detail"

export default function NotebookPage() {
  const [view, setView] = useState<View>("list")
  const [entries, setEntries] = useState<NotebookEntry[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  function handleSave(data: EntryFormData) {
    const newEntry: NotebookEntry = {
      id:           `entry-${Date.now()}`,
      studentId:    "demo-student",
      certLevel:    DEMO_LEVEL,
      gradeBand:    DEMO_BAND,
      domain:       undefined,
      title:        data.title,
      whatMeasured: data.whatMeasured,
      instrument:   data.instrument,
      unit:         data.unit || "units",
      entryType:    "free",
      status:       "complete",
      measurements: data.measurements.map((m, i) => ({
        id:          `m-${Date.now()}-${i}`,
        trialNumber: i + 1,
        value:       m.value,
        unit:        data.unit || "units",
        notes:       m.notes,
      })),
      reflections: data.reflections.map((r, i) => ({
        id:       `r-${Date.now()}-${i}`,
        prompt:   r.prompt,
        response: r.response,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setEntries(prev => [...prev, newEntry])
    setView("list")
  }

  const selectedEntry = entries.find(e => e.id === selectedId)

  return (
    <AppShell
      studentName="Explorer"
      certLevel={DEMO_LEVEL}
      gradeBand={DEMO_BAND}
    >
      <div className="p-4 lg:p-6 max-w-2xl mx-auto">
        {view === "list" && (
          <NotebookList
            entries={entries}
            certLevel={DEMO_LEVEL}
            onSelect={(id) => { setSelectedId(id); setView("detail") }}
            onCreate={() => setView("create")}
          />
        )}

        {view === "create" && (
          <NotebookEntryForm
            certLevel={DEMO_LEVEL}
            onSave={handleSave}
            onCancel={() => setView("list")}
          />
        )}

        {view === "detail" && selectedEntry && (
          <NotebookEntryView
            entry={selectedEntry}
            onBack={() => { setSelectedId(null); setView("list") }}
          />
        )}
      </div>
    </AppShell>
  )
}
