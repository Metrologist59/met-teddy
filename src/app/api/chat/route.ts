// src/app/api/chat/route.ts
// Main chat API endpoint for MET and Teddy.
// v4: Passes retrieved chunks to the agent for mediation guard comparison.

import { NextRequest, NextResponse } from "next/server"
import { HumanMessage } from "@langchain/core/messages"
import { metAndTeddyApp } from "@/agents/metAndTeddy/graph"
import { dualSourceRetrieve } from "@/lib/retrieval/dualSource"
import { routeSession } from "@/lib/levels/routing"
import type { GradeBand } from "@/lib/levels/config"
import type { StudentProfile } from "@/lib/levels/detection"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      message,
      gradeBand = "K-2" as GradeBand,
      studentId = "anonymous",
      overrideLevel = null,
      flexLevel = null,
    } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    const startTime = Date.now()

    // ── Route ────────────────────────────────────────────────────────
    const profile: StudentProfile = {
      studentId,
      gradeBand: gradeBand as GradeBand,
      overrideLevel,
      flexLevel,
    }
    const session = routeSession(profile)

    // ── Retrieve ─────────────────────────────────────────────────────
    const retrieval = await dualSourceRetrieve(
      message,
      session.gradeBand,
      session.certLevel,
    )

    // ── Invoke agent (with chunks for mediation guard) ───────────────
    const result = await metAndTeddyApp.invoke(
      { messages: [new HumanMessage(message)] },
      {
        configurable: {
          certLevel:           session.certLevel,
          gradeBand:           session.gradeBand,
          studentId,
          retrievedContext:    retrieval.context,
          retrievedChunks:     retrieval.chunks,
          metlibraryAvailable: retrieval.metlibraryAvailable,
        },
      }
    )

    // ── Response ─────────────────────────────────────────────────────
    const lastMessage = result.messages[result.messages.length - 1]
    const reply = typeof lastMessage.content === "string"
      ? lastMessage.content
      : JSON.stringify(lastMessage.content)

    const totalLatencyMs = Date.now() - startTime

    return NextResponse.json({
      reply,
      citationFooter: retrieval.citationFooter,
      session: {
        certLevel:       session.certLevel,
        gradeBand:       session.gradeBand,
        levelSource:     session.levelSource,
        teddyProminence: session.teddyProminence,
        citationFormat:  session.citationFormat,
        safetyLevel:     session.safetyLevel,
      },
      meta: {
        retrievalLatencyMs:  retrieval.latencyMs,
        totalLatencyMs,
        chunksRetrieved:     retrieval.chunks.length,
        metlibraryAvailable: retrieval.metlibraryAvailable,
      },
    })

  } catch (err: any) {
    console.error("[chat] Error:", err.message)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
