// src/lib/teddy/bodyLanguage.ts
// Body language selection logic for Teddy.
// Teddy communicates exclusively through body language — MET interprets.
// Source: Brand Ecosystem Profile v2.0 §11, character_patterns database.

// ── Types ────────────────────────────────────────────────────────────────────

export type TeddyAction =
  | "tail_wag"       // excitement, approval, recognition
  | "head_tilt"      // curiosity, "tell me more"
  | "pawing"         // "look at this!" — finding things to measure
  | "sniffing"       // investigating, exploring, discovering
  | "barking"        // alert, celebration, surprise
  | "sitting"        // listening, focused, attentive
  | "paws_over_nose" // embarrassment after a mistake
  | "spinning"       // pure excitement, milestone celebration
  | "nudging"        // gentle redirect, encouragement
  | "standing_proud" // confidence, accomplishment

export type TeddyEmotion =
  | "excited"
  | "curious"
  | "proud"
  | "playful"
  | "alert"
  | "embarrassed"
  | "encouraging"
  | "celebrating"

export interface TeddyReaction {
  action:      TeddyAction
  emotion:     TeddyEmotion
  description: string  // What MET would say about Teddy's behavior
}

// ── Reaction library ─────────────────────────────────────────────────────────

const REACTIONS: Record<TeddyAction, TeddyReaction> = {
  tail_wag: {
    action: "tail_wag",
    emotion: "excited",
    description: "Teddy's wagging his tail",
  },
  head_tilt: {
    action: "head_tilt",
    emotion: "curious",
    description: "Teddy just tilted his head",
  },
  pawing: {
    action: "pawing",
    emotion: "playful",
    description: "Teddy's pawing at something",
  },
  sniffing: {
    action: "sniffing",
    emotion: "curious",
    description: "Teddy's sniffing around",
  },
  barking: {
    action: "barking",
    emotion: "alert",
    description: "Teddy just barked",
  },
  sitting: {
    action: "sitting",
    emotion: "encouraging",
    description: "Teddy's sitting quietly, watching you work",
  },
  paws_over_nose: {
    action: "paws_over_nose",
    emotion: "embarrassed",
    description: "Teddy's got his paws over his nose",
  },
  spinning: {
    action: "spinning",
    emotion: "celebrating",
    description: "Teddy's spinning in circles",
  },
  nudging: {
    action: "nudging",
    emotion: "encouraging",
    description: "Teddy's nudging you with his nose",
  },
  standing_proud: {
    action: "standing_proud",
    emotion: "proud",
    description: "Teddy's standing up tall, looking proud",
  },
}

// ── Context-based selection ──────────────────────────────────────────────────

export type QueryContext =
  | "greeting"           // session opener
  | "new_concept"        // learning something new
  | "experiment"         // doing a measurement activity
  | "mistake_correction" // student or Teddy made an error
  | "achievement"        // completed a mission or earned a badge
  | "curiosity"          // student asked an interesting question
  | "struggle"           // student is having difficulty
  | "factual"            // straightforward factual question
  | "deep_technical"     // complex technical topic
  | "fun"                // playful interaction

/**
 * Selects the most appropriate Teddy body language for the given
 * query context. Returns a ranked list — the engine picks the top
 * one or skips Teddy if prominence rules say so.
 */
export function selectBodyLanguage(context: QueryContext): TeddyReaction[] {
  switch (context) {
    case "greeting":
      return [REACTIONS.tail_wag, REACTIONS.barking, REACTIONS.spinning]

    case "new_concept":
      return [REACTIONS.head_tilt, REACTIONS.sniffing, REACTIONS.pawing]

    case "experiment":
      return [REACTIONS.pawing, REACTIONS.sniffing, REACTIONS.tail_wag]

    case "mistake_correction":
      return [REACTIONS.paws_over_nose, REACTIONS.nudging, REACTIONS.head_tilt]

    case "achievement":
      return [REACTIONS.spinning, REACTIONS.barking, REACTIONS.standing_proud]

    case "curiosity":
      return [REACTIONS.head_tilt, REACTIONS.tail_wag, REACTIONS.sniffing]

    case "struggle":
      return [REACTIONS.nudging, REACTIONS.sitting, REACTIONS.tail_wag]

    case "factual":
      return [REACTIONS.sitting, REACTIONS.head_tilt]

    case "deep_technical":
      return [REACTIONS.sitting]

    case "fun":
      return [REACTIONS.tail_wag, REACTIONS.spinning, REACTIONS.barking]
  }
}
