// src/app/page.tsx
// MET Universe landing page with brand design system.

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--met-teal-900)" }}>
      {/* Grid-line background motif */}
      <div className="absolute inset-0 met-grid-bg pointer-events-none" style={{ opacity: 0.06 }} />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 text-center">
        {/* Logo area */}
        <div className="mb-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight" style={{ color: "var(--met-text-inverse)" }}>
            <span style={{ color: "var(--met-teal-400)" }}>MET</span> and Teddy
          </h1>
          <p className="mt-3 text-xl sm:text-2xl font-medium" style={{ color: "var(--met-teal-400)" }}>
            Every measurement tells a story.
          </p>
        </div>

        {/* Ruler divider */}
        <div className="met-ruler-divider w-64 mx-auto mb-8" style={{ opacity: 0.6 }} />

        {/* Tagline */}
        <p className="text-lg max-w-md mx-auto mb-10" style={{ color: "var(--met-text-inverse)", opacity: 0.8 }}>
          Your Measurement Education Tutor and his trusty companion.
          Where measurement comes alive for K–12 students.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="/chat" className="met-btn-primary text-center px-8 py-3 text-lg">
            Start Exploring
          </a>
          <a
            href="/missions"
            className="met-btn-warm text-center px-8 py-3 text-lg"
          >
            Field Missions
          </a>
        </div>

        {/* Level badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          {[
            { level: "Explorer",     band: "K–2",  color: "#2AB8AB" },
            { level: "Investigator", band: "3–5",  color: "#60A5FA" },
            { level: "Innovator",    band: "6–8",  color: "#F59E0B" },
            { level: "Metrologist",  band: "9–12", color: "#F8FAFA" },
          ].map(({ level, band, color }) => (
            <span
              key={level}
              className="met-badge px-4 py-1.5"
              style={{
                background: `${color}18`,
                color,
                border: `1px solid ${color}33`,
              }}
            >
              {level} · {band}
            </span>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 text-center py-6 text-xs"
        style={{ color: "var(--met-text-inverse)", opacity: 0.5 }}
      >
        MET Universe — A MET Scientia Experience · © 2026 MET Scientia, LLC · In Support of the Metrology Institute
      </footer>
    </div>
  )
}
