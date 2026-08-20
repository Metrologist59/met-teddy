// src/components/notebook/NotebookEntryView.tsx
// Displays a saved notebook entry with level-appropriate formatting.

"use client"

import type { NotebookEntry } from "@/lib/notebook/notebookTypes"

interface NotebookEntryViewProps {
  entry: NotebookEntry
  onBack: () => void
}

export function NotebookEntryView({ entry, onBack }: NotebookEntryViewProps) {
  const values = entry.measurements.map(m => m.value)
  const mean = values.length > 0
    ? values.reduce((a, b) => a + b, 0) / values.length
    : null
  const stdev = values.length > 1
    ? Math.sqrt(values.map(v => (v - mean!) ** 2).reduce((a, b) => a + b, 0) / (values.length - 1))
    : null

  const showStats = entry.certLevel !== "Explorer" && values.length > 1

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-medium mb-4"
        style={{ color: "var(--met-teal-400)" }}
      >
        ← My Notebook
      </button>

      <div className="met-card overflow-hidden">
        {/* Header */}
        <div
          className="p-5"
          style={{ background: "var(--met-teal-900)", color: "var(--met-text-inverse)" }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs" style={{ opacity: 0.7 }}>
              {new Date(entry.createdAt).toLocaleDateString()}
            </span>
            <div className="flex gap-2">
              <span
                className="met-badge"
                style={{ background: "rgba(42,184,171,0.2)", color: "var(--met-teal-400)" }}
              >
                {entry.certLevel}
              </span>
              {entry.missionSlug && (
                <span
                  className="met-badge"
                  style={{ background: "rgba(245,158,11,0.2)", color: "var(--met-amber-400)" }}
                >
                  🧭 Mission
                </span>
              )}
            </div>
          </div>
          <h2 className="text-xl font-bold">{entry.title}</h2>
          <p className="text-sm mt-1" style={{ opacity: 0.8 }}>
            Measured: {entry.whatMeasured}
            {entry.instrument && ` · Using: ${entry.instrument}`}
          </p>
        </div>

        {/* Measurements */}
        <div className="p-5">
          <h3
            className="text-xs font-semibold uppercase tracking-wide mb-3"
            style={{ color: "var(--met-text-muted)" }}
          >
            Measurements
          </h3>

          <div className="space-y-2 mb-4">
            {entry.measurements.map((m, i) => (
              <div
                key={m.id}
                className="flex items-center gap-3 text-sm"
                style={{ color: "var(--met-text-primary)" }}
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "var(--met-surface-muted)", color: "var(--met-text-muted)" }}
                >
                  {m.trialNumber}
                </span>
                <span className="font-medium">{m.value} {m.unit}</span>
                {m.notes && (
                  <span className="text-xs" style={{ color: "var(--met-text-muted)" }}>
                    — {m.notes}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Statistics (Investigator+) */}
          {showStats && (
            <div
              className="p-3 rounded-lg mb-4"
              style={{ background: "var(--met-surface-muted)" }}
            >
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs" style={{ color: "var(--met-text-muted)" }}>Mean</span>
                  <p className="font-semibold" style={{ color: "var(--met-text-primary)" }}>
                    {mean!.toFixed(3)} {entry.unit}
                  </p>
                </div>
                <div>
                  <span className="text-xs" style={{ color: "var(--met-text-muted)" }}>Std Dev (s)</span>
                  <p className="font-semibold" style={{ color: "var(--met-text-primary)" }}>
                    {stdev!.toFixed(4)} {entry.unit}
                  </p>
                </div>
                {values.length > 0 && (
                  <>
                    <div>
                      <span className="text-xs" style={{ color: "var(--met-text-muted)" }}>n</span>
                      <p className="font-semibold" style={{ color: "var(--met-text-primary)" }}>
                        {values.length}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: "var(--met-text-muted)" }}>Range</span>
                      <p className="font-semibold" style={{ color: "var(--met-text-primary)" }}>
                        {(Math.max(...values) - Math.min(...values)).toFixed(3)} {entry.unit}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Uncertainty (Innovator/Metrologist) */}
          {entry.uncertainty && entry.uncertainty.length > 0 && (
            <div className="mb-4">
              <h3
                className="text-xs font-semibold uppercase tracking-wide mb-2"
                style={{ color: "var(--met-text-muted)" }}
              >
                Uncertainty Budget
              </h3>
              <div className="space-y-1">
                {entry.uncertainty.map(u => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between text-sm p-2 rounded-lg"
                    style={{ background: "var(--met-surface-muted)" }}
                  >
                    <span style={{ color: "var(--met-text-primary)" }}>
                      {u.componentName}
                      <span className="ml-1 text-xs" style={{ color: "var(--met-text-muted)" }}>
                        (Type {u.evalType})
                      </span>
                    </span>
                    <span className="font-medium" style={{ color: "var(--met-text-primary)" }}>
                      {u.value} {u.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reflections */}
          {entry.reflections.length > 0 && (
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-wide mb-2"
                style={{ color: "var(--met-text-muted)" }}
              >
                Reflections
              </h3>
              <div className="space-y-3">
                {entry.reflections.map(r => (
                  <div key={r.id}>
                    <p className="text-xs font-medium" style={{ color: "var(--met-text-muted)" }}>
                      {r.prompt}
                    </p>
                    <p className="text-sm mt-0.5" style={{ color: "var(--met-text-primary)" }}>
                      {r.response}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div
          className="px-5 py-3 flex items-center justify-between text-xs border-t"
          style={{ borderColor: "rgba(42,184,171,0.08)", color: "var(--met-text-muted)" }}
        >
          <span>Status: {entry.status}</span>
          <span>Updated {new Date(entry.updatedAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
