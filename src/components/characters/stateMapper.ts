// src/components/characters/stateMapper.ts
// Maps interaction context to character expression and body language.
// This is the bridge between the AI engine's Teddy directive and
// the visual rendering.

import type {
  InteractionContext,
  METExpression,
  TeddyBodyLanguage,
  CharacterState,
} from "./types"

// ── Context → Expression mapping ─────────────────────────────────

const MET_EXPRESSION_MAP: Record<InteractionContext, METExpression> = {
  greeting:      "playful",
  teaching:      "explore",
  experiment:    "guide",
  mistake:       "encourage",
  achievement:   "encourage",
  struggle:      "encourage",
  safety:        "caution",
  humor:         "playful",
  factual:       "explore",
  deep_technical: "explore",
  idle:          "neutral",
}

const TEDDY_LANGUAGE_MAP: Record<InteractionContext, TeddyBodyLanguage> = {
  greeting:      "tail_wag",
  teaching:      "head_tilt",
  experiment:    "pawing",
  mistake:       "paws_over_nose",
  achievement:   "spinning",
  struggle:      "nudging",
  safety:        "sitting",
  humor:         "tail_wag",
  factual:       "sitting",
  deep_technical: "sleeping",
  idle:          "sitting",
}

// ── Main mapper ──────────────────────────────────────────────────

/**
 * Produces a CharacterState from the interaction context and
 * whether Teddy should be visible.
 */
export function mapToCharacterState(
  context:      InteractionContext,
  teddyVisible: boolean,
): CharacterState {
  return {
    metExpression:     MET_EXPRESSION_MAP[context],
    teddyBodyLanguage: teddyVisible ? TEDDY_LANGUAGE_MAP[context] : "hidden",
    teddyVisible,
    animating:         false,
  }
}

/**
 * Maps a Teddy engine action string to a TeddyBodyLanguage type.
 * Used when the AI response includes a Teddy directive with a
 * specific action from the behavioral engine.
 */
export function mapTeddyAction(action: string): TeddyBodyLanguage {
  const actionMap: Record<string, TeddyBodyLanguage> = {
    tail_wag:       "tail_wag",
    head_tilt:      "head_tilt",
    pawing:         "pawing",
    sniffing:       "sniffing",
    barking:        "barking",
    sitting:        "sitting",
    paws_over_nose: "paws_over_nose",
    spinning:       "spinning",
    nudging:        "nudging",
    standing_proud: "standing_proud",
  }
  return actionMap[action] ?? "sitting"
}

/**
 * Determines MET's expression from the response content.
 * Simple heuristic — checks for keywords that indicate context.
 */
export function inferContextFromResponse(response: string): InteractionContext {
  const lower = response.toLowerCase()

  if (/\b(careful|safety|caution|adult|supervisor|danger)\b/.test(lower)) return "safety"
  if (/\b(great job|well done|congratulations|earned|badge|celebrate)\b/.test(lower)) return "achievement"
  if (/\b(oops|mistake|paws over|embarrass)\b/.test(lower)) return "mistake"
  if (/\b(experiment|mission|materials|procedure|measure|try this)\b/.test(lower)) return "experiment"
  if (/\b(that'?s tricky|let me help|don'?t worry|confused)\b/.test(lower)) return "struggle"
  if (/\b(joke|pun|ha|funny|laugh)\b/.test(lower)) return "humor"
  if (/\b(hello|hi there|hey|welcome|good morning)\b/.test(lower)) return "greeting"
  if (/\b(per vim|per gum|iso|uncertainty budget|coverage factor|type [ab])\b/.test(lower)) return "deep_technical"

  return "teaching"
}
