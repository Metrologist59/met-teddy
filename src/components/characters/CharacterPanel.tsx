// src/components/characters/CharacterPanel.tsx
// Combined MET and Teddy character panel.

"use client"

import { METAvatar } from "./METAvatar"
import { TeddyAvatar } from "./TeddyAvatar"
import { MET_ASSETS } from "./assets"
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
  const metAsset = MET_ASSETS[metExpression]
  const isDuo = metAsset?.isDuo === true
  const showTeddy = !isDuo && teddyVisible && prominence.teddyPosition !== "hidden"

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
            MET{(showTeddy || isDuo) ? " and Teddy" : ""}
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

  return (
    <div className="flex items-end gap-2">
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
