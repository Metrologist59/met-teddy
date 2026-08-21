// src/components/characters/assets.ts
// Asset registry for MET and Teddy character rendering.
// © 2026 MET Scientia, LLC — all character assets are owned IP.

import type { METExpression, TeddyBodyLanguage } from "./types"

export interface AssetEntry {
  type:    "emoji" | "image"
  emoji?:  string
  url?:    string
  alt:     string
  label:   string
  isDuo?:  boolean
}

export const MET_ASSETS: Record<METExpression, AssetEntry> = {
  caution: {
    type: "image",
    url: "/characters/met-caution.svg",
    alt: "MET with hand raised in caution",
    label: "Caution",
  },
  encourage: {
    type: "image",
    url: "/characters/met-encourage.svg",
    alt: "MET giving thumbs up",
    label: "Encourage",
  },
  guide: {
    type: "image",
    url: "/characters/met-guide.svg",
    alt: "MET with caliper, hand open welcoming",
    label: "Guide",
  },
  explore: {
    type: "image",
    url: "/characters/met-explore.svg",
    alt: "MET with Field Guide and caliper ready to explore",
    label: "Explore",
  },
  playful: {
    type: "image",
    url: "/characters/met-laughing.svg",
    alt: "MET laughing and pointing",
    label: "Playful",
  },
  neutral: {
    type: "image",
    url: "/characters/met-teddy.svg",
    alt: "MET and Teddy ready to explore together",
    label: "MET and Teddy",
    isDuo: true,
  },
}

export const TEDDY_ASSETS: Record<TeddyBodyLanguage, AssetEntry> = {
  tail_wag: {
    type: "image",
    url: "/characters/teddy-happy.svg",
    alt: "Teddy wagging his tail excitedly",
    label: "Tail Wag",
  },
  head_tilt: {
    type: "image",
    url: "/characters/teddy-curious.svg",
    alt: "Teddy tilting his head curiously",
    label: "Head Tilt",
  },
  pawing: {
    type: "image",
    url: "/characters/teddy-encourage.svg",
    alt: "Teddy with paw raised",
    label: "Pawing",
  },
  sniffing: {
    type: "image",
    url: "/characters/teddy-explore.svg",
    alt: "Teddy sniffing and exploring",
    label: "Sniffing",
  },
  barking: {
    type: "image",
    url: "/characters/teddy-alert.svg",
    alt: "Teddy barking, ears perked",
    label: "Barking",
  },
  sitting: {
    type: "image",
    url: "/characters/teddy-curious.svg",
    alt: "Teddy sitting attentively",
    label: "Sitting",
  },
  paws_over_nose: {
    type: "image",
    url: "/characters/teddy-confused.svg",
    alt: "Teddy confused, paw to chin",
    label: "Confused",
  },
  spinning: {
    type: "image",
    url: "/characters/teddy-spinning.svg",
    alt: "Teddy spinning in circles with joy",
    label: "Spinning",
  },
  nudging: {
    type: "image",
    url: "/characters/teddy-guide.svg",
    alt: "Teddy trotting forward, nudging along",
    label: "Nudging",
  },
  standing_proud: {
    type: "image",
    url: "/characters/teddy-celebrate.svg",
    alt: "Teddy standing proud, both paws up",
    label: "Standing Proud",
  },
  sleeping: {
    type: "image",
    url: "/characters/teddy-curious.svg",
    alt: "Teddy resting quietly nearby",
    label: "Sleeping",
  },
  hidden: {
    type: "emoji",
    emoji: "",
    alt: "",
    label: "Hidden",
  },
}
