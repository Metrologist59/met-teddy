// src/components/onboarding/NotebookSetup.tsx
// Initial Field Notebook setup during onboarding.
// Level-adaptive — Explorer gets a sticker-book feel,
// Metrologist gets a professional calibration record format.

"use client"

import type { CertificationLevel } from "@/lib/levels/config"

interface NotebookSetupProps {
  certLevel:   CertificationLevel
  studentName: string
  onContinue:  () => void
}

const NOTEBOOK_INTROS: Record<CertificationLevel, {
  title:       string
  description: string
  features:    string[]
  metSays:     string
}> = {
  Explorer: {
    title: "Your Field Notebook",
    description: "This is where you'll draw and record everything you measure. Every great scientist keeps a notebook!",
    features: [
      "🖍️ Draw what you measured",
      "🔢 Write the number and the unit",
      "⭐ Earn stickers for every entry",
      "🐕 Teddy has his own page!",
    ],
    metSays: "Teddy's already sniffing at the notebook — he can't wait to see what you measure first!",
  },
  Investigator: {
    title: "My Field Notebook",
    description: "Your measurement journal — where you record data, compare results, and track your experiments.",
    features: [
      "📊 Record measurements with date and tool",
      "🔄 Compare multiple measurements",
      "❓ Answer 'Why were they different?'",
      "🏅 Complete entries earn badges",
    ],
    metSays: "Every entry you make is practice for how real scientists work. The record IS the science.",
  },
  Innovator: {
    title: "My Field Notebook",
    description: "Your data tool — multiple trials, calculated statistics, error analysis, and sources of variation.",
    features: [
      "📈 Auto-calculated mean and standard deviation",
      "📋 Structured error analysis fields",
      "🔗 Linked to Field Mission procedures",
      "📝 'What I'd do differently' reflection",
    ],
    metSays: "Your notebook is where raw numbers become real understanding. The statistics tell the story the numbers can't tell alone.",
  },
  Metrologist: {
    title: "My Field Notebook",
    description: "Professional measurement documentation — uncertainty budgets, calibration record formats, and standards references.",
    features: [
      "📐 Uncertainty budget worksheets",
      "📋 Calibration certificate format entries",
      "📎 Standards clause references",
      "🔬 Degrees of freedom and coverage factors",
    ],
    metSays: "ISO 17025 says it plainly: if you didn't write it down, it didn't happen. Your notebook is your professional documentation.",
  },
}

export function NotebookSetup({ certLevel, studentName, onContinue }: NotebookSetupProps) {
  const config = NOTEBOOK_INTROS[certLevel]

  return (
    <div className="max-w-lg mx-auto text-center">
      {/* Notebook icon */}
      <div className="text-6xl mb-4">📓</div>

      <h2
        className="text-2xl font-bold mb-2"
        style={{ color: "var(--met-text-primary)" }}
      >
        {config.title}
      </h2>
      <p
        className="mb-6 text-sm"
        style={{ color: "var(--met-text-secondary)" }}
      >
        {config.description}
      </p>

      {/* Features */}
      <div className="met-card p-5 text-left mb-6">
        <div className="space-y-3">
          {config.features.map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-sm"
              style={{ color: "var(--met-text-primary)" }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* MET says */}
      <div className="met-citation-footer text-left mb-6">
        <span className="font-semibold">MET says:</span> {config.metSays}
      </div>

      <button
        onClick={onContinue}
        className="met-btn-primary px-8 py-3 text-base"
      >
        Open My Notebook
      </button>
    </div>
  )
}
