// src/app/missions/page.tsx
// Field Missions page — catalog and detail views.

"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/AppShell"
import { MissionCatalog, type MissionSummary } from "@/components/missions/MissionCatalog"
import { MissionDetail, type MissionData } from "@/components/missions/MissionDetail"

// TODO: Load from profile + database
const DEMO_LEVEL = "Explorer" as const
const DEMO_BAND  = "K-2" as const

// ── Demo missions (from Tier 1 seed data) ────────────────────────

const DEMO_MISSIONS: MissionSummary[] = [
  { slug: "measure-teddy",           title: "Measure Teddy!",                domain: "length",      certLevel: "Explorer", gradeBand: "K-2", description: "How tall is Teddy? How long is his tail? Grab a ruler and find out!", timeEstimate: "10 min", completed: false },
  { slug: "heavy-or-light",          title: "Heavy or Light?",               domain: "mass",        certLevel: "Explorer", gradeBand: "K-2", description: "Weigh five objects and sort them from lightest to heaviest.", timeEstimate: "15 min", completed: false },
  { slug: "hot-cold-warm",           title: "Hot, Cold, Warm",               domain: "temperature", certLevel: "Explorer", gradeBand: "K-2", description: "Measure the temperature of three different waters. Which is warmest?", timeEstimate: "10 min", completed: false },
  { slug: "how-long-does-it-take",   title: "How Long Does It Take?",        domain: "time",        certLevel: "Explorer", gradeBand: "K-2", description: "Time yourself doing three activities. Which was fastest?", timeEstimate: "10 min", completed: false },
  { slug: "fill-it-up",             title: "Fill It Up!",                    domain: "volume",      certLevel: "Explorer", gradeBand: "K-2", description: "How many small cups fill up a big cup? Measure and find out!", timeEstimate: "10 min", completed: false },
  { slug: "teddys-shadow",          title: "Teddy's Shadow",                 domain: "length",      certLevel: "Explorer", gradeBand: "K-2", description: "Measure Teddy's shadow at different times. Why does it change?", timeEstimate: "20 min", completed: false },
  { slug: "count-and-measure",      title: "Count and Measure",              domain: "general",     certLevel: "Explorer", gradeBand: "K-2", description: "Count is not the same as measure. Let's find out the difference!", timeEstimate: "10 min", completed: false },
  { slug: "same-or-different",      title: "Same or Different?",             domain: "general",     certLevel: "Explorer", gradeBand: "K-2", description: "Measure the same thing twice. Did you get the same number?", timeEstimate: "10 min", completed: false },
  { slug: "teddy-unit-walk",        title: "Teddy Unit Walk",                domain: "length",      certLevel: "Explorer", gradeBand: "K-2", description: "Measure a hallway in Teddy-lengths. Then use a ruler. Why are the numbers different?", timeEstimate: "15 min", completed: false },
  { slug: "zero-check",             title: "Zero Check!",                    domain: "general",     certLevel: "Explorer", gradeBand: "K-2", description: "Before you measure, check that the tool says zero. Why does this matter?", timeEstimate: "10 min", completed: false },
]

const DEMO_MISSION_DETAIL: MissionData = {
  slug: "measure-teddy",
  title: "Measure Teddy!",
  domain: "length",
  certLevel: "Explorer",
  gradeBand: "K-2",
  description: "How tall is Teddy? How long is his tail? Let's find out — grab a ruler and start measuring!",
  objective: "Practice using a ruler to measure different parts of a stuffed animal. Record each measurement with the number AND the unit.",
  materials: [
    "A ruler (inches or centimeters)",
    "A stuffed animal (or a real Teddy!)",
    "Your Field Notebook",
    "A pencil",
  ],
  timeEstimate: "10 minutes",
  safetyNote: undefined,
  steps: [
    {
      stepNumber: 1,
      title: "Choose What to Measure",
      instruction: "Look at your stuffed animal. Pick three things to measure: how tall he is standing up, how long his tail is, and how wide his paw is.",
      metTip: "Teddy's already standing tall — he knows what's coming!",
    },
    {
      stepNumber: 2,
      title: "Line Up the Ruler",
      instruction: "Put the zero end of the ruler right at the edge of what you're measuring. The zero is where you start counting — not the end of the ruler!",
      metTip: "This is the most important step. If zero isn't at the start, your number will be wrong.",
      dataPrompt: "Which end of the ruler has the zero?",
    },
    {
      stepNumber: 3,
      title: "Read the Number",
      instruction: "Look at where the other end of what you're measuring reaches on the ruler. Read the number. Say it out loud with the unit: 'Teddy is 12 inches tall' or 'Teddy is 30 centimeters tall.'",
      metTip: "The number means nothing without the unit! Just saying '12' doesn't tell anyone what kind of 12.",
      dataPrompt: "Write the measurement with the unit: Teddy is ___ [inches/cm] tall.",
    },
    {
      stepNumber: 4,
      title: "Measure Two More Things",
      instruction: "Now measure Teddy's tail and one paw. Line up the zero each time. Read the number. Write it down with the unit.",
      dataPrompt: "Tail: ___ [unit]. Paw: ___ [unit].",
    },
    {
      stepNumber: 5,
      title: "Compare Your Measurements",
      instruction: "Look at your three numbers. Which is the biggest? Which is the smallest? Are any of them the same?",
      metTip: "You just did something real scientists do — measured, recorded, and compared. That's measurement science!",
      dataPrompt: "Biggest: ___. Smallest: ___.",
    },
  ],
  notebookPrompt: "Time to write this up in your Field Notebook! Draw Teddy and label the three measurements you took.",
}

export default function MissionsPage() {
  const [selectedMission, setSelectedMission] = useState<string | null>(null)

  return (
    <AppShell
      studentName="Explorer"
      certLevel={DEMO_LEVEL}
      gradeBand={DEMO_BAND}
    >
      <div className="p-4 lg:p-6">
        {selectedMission ? (
          <MissionDetail
            mission={DEMO_MISSION_DETAIL}
            onComplete={() => setSelectedMission(null)}
            onBack={() => setSelectedMission(null)}
          />
        ) : (
          <MissionCatalog
            missions={DEMO_MISSIONS}
            certLevel={DEMO_LEVEL}
            onSelect={(slug) => setSelectedMission(slug)}
          />
        )}
      </div>
    </AppShell>
  )
}
