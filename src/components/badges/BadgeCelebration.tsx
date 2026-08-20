// src/components/badges/BadgeCelebration.tsx
// Badge earned celebration overlay.
// MET and Teddy celebrate with the student.

"use client"

import { useEffect, useState } from "react"
import { CharacterPanel } from "@/components/characters/CharacterPanel"
import { getCelebrationMessage } from "@/lib/badges/engine"
import type { BadgeDefinition } from "@/lib/badges/catalog"
import type { CertificationLevel } from "@/lib/levels/config"

interface BadgeCelebrationProps {
  badge:     BadgeDefinition
  certLevel: CertificationLevel
  onDismiss: () => void
}

export function BadgeCelebration({ badge, certLevel, onDismiss }: BadgeCelebrationProps) {
  const [visible, setVisible] = useState(false)
  const message = getCelebrationMessage(badge, certLevel)
  const isCertification = badge.category === "certification"

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  function handleDismiss() {
    setVisible(false)
    setTimeout(onDismiss, 300)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 transition-opacity duration-300"
      style={{
        opacity: visible ? 1 : 0,
        background: "rgba(6, 44, 40, 0.85)",
        backdropFilter: "blur(8px)",
      }}
      onClick={handleDismiss}
    >
      <div
        className="max-w-sm w-full rounded-2xl p-8 text-center transition-all duration-500"
        style={{
          background: "var(--met-surface-card)",
          boxShadow: "0 0 60px rgba(42, 184, 171, 0.3)",
          transform: visible ? "scale(1) translateY(0)" : "scale(0.8) translateY(30px)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Characters celebrating */}
        <div className="mb-4">
          <CharacterPanel
            metExpression="encourage"
            teddyBodyLanguage={isCertification ? "spinning" : "barking"}
            certLevel={certLevel}
            layout="stacked"
            size="lg"
          />
        </div>

        {/* Badge icon — large */}
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl"
          style={{
            background: isCertification
              ? "linear-gradient(135deg, var(--met-teal-400), var(--met-amber-400))"
              : "linear-gradient(135deg, var(--met-teal-400), var(--met-teal-600))",
            boxShadow: "0 0 30px rgba(42, 184, 171, 0.4)",
          }}
        >
          {badge.icon}
        </div>

        {/* Badge name */}
        <h2
          className="text-xl font-bold mb-1"
          style={{ color: "var(--met-text-primary)" }}
        >
          {badge.name}
        </h2>

        {/* Badge description */}
        <p
          className="text-sm mb-4"
          style={{ color: "var(--met-text-secondary)" }}
        >
          {badge.description}
        </p>

        {/* MET celebration message */}
        <div className="met-citation-footer text-left mb-6">
          {message}
        </div>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="met-btn-primary w-full py-3 text-base"
        >
          {isCertification ? "View My Certificate" : "Awesome!"}
        </button>
      </div>
    </div>
  )
}
