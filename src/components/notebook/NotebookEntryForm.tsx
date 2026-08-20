// src/components/notebook/NotebookEntryForm.tsx
// Level-adaptive notebook entry creation form.
// Renders template sections appropriate to the student's level.

"use client"

import { useState } from "react"
import { TEMPLATES, type Measurement, type Reflection } from "@/lib/notebook/notebookTypes"
import type { CertificationLevel } from "@/lib/levels/config"

interface NotebookEntryFormProps {
  certLevel:    CertificationLevel
  missionSlug?: string
  missionTitle?: string
  onSave:       (data: EntryFormData) => void
  onCancel:     () => void
}

export interface EntryFormData {
  title:        string
  whatMeasured: string
  instrument:   string
  unit:         string
  measurements: { value: number; notes?: string }[]
  textFields:   Record<string, string>
  reflections:  { prompt: string; response: string }[]
}

export function NotebookEntryForm({
  certLevel,
  missionSlug,
  missionTitle,
  onSave,
  onCancel,
}: NotebookEntryFormProps) {
  const template = TEMPLATES[certLevel]

  const [title, setTitle] = useState(missionTitle ?? "")
  const [textFields, setTextFields] = useState<Record<string, string>>({})
  const [measurements, setMeasurements] = useState<{ value: string; notes: string }[]>([
    { value: "", notes: "" },
  ])
  const [reflections, setReflections] = useState<Record<string, string>>({})
  const [step, setStep] = useState<"data" | "reflect">("data")

  function updateTextField(id: string, value: string) {
    setTextFields(prev => ({ ...prev, [id]: value }))
  }

  function addMeasurement() {
    setMeasurements(prev => [...prev, { value: "", notes: "" }])
  }

  function updateMeasurement(index: number, field: "value" | "notes", val: string) {
    setMeasurements(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: val }
      return next
    })
  }

  function removeMeasurement(index: number) {
    if (measurements.length <= 1) return
    setMeasurements(prev => prev.filter((_, i) => i !== index))
  }

  function handleSubmit() {
    const parsed = measurements
      .filter(m => m.value.trim() !== "")
      .map(m => ({ value: parseFloat(m.value), notes: m.notes || undefined }))

    const refs = template.reflectionPrompts.map(prompt => ({
      prompt,
      response: reflections[prompt] ?? "",
    })).filter(r => r.response.trim() !== "")

    onSave({
      title,
      whatMeasured: textFields["what"] ?? textFields["measurand"] ?? "",
      instrument: textFields["tool"] ?? textFields["iut"] ?? "",
      unit: textFields["unit"] ?? "",
      measurements: parsed,
      textFields,
      reflections: refs,
    })
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-lg font-bold"
          style={{ color: "var(--met-text-primary)" }}
        >
          {template.templateName}
        </h2>
        <span className="met-badge met-badge-teal">{certLevel}</span>
      </div>

      {missionSlug && (
        <div
          className="met-badge met-badge-amber mb-4"
        >
          🧭 {missionTitle ?? missionSlug}
        </div>
      )}

      {step === "data" && (
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1"
              style={{ color: "var(--met-text-muted)" }}
            >
              Entry Title
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{
                background: "var(--met-surface-muted)",
                border: "1px solid rgba(42,184,171,0.15)",
                color: "var(--met-text-primary)",
              }}
              placeholder="What is this entry about?"
            />
          </div>

          {/* Template sections */}
          {template.sections.map(section => {
            if (section.type === "measurements") {
              return (
                <div key={section.id}>
                  <label
                    className="block text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: "var(--met-text-muted)" }}
                  >
                    {section.label}
                  </label>
                  {section.hint && (
                    <p className="text-xs mb-2" style={{ color: "var(--met-text-muted)" }}>
                      {section.hint}
                    </p>
                  )}
                  <div className="space-y-2">
                    {measurements.map((m, i) => (
                      <div key={i} className="flex gap-2">
                        <span
                          className="flex-shrink-0 w-8 h-9 flex items-center justify-center text-xs font-bold rounded-lg"
                          style={{ background: "var(--met-surface-muted)", color: "var(--met-text-muted)" }}
                        >
                          #{i + 1}
                        </span>
                        <input
                          value={m.value}
                          onChange={e => updateMeasurement(i, "value", e.target.value)}
                          type="number"
                          step="any"
                          className="flex-1 px-3 py-2 rounded-lg text-sm"
                          style={{
                            background: "var(--met-surface-muted)",
                            border: "1px solid rgba(42,184,171,0.15)",
                            color: "var(--met-text-primary)",
                          }}
                          placeholder="Value"
                        />
                        {certLevel !== "Explorer" && (
                          <input
                            value={m.notes}
                            onChange={e => updateMeasurement(i, "notes", e.target.value)}
                            className="w-28 px-3 py-2 rounded-lg text-sm"
                            style={{
                              background: "var(--met-surface-muted)",
                              border: "1px solid rgba(42,184,171,0.15)",
                              color: "var(--met-text-primary)",
                            }}
                            placeholder="Notes"
                          />
                        )}
                        {measurements.length > 1 && (
                          <button
                            onClick={() => removeMeasurement(i)}
                            className="text-xs px-2"
                            style={{ color: "var(--met-error)" }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addMeasurement}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                      style={{ color: "var(--met-teal-400)", background: "var(--met-surface-muted)" }}
                    >
                      + Add reading
                    </button>
                  </div>
                </div>
              )
            }

            if (section.type === "uncertainty") {
              return (
                <div key={section.id} className="met-card p-4">
                  <label
                    className="block text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: "var(--met-text-muted)" }}
                  >
                    {section.label}
                  </label>
                  <p className="text-xs" style={{ color: "var(--met-text-muted)" }}>
                    Uncertainty worksheet — built in full at integration (Step 3.8).
                    Record components: repeatability, resolution, reference standard, etc.
                  </p>
                </div>
              )
            }

            if (section.type === "drawing") {
              return (
                <div key={section.id} className="met-card p-4 text-center">
                  <label
                    className="block text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: "var(--met-text-muted)" }}
                  >
                    {section.label}
                  </label>
                  <div
                    className="h-32 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--met-surface-muted)", border: "2px dashed rgba(42,184,171,0.2)" }}
                  >
                    <span className="text-sm" style={{ color: "var(--met-text-muted)" }}>
                      🖍️ Drawing area — photo upload in production
                    </span>
                  </div>
                </div>
              )
            }

            // Text and number fields
            return (
              <div key={section.id}>
                <label
                  className="block text-xs font-semibold uppercase tracking-wide mb-1"
                  style={{ color: "var(--met-text-muted)" }}
                >
                  {section.label} {section.required && <span style={{ color: "var(--met-error)" }}>*</span>}
                </label>
                {section.hint && (
                  <p className="text-xs mb-1" style={{ color: "var(--met-text-muted)" }}>
                    {section.hint}
                  </p>
                )}
                <input
                  value={textFields[section.id] ?? ""}
                  onChange={e => updateTextField(section.id, e.target.value)}
                  type={section.type === "number" ? "number" : "text"}
                  step={section.type === "number" ? "any" : undefined}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    background: "var(--met-surface-muted)",
                    border: "1px solid rgba(42,184,171,0.15)",
                    color: "var(--met-text-primary)",
                  }}
                />
              </div>
            )
          })}

          <button
            onClick={() => setStep("reflect")}
            className="met-btn-primary w-full py-3"
          >
            Next: Reflection
          </button>
        </div>
      )}

      {step === "reflect" && (
        <div className="space-y-4">
          <div className="met-citation-footer mb-4">
            <span className="font-semibold">MET says:</span>{" "}
            {certLevel === "Explorer"
              ? "Now tell me what you noticed! There are no wrong answers."
              : certLevel === "Investigator"
              ? "Think about your data. What story do the numbers tell?"
              : certLevel === "Innovator"
              ? "Analyze what happened. What did the variation reveal?"
              : "Evaluate your results against the procedure and acceptance criteria."
            }
          </div>

          {template.reflectionPrompts.map((prompt, i) => (
            <div key={i}>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--met-text-primary)" }}
              >
                {prompt}
              </label>
              <textarea
                value={reflections[prompt] ?? ""}
                onChange={e => setReflections(prev => ({ ...prev, [prompt]: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                style={{
                  background: "var(--met-surface-muted)",
                  border: "1px solid rgba(42,184,171,0.15)",
                  color: "var(--met-text-primary)",
                }}
              />
            </div>
          ))}

          <div className="flex gap-3">
            <button
              onClick={() => setStep("data")}
              className="flex-1 py-3 font-medium rounded-lg"
              style={{ background: "var(--met-surface-muted)", color: "var(--met-text-secondary)" }}
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="met-btn-primary flex-1 py-3"
            >
              Save Entry
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onCancel}
        className="w-full mt-3 text-center text-sm py-2"
        style={{ color: "var(--met-text-muted)" }}
      >
        Cancel
      </button>
    </div>
  )
}
