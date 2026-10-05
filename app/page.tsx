"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import TestCard from "@/components/TestCard"
import Footer from "@/components/footer"
import { useScore } from "@/lib/score-context"
import {
  Brain,
  Zap,
  Activity,
  ArrowRight,
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
    color: "text-amber-500 dark:text-cyan-400",
    bgColor: "bg-amber-400 dark:bg-cyan-400",
    isNew: false,
    category: "Speed",
  },
  {
    id: "sequence-memory",
    title: "Sequence Memory",
    description: "Memorize and reproduce spatial pattern sequences that expand each round.",
    icon: "Grid3X3",
    color: "text-purple-400",
    bgColor: "bg-purple-400",
    isNew: false,
    category: "Memory",
  },
  {
    id: "aim-trainer",
    title: "Aim Trainer",
    description: "Ballistic target acquisition and fine neuromuscular motor accuracy.",
    icon: "Target",
    color: "text-rose-400",
    bgColor: "bg-rose-400",
    isNew: false,
    category: "Motor",
  },
  {
    id: "number-memory",
    title: "Number Memory",
    description: "Working memory digit span based on Miller's Law (7 ± 2 items).",
    icon: "Hash",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400",
    isNew: false,
    category: "Memory",
  },
  {
    id: "verbal-memory",
    title: "Verbal Memory",
    description: "Differentiate between familiar seen words and novel lexical entries.",
    icon: "MessageSquare",
    color: "text-amber-400",
    bgColor: "bg-amber-400",
    isNew: false,
    category: "Language",
  },
  {
    id: "chimp-test",
    title: "Chimp Test",
    description: "Evaluate iconic spatial working memory inspired by Ayumu chimpanzee studies.",
    icon: "Brain",
    color: "text-pink-400",
    bgColor: "bg-pink-400",
    isNew: false,
    category: "Vision",
  },
  {
    id: "visual-memory",
    title: "Visual Memory",
    description: "Retain and select coordinates in an expanding matrix of illuminated tiles.",
    icon: "Eye",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400",
    isNew: false,
    category: "Vision",
  },
  {
    id: "typing",
    title: "Typing Speed",
    description: "Measure net typing cadence (WPM), accuracy, and motor rhythm efficiency.",
    icon: "Keyboard",
    color: "text-indigo-400",
    bgColor: "bg-indigo-400",
    isNew: false,
    category: "Motor",
  },
  {
    id: "reading-comprehension",
    title: "Reading Comprehension",
    description: "Synthesize high-speed textual parsing alongside factual comprehension checks.",
    icon: "BookOpen",
    color: "text-teal-400",
    bgColor: "bg-teal-400",
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
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>COGNITIVE BENCHMARK OS 2.0</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight font-mono uppercase text-foreground leading-[1.05]">
            HUMAN <span className="text-amber-500 dark:text-cyan-400">EVALUATION</span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed font-mono">
            Precision cognitive diagnostics and real-time human telemetry. 
            Measure your synaptic reaction velocity, digit span, spatial memory, and motor accuracy against global distributions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Button
              size="lg"
              variant="default"
              asChild
            >
              <Link href="/facility">
                <Cpu className="w-4 h-4 mr-2" /> Training Facility OS 2.0
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="#benchmarks">
                <Activity className="w-4 h-4 mr-2 text-amber-500 dark:text-cyan-400" /> Diagnostic Battery
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/dashboard">
                <BarChart3 className="w-4 h-4 mr-2 text-amber-500 dark:text-cyan-400" /> Command Center
              </Link>
            </Button>
          </div>

          {/* User Status Bar if already played */}
          {userStats.totalGamesPlayed > 0 && (
            <div className="pt-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-4 py-2 border-2 border-black dark:border-white bg-card text-xs font-mono text-foreground shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform"
              >
                <span>
                  Telemetry Active: <strong className="text-foreground">{completedCount} of 9</strong> Tests Calibrated
                </span>
                <span className="text-amber-500 dark:text-cyan-400 font-black">CGI: {userStats.cgi} ({userStats.tier}) →</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Global Metrics Bar */}
      <section className="py-6 border-y-2 border-black dark:border-white bg-card">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black dark:divide-white font-mono text-center">
          <div className="py-2">
            <div className="text-3xl font-black text-foreground tabular">9</div>
            <div className="text-xs uppercase text-muted-foreground font-bold">Standardized Batteries</div>
          </div>
          <div className="py-2">
            <div className="text-3xl font-black text-amber-500 dark:text-cyan-400 tabular">5-Axis</div>
            <div className="text-xs uppercase text-muted-foreground font-bold">Cognitive Radar</div>
          </div>
          <div className="py-2">
            <div className="text-3xl font-black text-emerald-500 tabular">P99/P50</div>
            <div className="text-xs uppercase text-muted-foreground font-bold">Gaussian Distributions</div>
          </div>
          <div className="py-2">
            <div className="text-3xl font-black text-purple-500 tabular">0.1ms</div>
            <div className="text-xs uppercase text-muted-foreground font-bold">Telemetry Precision</div>
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
                <span className="text-xs font-mono uppercase font-black tracking-wider text-amber-500 dark:text-cyan-400">
                  [ DIAGNOSTIC BATTERY ]
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-foreground uppercase">
                All Cognitive Benchmarks
              </h2>
            </div>

            {/* Interactive Category Tabs */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 uppercase font-mono font-bold transition-all border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-amber-400 dark:bg-cyan-400 text-black font-black"
                      : "bg-card text-foreground hover:bg-secondary"
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
