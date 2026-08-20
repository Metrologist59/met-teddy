// src/app/onboarding/page.tsx
// Student onboarding flow for MET and Teddy.
// Steps: Level Reveal → Notebook Setup → First Mission
//
// Reached after registration and (for under-13) parental consent.
// The grade band and cert level come from the profile created
// during registration.

"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { LevelReveal } from "@/components/onboarding/LevelReveal"
import { NotebookSetup } from "@/components/onboarding/NotebookSetup"
import { FirstMission } from "@/components/onboarding/FirstMission"
import { BAND_TO_LEVEL } from "@/lib/levels/config"
import type { CertificationLevel, GradeBand } from "@/lib/levels/config"

type OnboardingStep = "reveal" | "notebook" | "mission"

export default function OnboardingPage() {
  const searchParams = useSearchParams()
  const gradeBand = (searchParams.get("band") ?? "K-2") as GradeBand
  const studentName = searchParams.get("name") ?? "Explorer"
  const certLevel = BAND_TO_LEVEL[gradeBand] ?? "Explorer"

  const [step, setStep] = useState<OnboardingStep>("reveal")

  // Progress indicator
  const steps: OnboardingStep[] = ["reveal", "notebook", "mission"]
  const currentIndex = steps.indexOf(step)

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ background: "var(--met-surface)" }}
    >
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div
            key={s}
            className="w-2.5 h-2.5 rounded-full transition-all"
            style={{
              background: i <= currentIndex
                ? "var(--met-teal-400)"
                : "var(--met-surface-muted)",
              transform: i === currentIndex ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="max-w-xl mx-auto">
        {step === "reveal" && (
          <LevelReveal
            certLevel={certLevel}
            gradeBand={gradeBand}
            studentName={studentName}
            onContinue={() => setStep("notebook")}
          />
        )}

        {step === "notebook" && (
          <NotebookSetup
            certLevel={certLevel}
            studentName={studentName}
            onContinue={() => setStep("mission")}
          />
        )}

        {step === "mission" && (
          <FirstMission
            certLevel={certLevel}
            studentName={studentName}
            onStart={() => {
              // Navigate to the first mission
              window.location.href = "/missions"
            }}
            onSkip={() => {
              // Navigate to the chat — let them explore
              window.location.href = "/chat"
            }}
          />
        )}
      </div>

      {/* Footer */}
      <p
        className="text-center text-xs mt-12"
        style={{ color: "var(--met-text-muted)" }}
      >
        MET Universe — A MET Scientia Experience
      </p>
    </div>
  )
}
