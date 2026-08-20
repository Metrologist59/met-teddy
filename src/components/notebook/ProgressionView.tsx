// src/components/notebook/ProgressionView.tsx
// Notebook progression summary — visual display of notebook activity.
// Used in student view, parent dashboard, and educator dashboard.

"use client"

import { computeProgression, getProgressInsights } from "@/lib/notebook/progression"
import type { NotebookEntry } from "@/lib/notebook/notebookTypes"
import type { CertificationLevel } from "@/lib/levels/config"

interface ProgressionViewProps {
  entries:   NotebookEntry[]
  certLevel: CertificationLevel
}

export function ProgressionView({ entries, certLevel }: ProgressionViewProps) {
  const summary = computeProgression(entries)
  const insights = getProgressInsights(summary, certLevel)

  return (
    <div>
      <h3
        className="text-sm font-semibold mb-3"
        style={{ color: "var(--met-text-primary)" }}
      >
        Notebook Progress
      </h3>

      {/* Insight cards */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {insights.map(insight => (
          <div
            key={insight.label}
            className="met-card p-3 text-center"
          >
            <span className="text-lg">{insight.icon}</span>
            <p
              className="text-lg font-bold mt-1"
              style={{ color: "var(--met-text-primary)" }}
            >
              {insight.value}
            </p>
            <p
              className="text-[10px]"
              style={{ color: "var(--met-text-muted)" }}
            >
              {insight.label}
            </p>
          </div>
        ))}
      </div>

      {/* Domain breakdown */}
      {summary.domainsExplored.length > 0 && (
        <div className="met-card p-3 mb-4">
          <h4
            className="text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: "var(--met-text-muted)" }}
          >
            Domains Explored
          </h4>
          <div className="space-y-1.5">
            {Object.entries(summary.entriesByDomain).map(([domain, count]) => (
              <div key={domain} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span style={{ color: "var(--met-text-primary)" }}>{domain}</span>
                    <span style={{ color: "var(--met-text-muted)" }}>{count}</span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--met-surface-muted)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(count / summary.totalEntries) * 100}%`,
                        background: "var(--met-teal-400)",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completion rate */}
      <div className="met-card p-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span style={{ color: "var(--met-text-muted)" }}>Completion rate</span>
          <span style={{ color: "var(--met-text-primary)" }}>
            {summary.totalEntries > 0
              ? `${((summary.completedEntries / summary.totalEntries) * 100).toFixed(0)}%`
              : "—"
            }
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: "var(--met-surface-muted)" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: summary.totalEntries > 0
                ? `${(summary.completedEntries / summary.totalEntries) * 100}%`
                : "0%",
              background: "var(--met-teal-400)",
            }}
          />
        </div>
      </div>
    </div>
  )
}
