"use client"

import Link from "next/link"
import { useScore } from "@/lib/score-context"
import { BENCHMARKS } from "@/lib/benchmarks"
import Footer from "@/components/footer"
import {
  Trophy,
  Award,
  Trash2,
  TrendingUp,
  Brain,
  Zap,
  Target,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

export default function ProfilePage() {
  const { userStats, clearAllData, getTestHistory } = useScore()

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto w-full px-4 pt-8 pb-16 flex-1 space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-foreground">
                Neural Performance Profile
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Cognitive telemetry & lifetime achievement ledger
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm("Reset all test telemetry and saved scores?")) {
                clearAllData()
              }
            }}
            className="text-xs font-mono text-rose-400 border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Purge Local Data
          </Button>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="cyber-card rounded-xl p-5">
            <span className="text-xs font-mono text-muted-foreground block mb-1">CGI Rating</span>
            <div className="text-3xl font-mono font-extrabold text-cyan-400 tabular">
              {userStats.cgi}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground mt-1 block">
              Tier: {userStats.tier}
            </span>
          </div>

          <div className="cyber-card rounded-xl p-5">
            <span className="text-xs font-mono text-muted-foreground block mb-1">Total Sessions</span>
            <div className="text-3xl font-mono font-extrabold text-foreground tabular">
              {userStats.totalGamesPlayed}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground mt-1 block">
              Recorded runs
            </span>
          </div>

          <div className="cyber-card rounded-xl p-5">
            <span className="text-xs font-mono text-muted-foreground block mb-1">Calibrated Tests</span>
            <div className="text-3xl font-mono font-extrabold text-emerald-400 tabular">
              {Object.keys(userStats.bestScores).length} / 9
            </div>
            <span className="text-[10px] font-mono text-muted-foreground mt-1 block">
              Active diagnostics
            </span>
          </div>

          <div className="cyber-card rounded-xl p-5">
            <span className="text-xs font-mono text-muted-foreground block mb-1">Unlocked Badges</span>
            <div className="text-3xl font-mono font-extrabold text-violet-400 tabular">
              {userStats.achievements.length}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground mt-1 block">
              Neuro-milestones
            </span>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="cyber-card rounded-2xl p-6">
          <h2 className="text-base font-bold font-mono text-foreground mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" /> Milestone Achievements
          </h2>

          <div className="flex flex-wrap gap-2.5">
            {[
              { id: "First Transmission", desc: "Completed your first benchmark trial" },
              { id: "Neural Calibration", desc: "10 diagnostic trials completed" },
              { id: "Hyper-Focused", desc: "50 total benchmark trials" },
              { id: "Top 10% Neuro", desc: "Reached 90th percentile in any benchmark" },
              { id: "Apex 99th Percentile", desc: "Achieved elite top 1% human performance" },
            ].map((ach) => {
              const unlocked = userStats.achievements.includes(ach.id)
              return (
                <div
                  key={ach.id}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-mono transition-all ${
                    unlocked
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-sm"
                      : "bg-secondary/40 border-border/30 text-muted-foreground/40"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {unlocked ? "★" : "○"} {ach.id}
                  </div>
                  <div className="text-[10px] text-muted-foreground/80 mt-0.5">{ach.desc}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Test Performance Breakdown & Sparkline History */}
        <div className="cyber-card rounded-2xl p-6">
          <h2 className="text-base font-bold font-mono text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Test Performance History (Reaction Time)
          </h2>

          {getTestHistory("reaction-time").length > 1 ? (
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getTestHistory("reaction-time")
                    .slice(-15)
                    .reverse()
                    .map((item, i) => ({
                      attempt: `#${i + 1}`,
                      score: item.score,
                    }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="attempt" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                  <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0d1117",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      fontFamily: "monospace",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#00F0FF"
                    strokeWidth={2.5}
                    dot={{ fill: "#00F0FF", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs font-mono text-muted-foreground py-6 text-center">
              Complete more Reaction Time sessions to populate the historical telemetry graph.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
