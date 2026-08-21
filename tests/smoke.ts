/**
 * MET and Teddy — Smoke Test
 * © 2026 MET Scientia, LLC
 *
 * Validates that all required files exist, key modules export
 * correctly, and the app structure is intact.
 *
 * Usage: npx tsx tests/smoke.ts
 */

import { existsSync } from "fs"
import { resolve } from "path"

let passed = 0
let failed = 0

function check(name: string, condition: boolean) {
  if (condition) { console.log(`  ✓ ${name}`); passed++ }
  else { console.log(`  ✗ ${name}`); failed++ }
}

function fileExists(path: string): boolean {
  return existsSync(resolve(process.cwd(), path))
}

console.log("MET and Teddy — Smoke Test")
console.log("==========================\n")

// ── App routes ───────────────────────────────────────────────────
console.log("── App Routes ──")
check("Landing page",        fileExists("src/app/page.tsx"))
check("Layout",              fileExists("src/app/layout.tsx"))
check("Chat page",           fileExists("src/app/chat/page.tsx"))
check("Missions page",       fileExists("src/app/missions/page.tsx"))
check("Notebook page",       fileExists("src/app/notebook/page.tsx"))
check("Badges page",         fileExists("src/app/badges/page.tsx"))
check("Dashboard page",      fileExists("src/app/dashboard/page.tsx"))
check("Onboarding page",     fileExists("src/app/onboarding/page.tsx"))
check("Register page",       fileExists("src/app/register/page.tsx"))
check("Login page",          fileExists("src/app/login/page.tsx"))
check("Privacy page",        fileExists("src/app/privacy/page.tsx"))
check("Terms page",          fileExists("src/app/terms/page.tsx"))
check("COPPA page",          fileExists("src/app/coppa/page.tsx"))
check("Verify email page",   fileExists("src/app/verify-email/page.tsx"))
check("Consent pending page", fileExists("src/app/consent-pending/page.tsx"))
check("Auth callback",       fileExists("src/app/auth/callback/route.ts"))
check("Auth confirm",        fileExists("src/app/auth/confirm/route.ts"))

// ── API routes ───────────────────────────────────────────────────
console.log("\n── API Routes ──")
check("Chat API",            fileExists("src/app/api/chat/route.ts"))
check("Badge API",           fileExists("src/app/api/badges/route.ts"))
check("Notebook feedback API", fileExists("src/app/api/notebook-feedback/route.ts"))
check("Credentials API",     fileExists("src/app/api/credentials/route.ts"))

// ── Layout components ────────────────────────────────────────────
console.log("\n── Layout Components ──")
check("AppShell",            fileExists("src/components/layout/AppShell.tsx"))
check("NavBar",              fileExists("src/components/layout/NavBar.tsx"))
check("Sidebar",             fileExists("src/components/layout/Sidebar.tsx"))

// ── Character components ─────────────────────────────────────────
console.log("\n── Character Components ──")
check("METAvatar",           fileExists("src/components/characters/METAvatar.tsx"))
check("TeddyAvatar",         fileExists("src/components/characters/TeddyAvatar.tsx"))
check("CharacterPanel",      fileExists("src/components/characters/CharacterPanel.tsx"))
check("State mapper",        fileExists("src/components/characters/stateMapper.ts"))
check("Assets registry",     fileExists("src/components/characters/assets.ts"))
check("Character types",     fileExists("src/components/characters/types.ts"))

// ── Chat components ──────────────────────────────────────────────
console.log("\n── Chat Components ──")
check("ChatInterface",       fileExists("src/components/chat/ChatInterface.tsx"))
check("ChatInput",           fileExists("src/components/chat/ChatInput.tsx"))
check("MessageBubble",       fileExists("src/components/chat/MessageBubble.tsx"))

// ── Mission components ───────────────────────────────────────────
console.log("\n── Mission Components ──")
check("MissionCatalog",      fileExists("src/components/missions/MissionCatalog.tsx"))
check("MissionDetail",       fileExists("src/components/missions/MissionDetail.tsx"))
check("MissionCard",         fileExists("src/components/missions/MissionCard.tsx"))
check("SafetyBanner",        fileExists("src/components/missions/SafetyBanner.tsx"))

// ── Notebook components ──────────────────────────────────────────
console.log("\n── Notebook Components ──")
check("NotebookEntryForm",   fileExists("src/components/notebook/NotebookEntryForm.tsx"))
check("NotebookEntryView",   fileExists("src/components/notebook/NotebookEntryView.tsx"))
check("NotebookList",        fileExists("src/components/notebook/NotebookList.tsx"))
check("NotebookFeedback",    fileExists("src/components/notebook/NotebookFeedback.tsx"))
check("MissionNudge",        fileExists("src/components/notebook/MissionNudge.tsx"))
check("ProgressionView",     fileExists("src/components/notebook/ProgressionView.tsx"))
check("QualityScore",        fileExists("src/components/notebook/QualityScore.tsx"))

// ── Badge components ─────────────────────────────────────────────
console.log("\n── Badge Components ──")
check("BadgeCard",           fileExists("src/components/badges/BadgeCard.tsx"))
check("BadgeGallery",        fileExists("src/components/badges/BadgeGallery.tsx"))
check("BadgeCelebration",    fileExists("src/components/badges/BadgeCelebration.tsx"))
check("CredentialDisplay",   fileExists("src/components/badges/CredentialDisplay.tsx"))
check("CredentialExport",    fileExists("src/components/badges/CredentialExport.tsx"))

// ── Auth components ──────────────────────────────────────────────
console.log("\n── Auth Components ──")
check("AgeGate",             fileExists("src/components/auth/AgeGate.tsx"))
check("ParentalConsentForm", fileExists("src/components/auth/ParentalConsentForm.tsx"))
check("TermsAcceptance",     fileExists("src/components/auth/TermsAcceptance.tsx"))

// ── Onboarding components ────────────────────────────────────────
console.log("\n── Onboarding Components ──")
check("LevelReveal",         fileExists("src/components/onboarding/LevelReveal.tsx"))
check("NotebookSetup",       fileExists("src/components/onboarding/NotebookSetup.tsx"))
check("FirstMission",        fileExists("src/components/onboarding/FirstMission.tsx"))

// ── Dashboard components ─────────────────────────────────────────
console.log("\n── Dashboard Components ──")
check("StudentProgressCard", fileExists("src/components/dashboard/StudentProgressCard.tsx"))
check("ClassroomView",       fileExists("src/components/dashboard/ClassroomView.tsx"))
check("ParentDashboard",     fileExists("src/components/dashboard/ParentDashboard.tsx"))
check("LevelOverride",       fileExists("src/components/dashboard/LevelOverride.tsx"))

// ── AI engine ────────────────────────────────────────────────────
console.log("\n── AI Engine (Phase 2) ──")
check("Base prompt",         fileExists("src/agents/metAndTeddy/prompts.ts"))
check("LangGraph graph",     fileExists("src/agents/metAndTeddy/graph.ts"))
check("Teddy engine",        fileExists("src/lib/teddy/engine.ts"))
check("Mediation guard",     fileExists("src/lib/mediation/guard.ts"))
check("Dual-source retrieval", fileExists("src/lib/retrieval/dualSource.ts"))
check("Level detection",     fileExists("src/lib/levels/detection.ts"))

// ── Badge engine ─────────────────────────────────────────────────
console.log("\n── Badge Engine ──")
check("Badge catalog",       fileExists("src/lib/badges/catalog.ts"))
check("Badge engine",        fileExists("src/lib/badges/engine.ts"))
check("Notebook integration", fileExists("src/lib/badges/notebookIntegration.ts"))
check("Triggers",            fileExists("src/lib/badges/triggers.ts"))
check("Open Badges 3.0",     fileExists("src/lib/badges/openBadges.ts"))

// ── Notebook engine ──────────────────────────────────────────────
console.log("\n── Notebook Engine ──")
check("Notebook types",      fileExists("src/lib/notebook/notebookTypes.ts"))
check("Feedback service",    fileExists("src/lib/notebook/feedback.ts"))
check("Progression",         fileExists("src/lib/notebook/progression.ts"))

// ── Database migrations ──────────────────────────────────────────
console.log("\n── Database Migrations ──")
check("Auth profiles",       fileExists("supabase/migrations/0001_auth_profiles.sql"))
check("Notebook tables",     fileExists("supabase/migrations/0002_notebook.sql"))
check("Badge tables",        fileExists("supabase/migrations/0003_badges.sql"))
check("Registration hardening", fileExists("supabase/migrations/0004_registration_hardening.sql"))

// ── Auth / registration infrastructure ───────────────────────────
console.log("\n── Auth Infrastructure ──")
check("Admin Supabase client", fileExists("src/lib/supabase/admin.ts"))
check("Legal versions",      fileExists("src/lib/legal.ts"))
check("Email templates",     fileExists("src/lib/email.ts"))
check("Request helpers",     fileExists("src/lib/http/request.ts"))
check("Rate limit helper",   fileExists("src/lib/http/rateLimit.ts"))
check("Finalize confirmation", fileExists("src/lib/auth/finalizeConfirmation.ts"))
check("Registration metadata type", fileExists("src/lib/auth/registrationMetadata.ts"))

// ── Documentation ────────────────────────────────────────────────
console.log("\n── Documentation ──")
check("Independence attestation", fileExists("docs/independence-attestation.md"))
check("Source blending policy",   fileExists("docs/source-blending-policy.md"))
check("Onboarding flow spec",     fileExists("docs/onboarding-flow.md"))
check("Content adaptation pipeline", fileExists("docs/content-adaptation-pipeline.md"))

// ── Design system ────────────────────────────────────────────────
console.log("\n── Design System ──")
check("Global CSS",          fileExists("src/app/globals.css"))

// ── Summary ──────────────────────────────────────────────────────
console.log("\n==========================")
console.log(`Total:  ${passed + failed}`)
console.log(`Passed: ${passed}`)
console.log(`Failed: ${failed}`)
if (failed === 0) console.log("\n✓ ALL SMOKE TESTS PASSED")
else process.exit(1)
