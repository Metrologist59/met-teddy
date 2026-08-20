// src/lib/teddy/patterns.ts
// Teddy interaction patterns for MET and Teddy.
// Source: Brand Ecosystem Profile v2.0 §10, §13, §15.2
//
// Three core patterns:
// 1. Mistake-maker — Teddy makes a measurement mistake the student corrects
// 2. Student-talks-to-Teddy — student addresses Teddy directly
// 3. Measurement-subject — Teddy is the thing being measured

import type { CertificationLevel } from "@/lib/levels/config"

// ── Types ────────────────────────────────────────────────────────────────────

export interface MistakeMakerPrompt {
  mistake:    string  // What Teddy did wrong
  correction: string  // What the student should notice
  concept:    string  // The measurement concept being taught
}

export interface TeddyInteractionDirective {
  pattern:     "mistake_maker" | "talks_to_teddy" | "measurement_subject" | "none"
  instruction: string  // Injected into the context layer for the LLM
}

// ── Mistake-maker library ────────────────────────────────────────────────────
// Teddy's mistakes are engineered to teach correct methodology.
// They are NEVER unsafe — wrong unit, forgot to record, read from
// an angle — never a dangerous act.

const MISTAKES_BY_LEVEL: Record<CertificationLevel, MistakeMakerPrompt[]> = {
  Explorer: [
    {
      mistake: "Teddy measured the book but forgot to say the unit — he just wrote '12'",
      correction: "12 what? Inches? Centimeters? We need the unit!",
      concept: "unit",
    },
    {
      mistake: "Teddy read the ruler from the side instead of looking straight down",
      correction: "Looking from the side gives you the wrong number — that's called parallax",
      concept: "parallax",
    },
    {
      mistake: "Teddy started measuring from the 1 mark instead of the 0 mark",
      correction: "Always start at zero! Otherwise every measurement is off by that much",
      concept: "zero_check",
    },
    {
      mistake: "Teddy put something on the scale without checking if it said zero first",
      correction: "Check that the scale says zero before you weigh — or your number will be wrong",
      concept: "zero_check",
    },
  ],

  Investigator: [
    {
      mistake: "Teddy measured the pendulum only once and said 'that's the answer'",
      correction: "One measurement isn't enough — try it five times and see if you get the same number every time",
      concept: "repeatability",
    },
    {
      mistake: "Teddy wrote down 22 cm but didn't write down which ruler he used or when he measured",
      correction: "A good record includes the date, the tool, and the number with its unit",
      concept: "recording_data",
    },
    {
      mistake: "Teddy converted centimeters to inches but got the wrong answer because he multiplied instead of dividing",
      correction: "To go from cm to inches, divide by 2.54 — not multiply!",
      concept: "unit",
    },
    {
      mistake: "Teddy used a kitchen scale to weigh something but forgot to tare the bowl first",
      correction: "The scale was weighing the bowl AND the object — press tare to subtract the bowl's weight",
      concept: "tare",
    },
  ],

  Innovator: [
    {
      mistake: "Teddy reported his measurement as 25.345678 mm from a caliper that only reads to 0.01 mm",
      correction: "You can't report more digits than your instrument can measure — that's false precision",
      concept: "significant_figures",
    },
    {
      mistake: "Teddy said his measurement was 'accurate' because he got the same number three times",
      correction: "Getting the same number means it's precise, but it might not be accurate — those are different things",
      concept: "accuracy_vs_precision",
    },
    {
      mistake: "Teddy measured a metal rod right after holding it in his warm paws for five minutes",
      correction: "Body heat expanded the rod — temperature affects measurements. That's why labs are kept at 20 °C",
      concept: "thermal_expansion",
    },
  ],

  Metrologist: [
    {
      mistake: "Teddy reported an uncertainty of ± 0.003 mm but used k = 2 with only 4 measurements (ν = 3)",
      correction: "With only 3 degrees of freedom, k = 2 doesn't give 95% confidence — you need the t-distribution",
      concept: "coverage_factor",
    },
    {
      mistake: "Teddy calibrated a caliper but forgot to record the environmental conditions",
      correction: "ISO 17025 §7.6 requires that calibration results state the environmental conditions — temperature matters",
      concept: "environmental_effects",
    },
  ],
}

// ── Pattern detection ────────────────────────────────────────────────────────

/**
 * Detects if the student's message is addressing Teddy directly.
 * Patterns: mentions Teddy by name, asks Teddy a question, talks
 * to Teddy, greets Teddy.
 */
export function isAddressingTeddy(message: string): boolean {
  const lower = message.toLowerCase()
  const teddyPatterns = [
    /\bteddy\b/,
    /\bhey teddy\b/,
    /\bhi teddy\b/,
    /\bteddy,?\s/,
    /\bwhat does teddy\b/,
    /\bwhere'?s teddy\b/,
    /\bhow'?s teddy\b/,
    /\bteddy'?s\b/,
    /\bask teddy\b/,
    /\btell teddy\b/,
    /\bshow teddy\b/,
    /\bpet teddy\b/,
  ]
  return teddyPatterns.some(p => p.test(lower))
}

/**
 * Selects a random mistake-maker prompt appropriate for the level.
 * Returns null if no mistakes are available (shouldn't happen).
 */
export function selectMistake(level: CertificationLevel): MistakeMakerPrompt | null {
  const mistakes = MISTAKES_BY_LEVEL[level]
  if (!mistakes || mistakes.length === 0) return null
  return mistakes[Math.floor(Math.random() * mistakes.length)]
}

/**
 * Builds a directive for the LLM when the student is talking to Teddy.
 */
export function buildTalksToTeddyDirective(message: string): TeddyInteractionDirective {
  return {
    pattern: "talks_to_teddy",
    instruction: [
      "TEDDY INTERACTION: The student is addressing Teddy directly.",
      "Respond warmly as MET interpreting Teddy's reaction.",
      "Describe what Teddy is doing (body language only — Teddy never talks).",
      "Then pivot naturally back to the measurement concept.",
      "Example: \"Teddy's wagging his tail — he loves that question! Here's what's really cool about...\"",
    ].join("\n"),
  }
}

/**
 * Builds a directive for the mistake-maker pattern.
 */
export function buildMistakeMakerDirective(
  mistake: MistakeMakerPrompt,
): TeddyInteractionDirective {
  return {
    pattern: "mistake_maker",
    instruction: [
      "TEDDY MISTAKE-MAKER PATTERN:",
      `Teddy made a measurement mistake: ${mistake.mistake}`,
      "Present this to the student and let THEM figure out what went wrong.",
      "Teddy puts his paws over his nose in embarrassment when the student catches it.",
      `The concept being taught: ${mistake.concept}`,
      `What the student should notice: ${mistake.correction}`,
      "Frame it warmly — Teddy's mistake is how the student learns.",
    ].join("\n"),
  }
}
