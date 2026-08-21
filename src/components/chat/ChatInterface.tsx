// src/components/chat/ChatInterface.tsx
// Full chat interface for MET and Teddy.

"use client"

import { useState, useRef, useEffect } from "react"
import { ChatInput } from "./ChatInput"
import { MessageBubble } from "./MessageBubble"
import { CharacterPanel } from "@/components/characters/CharacterPanel"
import type { CertificationLevel, GradeBand } from "@/lib/levels/config"

interface Message {
  id:              string
  role:            "student" | "met"
  content:         string
  citationFooter?: string
  timestamp:       string
}

interface ChatInterfaceProps {
  certLevel:   CertificationLevel
  gradeBand:   GradeBand
  studentName: string
  studentId?:  string
}

export function ChatInterface({
  certLevel,
  gradeBand,
  studentName,
  studentId = "anonymous",
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages])

  async function handleSend(text: string) {
    const studentMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "student",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages(prev => [...prev, studentMsg])
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          gradeBand,
          studentId,
        }),
      })

      const data = await res.json()

      const metMsg: Message = {
        id: `msg-${Date.now()}-met`,
        role: "met",
        content: data.reply ?? "I had trouble with that question. Could you try asking again?",
        citationFooter: data.citationFooter,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages(prev => [...prev, metMsg])

    } catch {
      const errorMsg: Message = {
        id: `msg-${Date.now()}-error`,
        role: "met",
        content: "Something went wrong on my end. Let me try again — could you ask that once more?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-w-[var(--met-max-chat)] mx-auto">
      {/* Header — only visible once conversation starts */}
      {messages.length > 0 && (
        <div
          className="flex-shrink-0 p-4 border-b"
          style={{ borderColor: "rgba(42, 184, 171, 0.08)" }}
        >
          <CharacterPanel
            metExpression="neutral"
            teddyBodyLanguage="sitting"
            certLevel={certLevel}
            layout="chat-header"
            size="md"
          />
        </div>
      )}

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4"
      >
        {/* Welcome — one duo image, shown only before first message */}
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <img
                src="/characters/met-teddy.svg"
                alt="MET and Teddy ready to explore together"
                className="h-48 object-contain"
              />
            </div>
            <h2
              className="text-lg font-semibold mb-1"
              style={{ color: "var(--met-text-primary)" }}
            >
              Hey {studentName}!
            </h2>
            <p
              className="text-sm max-w-sm mx-auto"
              style={{ color: "var(--met-text-secondary)" }}
            >
              {certLevel === "Explorer"
                ? "Teddy and I are ready to measure things with you! What do you want to explore?"
                : certLevel === "Investigator"
                ? "Ready to investigate some measurements? Ask me anything about measuring, experiments, or how things work."
                : certLevel === "Innovator"
                ? "Let\u2019s dig into measurement science. Ask about uncertainty, repeatability, or anything you\u2019re working on."
                : "What measurement challenge are we tackling today? Standards, uncertainty, calibration \u2014 I\u2019m here."
              }
            </p>
          </div>
        )}

        {/* Message list */}
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            certLevel={certLevel}
            citationFooter={msg.citationFooter}
            timestamp={msg.timestamp}
          />
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3 mb-4">
            <div className="flex-shrink-0 mt-1">
              <CharacterPanel
                metExpression="explore"
                teddyBodyLanguage="head_tilt"
                certLevel={certLevel}
                layout="chat-header"
                size="sm"
              />
            </div>
            <div
              className="px-4 py-3 rounded-2xl rounded-tl-md text-sm"
              style={{
                background: "var(--met-surface-card)",
                border: "1px solid rgba(42, 184, 171, 0.08)",
                color: "var(--met-text-muted)",
              }}
            >
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>·</span>
                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>·</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 p-4">
        <ChatInput
          onSend={handleSend}
          disabled={loading}
          certLevel={certLevel}
        />
      </div>
    </div>
  )
}
