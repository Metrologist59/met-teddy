// src/components/notebook/QualityScore.tsx
// Displays the notebook entry quality score and check results.
// Shows whether the entry qualifies for its mission badge.

"use client"

import { scoreEntryQuality, type EntryQuality } from "@/lib/badges/notebookIntegration"
import type { NotebookEntry } from "@/lib/notebook/notebookTypes"
import type { CertificationLevel } from "@/lib/levels/config"

interface QualityScoreProps {
  entry:     NotebookEntry
  certLevel: CertificationLevel
}

export function QualityScore({ entry, certLevel }: QualityScoreProps) {
  const quality = scoreEntryQuality(entry, certLevel)

  return (
    <div className="met-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--met-text-muted)" }}
        >
          Entry Quality
        </h3>
        <div className="flex items-center gap-2">
          <span
            className="text-lg font-bold"
            style={{
              color: quality.meetsMinimum
                ? "var(--met-success)"
                : "var(--met-amber-500)",
            }}
          >
            {quality.score}%
          </span>
          {quality.meetsMinimum ? (
            <span className="met-badge" style={{ background: "rgba(16,185,129,0.1)", color: "var(--met-success)" }}>
              ✓ Badge eligible
            </span>
          ) : (
            <span className="met-badge" style={{ background: "rgba(245,158,11,0.1)", color: "var(--met-amber-500)" }}>
              Needs improvement
            </span>
          )}
        </div>
      </div>

      {/* Quality bar */}
      <div
        className="h-2 rounded-full overflow-hidden mb-3"
        style={{ background: "var(--met-surface-muted)" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${quality.score}%`,
            background: quality.meetsMinimum
              ? "var(--met-success)"
              : "var(--met-amber-400)",
          }}
        />
      </div>

      {/* Individual checks */}
      <div className="space-y-1.5">
        {quality.checks.map((check, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span
              style={{
                color: check.passed ? "var(--met-success)" : "var(--met-amber-500)",
              }}
            >
              {check.passed ? "✓" : "○"}
            </span>
            <span style={{ color: "var(--met-text-primary)" }}>
              {check.name}
            </span>
            {check.detail && (
              <span style={{ color: "var(--met-text-muted)" }}>
                — {check.detail}
              </span>
            )}
          </div>
        ))}
      </div>

      {!quality.meetsMinimum && (
        <p
          className="text-xs mt-3"
          style={{ color: "var(--met-text-secondary)" }}
        >
          {quality.feedback}
        </p>
      )}
    </div>
  )
}
