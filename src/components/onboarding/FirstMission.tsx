// src/components/onboarding/FirstMission.tsx
// First Field Mission recommendation during onboarding.
// Each level gets a mission that matches their starting point.

"use client"

import type { CertificationLevel } from "@/lib/levels/config"

interface FirstMissionProps {
  certLevel:   CertificationLevel
  studentName: string
  onStart:     () => void
  onSkip:      () => void
}

const FIRST_MISSIONS: Record<CertificationLevel, {
  title:       string
  domain:      string
  description: string
  materials:   string[]
  timeEstimate: string
  metSays:     string
}> = {
  Explorer: {
    title: "Measure Teddy!",
    domain: "Length",
    description: "How tall is Teddy? How long is his tail? Let's find out — grab a ruler and start measuring!",
    materials: ["A ruler", "A stuffed animal (or Teddy!)", "Your Field Notebook"],
    timeEstimate: "10 minutes",
    metSays: "Teddy's standing up straight and looking proud — he's ready to be measured! Don't forget to say what unit you're using.",
  },
  Investigator: {
    title: "The Pendulum Period",
    domain: "Time",
    description: "Build a simple pendulum and measure how long one swing takes. Then do it again. And again. Are the numbers the same?",
    materials: ["String (about 1 meter)", "A small weight (washer or key)", "Stopwatch or phone timer", "Your Field Notebook"],
    timeEstimate: "20 minutes",
    metSays: "This mission teaches you something important: why scientists never trust a single measurement. Five trials minimum!",
  },
  Innovator: {
    title: "Scale Repeatability Study",
    domain: "Mass",
    description: "Weigh the same object 10 times on a digital scale without removing it between readings. Calculate the mean and standard deviation. What does the spread tell you about the scale's repeatability?",
    materials: ["Digital scale (kitchen scale works)", "A solid object (sealed container, metal block)", "Your Field Notebook"],
    timeEstimate: "25 minutes",
    metSays: "This is your first real repeatability study. The standard deviation you calculate tells you something the single reading never could.",
  },
  Metrologist: {
    title: "Caliper Verification",
    domain: "Dimensional",
    description: "Verify the zero error and repeatability of a digital caliper at three test points. Document results in calibration record format with uncertainty evaluation.",
    materials: ["Digital caliper", "Gauge blocks or known reference objects", "Your Field Notebook"],
    timeEstimate: "30 minutes",
    metSays: "This is how a calibration technician starts their day. You're verifying an instrument — the fundamental act of metrology.",
  },
}

export function FirstMission({ certLevel, studentName, onStart, onSkip }: FirstMissionProps) {
  const mission = FIRST_MISSIONS[certLevel]

  return (
    <div className="max-w-lg mx-auto">
      <h2
        className="text-2xl font-bold mb-1 text-center"
        style={{ color: "var(--met-text-primary)" }}
      >
        Your First Field Mission
      </h2>
      <p
        className="text-center text-sm mb-6"
        style={{ color: "var(--met-text-muted)" }}
      >
        Ready for your first measurement adventure?
      </p>

      <div className="met-card overflow-hidden">
        {/* Mission header */}
        <div
          className="p-5"
          style={{ background: "var(--met-teal-900)", color: "var(--met-text-inverse)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🧭</span>
            <span
              className="met-badge"
              style={{
                background: "rgba(42, 184, 171, 0.2)",
                color: "var(--met-teal-400)",
              }}
            >
              {mission.domain}
            </span>
          </div>
          <h3 className="text-xl font-bold">{mission.title}</h3>
          <p className="text-sm mt-1" style={{ opacity: 0.8 }}>
            {mission.description}
          </p>
        </div>

        {/* Mission details */}
        <div className="p-5">
          <div className="mb-4">
            <h4
              className="text-xs font-semibold uppercase tracking-wide mb-2"
              style={{ color: "var(--met-text-muted)" }}
            >
              What you'll need
            </h4>
            <div className="space-y-1">
              {mission.materials.map((item, i) => (
                <div
                  key={i}
                  className="text-sm flex items-center gap-2"
                  style={{ color: "var(--met-text-secondary)" }}
                >
                  <span style={{ color: "var(--met-teal-400)" }}>•</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm" style={{ color: "var(--met-text-muted)" }}>⏱</span>
            <span className="text-sm" style={{ color: "var(--met-text-secondary)" }}>
              About {mission.timeEstimate}
            </span>
          </div>

          {/* MET says */}
          <div className="met-citation-footer">
            <span className="font-semibold">MET says:</span> {mission.metSays}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onStart}
          className="met-btn-primary flex-1 py-3 text-base"
        >
          Start Mission
        </button>
        <button
          onClick={onSkip}
          className="flex-1 py-3 text-base font-medium rounded-lg transition-colors"
          style={{
            color: "var(--met-text-muted)",
            background: "var(--met-surface-muted)",
          }}
        >
          Explore First
        </button>
      </div>
    </div>
  )
}
