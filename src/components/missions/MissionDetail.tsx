// src/components/missions/MissionDetail.tsx
// Individual Field Mission — step-by-step interactive interface.
// Includes safety banner, materials checklist, procedure steps,
// completion state, and notebook prompt.

"use client"

import { useState } from "react"
import { SafetyBanner } from "./SafetyBanner"
import { CharacterPanel } from "@/components/characters/CharacterPanel"
import type { CertificationLevel, GradeBand } from "@/lib/levels/config"

export interface MissionStep {
  stepNumber: number
  title:      string
  instruction: string
  metTip?:    string
  dataPrompt?: string  // what to record in notebook
}

export interface MissionData {
  slug:          string
  title:         string
  domain:        string
  certLevel:     CertificationLevel
  gradeBand:     GradeBand
  description:   string
  objective:     string
  materials:     string[]
  timeEstimate:  string
  safetyNote?:   string
  steps:         MissionStep[]
  notebookPrompt: string
}

interface MissionDetailProps {
  mission:     MissionData
  onComplete:  () => void
  onBack:      () => void
}

export function MissionDetail({ mission, onComplete, onBack }: MissionDetailProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [checkedMaterials, setCheckedMaterials] = useState<Set<number>>(new Set())
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const allMaterialsChecked = checkedMaterials.size === mission.materials.length
  const allStepsCompleted = completedSteps.size === mission.steps.length
  const inSteps = currentStep > 0

  function toggleMaterial(index: number) {
    setCheckedMaterials(prev => {
      const next = new Set(prev)
      next.has(index) ? next.delete(index) : next.add(index)
      return next
    })
  }

  function completeStep(stepNum: number) {
    setCompletedSteps(prev => new Set(prev).add(stepNum))
    if (stepNum < mission.steps.length) {
      setCurrentStep(stepNum + 1)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-medium mb-4 transition-colors"
        style={{ color: "var(--met-teal-400)" }}
      >
        ← All Missions
      </button>

      {/* Mission header */}
      <div
        className="rounded-xl p-6 mb-4"
        style={{ background: "var(--met-teal-900)", color: "var(--met-text-inverse)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-3xl">🧭</span>
          <div className="flex gap-2">
            <span
              className="met-badge"
              style={{ background: "rgba(42,184,171,0.2)", color: "var(--met-teal-400)" }}
            >
              {mission.domain}
            </span>
            <span
              className="met-badge"
              style={{ background: "rgba(245,158,11,0.2)", color: "var(--met-amber-400)" }}
            >
              {mission.certLevel}
            </span>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">{mission.title}</h1>
        <p className="text-sm" style={{ opacity: 0.85 }}>{mission.description}</p>
        <div className="flex items-center gap-4 mt-3 text-xs" style={{ opacity: 0.7 }}>
          <span>⏱ {mission.timeEstimate}</span>
          <span>📋 {mission.steps.length} steps</span>
        </div>
      </div>

      {/* Safety banner */}
      <div className="mb-4">
        <SafetyBanner
          gradeBand={mission.gradeBand}
          missionSafety={mission.safetyNote}
        />
      </div>

      {/* Objective */}
      <div className="met-card p-4 mb-4">
        <h3
          className="text-xs font-semibold uppercase tracking-wide mb-1"
          style={{ color: "var(--met-text-muted)" }}
        >
          Objective
        </h3>
        <p className="text-sm" style={{ color: "var(--met-text-primary)" }}>
          {mission.objective}
        </p>
      </div>

      {/* Materials checklist */}
      {!inSteps && (
        <div className="met-card p-4 mb-4">
          <h3
            className="text-xs font-semibold uppercase tracking-wide mb-3"
            style={{ color: "var(--met-text-muted)" }}
          >
            Materials — check each one off
          </h3>
          <div className="space-y-2">
            {mission.materials.map((item, i) => (
              <label
                key={i}
                className="flex items-center gap-3 cursor-pointer text-sm"
                style={{ color: "var(--met-text-primary)" }}
              >
                <input
                  type="checkbox"
                  checked={checkedMaterials.has(i)}
                  onChange={() => toggleMaterial(i)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "var(--met-teal-400)" }}
                />
                <span style={{
                  textDecoration: checkedMaterials.has(i) ? "line-through" : "none",
                  opacity: checkedMaterials.has(i) ? 0.6 : 1,
                }}>
                  {item}
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={() => setCurrentStep(1)}
            disabled={!allMaterialsChecked}
            className="met-btn-primary w-full mt-4 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {allMaterialsChecked ? "Start Mission" : `Check all ${mission.materials.length} items to begin`}
          </button>
        </div>
      )}

      {/* Steps */}
      {inSteps && (
        <div className="space-y-3">
          {/* Step progress */}
          <div className="flex gap-1 mb-4">
            {mission.steps.map((s) => (
              <div
                key={s.stepNumber}
                className="flex-1 h-1.5 rounded-full transition-all"
                style={{
                  background: completedSteps.has(s.stepNumber)
                    ? "var(--met-teal-400)"
                    : s.stepNumber === currentStep
                    ? "var(--met-amber-400)"
                    : "var(--met-surface-muted)",
                }}
              />
            ))}
          </div>

          {mission.steps.map((step) => {
            const isActive = step.stepNumber === currentStep
            const isDone = completedSteps.has(step.stepNumber)
            const isLocked = step.stepNumber > currentStep && !isDone

            return (
              <div
                key={step.stepNumber}
                className="met-card overflow-hidden transition-all"
                style={{
                  opacity: isLocked ? 0.5 : 1,
                  border: isActive ? "2px solid var(--met-teal-400)" : undefined,
                }}
              >
                {/* Step header */}
                <div className="flex items-center gap-3 p-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      background: isDone
                        ? "var(--met-teal-400)"
                        : isActive
                        ? "var(--met-amber-400)"
                        : "var(--met-surface-muted)",
                      color: isDone || isActive ? "white" : "var(--met-text-muted)",
                    }}
                  >
                    {isDone ? "✓" : step.stepNumber}
                  </div>
                  <div className="flex-1">
                    <h4
                      className="font-semibold text-sm"
                      style={{ color: "var(--met-text-primary)" }}
                    >
                      {step.title}
                    </h4>
                  </div>
                </div>

                {/* Step content (expanded when active) */}
                {(isActive || isDone) && (
                  <div className="px-4 pb-4">
                    <p
                      className="text-sm leading-relaxed mb-3"
                      style={{ color: "var(--met-text-secondary)" }}
                    >
                      {step.instruction}
                    </p>

                    {/* MET tip */}
                    {step.metTip && (
                      <div className="met-citation-footer mb-3">
                        <span className="font-semibold">MET says:</span> {step.metTip}
                      </div>
                    )}

                    {/* Data prompt */}
                    {step.dataPrompt && (
                      <div
                        className="p-3 rounded-lg text-xs mb-3"
                        style={{
                          background: "var(--met-surface-muted)",
                          color: "var(--met-text-secondary)",
                        }}
                      >
                        📓 <span className="font-medium">Record in your notebook:</span> {step.dataPrompt}
                      </div>
                    )}

                    {/* Complete step button */}
                    {isActive && !isDone && (
                      <button
                        onClick={() => completeStep(step.stepNumber)}
                        className="met-btn-primary w-full py-2 text-sm"
                      >
                        {step.stepNumber === mission.steps.length
                          ? "Complete Final Step"
                          : "Done — Next Step"
                        }
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* Mission complete */}
          {allStepsCompleted && (
            <div className="met-card p-6 text-center">
              <CharacterPanel
                metExpression="encourage"
                teddyBodyLanguage="spinning"
                certLevel={mission.certLevel}
                layout="stacked"
                size="lg"
              />
              <h3
                className="text-lg font-bold mt-4 mb-1"
                style={{ color: "var(--met-text-primary)" }}
              >
                Mission Complete!
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--met-text-secondary)" }}
              >
                {mission.notebookPrompt}
              </p>
              <div className="flex gap-3">
                <a
                  href="/notebook"
                  className="met-btn-primary flex-1 py-3 text-center"
                >
                  Open Notebook
                </a>
                <button
                  onClick={onComplete}
                  className="met-btn-warm flex-1 py-3"
                >
                  Back to Missions
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
