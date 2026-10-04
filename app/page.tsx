"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import TestCard from "@/components/TestCard"
import Footer from "@/components/footer"
import { BENCHMARKS } from "@/lib/benchmarks"
import { useScore } from "@/lib/score-context"
import {
  Brain,
  Zap,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BarChart3,
  Cpu,
} from "lucide-react"

const tests = [
  {
    id: "reaction-time",
    title: "Reaction Time",
    description: "Measure synaptic visual-to-motor reaction latency and afferent nerve speeds.",
    icon: "Zap",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    isNew: false,
    category: "Speed",
  },
  {
    id: "sequence-memory",
    title: "Sequence Memory",
    description: "Memorize and reproduce spatial pattern sequences that expand each round.",
    icon: "Grid3X3",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    isNew: false,
    category: "Memory",
  },
  {
    id: "aim-trainer",
    title: "Aim Trainer",
    description: "Ballistic target acquisition and fine neuromuscular motor accuracy.",
    icon: "Target",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    isNew: false,
    category: "Motor",
  },
  {
    id: "number-memory",
    title: "Number Memory",
    description: "Working memory digit span based on Miller's Law (7 ± 2 items).",
    icon: "Hash",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    isNew: false,
    category: "Memory",
  },
  {
    id: "verbal-memory",
    title: "Verbal Memory",
    description: "Differentiate between familiar seen words and novel lexical entries.",
    icon: "MessageSquare",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    isNew: false,
    category: "Language",
  },
  {
    id: "chimp-test",
    title: "Chimp Test",
    description: "Evaluate iconic spatial working memory inspired by Ayumu chimpanzee studies.",
    icon: "Brain",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    isNew: false,
    category: "Vision",
  },
  {
    id: "visual-memory",
    title: "Visual Memory",
    description: "Retain and select coordinates in an expanding matrix of illuminated tiles.",
    icon: "Eye",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    isNew: false,
    category: "Vision",
  },
  {
    id: "typing",
    title: "Typing Speed",
    description: "Measure net typing cadence (WPM), accuracy, and motor rhythm efficiency.",
    icon: "Keyboard",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    isNew: false,
    category: "Motor",
  },
  {
    id: "reading-comprehension",
    title: "Reading Comprehension",
    description: "Synthesize high-speed textual parsing alongside factual comprehension checks.",
    icon: "BookOpen",
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
    isNew: true,
    category: "Language",
  },
]

const categories = ["All", "Speed", "Memory", "Motor", "Vision", "Language"]

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const { userStats } = useScore()

  const filteredTests =
    selectedCategory === "All"
      ? tests
      : tests.filter((t) => t.category === selectedCategory)

  const completedCount = Object.keys(userStats.bestScores).length

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 text-center overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COGNITIVE BENCHMARK OS 2.0</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight font-mono text-foreground">
            HUMAN <span className="text-cyan-400">EVALUATION</span>
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-sans">
            Precision cognitive diagnostics and real-time human telemetry. 
            Measure your synaptic reaction velocity, digit span, spatial memory, and motor accuracy against global distributions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Button
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-sm px-8 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
              asChild
            >
              <Link href="/facility">
                <Cpu className="w-4 h-4 mr-2" /> Training Facility OS 2.0
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-border/60 text-foreground hover:bg-secondary font-mono text-sm px-8 py-3 rounded-xl"
              asChild
            >
              <Link href="#benchmarks">
                <Activity className="w-4 h-4 mr-2 text-cyan-400" /> Diagnostic Battery
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-border/60 text-foreground hover:bg-secondary font-mono text-sm px-8 py-3 rounded-xl"
              asChild
            >
              <Link href="/dashboard">
                <BarChart3 className="w-4 h-4 mr-2 text-cyan-400" /> Command Center
              </Link>
            </Button>
          </div>

          {/* User Status Bar if already played */}
          {userStats.totalGamesPlayed > 0 && (
            <div className="pt-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-card/60 border border-border/60 text-xs font-mono text-muted-foreground hover:border-cyan-500/40 transition-colors"
              >
                <span>
                  Telemetry Active: <strong className="text-foreground">{completedCount} of 9</strong> Tests Calibrated
                </span>
                <span className="text-cyan-400 font-bold">CGI: {userStats.cgi} ({userStats.tier}) →</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Global Metrics Bar */}
      <section className="py-6 border-y border-border/40 bg-card/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-mono">
          <div>
            <div className="text-2xl font-bold text-foreground tabular">9</div>
            <div className="text-xs text-muted-foreground">Standardized Batteries</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-400 tabular">5-Axis</div>
            <div className="text-xs text-muted-foreground">Cognitive Radar</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 tabular">P99/P50</div>
            <div className="text-xs text-muted-foreground">Gaussian Distributions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-violet-400 tabular">0.1ms</div>
            <div className="text-xs text-muted-foreground">Telemetry Precision</div>
          </div>
        </div>
      </section>

      {/* Benchmark Battery Section */}
      <section id="benchmarks" className="py-16 px-4 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Section Header & Category Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase text-cyan-400">Diagnostic Battery</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
                All Cognitive Benchmarks
              </h2>
            </div>

            {/* Interactive Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-secondary/60 border border-border/40 text-xs font-mono">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedCategory === cat
                      ? "bg-background text-cyan-400 shadow-sm font-bold border border-border/60"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <TestCard key={test.id} {...test} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
