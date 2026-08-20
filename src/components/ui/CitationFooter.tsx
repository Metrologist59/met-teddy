// src/components/ui/CitationFooter.tsx
// Teal citation footer — the visual convention from Brand Ecosystem
// Profile v2.0 §20.2 that signals commitment to traceability.

interface CitationFooterProps {
  citation: string
}

export function CitationFooter({ citation }: CitationFooterProps) {
  if (!citation) return null

  return (
    <div className="met-citation-footer">
      {citation}
    </div>
  )
}
