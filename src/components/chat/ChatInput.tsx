// src/components/chat/ChatInput.tsx
// Chat input bar for MET and Teddy.

"use client"

import { useState, useRef } from "react"
import type { CertificationLevel } from "@/lib/levels/config"

interface ChatInputProps {
  onSend:    (message: string) => void
  disabled?: boolean
  certLevel: CertificationLevel
}

const PLACEHOLDERS: Record<CertificationLevel, string> = {
  Explorer:     "Ask MET anything! What do you want to measure?",
  Investigator: "Ask MET a question about measurement...",
  Innovator:    "Ask about uncertainty, repeatability, or a concept...",
  Metrologist:  "Ask about standards, uncertainty evaluation, or calibration...",
}

export function ChatInput({ onSend, disabled = false, certLevel }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  function handleSend() {
    const trimmed = message.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setMessage("")
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className="flex items-end gap-2 p-3 rounded-xl"
      style={{
        background: "var(--met-surface-card)",
        border: "1px solid rgba(42, 184, 171, 0.12)",
        boxShadow: "var(--met-shadow-md)",
      }}
    >
      <textarea
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={PLACEHOLDERS[certLevel]}
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none"
        style={{
          color: "var(--met-text-primary)",
          maxHeight: "120px",
          minHeight: "24px",
        }}
      />

      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all"
        style={{
          background: message.trim()
            ? "var(--met-teal-400)"
            : "var(--met-surface-muted)",
          color: message.trim() ? "white" : "var(--met-text-muted)",
          cursor: message.trim() ? "pointer" : "default",
        }}
        aria-label="Send message"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M1.5 1.5L14.5 8L1.5 14.5V9.5L10 8L1.5 6.5V1.5Z" />
        </svg>
      </button>
    </div>
  )
}
