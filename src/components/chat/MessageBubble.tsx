// src/components/chat/MessageBubble.tsx
// Chat message bubble for MET and Teddy.
// Renders student messages and MET responses differently.
// MET responses include character avatar and citation footer.

"use client"

import { useState } from "react"
import { CharacterPanel } from "@/components/characters/CharacterPanel"
import { inferContextFromResponse } from "@/components/characters/stateMapper"
import type { CertificationLevel } from "@/lib/levels/config"

interface MessageBubbleProps {
  role:            "student" | "met"
  content:         string
  certLevel:       CertificationLevel
  citationFooter?: string
  timestamp?:      string
}

export function MessageBubble({
  role,
  content,
  certLevel,
  citationFooter,
  timestamp,
}: MessageBubbleProps) {
  const [citationExpanded, setCitationExpanded] = useState(false)

  if (role === "student") {
    return (
      <div className="flex justify-end mb-4">
        <div
          className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-md text-sm"
          style={{
            background: "var(--met-teal-400)",
            color: "white",
          }}
        >
          {content}
        </div>
      </div>
    )
  }

  // MET response
  const context = inferContextFromResponse(content)
  const teddyLanguage =
    context === "achievement" ? "spinning" :
    context === "mistake" ? "paws_over_nose" :
    context === "greeting" ? "tail_wag" :
    context === "experiment" ? "pawing" :
    context === "struggle" ? "nudging" :
    "sitting"

  // Parse citation from content (📐 line at the end)
  const citationMatch = content.match(/📐.*$/m)
  const mainContent = citationMatch
    ? content.replace(/📐.*$/m, "").trimEnd()
    : content
  const inlineCitation = citationMatch?.[0] ?? citationFooter

  // Check for expandable clause references (Innovator and Metrologist)
  const hasExpandableCitation =
    (certLevel === "Innovator" || certLevel === "Metrologist") &&
    inlineCitation

  return (
    <div className="flex gap-3 mb-4">
      {/* Character avatar */}
      <div className="flex-shrink-0 mt-1">
        <CharacterPanel
          metExpression={
            context === "greeting" ? "neutral" :
            context === "safety" ? "caution" :
            context === "achievement" ? "encourage" :
            context === "humor" ? "playful" :
            context === "experiment" ? "guide" :
            "explore"
          }
          teddyBodyLanguage={teddyLanguage}
          certLevel={certLevel}
          layout="chat-header"
          size="sm"
        />
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0">
        <div
          className="px-4 py-3 rounded-2xl rounded-tl-md text-sm leading-relaxed"
          style={{
            background: "var(--met-surface-card)",
            color: "var(--met-text-primary)",
            border: "1px solid rgba(42, 184, 171, 0.08)",
          }}
        >
          {/* Main content — preserve line breaks */}
          <div className="whitespace-pre-wrap">{mainContent}</div>

          {/* Citation footer */}
          {inlineCitation && (
            <div className="mt-3">
              <div
                className="met-citation-footer flex items-center justify-between cursor-default"
                onClick={hasExpandableCitation ? () => setCitationExpanded(!citationExpanded) : undefined}
                style={{
                  cursor: hasExpandableCitation ? "pointer" : "default",
                }}
              >
                <span>{inlineCitation}</span>
                {hasExpandableCitation && (
                  <span
                    className="text-xs ml-2 transition-transform"
                    style={{
                      transform: citationExpanded ? "rotate(180deg)" : "rotate(0)",
                    }}
                  >
                    ▼
                  </span>
                )}
              </div>

              {/* Expanded clause view (Innovator/Metrologist) */}
              {citationExpanded && (
                <div
                  className="mt-2 p-3 rounded-lg text-xs"
                  style={{
                    background: "var(--met-surface-muted)",
                    color: "var(--met-text-secondary)",
                    borderLeft: "2px solid var(--met-teal-400)",
                  }}
                >
                  <p className="font-medium mb-1" style={{ color: "var(--met-text-primary)" }}>
                    Standards Reference
                  </p>
                  <p>
                    This content is grounded in the referenced standard via the
                    Standards Bridge. The citation traces through the MET Field
                    Guide to MetLibrary.
                  </p>
                  {certLevel === "Metrologist" && (
                    <p className="mt-2 italic">
                      At the Metrologist level, you can explore the full clause
                      text from MetLibrary when federation is active.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <p
            className="text-xs mt-1 ml-1"
            style={{ color: "var(--met-text-muted)" }}
          >
            {timestamp}
          </p>
        )}
      </div>
    </div>
  )
}
