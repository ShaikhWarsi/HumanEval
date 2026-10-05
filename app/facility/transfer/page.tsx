// app/facility/transfer/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  PlusCircle,
  HelpCircle,
  TrendingUp,
  FileCheck,
} from "lucide-react"
import { FacilityNav } from "@/components/facility-nav"
import {
  TransferEngine,
  SCIENTIFIC_BENCHMARKS,
  type TransferAuditRecord,
  type TransferAnalysis,
} from "@/lib/transfer-engine"
import { sound } from "@/lib/audio"

export default function TransferAuditPage() {
  const [audits, setAudits] = useState<TransferAuditRecord[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [trainedGain, setTrainedGain] = useState<number>(30.0)
  const [nearGain, setNearGain] = useState<number>(18.0)
  const [farGain, setFarGain] = useState<number>(12.0)
  const [trainedName, setTrainedName] = useState("Relational Integration RIT")
  const [nearName, setNearName] = useState("Matrix Deduction Test")
  const [farName, setFarName] = useState("Quantitative Fermi Reasoning")

  useEffect(() => {
    setAudits(TransferEngine.getAudits())
  }, [])

  const currentTau =
    audits.length > 0
      ? audits[0].transferIndex
      : TransferEngine.calculateTransferIndex(trainedGain, nearGain, farGain)

  const analysis: TransferAnalysis = TransferEngine.analyzeTransfer(currentTau)

  const handleCreateAudit = (e: React.FormEvent) => {
    e.preventDefault()
    sound.playSuccess()

    const newRec = TransferEngine.recordAudit({
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      trainedGainPercent: trainedGain,
      nearTransferGainPercent: nearGain,
      farTransferGainPercent: farGain,
      trainedBatteryName: trainedName,
      nearBatteryName: nearName,
      farBatteryName: farName,
      notes: "30-Day Pre/Post Gauntlet verification cycle",
    })

    setAudits([newRec, ...audits])
    setShowAddForm(false)
  }

  const getTierColor = (tau: number) => {
    if (tau < 0.15) return "text-zinc-400 border-zinc-500/30 bg-zinc-500/10"
    if (tau < 0.35) return "text-amber-400 border-amber-500/30 bg-amber-500/10"
    if (tau < 0.55) return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10"
    return "text-purple-400 border-purple-500/30 bg-purple-500/10"
  }

  return (
    <div className="min-h-screen pb-20 dot-grid mesh-glow">
      <FacilityNav />

      <main className="max-w-5xl mx-auto px-4 pt-8 space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
              <Link href="/facility" className="hover:underline">
                Facility
              </Link>
              <span>/</span>
              <span>Transfer Verification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span>Transfer Verification Audit Dashboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Auditing true cognitive generalization. Eliminates the &ldquo;brain game specialization&rdquo; illusion.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick()
              setShowAddForm(!showAddForm)
            }}
            className="px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-xs hover:bg-purple-500/25 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Gauntlet Audit</span>
          </button>
        </div>

        {/* Primary Transfer Index Hero Card */}
        <div className="cyber-card p-6 sm:p-8 rounded-2xl border border-purple-500/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
            <div>
              <span className="text-xs font-mono uppercase text-purple-400 font-bold block">
                Official Cross-Domain Transfer Index (τ)
              </span>
              <h2 className="text-2xl sm:text-3xl font-mono font-bold text-foreground mt-1">
                {analysis.tierLabel}
              </h2>
            </div>

            <div className={`p-4 rounded-xl border font-mono text-right ${getTierColor(currentTau)}`}>
              <span className="text-[10px] text-muted-foreground block uppercase">TRANSFER COEFFICIENT</span>
              <span className="text-3xl font-bold tabular">τ {currentTau.toFixed(2)}</span>
            </div>
          </div>

          {/* Mathematical Formula Display */}
          <div className="p-4 rounded-xl bg-muted/20 border border-border/60 font-mono text-xs space-y-2">
            <span className="text-muted-foreground block text-[11px] uppercase">Mathematical Specification:</span>
            <div className="text-sm font-bold text-cyan-300">
              τ = (0.6 · Δ_Near + 0.4 · Δ_Far) / Δ_Trained
            </div>
            <p className="text-xs font-sans text-muted-foreground leading-relaxed">
              Where Δ_Trained is the performance gain on practiced gym items, Δ_Near is the gain on unpracticed tasks
              in the same construct, and Δ_Far is the gain on unpracticed tasks in non-overlapping reasoning domains.
            </p>
          </div>

          {/* Diagnostic Narrative */}
          <div className="space-y-2 text-xs font-sans">
            <span className="font-mono text-purple-400 font-bold uppercase block text-[11px]">
              Transfer Verdict & Assessment:
            </span>
            <p className="text-foreground/90 leading-relaxed">{analysis.description}</p>
            <p className="text-muted-foreground italic leading-relaxed pt-1">
              Benchmark comparison: {analysis.scientificBenchmarkComparison}
            </p>
          </div>
        </div>

        {/* Audit Entry Form Modal/Accordion */}
        {showAddForm && (
          <form
            onSubmit={handleCreateAudit}
            className="cyber-card p-6 rounded-2xl border border-border/80 space-y-4 font-mono text-xs"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-purple-400" />
                <span>Log 30-Day Gauntlet Pre/Post Audit Results</span>
              </h3>
              <span className="text-muted-foreground">Manual Verification Entry</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-muted-foreground block">Trained Task Gain (Δ_Trained %)</label>
                <input
                  type="number"
                  step="0.1"
                  value={trainedGain}
                  onChange={(e) => setTrainedGain(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-border/60 bg-muted/20 text-foreground"
                />
                <input
                  type="text"
                  value={trainedName}
                  onChange={(e) => setTrainedName(e.target.value)}
                  placeholder="Task Name"
                  className="w-full p-1.5 text-[11px] rounded border border-border/40 bg-muted/10 text-muted-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground block">Near Transfer Gain (Δ_Near %)</label>
                <input
                  type="number"
                  step="0.1"
                  value={nearGain}
                  onChange={(e) => setNearGain(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-border/60 bg-muted/20 text-foreground"
                />
                <input
                  type="text"
                  value={nearName}
                  onChange={(e) => setNearName(e.target.value)}
                  placeholder="Near Task Name"
                  className="w-full p-1.5 text-[11px] rounded border border-border/40 bg-muted/10 text-muted-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground block">Far Transfer Gain (Δ_Far %)</label>
                <input
                  type="number"
                  step="0.1"
                  value={farGain}
                  onChange={(e) => setFarGain(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-border/60 bg-muted/20 text-foreground"
                />
                <input
                  type="text"
                  value={farName}
                  onChange={(e) => setFarName(e.target.value)}
                  placeholder="Far Task Name"
                  className="w-full p-1.5 text-[11px] rounded border border-border/40 bg-muted/10 text-muted-foreground"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-500 text-black font-bold hover:bg-purple-400 transition-all"
              >
                Save & Calculate Official τ
              </button>
            </div>
          </form>
        )}

        {/* Published Scientific Literature Benchmarks Table */}
        <div className="cyber-card p-6 rounded-2xl border border-border/80 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>2020–2026 Double-Blind RCT Reference Benchmarks</span>
            </h3>
            <span className="text-muted-foreground text-[10px]">Literature Standards</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-[11px] text-muted-foreground uppercase">
                  <th className="py-2 pr-4">Protocol</th>
                  <th className="py-2 px-3">Trained Gain</th>
                  <th className="py-2 px-3">Near Gain</th>
                  <th className="py-2 px-3">Far Gain</th>
                  <th className="py-2 px-3">Transfer τ</th>
                  <th className="py-2 pl-3">Empirical Finding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 text-xs">
                {SCIENTIFIC_BENCHMARKS.map((b) => (
                  <tr key={b.protocol} className="hover:bg-muted/10">
                    <td className="py-3 pr-4 font-semibold text-foreground">{b.protocol}</td>
                    <td className="py-3 px-3 text-muted-foreground">{b.trainedGain}</td>
                    <td className="py-3 px-3 text-muted-foreground">{b.nearGain}</td>
                    <td className="py-3 px-3 text-muted-foreground">{b.farGain}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded border font-bold ${getTierColor(b.transferIndex)}`}>
                        τ {b.transferIndex.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 pl-3 text-muted-foreground font-sans text-[11px] leading-relaxed">
                      {b.finding}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit History Log */}
        <div className="cyber-card p-6 rounded-2xl border border-border/80 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground">Personal Transfer Audit Ledger</h3>
            <span className="text-muted-foreground">{audits.length} Audits Logged</span>
          </div>

          <div className="space-y-2">
            {audits.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-border/60 bg-muted/10 text-center space-y-2">
                <p className="text-muted-foreground font-bold">No empirical transfer audits recorded yet.</p>
                <p className="text-[11px] text-muted-foreground">
                  Complete your baseline assessment, train for a multi-week block, and log your pre/post test gains to calculate your individual Transfer Index τ.
                </p>
              </div>
            ) : (
              audits.map((a) => (
                <div
                  key={a.id}
                  className="p-3.5 rounded-xl border border-border/50 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{a.date}</span>
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getTierColor(a.transferIndex)}`}>
                        τ {a.transferIndex.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Trained: +{a.trainedGainPercent}% ({a.trainedBatteryName}) • Near: +{a.nearTransferGainPercent}% • Far: +{a.farTransferGainPercent}%
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-muted-foreground font-sans">
                    {a.notes || "Verified"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
