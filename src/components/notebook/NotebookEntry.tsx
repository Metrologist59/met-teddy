// src/components/notebook/NotebookEntry.tsx
// Placeholder — built in Step 3.7.

interface NotebookEntryProps {
  date: string
  missionTitle?: string
  measuredItem: string
  measurements: number[]
  unit: string
}

export function NotebookEntry({ date, missionTitle, measuredItem, measurements, unit }: NotebookEntryProps) {
  return (
    <div className="met-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: "var(--met-text-muted)" }}>
          {date}
        </span>
        {missionTitle && (
          <span className="met-badge met-badge-teal">{missionTitle}</span>
        )}
      </div>
      <p className="font-medium text-sm" style={{ color: "var(--met-text-primary)" }}>
        Measured: {measuredItem}
      </p>
      <p className="text-sm mt-1" style={{ color: "var(--met-text-secondary)" }}>
        {measurements.join(", ")} {unit}
      </p>
    </div>
  )
}
