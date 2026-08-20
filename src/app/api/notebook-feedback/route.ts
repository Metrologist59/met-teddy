// src/app/api/notebook-feedback/route.ts
// API route for MET feedback on notebook entries.

import { NextResponse } from "next/server"
import { buildFeedbackPrompt } from "@/lib/notebook/feedback"
import type { NotebookEntry } from "@/lib/notebook/notebookTypes"
import type { CertificationLevel } from "@/lib/levels/config"

export async function POST(request: Request) {
  try {
    const { entry, certLevel } = await request.json() as {
      entry: NotebookEntry
      certLevel: CertificationLevel
    }

    const prompt = buildFeedbackPrompt(entry, certLevel)

    // Call the AI engine for feedback
    // Uses the same Claude backend as chat, with a feedback-specific system prompt
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ feedback: "MET feedback is not configured yet. Add your ANTHROPIC_API_KEY to .env.local." })
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system: `You are MET — the Measurement Education Tutor. You are reviewing a student's Field Notebook entry. You are kind, encouraging, and specific. You never grade or rank. You guide. Keep your feedback to 3-4 sentences. For the ${certLevel} level, match the vocabulary and technical depth to the student's band.`,
        messages: [
          { role: "user", content: prompt },
        ],
      }),
    })

    const data = await response.json()
    const feedback = data.content?.[0]?.text ?? "MET couldn't review this entry right now."

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("Notebook feedback error:", error)
    return NextResponse.json(
      { feedback: "Something went wrong getting MET's feedback." },
      { status: 500 }
    )
  }
}
