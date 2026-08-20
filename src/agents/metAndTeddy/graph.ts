// src/agents/metAndTeddy/graph.ts
// MET and Teddy AI Agent — LangGraph implementation
// v4: Notebook + Badge awareness integrated.

import { ChatAnthropic } from "@langchain/anthropic"
import { StateGraph, MessagesAnnotation, START, END } from "@langchain/langgraph"
import { SystemMessage, AIMessage } from "@langchain/core/messages"
import { ToolNode } from "@langchain/langgraph/prebuilt"
import { BASE_PROMPT, getLevelAdaptation } from "./prompts"
import { metAndTeddyTools } from "./tools"
import { teddyEngine } from "@/lib/teddy/engine"
import { mediationGuard } from "@/lib/mediation/guard"
import { getConflictDirective, getFallbackDirective } from "@/lib/mediation/conflicts"
import { notebookAwareness } from "@/lib/notebook/awareness"
import { badgeAwareness } from "@/lib/badges/awareness"
import { LEVELS, type CertificationLevel } from "@/lib/levels/config"
import type { NotebookSummary } from "@/lib/notebook/types"
import type { BadgeSummary } from "@/lib/badges/types"

// ── Config type ──────────────────────────────────────────────────────────────

export interface MetAndTeddyRunConfig {
  certLevel?:           CertificationLevel
  gradeBand?:           string
  studentId?:           string
  retrievedContext?:    string
  retrievedChunks?:     any[]
  metlibraryAvailable?: boolean
  notebookSummary?:     NotebookSummary | null
  badgeSummary?:        BadgeSummary | null
}

// ── Tool node ────────────────────────────────────────────────────────────────

const toolNode = new ToolNode(metAndTeddyTools)

// ── Main agent node ──────────────────────────────────────────────────────────

async function metAndTeddyNode(
  state: typeof MessagesAnnotation.State,
  config?: { configurable?: MetAndTeddyRunConfig }
) {
  const certLevel   = config?.configurable?.certLevel   ?? "Explorer"
  const gradeBand   = config?.configurable?.gradeBand   ?? "K-2"
  const studentId   = config?.configurable?.studentId   ?? "anonymous"
  const context     = config?.configurable?.retrievedContext ?? ""
  const chunks      = config?.configurable?.retrievedChunks ?? []
  const mlAvailable = config?.configurable?.metlibraryAvailable ?? false
  const nbSummary   = config?.configurable?.notebookSummary ?? null
  const bdgSummary  = config?.configurable?.badgeSummary ?? null

  // ── Student message ────────────────────────────────────────────────
  const lastUserMessage = state.messages
    .filter(m => m._getType() === "human")
    .pop()
  const messageText = typeof lastUserMessage?.content === "string"
    ? lastUserMessage.content
    : ""

  // ── Teddy Engine ───────────────────────────────────────────────────
  const levelConfig = LEVELS[certLevel]
  const teddyDirective = teddyEngine(
    messageText,
    certLevel,
    levelConfig.teddyProminence,
  )

  // ── Mediation directives ───────────────────────────────────────────
  const conflictDirective = getConflictDirective(certLevel)
  const fallbackDirective = getFallbackDirective(certLevel, mlAvailable)

  // ── Notebook awareness ─────────────────────────────────────────────
  const notebookDirective = notebookAwareness(nbSummary, certLevel)

  // ── Badge awareness ───────────────────────────────────────────────
  const badgeDirective = badgeAwareness(bdgSummary, certLevel)

  // ── Compose system prompt ──────────────────────────────────────────
  const levelAdaptation = getLevelAdaptation(certLevel)

  const sessionContext = [
    `SESSION:`,
    `- Student ID: ${studentId}`,
    `- Certification level: ${certLevel}`,
    `- Grade band: ${gradeBand}`,
  ].join("\n")

  const systemParts: string[] = [
    BASE_PROMPT,
    levelAdaptation,
    sessionContext,
    conflictDirective,
    teddyDirective.promptBlock,
    notebookDirective.promptBlock,
    badgeDirective.promptBlock,
  ]

  if (fallbackDirective) systemParts.push(fallbackDirective)
  if (context) systemParts.push(context)

  const systemMessage = new SystemMessage(
    systemParts.filter(Boolean).join("\n\n")
  )

  // ── Invoke Claude ──────────────────────────────────────────────────
  const llm = new ChatAnthropic({
    model:       "claude-sonnet-4-6",
    temperature: 0,
    apiKey:      process.env.ANTHROPIC_API_KEY,
  }).bindTools(metAndTeddyTools)

  const messages = [systemMessage, ...state.messages]
  const response = await llm.invoke(messages)

  // ── Mediation Guard ────────────────────────────────────────────────
  let finalContent = typeof response.content === "string"
    ? response.content
    : response.content

  if (typeof finalContent === "string" && certLevel !== "Metrologist") {
    const guardResult = mediationGuard(finalContent, certLevel, chunks)
    if (!guardResult.passed) {
      console.warn(
        `[mediation] ${guardResult.violations.length} violation(s) at ${certLevel}:`,
        guardResult.violations.map(v => `${v.type}: ${v.match}`).join("; ")
      )
      const mediatedResponse = new AIMessage({
        content: guardResult.mediated,
        tool_calls: (response as AIMessage).tool_calls,
      })
      return { messages: [mediatedResponse] }
    }
  }

  return { messages: [response] }
}

// ── Routing ──────────────────────────────────────────────────────────────────

function shouldContinue(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage
  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) return "tools"
  return END
}

// ── Graph ────────────────────────────────────────────────────────────────────

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("met_and_teddy", metAndTeddyNode)
  .addNode("tools", toolNode)
  .addEdge(START, "met_and_teddy")
  .addConditionalEdges("met_and_teddy", shouldContinue)
  .addEdge("tools", "met_and_teddy")

export const metAndTeddyApp = workflow.compile()
