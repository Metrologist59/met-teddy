/**
 * MET Character Pose Registry
 *
 * Source art: Canva AI, © 2026 MET Scientia, LLC
 * Spec: MET Brand Ecosystem Profile v2.0 §9.2
 *
 * SVGs served from public/characters/ as static files.
 * Avatars (64px PNGs) served from public/characters/avatars/.
 */

export const MET_POSES = {
  guide:        '/characters/met-guide.svg',
  encourage:    '/characters/met-encourage.svg',
  explore:      '/characters/met-explore.svg',
  caution:      '/characters/met-caution.svg',
  verification: '/characters/met-verification.svg',
  explain:      '/characters/met-explain.svg',
  laughing:     '/characters/met-laughing.svg',
  playful:      '/characters/met-playful.svg',
} as const;

export type METPose = keyof typeof MET_POSES;

export const MET_AVATARS: Record<METPose, string> = {
  guide:        '/characters/avatars/met-guide.png',
  encourage:    '/characters/avatars/met-encourage.png',
  explore:      '/characters/avatars/met-explore.png',
  caution:      '/characters/avatars/met-caution.png',
  verification: '/characters/avatars/met-verification.png',
  explain:      '/characters/avatars/met-explain.png',
  laughing:     '/characters/avatars/met-laughing.png',
  playful:      '/characters/avatars/met-playful.png',
};

/** Default pose when no context is available */
export const MET_DEFAULT_POSE: METPose = 'guide';
