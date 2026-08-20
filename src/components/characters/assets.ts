// src/components/characters/assets.ts
// Asset registry for MET and Teddy character rendering.
// © 2026 MET Scientia, LLC — all character assets are owned IP.
//
// PLACEHOLDER: Uses emoji representations until illustrated assets
// are delivered. When real art is ready, update the URL fields and
// set `type: "image"`. Zero code changes elsewhere.

import type { METExpression, TeddyBodyLanguage } from "./types"

interface AssetEntry {
  type:    "emoji" | "image"
  emoji?:  string
  url?:    string        // path to illustrated asset
  alt:     string
  label:   string        // human-readable name
}

// ── MET Expression Assets ────────────────────────────────────────

export const MET_ASSETS: Record<METExpression, AssetEntry> = {
  caution: {
    type: "emoji",
    emoji: "✋",
    alt: "MET with hand raised in caution",
    label: "Caution",
  },
  encourage: {
    type: "emoji",
    emoji: "👍",
    alt: "MET giving thumbs up",
    label: "Encourage",
  },
  guide: {
    type: "emoji",
    emoji: "👉",
    alt: "MET pointing forward",
    label: "Guide",
  },
  explore: {
    type: "emoji",
    emoji: "🔬",
    alt: "MET at whiteboard with diagrams",
    label: "Explore",
  },
  playful: {
    type: "emoji",
    emoji: "😄",
    alt: "MET smiling, relaxed",
    label: "Playful",
  },
  neutral: {
    type: "emoji",
    emoji: "🧑‍🔬",
    alt: "MET in default pose",
    label: "Neutral",
  },
}

// ── Teddy Body Language Assets ───────────────────────────────────

export const TEDDY_ASSETS: Record<TeddyBodyLanguage, AssetEntry> = {
  tail_wag: {
    type: "emoji",
    emoji: "🐕",
    alt: "Teddy wagging his tail",
    label: "Tail Wag",
  },
  head_tilt: {
    type: "emoji",
    emoji: "🐶",
    alt: "Teddy tilting his head",
    label: "Head Tilt",
  },
  pawing: {
    type: "emoji",
    emoji: "🐾",
    alt: "Teddy pawing at something",
    label: "Pawing",
  },
  sniffing: {
    type: "emoji",
    emoji: "👃",
    alt: "Teddy sniffing around",
    label: "Sniffing",
  },
  barking: {
    type: "emoji",
    emoji: "🐕‍🦺",
    alt: "Teddy barking excitedly",
    label: "Barking",
  },
  sitting: {
    type: "emoji",
    emoji: "🦮",
    alt: "Teddy sitting attentively",
    label: "Sitting",
  },
  paws_over_nose: {
    type: "emoji",
    emoji: "🙈",
    alt: "Teddy covering his nose with paws",
    label: "Embarrassed",
  },
  spinning: {
    type: "emoji",
    emoji: "💫",
    alt: "Teddy spinning in circles",
    label: "Spinning",
  },
  nudging: {
    type: "emoji",
    emoji: "🐕",
    alt: "Teddy nudging with nose",
    label: "Nudging",
  },
  standing_proud: {
    type: "emoji",
    emoji: "🏆",
    alt: "Teddy standing tall and proud",
    label: "Standing Proud",
  },
  sleeping: {
    type: "emoji",
    emoji: "😴",
    alt: "Teddy sleeping nearby",
    label: "Sleeping",
  },
  hidden: {
    type: "emoji",
    emoji: "",
    alt: "",
    label: "Hidden",
  },
}
