"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  BENCHMARKS,
  calculateExactPercentile,
  calculatePercentile,
  formatPercentileBadge,
  getEmpiricalDistributionCurve,
} from "@/lib/benchmarks"
import {
  BarChart3,
  Brain,
  Zap,
  Target,
  Hash,
  MessageSquare,
  Eye,
  Keyboard,
  BookOpen,
  Grid3X3,
  Download,
  Sliders,
  Scale,
  Award,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react"
import Footer from "@/components/footer"

const iconMap: Record<string, any> = {
  Zap,
  Target,
  Grid3X3,
  Hash,
  MessageSquare,
  Brain,
  Eye,
  Keyboard,
  BookOpen,
}

export default function BenchmarksRegistryPage() {
  const [selectedTestId, setSelectedTestId] = useState("reaction-time")
  const meta = BENCHMARKS[selectedTestId]

  // Interactive calculator state
  const defaultScore = meta ? meta.median : 273
  const [interactiveScore, setInteractiveScore] = useState<number>(defaultScore)

  const handleTestSelect = (id: string) => {
    setSelectedTestId(id)
    setInteractiveScore(BENCHMARKS[id].median)
  }

  const exactP = calculateExactPercentile(selectedTestId, interactiveScore)
  const roundedP = calculatePercentile(selectedTestId, interactiveScore)
  const badge = formatPercentileBadge(roundedP)
  const curveData = getEmpiricalDistributionCurve(selectedTestId, interactiveScore, 420, 140, 24)

  const IconComp = iconMap[meta?.icon || "Brain"] || Brain

  return (
    <div className="min-h-screen flex flex-col font-mono text-foreground">
      {/* Top Banner */}
      <section className="border-b-2 border-black dark:border-white bg-card py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black dark:border-white bg-emerald-400 text-black font-black uppercase shadow-[2px_2px_0px_0px_#0A0A0A]">
              <BarChart3 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>EMPIRICAL NORMATIVE REGISTRY • N = 82,000,000+ SAMPLES</span>
            </div>
            <Link
              href="/science"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-bold underline underline-offset-4"
            >
              Read Mathematical Whitepaper <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-foreground">
            Empirical Quantile Norms
          </h1>
          <p className="text-sm text-muted-foreground max-w-3xl font-sans leading-relaxed">
            High-density empirical quantile reference tables derived from the largest public cognitive telemetry archives and peer-reviewed neuropsychological literature. Zero parametric Gaussian assumptions.
          </p>

          {/* Test Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-4">
            {Object.values(BENCHMARKS).map((b) => {
              const TabIcon = iconMap[b.icon] || Brain
              const active = selectedTestId === b.id
              return (
                <button
                  key={b.id}
                  onClick={() => handleTestSelect(b.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold uppercase whitespace-nowrap border-2 border-black dark:border-white transition-all shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] cursor-pointer ${
                    active
                      ? "bg-amber-400 dark:bg-cyan-400 text-black font-black translate-x-[-1px] translate-y-[-1px]"
                      : "bg-card text-foreground hover:bg-secondary"
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{b.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Registry Explorer */}
      <main className="max-w-6xl mx-auto w-full px-4 py-10 flex-1 space-y-10">
        {/* Metadata & Statistical Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="brutal-card p-4 space-y-1">
            <span className="text-muted-foreground uppercase text-[10px] font-bold block">
              Population Median (P50)
            </span>
            <div className="text-2xl font-black text-foreground">
              {meta.median} <span className="text-xs text-muted-foreground font-sans">{meta.unit}</span>
            </div>
            <span className="text-[10px] text-muted-foreground block font-sans">
              Exact modal center of mass
            </span>
          </div>

          <div className="brutal-card p-4 space-y-1">
            <span className="text-muted-foreground uppercase text-[10px] font-bold block">
              Empirical Sample Size
            </span>
            <div className="text-2xl font-black text-amber-500 dark:text-cyan-400">
              {meta.sampleSize}
            </div>
            <span className="text-[10px] text-muted-foreground block font-sans">
              Aggregated verification cohort
            </span>
          </div>

          <div className="brutal-card p-4 space-y-1">
            <span className="text-muted-foreground uppercase text-[10px] font-bold block">
              Distribution Topology
            </span>
            <div className="text-2xl font-black text-foreground uppercase text-base sm:text-lg">
              {meta.distributionType.replace("-", " ")}
            </div>
            <span className="text-[10px] text-muted-foreground block font-sans">
              {meta.lowerIsBetter ? "Lower is better (Positive Skew)" : "Higher is better"}
            </span>
          </div>

          <div className="brutal-card p-4 space-y-1">
            <span className="text-muted-foreground uppercase text-[10px] font-bold block">
              Diagnostic Category
            </span>
            <div className="text-2xl font-black text-foreground">
              {meta.category}
            </div>
            <span className="text-[10px] text-muted-foreground block font-sans">
              {meta.description}
            </span>
          </div>
        </div>

        {/* Interactive Quantile Calculator Section */}
        <div className="brutal-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-black dark:border-white pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black flex items-center justify-center font-bold">
                <IconComp className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black uppercase text-foreground">
                  Interactive Empirical Quantile Calculator
                </h2>
                <p className="text-xs text-muted-foreground font-sans">
                  Evaluate any arbitrary score against empirical population knots with piecewise monotonic interpolation.
                </p>
              </div>
            </div>

            <div className={`px-3 py-1 border-2 border-black dark:border-white text-xs font-mono font-bold ${badge.badgeClass}`}>
              {badge.label} • {roundedP}TH %ILE (±4% SEM)
            </div>
          </div>

          {/* Interactive Slider & Number Input */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-2 md:col-span-2">
              <div className="flex justify-between text-xs font-mono">
                <label className="font-bold uppercase text-foreground">
                  Test Score ({meta.unit}):
                </label>
                <span className="text-amber-500 dark:text-cyan-400 font-bold">
                  {interactiveScore} {meta.unit}
                </span>
              </div>
              <input
                type="range"
                min={meta.quantiles[0][0]}
                max={meta.quantiles[meta.quantiles.length - 1][0]}
                step={meta.unit === "ms" ? 5 : 1}
                value={interactiveScore}
                onChange={(e) => setInteractiveScore(Number(e.target.value))}
                className="w-full accent-amber-500 dark:accent-cyan-400 cursor-pointer h-2 bg-muted border border-black dark:border-white"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>Min: {meta.quantiles[0][0]}{meta.unit}</span>
                <span>Median: {meta.median}{meta.unit}</span>
                <span>Max: {meta.quantiles[meta.quantiles.length - 1][0]}{meta.unit}</span>
              </div>
            </div>

            <div className="p-4 border-2 border-black dark:border-white bg-secondary/50 text-center space-y-1 font-mono">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                Calculated Standing
              </span>
              <div className="text-3xl font-black text-foreground">
                {exactP.toFixed(1)}%
              </div>
              <span className="text-[11px] font-bold text-amber-600 dark:text-cyan-400 block uppercase">
                {badge.sublabel}
              </span>
            </div>
          </div>

          {/* Live Empirical Density Curve SVG */}
          {curveData && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span>[ POPULATION DENSITY CURVE // DERIVATIVE dP/ds ]</span>
                <span>CITATION: {meta.sourceCitation}</span>
              </div>

              <div className="relative w-full h-[150px] bg-background border-2 border-black dark:border-white p-2">
                <svg viewBox="0 0 420 140" className="w-full h-full overflow-visible">
                  {/* Shaded Area */}
                  <path
                    d={`${curveData.pathD} L ${420 - 24} ${140 - 18} L 24 ${140 - 18} Z`}
                    className="fill-amber-400/20 dark:fill-cyan-400/20"
                  />
                  {/* Baseline */}
                  <line x1={24} y1={140 - 18} x2={420 - 24} y2={140 - 18} stroke="currentColor" strokeWidth="2" />

                  {/* Curve Path */}
                  <path d={curveData.pathD} fill="none" stroke="currentColor" strokeWidth="2.5" />

                  {/* Median Line */}
                  <line
                    x1={curveData.medianX}
                    y1={20}
                    x2={curveData.medianX}
                    y2={140 - 18}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="opacity-50"
                  />
                  <text
                    x={curveData.medianX}
                    y={140 - 4}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="9"
                    fontFamily="monospace"
                    className="text-muted-foreground"
                  >
                    MEDIAN {meta.median}{meta.unit}
                  </text>

                  {/* User Score Marker */}
                  <line
                    x1={curveData.userX}
                    y1={12}
                    x2={curveData.userX}
                    y2={140 - 18}
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-amber-500 dark:text-sky-400"
                  />
                  <rect
                    x={curveData.userX - 4}
                    y={8}
                    width={8}
                    height={8}
                    className="fill-amber-500 dark:fill-sky-400 stroke-black dark:stroke-slate-900"
                    strokeWidth={1}
                  />
                  <text
                    x={curveData.userX}
                    y={4}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                    className="text-amber-500 dark:text-sky-400"
                  >
                    SCORE {interactiveScore}{meta.unit}
                  </text>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Raw Empirical Quantile Knot Table */}
        <div className="brutal-card p-6 sm:p-8 space-y-4 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black dark:border-white pb-3">
            <div>
              <h3 className="text-base font-black uppercase text-foreground">
                Raw Quantile Knot Architecture: {meta.title}
              </h3>
              <p className="text-xs text-muted-foreground font-sans">
                Source: {meta.sourceCitation}
              </p>
            </div>

            <button
              onClick={() => {
                const dataStr = JSON.stringify(meta.quantiles, null, 2)
                const blob = new Blob([dataStr], { type: "application/json" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `humaneval_quantiles_${meta.id}.json`
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase border-2 border-black dark:border-white bg-card hover:bg-secondary transition-all shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export Quantile JSON
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-black dark:border-white bg-secondary">
                  <th className="p-2.5 uppercase">Knot Index</th>
                  <th className="p-2.5 uppercase">Score Value ({meta.unit})</th>
                  <th className="p-2.5 uppercase">Empirical Percentile</th>
                  <th className="p-2.5 uppercase">Population Tier</th>
                  <th className="p-2.5 uppercase">Clinical Bracket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/20 dark:divide-white/20 text-[11px]">
                {meta.quantiles.map(([score, p], idx) => {
                  const b = formatPercentileBadge(p)
                  return (
                    <tr key={idx} className="hover:bg-muted/40 transition-colors">
                      <td className="p-2.5 font-bold text-muted-foreground">K_{idx + 1}</td>
                      <td className="p-2.5 font-bold text-foreground">{score} {meta.unit}</td>
                      <td className="p-2.5 font-bold text-amber-500 dark:text-cyan-400">{p.toFixed(1)}%</td>
                      <td className="p-2.5">{b.label}</td>
                      <td className="p-2.5 text-muted-foreground">{b.sublabel}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
