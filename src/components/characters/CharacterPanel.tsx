// src/components/characters/CharacterPanel.tsx
// Combined MET and Teddy character panel.
// Handles prominence scaling, expression states, and layout.

"use client"

import { METAvatar } from "./METAvatar"
import { TeddyAvatar } from "./TeddyAvatar"
import { PROMINENCE_BY_LEVEL } from "./types"
import type { METExpression, TeddyBodyLanguage } from "./types"
import type { CertificationLevel } from "@/lib/levels/config"

interface CharacterPanelProps {
  metExpression:     METExpression
  teddyBodyLanguage: TeddyBodyLanguage
  certLevel:         CertificationLevel
  teddyVisible?:     boolean
  layout?:           "inline" | "stacked" | "chat-header"
  size?:             "sm" | "md" | "lg"
}

export function CharacterPanel({
  metExpression,
  teddyBodyLanguage,
  certLevel,
  teddyVisible = true,
  layout = "inline",
  size = "md",
}: CharacterPanelProps) {
  const prominence = PROMINENCE_BY_LEVEL[certLevel]
  const showTeddy = teddyVisible && prominence.teddyPosition !== "hidden"

  if (layout === "chat-header") {
    return (
      <div className="flex items-center gap-3">
        <METAvatar
          expression={metExpression}
          scale={prominence.metScale}
          size={size}
        />
        {showTeddy && (
          <TeddyAvatar
            bodyLanguage={teddyBodyLanguage}
            scale={prominence.teddyScale}
            opacity={prominence.teddyOpacity}
            size={size === "lg" ? "md" : "sm"}
          />
        )}
        <div className="flex flex-col">
          <span
            className="font-semibold text-sm"
            style={{ color: "var(--met-text-primary)" }}
          >
            MET{showTeddy ? " and Teddy" : ""}
          </span>
          <span
            className="text-xs"
            style={{ color: "var(--met-text-muted)" }}
          >
            Your Measurement Education Tutor
          </span>
        </div>
      </div>
    )
  }

  if (layout === "stacked") {
    return (
      <div className="flex flex-col items-center gap-2">
        <METAvatar
          expression={metExpression}
          scale={prominence.metScale}
          size={size}
        />
        {showTeddy && (
          <TeddyAvatar
            bodyLanguage={teddyBodyLanguage}
            scale={prominence.teddyScale}
            opacity={prominence.teddyOpacity}
            size={size === "lg" ? "md" : "sm"}
          />
        )}
      </div>
    )
  }

  // Default: inline
  return (
    <div className="flex items-end gap-2">
      {/* At Explorer level, Teddy is center — show first */}
      {showTeddy && prominence.teddyPosition === "center" && (
        <TeddyAvatar
          bodyLanguage={teddyBodyLanguage}
          scale={prominence.teddyScale}
          opacity={prominence.teddyOpacity}
          size={size}
        />
      )}

      <METAvatar
        expression={metExpression}
        scale={prominence.metScale}
        size={size}
      />

      {/* At other levels, Teddy is beside or behind */}
      {showTeddy && prominence.teddyPosition !== "center" && (
        <TeddyAvatar
          bodyLanguage={teddyBodyLanguage}
          scale={prominence.teddyScale}
          opacity={prominence.teddyOpacity}
          size={size === "lg" ? "md" : "sm"}
        />
      )}
    </div>
  )
}
