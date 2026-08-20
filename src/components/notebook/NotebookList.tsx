// src/components/notebook/NotebookList.tsx
// Notebook entry list — shows all entries with summary cards.

"use client"

import type { NotebookEntry } from "@/lib/notebook/notebookTypes"
import type { CertificationLevel } from "@/lib/levels/config"

interface NotebookListProps {
  entries:   NotebookEntry[]
  certLevel: CertificationLevel
  onSelect:  (id: string) => void
  onCreate:  () => void
}

export function NotebookList({ entries, certLevel, onSelect, onCreate }: NotebookListProps) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--met-text-primary)" }}
          >
            My Field Notebook
          </h2>
          <p className="text-sm" style={{ color: "var(--met-text-muted)" }}>
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <button onClick={onCreate} className="met-btn-primary px-4 py-2 text-sm">
          + New Entry
        </button>
      </div>

      {sorted.length > 0 ? (
        <div className="space-y-3">
          {sorted.map(entry => {
            const values = entry.measurements.map(m => m.value)
            const mean = values.length > 0
              ? values.reduce((a, b) => a + b, 0) / values.length
              : null

            return (
              <div
                key={entry.id}
                onClick={() => onSelect(entry.id)}
                className="met-card p-4 cursor-pointer transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-1">
                  <h3
                    className="font-semibold text-sm"
                    style={{ color: "var(--met-text-primary)" }}
                  >
                    {entry.title}
                  </h3>
                  <div className="flex gap-1.5">
                    {entry.missionSlug && (
                      <span className="met-badge met-badge-amber text-[10px]">🧭</span>
                    )}
                    <span
                      className="met-badge text-[10px]"
                      style={{
                        background: entry.status === "complete"
                          ? "rgba(16,185,129,0.1)"
                          : "rgba(42,184,171,0.1)",
                        color: entry.status === "complete"
                          ? "var(--met-success)"
                          : "var(--met-teal-400)",
                      }}
                    >
                      {entry.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs" style={{ color: "var(--met-text-secondary)" }}>
                  {entry.whatMeasured}
                  {entry.instrument && ` · ${entry.instrument}`}
                </p>

                <div
                  className="flex items-center gap-4 mt-2 text-xs"
                  style={{ color: "var(--met-text-muted)" }}
                >
                  <span>{values.length} reading{values.length !== 1 ? "s" : ""}</span>
                  {mean !== null && (
                    <span>Mean: {mean.toFixed(2)} {entry.unit}</span>
                  )}
                  <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📓</p>
          <h3
            className="font-semibold mb-1"
            style={{ color: "var(--met-text-primary)" }}
          >
            Your notebook is empty
          </h3>
          <p className="text-sm mb-4" style={{ color: "var(--met-text-muted)" }}>
            {certLevel === "Explorer"
              ? "Start a Field Mission and write down what you measure!"
              : "Record your first measurement or complete a Field Mission."
            }
          </p>
          <button onClick={onCreate} className="met-btn-primary px-6 py-2">
            Create First Entry
          </button>
        </div>
      )}
    </div>
  )
}
