"use client"

import Link from "next/link"
import { useScore } from "@/lib/score-context"
import { BENCHMARKS } from "@/lib/benchmarks"
import CognitiveRadarChart from "@/components/radar-chart"
import Footer from "@/components/footer"
import {
  Brain,
  Zap,
  Activity,
  Trophy,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { userStats } = useScore()

  const completedCount = Object.keys(userStats.bestScores).length

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-4 pt-8 pb-16 flex-1 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-black dark:border-white font-mono">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase px-2 py-0.5 border border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black font-black shadow-[1.5px_1.5px_0px_0px_#0A0A0A]">
                NEURAL TELEMETRY
              </span>
              <span className="text-xs text-muted-foreground font-bold uppercase">v2.0 Diagnostics</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground uppercase">
              Cognitive Command Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
            >
              <Link href="/facility">
                <Brain className="w-3.5 h-3.5 mr-1.5" /> Training Facility OS
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
            >
              <Link href="/tests/reaction-time">
                <Zap className="w-3.5 h-3.5 mr-1.5" /> Quick Benchmark
              </Link>
            </Button>
          </div>
        </div>

        {/* Hero Rating Banner & Radar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
          {/* Main CGI Card */}
          <div className="brutal-card p-6 sm:p-8 flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-muted-foreground uppercase font-black tracking-wider">
                  Composite Cognitive Index
                </span>
                <span className="text-xs font-black text-black px-2 py-0.5 border border-black dark:border-white bg-amber-400 dark:bg-cyan-400 shadow-[1.5px_1.5px_0px_0px_#0A0A0A]">
                  {userStats.tier}
                </span>
              </div>

              <div className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-2 tabular truncate">
                {userStats.cgi > 0 ? userStats.cgi : "UNCALIBRATED"}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                {userStats.cgi > 0
                  ? "Normalized index benchmarking your multi-domain human cognitive performance against standardized populations."
                  : "Complete at least 3 cognitive benchmarks to establish your baseline Composite Cognitive Index."}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t-2 border-black dark:border-white text-center">
              <div className="p-2 border border-black dark:border-white bg-card shadow-[1.5px_1.5px_0px_0px_#0A0A0A] dark:shadow-[1.5px_1.5px_0px_0px_#FFFFFF]">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Tests Done</span>
                <span className="text-base font-black text-foreground tabular">
                  {completedCount} / 9
                </span>
              </div>
              <div className="p-2 border border-black dark:border-white bg-card shadow-[1.5px_1.5px_0px_0px_#0A0A0A] dark:shadow-[1.5px_1.5px_0px_0px_#FFFFFF]">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Sessions</span>
                <span className="text-base font-black text-amber-500 dark:text-cyan-400 tabular">
                  {userStats.totalGamesPlayed}
                </span>
              </div>
              <div className="p-2 border border-black dark:border-white bg-card shadow-[1.5px_1.5px_0px_0px_#0A0A0A] dark:shadow-[1.5px_1.5px_0px_0px_#FFFFFF]">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Badges</span>
                <span className="text-base font-black text-emerald-500 tabular">
                  {userStats.achievements.length}
                </span>
              </div>
            </div>
          </div>

          {/* 5-Axis Spider Radar Chart */}
          <div className="lg:col-span-2 brutal-card p-6 sm:p-8 flex flex-col items-center justify-center relative">
            <div className="w-full flex items-center justify-between mb-3 border-b-2 border-black dark:border-white pb-3">
              <h3 className="text-sm font-black uppercase text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500 dark:text-cyan-400 stroke-[2.5]" /> 5-Axis Cognitive Domain Profile
              </h3>
              <span className="text-[11px] uppercase font-bold text-muted-foreground">
                Percentile Performance
              </span>
            </div>

            <CognitiveRadarChart scores={userStats.domainScores} size={280} />
          </div>
        </div>

        {/* 9 Tests Matrix Overview */}
        <div className="font-mono">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
              [ DIAGNOSTIC BATTERY OVERVIEW ]
            </h2>
            <span className="text-xs uppercase text-muted-foreground font-bold">
              {completedCount} OF 9 CALIBRATED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(BENCHMARKS).map((bench) => {
              const best = userStats.bestScores[bench.id]
              return (
                <Link
                  key={bench.id}
                  href={`/tests/${bench.id}`}
                  className="brutal-card p-5 block group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase px-2 py-0.5 border border-black dark:border-white bg-secondary text-foreground font-bold shadow-[1px_1px_0px_0px_#0A0A0A]">
                      {bench.category}
                    </span>
                    {best ? (
                      <span className="text-[11px] font-black text-black bg-emerald-400 px-2 py-0.5 border border-black dark:border-white shadow-[1px_1px_0px_0px_#0A0A0A]">
                        TOP {Math.max(1, Math.round(100 - best.percentile))}%
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase text-muted-foreground font-bold">
                        UNCALIBRATED
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black uppercase text-foreground group-hover:text-amber-500 dark:group-hover:text-cyan-400 transition-colors">
                    {bench.title}
                  </h3>

                  <div className="flex items-baseline justify-between mt-3 pt-3 border-t-2 border-black dark:border-white">
                    <span className="text-xs text-muted-foreground uppercase font-bold">Personal Best:</span>
                    {best ? (
                      <span className="text-sm font-black text-foreground tabular">
                        {best.score}{" "}
                        <span className="text-xs text-muted-foreground">{best.unit}</span>
                      </span>
                    ) : (
                      <span className="text-xs uppercase text-amber-500 dark:text-cyan-400 font-bold flex items-center gap-1 group-hover:underline">
                        Calibrate <ArrowRight className="w-3 h-3 stroke-[2.5]" />
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
          <div className="brutal-card p-6 font-mono">
            <h2 className="text-base font-black uppercase text-foreground mb-4 flex items-center gap-2 border-b-2 border-black dark:border-white pb-3">
              <Trophy className="w-4 h-4 text-amber-500 dark:text-cyan-400 stroke-[2.5]" /> Recent Telemetry Transmissions
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-muted-foreground border-b-2 border-black dark:border-white text-left uppercase font-bold">
                    <th className="pb-3">Test</th>
                    <th className="pb-3">Score</th>
                    <th className="pb-3">Percentile</th>
                    <th className="pb-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/10 dark:divide-white/10">
                  {userStats.recentScores.slice(0, 10).map((score, i) => (
                    <tr key={i} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 font-bold uppercase text-foreground">{score.testName}</td>
                      <td className="py-2.5 text-amber-500 dark:text-cyan-400 font-black tabular">
                        {score.score} {score.unit}
                      </td>
                      <td className="py-2.5 text-emerald-500 font-bold tabular">
                        {score.percentile ? `${score.percentile}%` : "—"}
                      </td>
                      <td className="py-2.5 text-muted-foreground text-right uppercase">
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