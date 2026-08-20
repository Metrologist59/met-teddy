// src/components/layout/ErrorBoundary.tsx
// MET Universe error boundary.
// Catches React rendering errors and shows a branded recovery.

"use client"

import { Component, type ReactNode, type ErrorInfo } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("MET Universe error:", error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          className="min-h-screen flex items-center justify-center p-6"
          style={{ background: "var(--met-surface)" }}
        >
          <div className="max-w-sm text-center">
            <div className="text-5xl mb-4">✋</div>
            <h2
              className="text-xl font-bold mb-2"
              style={{ color: "var(--met-text-primary)" }}
            >
              Something went wrong
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--met-text-secondary)" }}
            >
              MET ran into a problem. This has been logged.
              Try refreshing the page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: undefined })
                window.location.reload()
              }}
              className="met-btn-primary px-6 py-2"
            >
              Refresh
            </button>
            <p
              className="text-xs mt-6"
              style={{ color: "var(--met-text-muted)" }}
            >
              MET Universe — A MET Scientia Experience
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
