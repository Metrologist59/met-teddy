/**
 * Character State Mapper
 *
 * Maps AI response context to MET and Teddy expression poses.
 * Teddy prominence scales inversely with certification level (§11.3).
 *
 * MET Brand Ecosystem Profile v2.0 §10.1 (Teddy body language),
 * §11 (duo dynamic), §8.8 (level adaptation).
 */

import { type METPose, MET_DEFAULT_POSE } from './assets/met';
import { type TeddyPose, TEDDY_DEFAULT_POSE } from './assets/teddy';

export type ResponseType =
  | 'greeting'
  | 'teaching'
  | 'feedback'
  | 'mission'
  | 'safety'
  | 'humor'
  | 'verification'
  | 'explanation'
  | 'celebration'
  | 'error'
  | 'notebook'
  | 'badge';

export type Sentiment = 'positive' | 'neutral' | 'cautious';

export type CertificationLevel = 'explorer' | 'investigator' | 'innovator' | 'metrologist';

export interface ResponseContext {
  type: ResponseType;
  sentiment: Sentiment;
  level: CertificationLevel;
}

/** Map AI response context → MET pose */
export function mapMETPose(ctx: ResponseContext): METPose {
  switch (ctx.type) {
    case 'greeting':
      return 'guide';
    case 'teaching':
      return 'explain';
    case 'feedback':
      return ctx.sentiment === 'positive' ? 'encourage' : 'guide';
    case 'mission':
      return 'explore';
    case 'safety':
      return 'caution';
    case 'humor':
      return 'playful';
    case 'verification':
      return 'verification';
    case 'explanation':
      return 'explain';
    case 'celebration':
      return 'laughing';
    case 'error':
      return 'caution';
    case 'notebook':
      return 'explain';
    case 'badge':
      return 'encourage';
    default:
      return MET_DEFAULT_POSE;
  }
}

/** Map AI response context → Teddy pose */
export function mapTeddyPose(ctx: ResponseContext): TeddyPose {
  switch (ctx.type) {
    case 'greeting':
      return 'encourage';
    case 'teaching':
      return 'guide';
    case 'feedback':
      return ctx.sentiment === 'positive' ? 'happy' : 'curious';
    case 'mission':
      return 'explore';
    case 'safety':
      return 'alert';
    case 'humor':
      return 'spinning';
    case 'verification':
      return 'curious';
    case 'explanation':
      return 'guide';
    case 'celebration':
      return 'celebrate';
    case 'error':
      return 'confused';
    case 'notebook':
      return 'curious';
    case 'badge':
      return 'jumping';
    default:
      return TEDDY_DEFAULT_POSE;
  }
}

/**
 * Teddy prominence by certification level (§11.3).
 *
 * Returns a scale factor (0–1) and whether Teddy should appear at all.
 *
 *   Explorer:     1.0 — Teddy IS the experiment
 *   Investigator: 0.8 — Active, sniffs out things to measure
 *   Innovator:    0.4 — Selective, warm openers and milestones
 *   Metrologist:  0.1 — Minimal, occasional cameo
 */
export function teddyProminence(level: CertificationLevel): {
  scale: number;
  visible: boolean;
  showInChat: boolean;
} {
  switch (level) {
    case 'explorer':
      return { scale: 1.0, visible: true, showInChat: true };
    case 'investigator':
      return { scale: 0.8, visible: true, showInChat: true };
    case 'innovator':
      return { scale: 0.4, visible: true, showInChat: false };
    case 'metrologist':
      return { scale: 0.1, visible: false, showInChat: false };
    default:
      return { scale: 1.0, visible: true, showInChat: true };
  }
}

/**
 * Select the Teddy celebration pose based on achievement magnitude.
 * Badge earned → jumping; mission complete → celebrate; correct answer → happy.
 */
export function mapCelebrationPose(
  achievement: 'badge' | 'mission' | 'correct' | 'milestone'
): TeddyPose {
  switch (achievement) {
    case 'badge':     return 'jumping';
    case 'milestone': return 'jumping';
    case 'mission':   return 'celebrate';
    case 'correct':   return 'happy';
    default:          return 'celebrate';
  }
}
/**
 * Infer a response context label from AI response text.
 * Used by MessageBubble to drive inline pose selection.
 */
export function inferContextFromResponse(
  message: string
): 'achievement' | 'mistake' | 'greeting' | 'experiment' | 'struggle' | 'safety' | 'humor' | 'teaching' {
  if (/great job|well done|excellent|that'?s right|correct|perfect|congratulations|badge|earned/i.test(message)) {
    return 'achievement';
  }
  if (/careful|safety|warning|caution|be sure to|don'?t forget|important/i.test(message)) {
    return 'safety';
  }
  if (/not quite|try again|almost|oops|let'?s look at that again|hmm/i.test(message)) {
    return 'mistake';
  }
  if (/welcome|hello|hi there|hey\b|good morning|good afternoon/i.test(message)) {
    return 'greeting';
  }
  if (/field mission|let'?s explore|let'?s measure|experiment|adventure|quest|let'?s try/i.test(message)) {
    return 'experiment';
  }
  if (/stuck|confused|tricky|take a step back|simpler|break it down/i.test(message)) {
    return 'struggle';
  }
  if (/ha!|haha|joke|pun|funny|get it\?|caliper walked into/i.test(message)) {
    return 'humor';
  }
  return 'teaching';
}
/**
 * Map a context label + Teddy visibility → character panel state.
 * Used by CharacterPanel and integration tests.
 */
export function mapToCharacterState(
  context: string,
  teddyVisible: boolean
): { metExpression: string; teddyBodyLanguage: string } {
  let metExpression: string;
  let teddyBodyLanguage: string;

  switch (context) {
    case 'greeting':
      metExpression = 'playful';
      teddyBodyLanguage = 'tail_wag';
      break;
    case 'safety':
      metExpression = 'caution';
      teddyBodyLanguage = 'alert';
      break;
    case 'achievement':
      metExpression = 'encourage';
      teddyBodyLanguage = 'spinning';
      break;
    case 'experiment':
      metExpression = 'guide';
      teddyBodyLanguage = 'pawing';
      break;
    case 'mistake':
      metExpression = 'explain';
      teddyBodyLanguage = 'paws_over_nose';
      break;
    case 'struggle':
      metExpression = 'explain';
      teddyBodyLanguage = 'nudging';
      break;
    case 'humor':
      metExpression = 'playful';
      teddyBodyLanguage = 'spinning';
      break;
    default:
      metExpression = 'explore';
      teddyBodyLanguage = 'sitting';
      break;
  }

  if (!teddyVisible) {
    teddyBodyLanguage = 'hidden';
  }

  return { metExpression, teddyBodyLanguage };
}

/**
 * Validate and map a Teddy body language action.
 * Returns the action if known, "sitting" as fallback.
 */
const KNOWN_TEDDY_ACTIONS = new Set([
  'tail_wag', 'head_tilt', 'pawing', 'sniffing', 'barking',
  'sitting', 'paws_over_nose', 'spinning', 'nudging', 'alert',
  'hidden',
]);

export function mapTeddyAction(action: string): string {
  return KNOWN_TEDDY_ACTIONS.has(action) ? action : 'sitting';
}

/**
 * Character prominence by certification level (§11.3).
 * Teddy prominence descends, MET prominence ascends.
 */
export const PROMINENCE_BY_LEVEL: Record<string, {
  teddyPosition: string;
  teddyScale: number;
  metScale: number;
}> = {
  Explorer:     { teddyPosition: 'center',    teddyScale: 1.0, metScale: 0.6 },
  Investigator: { teddyPosition: 'side',      teddyScale: 0.8, metScale: 0.7 },
  Innovator:    { teddyPosition: 'background', teddyScale: 0.4, metScale: 0.9 },
  Metrologist:  { teddyPosition: 'hidden',    teddyScale: 0.0, metScale: 1.0 },
};