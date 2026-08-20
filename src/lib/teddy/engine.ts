// src/lib/teddy/engine.ts
// Teddy Behavioral Engine for MET and Teddy.
//
// The engine decides:
//   1. Should Teddy appear in this response? (relevance scoring)
//   2. If yes, what body language is appropriate?
//   3. Is this a good moment for the mistake-maker pattern?
//   4. Did the student address Teddy directly?
//
// Produces a TeddyDirective that gets injected into the system prompt
// context layer, giving the LLM structured guidance for Teddy's role
// in this specific response.
//
// The engine does NOT generate Teddy's words (Teddy never talks).
// It decides what Teddy DOES, and MET interprets.

import type { CertificationLevel } from "@/lib/levels/config"
import { selectBodyLanguage, type QueryContext, type TeddyReaction } from "./bodyLanguage"
import {
  isAddressingTeddy,
  selectMistake,
  buildTalksToTeddyDirective,
  buildMistakeMakerDirective,
  type TeddyInteractionDirective,
} from "./patterns"

// ── Types ────────────────────────────────────────────────────────────────────

export type TeddyProminence = "central" | "active" | "selective" | "minimal"

export interface TeddyDirective {
  shouldAppear:  boolean
  prominence:    TeddyProminence
  reaction:      TeddyReaction | null
  interaction:   TeddyInteractionDirective | null
  promptBlock:   string  // The text injected into the context layer
}

// ── Prominence thresholds ────────────────────────────────────────────────────
// At each prominence level, Teddy appears with a different probability
// based on the query context. These thresholds determine the baseline
// appearance rate — the engine always includes Teddy when specifically
// addressed or when the mistake-maker pattern fires.

const PROMINENCE_CONFIG: Record<TeddyProminence, {
  baseAppearanceRate: number   // 0.0–1.0, probability of appearing
  mistakeMakerRate:   number   // probability of triggering mistake-maker
  skipContexts:       QueryContext[]  // contexts where Teddy is suppressed
}> = {
  central: {
    baseAppearanceRate: 0.90,
    mistakeMakerRate:   0.20,
    skipContexts:       [],  // Teddy appears in almost everything
  },
  active: {
    baseAppearanceRate: 0.70,
    mistakeMakerRate:   0.15,
    skipContexts:       ["deep_technical"],
  },
  selective: {
    baseAppearanceRate: 0.30,
    mistakeMakerRate:   0.08,
    skipContexts:       ["deep_technical", "factual"],
  },
  minimal: {
    baseAppearanceRate: 0.10,
    mistakeMakerRate:   0.03,
    skipContexts:       ["deep_technical", "factual", "new_concept", "experiment"],
  },
}

// ── Query context classification ─────────────────────────────────────────────

/**
 * Classifies the student's message into a query context for body
 * language selection and appearance decisions.
 */
export function classifyQueryContext(message: string): QueryContext {
  const lower = message.toLowerCase()

  // Greeting patterns
  if (/^(hi|hello|hey|good morning|good afternoon|what'?s up)/.test(lower)) {
    return "greeting"
  }

  // Achievement / completion
  if (/\b(finished|completed|done|earned|got the badge|passed)\b/.test(lower)) {
    return "achievement"
  }

  // Experiment / measurement activity
  if (/\b(measure|experiment|mission|lab|procedure|how do i|steps|materials)\b/.test(lower)) {
    return "experiment"
  }

  // Struggle / confusion
  if (/\b(confused|don'?t understand|help|stuck|wrong|doesn'?t make sense|hard)\b/.test(lower)) {
    return "struggle"
  }

  // Fun / playful
  if (/\b(fun|cool|awesome|joke|funny|play|game)\b/.test(lower)) {
    return "fun"
  }

  // Deep technical (VIM, GUM, ISO, uncertainty budgets)
  if (/\b(vim|gum|iso|17025|uncertainty budget|type a|type b|coverage factor|welch.satterthwaite|degrees of freedom)\b/.test(lower)) {
    return "deep_technical"
  }

  // Mistake / error correction
  if (/\b(mistake|error|wrong|incorrect|fix|oops)\b/.test(lower)) {
    return "mistake_correction"
  }

  // Curiosity (why, how, what if)
  if (/^(why|how|what if|what would happen|i wonder)\b/.test(lower)) {
    return "curiosity"
  }

  // Default: new concept or factual
  if (/^(what is|what are|what does|define|explain|tell me about)\b/.test(lower)) {
    return "new_concept"
  }

  return "factual"
}

// ── Main engine ──────────────────────────────────────────────────────────────

/**
 * The main Teddy behavioral engine. Analyzes the query, determines
 * whether and how Teddy should participate, and produces a directive
 * for the LLM.
 *
 * Call this BEFORE invoking the agent. The returned promptBlock gets
 * appended to the context layer of the system prompt.
 */
export function teddyEngine(
  message:    string,
  level:      CertificationLevel,
  prominence: TeddyProminence,
): TeddyDirective {
  const config = PROMINENCE_CONFIG[prominence]
  const context = classifyQueryContext(message)

  // ── Priority 1: Student is talking to Teddy ──────────────────────────
  if (isAddressingTeddy(message)) {
    const reactions = selectBodyLanguage("curiosity")
    const reaction = reactions[0]
    const interaction = buildTalksToTeddyDirective(message)

    return {
      shouldAppear: true,
      prominence,
      reaction,
      interaction,
      promptBlock: interaction.instruction,
    }
  }

  // ── Priority 2: Check if this context is suppressed ──────────────────
  if (config.skipContexts.includes(context)) {
    return {
      shouldAppear: false,
      prominence,
      reaction:     null,
      interaction:  null,
      promptBlock:  "TEDDY: Not present in this response — let MET handle this directly.",
    }
  }

  // ── Priority 3: Mistake-maker pattern ────────────────────────────────
  // Fires randomly based on the prominence level's rate, but only for
  // appropriate contexts (experiment, new_concept, factual).
  const mistakeContexts: QueryContext[] = ["experiment", "new_concept", "factual"]
  if (
    mistakeContexts.includes(context) &&
    Math.random() < config.mistakeMakerRate
  ) {
    const mistake = selectMistake(level)
    if (mistake) {
      const interaction = buildMistakeMakerDirective(mistake)
      const reaction = selectBodyLanguage("mistake_correction")[0]
      return {
        shouldAppear: true,
        prominence,
        reaction,
        interaction,
        promptBlock: interaction.instruction,
      }
    }
  }

  // ── Priority 4: Standard appearance decision ─────────────────────────
  const shouldAppear = Math.random() < config.baseAppearanceRate

  if (!shouldAppear) {
    return {
      shouldAppear: false,
      prominence,
      reaction:     null,
      interaction:  null,
      promptBlock:  "TEDDY: Not present in this response.",
    }
  }

  // ── Teddy appears: select body language ──────────────────────────────
  const reactions = selectBodyLanguage(context)
  const reaction = reactions[0]

  const promptBlock = [
    `TEDDY: Present in this response.`,
    `Suggested reaction: ${reaction.description} — ${reaction.emotion}.`,
    `Teddy prominence for this level: ${prominence}.`,
    prominence === "central"
      ? "Teddy should be a major part of this response — open with him, use him as an example or measurement subject."
      : prominence === "active"
      ? "Include Teddy naturally — a reaction, a discovery, a moment. He's part of the conversation but not the center."
      : prominence === "selective"
      ? "A brief Teddy moment if it fits naturally — a warm opener or a quick reaction. Keep it light."
      : "Teddy is minimal at this level. A brief mention at most — a tail wag at a milestone. Most responses are just MET and the student.",
  ].join("\n")

  return {
    shouldAppear: true,
    prominence,
    reaction,
    interaction: null,
    promptBlock,
  }
}
