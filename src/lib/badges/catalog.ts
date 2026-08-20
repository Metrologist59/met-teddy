// src/lib/badges/catalog.ts
// Badge catalog — all badge definitions for MET and Teddy.
// © 2026 MET Scientia, LLC
//
// Badge categories:
//   mission       — complete a Field Mission with notebook entry
//   domain        — complete all missions in a measurement domain
//   notebook      — notebook quality and consistency milestones
//   certification — complete all requirements for a certification level
//   special       — streaks, milestones, achievements

import type { CertificationLevel } from "@/lib/levels/config"

// ── Types ────────────────────────────────────────────────────────

export interface BadgeDefinition {
  slug:        string
  name:        string
  description: string
  category:    "mission" | "domain" | "notebook" | "certification" | "special"
  certLevel?:  CertificationLevel
  domain?:     string
  missionSlug?: string
  icon:        string
  criteria:    CriterionDef[]
}

export interface CriterionDef {
  type:         string
  targetValue:  number
  targetSlug?:  string
  description:  string
}

export interface EarnedBadge {
  id:        string
  badgeId:   string
  studentId: string
  earnedAt:  string
  evidence?: Record<string, unknown>
}

export interface BadgeProgress {
  badgeId:      string
  currentValue: number
  targetValue:  number
  percentage:   number
}

// ── Badge catalog ────────────────────────────────────────────────

export const BADGE_CATALOG: BadgeDefinition[] = [
  // ── EXPLORER mission badges ────────────────────────────────────
  { slug: "explorer-measure-teddy",     name: "Teddy Measured!",       description: "Measured Teddy and recorded it in your notebook.", category: "mission", certLevel: "Explorer", missionSlug: "measure-teddy",         icon: "🐕", criteria: [{ type: "mission_with_notebook", targetValue: 1, targetSlug: "measure-teddy", description: "Complete Measure Teddy with a notebook entry" }] },
  { slug: "explorer-heavy-or-light",    name: "Weight Watcher",        description: "Sorted objects by weight — lightest to heaviest.", category: "mission", certLevel: "Explorer", missionSlug: "heavy-or-light",        icon: "⚖️", criteria: [{ type: "mission_with_notebook", targetValue: 1, targetSlug: "heavy-or-light", description: "Complete Heavy or Light with a notebook entry" }] },
  { slug: "explorer-hot-cold-warm",     name: "Temperature Tester",    description: "Measured temperatures and found the warmest.",     category: "mission", certLevel: "Explorer", missionSlug: "hot-cold-warm",         icon: "🌡️", criteria: [{ type: "mission_with_notebook", targetValue: 1, targetSlug: "hot-cold-warm", description: "Complete Hot, Cold, Warm with a notebook entry" }] },
  { slug: "explorer-how-long",          name: "Time Keeper",           description: "Timed three activities and found the fastest.",     category: "mission", certLevel: "Explorer", missionSlug: "how-long-does-it-take", icon: "⏱️", criteria: [{ type: "mission_with_notebook", targetValue: 1, targetSlug: "how-long-does-it-take", description: "Complete How Long Does It Take with a notebook entry" }] },
  { slug: "explorer-fill-it-up",        name: "Volume Victor",         description: "Measured volume by counting cups.",                category: "mission", certLevel: "Explorer", missionSlug: "fill-it-up",            icon: "🥤", criteria: [{ type: "mission_with_notebook", targetValue: 1, targetSlug: "fill-it-up", description: "Complete Fill It Up with a notebook entry" }] },
  { slug: "explorer-zero-check",        name: "Zero Hero",             description: "Learned why zero check matters.",                  category: "mission", certLevel: "Explorer", missionSlug: "zero-check",            icon: "0️⃣", criteria: [{ type: "mission_with_notebook", targetValue: 1, targetSlug: "zero-check", description: "Complete Zero Check with a notebook entry" }] },

  // ── DOMAIN badges (Explorer) ───────────────────────────────────
  { slug: "explorer-domain-length",     name: "Length Explorer",       description: "Completed all length missions at Explorer level.", category: "domain", certLevel: "Explorer", domain: "length",      icon: "📏", criteria: [{ type: "domain_missions_all", targetValue: 3, targetSlug: "length", description: "Complete all Explorer length missions" }] },
  { slug: "explorer-domain-mass",       name: "Mass Explorer",         description: "Completed all mass missions at Explorer level.",   category: "domain", certLevel: "Explorer", domain: "mass",        icon: "⚖️", criteria: [{ type: "domain_missions_all", targetValue: 1, targetSlug: "mass", description: "Complete all Explorer mass missions" }] },
  { slug: "explorer-domain-temperature",name: "Temperature Explorer",  description: "Completed all temperature missions.",              category: "domain", certLevel: "Explorer", domain: "temperature", icon: "🌡️", criteria: [{ type: "domain_missions_all", targetValue: 1, targetSlug: "temperature", description: "Complete all Explorer temperature missions" }] },

  // ── NOTEBOOK badges ────────────────────────────────────────────
  { slug: "first-entry",           name: "First Entry!",          description: "Created your first notebook entry.",            category: "notebook", icon: "📓", criteria: [{ type: "notebook_entry_count", targetValue: 1, description: "Create 1 notebook entry" }] },
  { slug: "five-entries",          name: "Data Collector",        description: "Five notebook entries — you're building a record!", category: "notebook", icon: "📊", criteria: [{ type: "notebook_entry_count", targetValue: 5, description: "Create 5 notebook entries" }] },
  { slug: "ten-entries",           name: "Dedicated Documenter",  description: "Ten entries. Real scientists keep records like this.", category: "notebook", icon: "📚", criteria: [{ type: "notebook_entry_count", targetValue: 10, description: "Create 10 notebook entries" }] },
  { slug: "twenty-five-entries",   name: "Master Recorder",       description: "Twenty-five entries. Your notebook is a real data set.", category: "notebook", icon: "🏆", criteria: [{ type: "notebook_entry_count", targetValue: 25, description: "Create 25 notebook entries" }] },
  { slug: "reflective-scientist",  name: "Reflective Scientist",  description: "Completed reflections in 5 entries.",           category: "notebook", icon: "💭", criteria: [{ type: "notebook_reflection", targetValue: 5, description: "Complete reflections in 5 entries" }] },
  { slug: "hundred-readings",      name: "100 Readings",          description: "Recorded 100 total measurements. Precision takes practice!", category: "notebook", icon: "📈", criteria: [{ type: "readings_count", targetValue: 100, description: "Record 100 total measurement readings" }] },

  // ── STREAK badges ──────────────────────────────────────────────
  { slug: "three-day-streak",  name: "3-Day Streak",   description: "Notebook entries three days in a row!",     category: "special", icon: "🔥", criteria: [{ type: "streak_days", targetValue: 3, description: "3 consecutive days with entries" }] },
  { slug: "seven-day-streak",  name: "Week Warrior",   description: "A full week of measurement. Impressive!",   category: "special", icon: "⚡", criteria: [{ type: "streak_days", targetValue: 7, description: "7 consecutive days with entries" }] },

  // ── CERTIFICATION badges ───────────────────────────────────────
  { slug: "certified-explorer",     name: "Certified Explorer",     description: "Completed all Explorer requirements. You are a certified MET Explorer!", category: "certification", certLevel: "Explorer",     icon: "🌟", criteria: [{ type: "level_badges_all", targetValue: 1, targetSlug: "Explorer", description: "Earn all Explorer mission and domain badges" }] },
  { slug: "certified-investigator", name: "Certified Investigator", description: "Completed all Investigator requirements. Certified MET Investigator!",  category: "certification", certLevel: "Investigator", icon: "🔬", criteria: [{ type: "level_badges_all", targetValue: 1, targetSlug: "Investigator", description: "Earn all Investigator mission and domain badges" }] },
  { slug: "certified-innovator",    name: "Certified Innovator",    description: "Completed all Innovator requirements. Certified MET Innovator!",        category: "certification", certLevel: "Innovator",    icon: "💡", criteria: [{ type: "level_badges_all", targetValue: 1, targetSlug: "Innovator", description: "Earn all Innovator mission and domain badges" }] },
  { slug: "certified-metrologist",  name: "Certified Metrologist",  description: "Completed all Metrologist requirements. You are a Certified MET Metrologist.", category: "certification", certLevel: "Metrologist",  icon: "🎓", criteria: [{ type: "level_badges_all", targetValue: 1, targetSlug: "Metrologist", description: "Earn all Metrologist mission and domain badges" }] },
]

// ── Helpers ──────────────────────────────────────────────────────

export function getBadgesByLevel(level: CertificationLevel): BadgeDefinition[] {
  return BADGE_CATALOG.filter(b => !b.certLevel || b.certLevel === level)
}

export function getBadgesByCategory(category: BadgeDefinition["category"]): BadgeDefinition[] {
  return BADGE_CATALOG.filter(b => b.category === category)
}

export function getBadgeBySlug(slug: string): BadgeDefinition | undefined {
  return BADGE_CATALOG.find(b => b.slug === slug)
}
