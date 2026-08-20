// src/components/characters/types.ts
// Character rendering types for MET and Teddy.
//
// Expression poses from Brand Ecosystem Profile v2.0 §11.1:
//   CAUTION, ENCOURAGE, GUIDE, EXPLORE, PLAYFUL
//
// Teddy body language from §11 and the Teddy behavioral engine.

import type { CertificationLevel } from "@/lib/levels/config"

// ── MET Expression Poses ─────────────────────────────────────────

export type METExpression =
  | "caution"    // Hand raised, "hold on" — safety, common mistakes
  | "encourage"  // Thumbs up, leaning forward — positive reinforcement
  | "guide"      // Pointing forward, confident — directing to next concept
  | "explore"    // At whiteboard with diagrams — teaching new concepts
  | "playful"    // Relaxed, smiling — humor, casual interaction
  | "neutral"    // Default resting state

// ── Teddy Body Language ──────────────────────────────────────────

export type TeddyBodyLanguage =
  | "tail_wag"       // Excitement, approval
  | "head_tilt"      // Curiosity
  | "pawing"         // "Look at this!"
  | "sniffing"       // Investigating
  | "barking"        // Alert, celebration
  | "sitting"        // Listening, attentive
  | "paws_over_nose" // Embarrassment (mistake-maker)
  | "spinning"       // Milestone celebration
  | "nudging"        // Encouragement, redirect
  | "standing_proud" // Accomplishment
  | "sleeping"       // Minimal presence — resting nearby
  | "hidden"         // Not visible

// ── Combined Character State ─────────────────────────────────────

export interface CharacterState {
  metExpression:     METExpression
  teddyBodyLanguage: TeddyBodyLanguage
  teddyVisible:      boolean
  animating:         boolean
}

// ── Interaction Context (what triggered the state) ───────────────

export type InteractionContext =
  | "greeting"
  | "teaching"
  | "experiment"
  | "mistake"
  | "achievement"
  | "struggle"
  | "safety"
  | "humor"
  | "factual"
  | "deep_technical"
  | "idle"

// ── Prominence Config ────────────────────────────────────────────

export interface ProminenceConfig {
  teddyScale:    number   // 0.0–1.0, visual size relative to MET
  teddyOpacity:  number   // 0.0–1.0
  teddyPosition: "center" | "side" | "background" | "hidden"
  metScale:      number   // 0.6–1.0
}

export const PROMINENCE_BY_LEVEL: Record<CertificationLevel, ProminenceConfig> = {
  Explorer: {
    teddyScale: 1.0,
    teddyOpacity: 1.0,
    teddyPosition: "center",
    metScale: 0.7,
  },
  Investigator: {
    teddyScale: 0.85,
    teddyOpacity: 1.0,
    teddyPosition: "side",
    metScale: 0.85,
  },
  Innovator: {
    teddyScale: 0.6,
    teddyOpacity: 0.8,
    teddyPosition: "background",
    metScale: 1.0,
  },
  Metrologist: {
    teddyScale: 0.4,
    teddyOpacity: 0.5,
    teddyPosition: "hidden",
    metScale: 1.0,
  },
}
