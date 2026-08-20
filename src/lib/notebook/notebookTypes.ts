// src/lib/notebook/types.ts
// Notebook data types and template system for MET and Teddy.

import type { CertificationLevel, GradeBand } from "@/lib/levels/config"

// ── Core entry ───────────────────────────────────────────────────

export interface NotebookEntry {
  id:            string
  studentId:     string
  missionSlug?:  string
  certLevel:     CertificationLevel
  gradeBand:     GradeBand
  domain?:       string
  title:         string
  whatMeasured:   string
  instrument?:   string
  unit?:         string
  entryType:     "mission" | "free" | "practice"
  status:        "draft" | "complete" | "reviewed"
  measurements:  Measurement[]
  reflections:   Reflection[]
  uncertainty?:  UncertaintyComponent[]
  createdAt:     string
  updatedAt:     string
}

export interface Measurement {
  id:          string
  trialNumber: number
  value:       number
  unit:        string
  notes?:      string
}

export interface Reflection {
  id:       string
  prompt:   string
  response: string
}

export interface UncertaintyComponent {
  id:            string
  componentName: string
  evalType:      "A" | "B"
  value?:        number
  unit?:         string
  dof?:          number
  notes?:        string
}

// ── Template definitions per level ───────────────────────────────

export interface NotebookTemplate {
  certLevel:         CertificationLevel
  templateName:      string
  sections:          TemplateSection[]
  reflectionPrompts: string[]
}

export interface TemplateSection {
  id:       string
  label:    string
  type:     "text" | "number" | "measurement" | "measurements" | "uncertainty" | "drawing"
  required: boolean
  hint?:    string
}

export const TEMPLATES: Record<CertificationLevel, NotebookTemplate> = {
  Explorer: {
    certLevel: "Explorer",
    templateName: "Explorer Field Entry",
    sections: [
      { id: "what",   label: "What did you measure?",       type: "text",        required: true, hint: "Teddy's tail, a book, your shoe..." },
      { id: "tool",   label: "What tool did you use?",      type: "text",        required: true, hint: "Ruler, scale, thermometer..." },
      { id: "result", label: "What number did you get?",    type: "measurement", required: true, hint: "Write the number AND the unit!" },
      { id: "draw",   label: "Draw what you measured",      type: "drawing",     required: false, hint: "Draw a picture of your measurement" },
    ],
    reflectionPrompts: [
      "Was the number bigger or smaller than you expected?",
      "What would happen if you measured it again?",
    ],
  },

  Investigator: {
    certLevel: "Investigator",
    templateName: "Investigator Data Record",
    sections: [
      { id: "what",    label: "What did you measure?",        type: "text",         required: true },
      { id: "tool",    label: "Instrument used",              type: "text",         required: true },
      { id: "trials",  label: "Measurements (at least 3)",    type: "measurements", required: true, hint: "Measure the same thing multiple times" },
      { id: "average", label: "Average of your measurements", type: "number",       required: true, hint: "Add them up and divide by how many" },
    ],
    reflectionPrompts: [
      "Were all your measurements exactly the same? Why or why not?",
      "What might cause the numbers to be different each time?",
      "What would you do differently next time?",
    ],
  },

  Innovator: {
    certLevel: "Innovator",
    templateName: "Innovator Analysis Record",
    sections: [
      { id: "what",    label: "Measurand",                  type: "text",         required: true },
      { id: "tool",    label: "Instrument (model, range)",   type: "text",         required: true },
      { id: "trials",  label: "Replicate measurements",      type: "measurements", required: true, hint: "At least 5 readings for Type A" },
      { id: "mean",    label: "Mean",                        type: "number",       required: true },
      { id: "stdev",   label: "Standard deviation",          type: "number",       required: true },
      { id: "uncert",  label: "Uncertainty components",      type: "uncertainty",  required: false, hint: "Resolution, repeatability, etc." },
    ],
    reflectionPrompts: [
      "What is the dominant uncertainty component? Why?",
      "How would you reduce the uncertainty?",
      "What sources of systematic error might be present?",
    ],
  },

  Metrologist: {
    certLevel: "Metrologist",
    templateName: "Calibration Record",
    sections: [
      { id: "measurand", label: "Measurand per VIM 2.3",          type: "text",         required: true },
      { id: "iut",       label: "Instrument Under Test",          type: "text",         required: true, hint: "Make, model, serial, resolution" },
      { id: "ref",       label: "Reference standard",             type: "text",         required: true, hint: "Traceable reference, cert number" },
      { id: "procedure", label: "Procedure reference",            type: "text",         required: true, hint: "ISO, EURAMET cg, or internal SOP" },
      { id: "env",       label: "Environmental conditions",       type: "text",         required: true, hint: "Temperature, humidity, pressure" },
      { id: "trials",    label: "Measurement data",               type: "measurements", required: true, hint: "As-found readings at each test point" },
      { id: "mean",      label: "Mean",                           type: "number",       required: true },
      { id: "stdev",     label: "Standard deviation",             type: "number",       required: true },
      { id: "uncert",    label: "Uncertainty budget",             type: "uncertainty",  required: true },
      { id: "coverage",  label: "Coverage factor k and level",    type: "text",         required: true, hint: "k = 2 for ~95% confidence" },
      { id: "result",    label: "Expanded uncertainty U",         type: "number",       required: true },
    ],
    reflectionPrompts: [
      "Is the instrument within its specification based on your result?",
      "What is the dominant uncertainty component and why?",
      "How does this uncertainty compare to the test tolerance?",
    ],
  },
}
