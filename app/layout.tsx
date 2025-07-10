// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GitHub Repository Health Dashboard",
  description: "Monitor your repository health with stale branches, open PRs, and detailed analytics",
  generator: "Divyaranjan Sahoo",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* Add suppressHydrationWarning to prevent false hydration mismatches on body */}
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
