// src/components/missions/MissionCard.tsx
// Placeholder — built in Step 3.6.

interface MissionCardProps {
  title: string
  domain: string
  level: string
  description?: string
}

export function MissionCard({ title, domain, level, description }: MissionCardProps) {
  return (
    <div className="met-card p-4">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-sm" style={{ color: "var(--met-text-primary)" }}>
          {title}
        </h3>
        <span className="met-badge met-badge-teal">{domain}</span>
      </div>
      {description && (
        <p className="text-sm" style={{ color: "var(--met-text-secondary)" }}>
          {description}
        </p>
      )}
      <div className="mt-3">
        <span className="met-badge met-badge-amber">{level}</span>
      </div>
    </div>
  )
}
