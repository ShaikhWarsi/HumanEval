"use client"

import { useState } from "react"
import { useScore } from "@/lib/score-context"
import { BENCHMARKS } from "@/lib/benchmarks"
import Footer from "@/components/footer"
import {
  Award,
  Trash2,
  TrendingUp,
  Brain,
  Download,
  Upload,
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
  const { userStats, clearAllData, getTestHistory, exportBackupData, importBackupData } = useScore()
  const [selectedTestId, setSelectedTestId] = useState("reaction-time")

  const currentHistory = getTestHistory(selectedTestId)
  const currentMeta = BENCHMARKS[selectedTestId]

  return (
    <div className="min-h-screen flex flex-col font-mono">
      <div className="max-w-6xl mx-auto w-full px-4 pt-8 pb-16 flex-1 space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-black dark:border-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black flex items-center justify-center shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
              <Brain className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
                Neural Performance Profile
              </h1>
              <p className="text-xs text-muted-foreground uppercase">
                Cognitive telemetry & lifetime achievement ledger
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const dataStr = exportBackupData()
                const blob = new Blob([dataStr], { type: "application/json" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `humaneval_backup_${new Date().toISOString().slice(0, 10)}.json`
                a.click()
                URL.revokeObjectURL(url)
              }}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export JSON
            </Button>

            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    const content = event.target?.result as string
                    if (content && importBackupData(content)) {
                      alert("Telemetry backup restored successfully.")
                    } else {
                      alert("Invalid backup file format.")
                    }
                  }
                  reader.readAsText(file)
                }}
              />
              <span className="inline-flex items-center justify-center border-2 border-black dark:border-white bg-card px-3 py-1.5 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] hover:bg-secondary">
                <Upload className="w-3.5 h-3.5 mr-1.5" /> Restore
              </span>
            </label>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm("Reset all test telemetry and saved scores?")) {
                  clearAllData()
                }
              }}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Purge
            </Button>
          </div>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="brutal-card p-5">
            <span className="text-xs uppercase text-muted-foreground font-bold block mb-1">CGI Rating</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-cyan-400 tabular truncate">
              {userStats.cgi > 0 ? userStats.cgi : "UNCALIBRATED"}
            </div>
            <span className="text-[10px] uppercase text-muted-foreground mt-1 font-bold block">
              {userStats.cgi > 0 ? `Tier: ${userStats.tier}` : "Complete tests to calibrate"}
            </span>
          </div>

          <div className="brutal-card p-5">
            <span className="text-xs uppercase text-muted-foreground font-bold block mb-1">Total Sessions</span>
            <div className="text-3xl font-black text-foreground tabular">
              {userStats.totalGamesPlayed}
            </div>
            <span className="text-[10px] uppercase text-muted-foreground mt-1 font-bold block">
              Recorded runs
            </span>
          </div>

          <div className="brutal-card p-5">
            <span className="text-xs uppercase text-muted-foreground font-bold block mb-1">Calibrated Tests</span>
            <div className="text-3xl font-black text-emerald-500 tabular">
              {Object.keys(userStats.bestScores).length} / 9
            </div>
            <span className="text-[10px] uppercase text-muted-foreground mt-1 font-bold block">
              Active diagnostics
            </span>
          </div>

          <div className="brutal-card p-5">
            <span className="text-xs uppercase text-muted-foreground font-bold block mb-1">Unlocked Badges</span>
            <div className="text-3xl font-black text-purple-500 tabular">
              {userStats.achievements.length}
            </div>
            <span className="text-[10px] uppercase text-muted-foreground mt-1 font-bold block">
              Neuro-milestones
            </span>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="brutal-card p-6">
          <h2 className="text-base font-black uppercase text-foreground mb-4 flex items-center gap-2 border-b-2 border-black dark:border-white pb-3">
            <Award className="w-4 h-4 text-amber-500 dark:text-cyan-400 stroke-[2.5]" /> Milestone Achievements
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                  className={`p-3.5 border-2 border-black dark:border-white text-xs transition-all shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] ${
                    unlocked
                      ? "bg-amber-400 dark:bg-cyan-400 text-black font-black"
                      : "bg-card text-muted-foreground opacity-60"
                  }`}
                >
                  <div className="font-black uppercase flex items-center gap-1.5">
                    {unlocked ? "★" : "○"} {ach.id}
                  </div>
                  <div className="text-[10px] uppercase mt-1 opacity-90">{ach.desc}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Test Performance Breakdown & Sparkline History */}
        <div className="brutal-card p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 border-b-2 border-black dark:border-white pb-3">
            <h2 className="text-base font-black uppercase text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500 stroke-[2.5]" /> History: {currentMeta?.title ?? selectedTestId}
            </h2>

            {/* Test switcher buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
              {Object.keys(BENCHMARKS).map((id) => (
                <button
                  key={id}
                  onClick={() => setSelectedTestId(id)}
                  className={`px-2.5 py-1 text-[11px] font-mono uppercase font-bold border-2 border-black dark:border-white whitespace-nowrap transition-all shadow-[1.5px_1.5px_0px_0px_#0A0A0A] dark:shadow-[1.5px_1.5px_0px_0px_#FFFFFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer ${
                    selectedTestId === id
                      ? "bg-amber-400 dark:bg-cyan-400 text-black font-black"
                      : "bg-card text-foreground hover:bg-secondary"
                  }`}
                >
                  {BENCHMARKS[id].title}
                </button>
              ))}
            </div>
          </div>

          {currentHistory.length > 1 ? (
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={currentHistory
                    .slice(-15)
                    .reverse()
                    .map((item, i) => ({
                      attempt: `#${i + 1}`,
                      score: item.score,
                    }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.15} />
                  <XAxis dataKey="attempt" stroke="currentColor" strokeOpacity={0.6} fontSize={11} fontFamily="monospace" />
                  <YAxis stroke="currentColor" strokeOpacity={0.6} fontSize={11} fontFamily="monospace" domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "2px solid currentColor",
                      borderRadius: "0px",
                      boxShadow: "3px 3px 0px 0px currentColor",
                      fontFamily: "monospace",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                    formatter={(val: any) => [`${val} ${currentMeta?.unit ?? ""}`, "Score"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    dot={{ stroke: "currentColor", strokeWidth: 2, r: 4, fill: "var(--card)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs uppercase text-muted-foreground py-6 text-center font-bold">
              Complete at least 2 trials of {currentMeta?.title ?? selectedTestId} to view the historical performance trendline.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
