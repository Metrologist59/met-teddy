// src/components/notebook/NotebookFeedback.tsx
// MET's feedback on a notebook entry.
// Shows quick checks (local) and AI feedback (from API).

"use client"

import { useState, useEffect } from "react"
import { runQuickChecks, type QuickCheck } from "@/lib/notebook/feedback"
import { CharacterPanel } from "@/components/characters/CharacterPanel"
import type { NotebookEntry } from "@/lib/notebook/notebookTypes"
import type { CertificationLevel } from "@/lib/levels/config"

interface NotebookFeedbackProps {
  entry:     NotebookEntry
  certLevel: CertificationLevel
}

export function NotebookFeedback({ entry, certLevel }: NotebookFeedbackProps) {
  const [checks, setChecks] = useState<QuickCheck[]>([])
  const [aiFeedback, setAiFeedback] = useState<string | null>(null)
  const [loadingFeedback, setLoadingFeedback] = useState(false)

  useEffect(() => {
    setChecks(runQuickChecks(entry, certLevel))
  }, [entry, certLevel])

  const allPassed = checks.every(c => c.passed)
  const passedCount = checks.filter(c => c.passed).length

  async function requestAIFeedback() {
    setLoadingFeedback(true)
    try {
      const res = await fetch("/api/notebook-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry, certLevel }),
      })
      const data = await res.json()
      setAiFeedback(data.feedback ?? "MET couldn't review this entry right now. Try again in a moment!")
    } catch {
      setAiFeedback("Something went wrong getting MET's feedback. Try again!")
    } finally {
      setLoadingFeedback(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Quick checks */}
      <div className="met-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--met-text-muted)" }}
          >
            Entry Checklist
          </h3>
          <span
            className="text-xs font-medium"
            style={{ color: allPassed ? "var(--met-success)" : "var(--met-amber-500)" }}
          >
            {passedCount}/{checks.length}
          </span>
        </div>

        <div className="space-y-2">
          {checks.map((check, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span
                className="flex-shrink-0 mt-0.5"
                style={{ color: check.passed ? "var(--met-success)" : "var(--met-amber-500)" }}
              >
                {check.passed ? "✓" : "○"}
              </span>
              <div>
                <span style={{ color: "var(--met-text-primary)" }}>{check.label}</span>
                {!check.passed && (
                  <p className="text-xs mt-0.5" style={{ color: "var(--met-text-muted)" }}>
                    {check.tip}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI feedback */}
      {aiFeedback ? (
        <div className="met-card p-4">
          <div className="flex gap-3 mb-3">
            <CharacterPanel
              metExpression={allPassed ? "encourage" : "guide"}
              teddyBodyLanguage={allPassed ? "tail_wag" : "head_tilt"}
              certLevel={certLevel}
              layout="chat-header"
              size="sm"
            />
          </div>
          <div
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: "var(--met-text-primary)" }}
          >
            {aiFeedback}
          </div>
        </div>
      ) : (
        <button
          onClick={requestAIFeedback}
          disabled={loadingFeedback}
          className="met-btn-primary w-full py-3 flex items-center justify-center gap-2"
        >
          {loadingFeedback ? (
            <span className="inline-flex gap-1">
              <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
              <span className="animate-bounce" style={{ animationDelay: "150ms" }}>·</span>
              <span className="animate-bounce" style={{ animationDelay: "300ms" }}>·</span>
            </span>
          ) : (
            <>🔬 Ask MET for Feedback</>
          )}
        </button>
      )}
    </div>
  )
}
