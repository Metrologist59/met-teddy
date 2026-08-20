// src/components/onboarding/LevelReveal.tsx
// Certification level reveal — animated moment where the student
// discovers their level. Each level feels distinct and earned.

"use client"

import { useState, useEffect } from "react"
import { CharacterPanel } from "@/components/characters/CharacterPanel"
import type { CertificationLevel } from "@/lib/levels/config"

interface LevelRevealProps {
  certLevel: CertificationLevel
  gradeBand: string
  studentName: string
  onContinue: () => void
}

const LEVEL_CONFIG: Record<CertificationLevel, {
  tagline:    string
  welcomeMsg: string
  color:      string
  bgGradient: string
}> = {
  Explorer: {
    tagline: "Measure it. Tell me what you see!",
    welcomeMsg: "Welcome, Explorer! Teddy and I are so excited to start measuring things with you. Every number tells a story — and we're going to find them together!",
    color: "#2AB8AB",
    bgGradient: "linear-gradient(135deg, #062C28 0%, #0F3D38 50%, #1A5C54 100%)",
  },
  Investigator: {
    tagline: "Measure it. Write it down. Now do it again.",
    welcomeMsg: "Welcome, Investigator! You're ready to dig deeper into measurement. Teddy's already sniffing out things to measure — and this time, we're going to write everything down and see what the numbers tell us.",
    color: "#60A5FA",
    bgGradient: "linear-gradient(135deg, #062C28 0%, #0C2D4A 50%, #1A3F6B 100%)",
  },
  Innovator: {
    tagline: "Why isn't it the same every time?",
    welcomeMsg: "Welcome, Innovator. Here's where measurement gets really interesting — we're going to talk about WHY your numbers change, what uncertainty means, and how real scientists handle variation. MET's got a lot to show you.",
    color: "#F59E0B",
    bgGradient: "linear-gradient(135deg, #062C28 0%, #2D2006 50%, #4A3A0C 100%)",
  },
  Metrologist: {
    tagline: "Quantify it. Defend it. Trace it.",
    welcomeMsg: "Welcome, Metrologist. You're training at the professional level now. We'll work with the GUM, ISO 17025, and the standards that real calibration laboratories follow. The science doesn't bend — and neither do we.",
    color: "#F8FAFA",
    bgGradient: "linear-gradient(135deg, #062C28 0%, #041A17 50%, #062C28 100%)",
  },
}

export function LevelReveal({ certLevel, gradeBand, studentName, onContinue }: LevelRevealProps) {
  const [revealed, setRevealed] = useState(false)
  const config = LEVEL_CONFIG[certLevel]

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center rounded-2xl"
      style={{ background: config.bgGradient }}
    >
      {/* Character panel */}
      <div
        className="mb-6 transition-all duration-700"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <CharacterPanel
          metExpression="encourage"
          teddyBodyLanguage={certLevel === "Explorer" ? "spinning" : certLevel === "Investigator" ? "tail_wag" : "sitting"}
          certLevel={certLevel}
          layout="stacked"
          size="lg"
        />
      </div>

      {/* Level badge */}
      <div
        className="transition-all duration-700 delay-300"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "scale(1)" : "scale(0.8)",
        }}
      >
        <div
          className="inline-block px-6 py-2 rounded-full text-lg font-bold mb-2"
          style={{
            color: config.color,
            border: `2px solid ${config.color}`,
            background: `${config.color}15`,
          }}
        >
          {certLevel}
        </div>
        <p className="text-sm" style={{ color: `${config.color}99` }}>
          {gradeBand} · {studentName}
        </p>
      </div>

      {/* Tagline */}
      <p
        className="mt-4 text-xl font-semibold italic transition-all duration-700 delay-500"
        style={{
          color: config.color,
          opacity: revealed ? 1 : 0,
        }}
      >
        "{config.tagline}"
      </p>

      {/* Welcome message */}
      <p
        className="mt-6 max-w-lg text-sm leading-relaxed transition-all duration-700 delay-700"
        style={{
          color: "var(--met-text-inverse)",
          opacity: revealed ? 0.85 : 0,
        }}
      >
        {config.welcomeMsg}
      </p>

      {/* Continue */}
      <button
        onClick={onContinue}
        className="met-btn-primary mt-8 px-8 py-3 text-base transition-all duration-700 delay-1000"
        style={{ opacity: revealed ? 1 : 0 }}
      >
        Let's Go!
      </button>
    </div>
  )
}
