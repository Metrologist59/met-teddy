// src/components/characters/METAvatar.tsx
// MET character avatar with expression-driven rendering.

"use client"

import { useEffect, useState } from "react"
import type { METExpression } from "./types"
import { MET_ASSETS } from "./assets"

interface METAvatarProps {
  expression: METExpression
  scale?:     number        // 0.6–1.0
  size?:      "sm" | "md" | "lg"
  className?: string
}

const SIZES = {
  sm: { container: 48,  emoji: "text-2xl" },
  md: { container: 72,  emoji: "text-4xl" },
  lg: { container: 96,  emoji: "text-5xl" },
}

export function METAvatar({
  expression,
  scale = 1.0,
  size = "md",
  className = "",
}: METAvatarProps) {
  const [currentExpression, setCurrentExpression] = useState(expression)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    if (expression !== currentExpression) {
      setTransitioning(true)
      const timer = setTimeout(() => {
        setCurrentExpression(expression)
        setTransitioning(false)
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [expression, currentExpression])

  const asset = MET_ASSETS[currentExpression]
  const sizeConfig = SIZES[size]

  return (
    <div
      className={`relative flex items-center justify-center rounded-full ${className}`}
      style={{
        width: sizeConfig.container * scale,
        height: sizeConfig.container * scale,
        background: "linear-gradient(135deg, var(--met-teal-400), var(--met-teal-600))",
        transition: "transform 150ms ease, opacity 150ms ease",
        transform: transitioning ? "scale(0.9)" : "scale(1)",
        opacity: transitioning ? 0.7 : 1,
      }}
      role="img"
      aria-label={asset.alt}
      title={`MET — ${asset.label}`}
    >
      {asset.type === "emoji" ? (
        <span className={sizeConfig.emoji}>{asset.emoji}</span>
      ) : (
        <img
          src={asset.url}
          alt={asset.alt}
          className="w-full h-full object-contain rounded-full"
        />
      )}
    </div>
  )
}
