import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ScoreProvider } from "@/lib/score-context"
import Navbar from "@/components/navbar"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "HumanEval | Cognitive Benchmark OS",
  description:
    "Next-generation human performance diagnostics. High-frequency tests for reaction time, sequence memory, aim precision, digit span, and typing speed.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased font-sans bg-background text-foreground dot-grid min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ScoreProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
          </ScoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
