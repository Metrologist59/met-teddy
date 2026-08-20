// src/components/characters/TeddyAvatar.tsx
// Teddy character avatar with body-language-driven rendering.
// Teddy does NOT talk — body language only, MET interprets.

"use client"

import { useEffect, useState } from "react"
import type { TeddyBodyLanguage } from "./types"
import { TEDDY_ASSETS } from "./assets"

interface TeddyAvatarProps {
  bodyLanguage: TeddyBodyLanguage
  scale?:       number  // 0.0–1.0 from prominence config
  opacity?:     number  // 0.0–1.0
  size?:        "sm" | "md" | "lg"
  className?:   string
}

const SIZES = {
  sm: { container: 40,  emoji: "text-xl" },
  md: { container: 60,  emoji: "text-3xl" },
  lg: { container: 80,  emoji: "text-4xl" },
}

// Body language states that trigger special animations
const ANIMATED_STATES: Partial<Record<TeddyBodyLanguage, string>> = {
  tail_wag:  "animate-wiggle",
  spinning:  "animate-spin-slow",
  barking:   "animate-bounce-gentle",
  pawing:    "animate-tap",
  nudging:   "animate-nudge",
}

export function TeddyAvatar({
  bodyLanguage,
  scale = 1.0,
  opacity = 1.0,
  size = "md",
  className = "",
}: TeddyAvatarProps) {
  const [currentState, setCurrentState] = useState(bodyLanguage)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    if (bodyLanguage !== currentState) {
      setTransitioning(true)
      const timer = setTimeout(() => {
        setCurrentState(bodyLanguage)
        setTransitioning(false)
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [bodyLanguage, currentState])

  if (bodyLanguage === "hidden" || scale <= 0) return null

  const asset = TEDDY_ASSETS[currentState]
  const sizeConfig = SIZES[size]
  const animClass = ANIMATED_STATES[currentState] ?? ""

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: sizeConfig.container * scale,
        height: sizeConfig.container * scale,
        opacity: transitioning ? 0.5 : opacity,
        transition: "transform 200ms ease, opacity 200ms ease",
        transform: transitioning ? "scale(0.85) rotate(-5deg)" : "scale(1)",
      }}
      role="img"
      aria-label={asset.alt}
      title={`Teddy — ${asset.label}`}
    >
      <div
        className={`flex items-center justify-center rounded-full ${animClass}`}
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, var(--met-amber-200), var(--met-amber-400))",
          borderRadius: "50%",
        }}
      >
        {asset.type === "emoji" && asset.emoji ? (
          <span className={sizeConfig.emoji}>{asset.emoji}</span>
        ) : asset.type === "image" ? (
          <img
            src={asset.url}
            alt={asset.alt}
            className="w-full h-full object-contain rounded-full"
          />
        ) : null}
      </div>
    </div>
  )
}
