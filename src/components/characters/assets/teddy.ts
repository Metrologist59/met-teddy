/**
 * Teddy Character Pose Registry
 *
 * Source art: Canva AI, © 2026 MET Scientia, LLC
 * Spec: MET Brand Ecosystem Profile v2.0 §10, §10.1
 *
 * SVGs served from public/characters/ as static files.
 * Avatars (64px PNGs) served from public/characters/avatars/.
 */

export const TEDDY_POSES = {
  curious:    '/characters/teddy-curious.svg',
  happy:      '/characters/teddy-happy.svg',
  alert:      '/characters/teddy-alert.svg',
  confused:   '/characters/teddy-confused.svg',
  celebrate:  '/characters/teddy-celebrate.svg',
  guide:      '/characters/teddy-guide.svg',
  explore:    '/characters/teddy-explore.svg',
  encourage:  '/characters/teddy-encourage.svg',
  jumping:    '/characters/teddy-jumping.svg',
  spinning:   '/characters/teddy-spinning.svg',
} as const;

export type TeddyPose = keyof typeof TEDDY_POSES;

export const TEDDY_AVATARS: Record<TeddyPose, string> = {
  curious:    '/characters/avatars/teddy-curious.png',
  happy:      '/characters/avatars/teddy-happy.png',
  alert:      '/characters/avatars/teddy-alert.png',
  confused:   '/characters/avatars/teddy-confused.png',
  celebrate:  '/characters/avatars/teddy-celebrate.png',
  guide:      '/characters/avatars/teddy-guide.png',
  explore:    '/characters/avatars/teddy-explore.png',
  encourage:  '/characters/avatars/teddy-encourage.png',
  jumping:    '/characters/avatars/teddy-jumping.png',
  spinning:   '/characters/avatars/teddy-spinning.png',
};

/** Default pose when no context is available */
export const TEDDY_DEFAULT_POSE: TeddyPose = 'curious';
