// src/agents/metAndTeddy/tools.ts
// MET and Teddy agent tools.
//
// Phase 2: starts minimal — tools are added as features are built.
// Phase 3 will add: Field Notebook, badge system, Field Mission runner.
//
// Architecture note (from MetTutor): the module-level ToolNode in graph.ts
// keeps ALL tools. The LLM only sees the filtered subset bound to it, so
// it can only emit tool_calls for tools in its bound list.

import { tool } from "@langchain/core/tools"
import { z } from "zod"

// ── Placeholder: search Field Guide ──────────────────────────────────────────
// This will be replaced by a real tool that queries the MET Field Guide
// database directly when the student asks a follow-up or refinement.

const searchFieldGuide = tool(
  async ({ query }) => {
    // TODO: wire to dualSourceRetrieve in Phase 2.5
    return `[Search not yet implemented — query: ${query}]`
  },
  {
    name: "search_field_guide",
    description: "Search the MET Field Guide for measurement science content. Use when the student asks a question that requires looking up a specific concept, experiment, or vocabulary term.",
    schema: z.object({
      query: z.string().describe("The search query — a few words describing what to look up"),
    }),
  }
)

// ── Export all tools ─────────────────────────────────────────────────────────

export const metAndTeddyTools = [
  searchFieldGuide,
]
