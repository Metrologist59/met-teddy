// src/app/chat/page.tsx
// Chat page — Talk to MET and Teddy.

"use client"

import { AppShell } from "@/components/layout/AppShell"
import { ChatInterface } from "@/components/chat/ChatInterface"

// TODO: Load from authenticated profile (Step 3.3 integration)
const DEMO_PROPS = {
  certLevel: "Explorer" as const,
  gradeBand: "K-2" as const,
  studentName: "Explorer",
  studentId: "demo-student",
}

export default function ChatPage() {
  return (
    <AppShell
      studentName={DEMO_PROPS.studentName}
      certLevel={DEMO_PROPS.certLevel}
      gradeBand={DEMO_PROPS.gradeBand}
    >
      <div className="h-[calc(100vh-var(--met-nav-height))]">
        <ChatInterface
          certLevel={DEMO_PROPS.certLevel}
          gradeBand={DEMO_PROPS.gradeBand}
          studentName={DEMO_PROPS.studentName}
          studentId={DEMO_PROPS.studentId}
        />
      </div>
    </AppShell>
  )
}
