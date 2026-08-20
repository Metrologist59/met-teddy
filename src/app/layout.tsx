// src/app/layout.tsx
// Root layout with MET Universe brand typography.

import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "MET Universe — Where Measurement Comes Alive",
  description: "MET and Teddy: A measurement science learning adventure for K–12 students. Every measurement tells a story. © 2026 MET Scientia, LLC.",
  icons: { icon: "/favicon.ico" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2AB8AB" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MET & Teddy" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>{children}</body>
    </html>
  )
}
