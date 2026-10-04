"use client"

import Link from "next/link"
import { useScore } from "@/lib/score-context"
import { BENCHMARKS } from "@/lib/benchmarks"
import CognitiveRadarChart from "@/components/radar-chart"
import Footer from "@/components/footer"
import {
  Brain,
  Zap,
  Target,
  Trophy,
  Activity,
  Award,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { userStats, clearAllData } = useScore()

  const completedCount = Object.keys(userStats.bestScores).length

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-4 pt-8 pb-16 flex-1 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                Neural Telemetry
              </span>
              <span className="text-xs font-mono text-muted-foreground">v2.0 Diagnostics</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-mono">
              Cognitive Command Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs rounded-xl"
            >
              <Link href="/facility">
                <Brain className="w-3.5 h-3.5 mr-1.5" /> Training Facility OS 2.0
              </Link>
            </Button>
            <Button
              asChild
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs rounded-xl"
            >
              <Link href="/tests/reaction-time">
                <Zap className="w-3.5 h-3.5 mr-1.5" /> Quick Benchmark
              </Link>
            </Button>
          </div>
        </div>

        {/* Hero Rating Banner & Radar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main CGI Card */}
          <div className="cyber-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Composite Cognitive Index
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  {userStats.tier}
                </span>
              </div>

              <div className="text-6xl sm:text-7xl font-mono font-black text-foreground tracking-tight mb-2 tabular">
                {userStats.cgi}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Normalized index benchmarking your multi-domain human cognitive performance against standardized populations.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-border/40 text-center font-mono">
              <div>
                <span className="text-[10px] text-muted-foreground block">Tests Done</span>
                <span className="text-lg font-bold text-foreground tabular">
                  {completedCount} / 9
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Sessions</span>
                <span className="text-lg font-bold text-cyan-400 tabular">
                  {userStats.totalGamesPlayed}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Badges</span>
                <span className="text-lg font-bold text-emerald-400 tabular">
                  {userStats.achievements.length}
                </span>
              </div>
            </div>
          </div>

          {/* 5-Axis Spider Radar Chart */}
          <div className="lg:col-span-2 cyber-card rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center relative">
            <div className="w-full flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold font-mono text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> 5-Axis Cognitive Domain Profile
              </h3>
              <span className="text-[11px] font-mono text-muted-foreground">
                Percentile Performance
              </span>
            </div>

            <CognitiveRadarChart scores={userStats.domainScores} size={280} />
          </div>
        </div>

        {/* 9 Tests Matrix Overview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-mono tracking-tight text-foreground">
              Diagnostic Battery Overview
            </h2>
            <span className="text-xs font-mono text-muted-foreground">
              {completedCount} of 9 Calibrated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(BENCHMARKS).map((bench) => {
              const best = userStats.bestScores[bench.id]
              return (
                <Link
                  key={bench.id}
                  href={`/tests/${bench.id}`}
                  className="cyber-card rounded-xl p-5 block group transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                      {bench.category}
                    </span>
                    {best ? (
                      <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Top {Math.max(1, Math.round(100 - best.percentile))}%
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-muted-foreground/60">
                        Uncalibrated
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-foreground group-hover:text-cyan-400 transition-colors">
                    {bench.title}
                  </h3>

                  <div className="flex items-baseline justify-between mt-3 pt-3 border-t border-border/40">
                    <span className="text-xs text-muted-foreground font-mono">Personal Best:</span>
                    {best ? (
                      <span className="text-sm font-bold font-mono text-foreground tabular">
                        {best.score}{" "}
                        <span className="text-xs text-muted-foreground">{best.unit}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-cyan-400/80 font-mono flex items-center gap-1 group-hover:underline">
                        Calibrate <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Session Log */}
        {userStats.recentScores.length > 0 && (
          <div className="cyber-card rounded-2xl p-6">
            <h2 className="text-lg font-bold font-mono text-foreground mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-cyan-400" /> Recent Telemetry Transmissions
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-muted-foreground border-b border-border/40 text-left">
                    <th className="pb-3 font-medium">Test</th>
                    <th className="pb-3 font-medium">Score</th>
                    <th className="pb-3 font-medium">Percentile</th>
                    <th className="pb-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {userStats.recentScores.slice(0, 10).map((score, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 font-bold text-foreground">{score.testName}</td>
                      <td className="py-2.5 text-cyan-400 font-bold tabular">
                        {score.score} {score.unit}
                      </td>
                      <td className="py-2.5 text-emerald-400 tabular">
                        {score.percentile ? `${score.percentile}%` : "—"}
                      </td>
                      <td className="py-2.5 text-muted-foreground text-right">
                        {new Date(score.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}