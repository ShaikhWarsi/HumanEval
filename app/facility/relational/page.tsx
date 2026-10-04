// app/facility/relational/page.tsx
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import {
  Layers,
  Zap,
  ArrowRight,
  RotateCcw,
  Clock,
  Sparkles,
  HelpCircle,
  Activity,
  Award,
} from "lucide-react"
import { FacilityNav } from "@/components/facility-nav"
import {
  RelationalEngine,
  type RelationalItem,
  type RelationalModality,
} from "@/lib/rit-engine"
import { FatigueMonitor } from "@/lib/fatigue-engine"
import { sound } from "@/lib/audio"

export default function RelationalGymPage() {
  const [modality, setModality] = useState<RelationalModality>("numerical")
  const [theta, setTheta] = useState<number>(0.5) // Initial ability parameter
  const [currentItem, setCurrentItem] = useState<RelationalItem | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState<boolean>(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [startTime, setStartTime] = useState<number>(0)
  const [timeLeftMs, setTimeLeftMs] = useState<number>(20000)
  const [trialCount, setTrialCount] = useState<number>(0)
  const [correctCount, setCorrectCount] = useState<number>(0)
  const [latencies, setLatencies] = useState<number[]>([])

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Load new item
  const loadNewProblem = useCallback(
    (currentMod: RelationalModality = modality, currentTh: number = theta) => {
      if (timerRef.current) clearInterval(timerRef.current)
      const item = RelationalEngine.generateAdaptiveItem(currentTh, currentMod)
      setCurrentItem(item)
      setSelectedOption(null)
      setIsAnswered(false)
      setIsCorrect(null)
      setTimeLeftMs(item.timeLimitMs)
      setStartTime(Date.now())

      // Start countdown
      const start = Date.now()
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - start
        const remaining = Math.max(0, item.timeLimitMs - elapsed)
        setTimeLeftMs(remaining)

        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current)
          handleTimeOut(item, currentTh)
        }
      }, 50)
    },
    [modality, theta]
  )

  useEffect(() => {
    loadNewProblem(modality, theta)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handleTimeOut = (item: RelationalItem, curTheta: number) => {
    setIsAnswered(true)
    setIsCorrect(false)
    sound.playError()
    FatigueMonitor.recordSample(item.timeLimitMs, true)

    const newTheta = RelationalEngine.calculateUpdatedTheta(
      curTheta,
      item.depth,
      false,
      item.timeLimitMs,
      item.timeLimitMs
    )
    setTheta(newTheta)
    setTrialCount((prev) => prev + 1)
  }

  const handleOptionSelect = (option: string) => {
    if (isAnswered || !currentItem) return
    if (timerRef.current) clearInterval(timerRef.current)

    const latency = Date.now() - startTime
    setSelectedOption(option)
    setIsAnswered(true)

    const correct = option === currentItem.correctDeduction
    setIsCorrect(correct)

    if (correct) {
      sound.playSuccess()
      setCorrectCount((prev) => prev + 1)
    } else {
      sound.playError()
    }

    // Telemetry & Fatigue tracking
    FatigueMonitor.recordSample(latency, !correct)
    setLatencies((prev) => [...prev, latency])

    // Update latent ability theta
    const newTheta = RelationalEngine.calculateUpdatedTheta(
      theta,
      currentItem.depth,
      correct,
      latency,
      currentItem.timeLimitMs
    )
    setTheta(newTheta)
    setTrialCount((prev) => prev + 1)
  }

  const handleModalityChange = (newMod: RelationalModality) => {
    sound.playClick()
    setModality(newMod)
    loadNewProblem(newMod, theta)
  }

  const handleNext = () => {
    sound.playClick()
    loadNewProblem(modality, theta)
  }

  const avgLatency =
    latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0
  const successRate = trialCount > 0 ? Math.round((correctCount / trialCount) * 100) : 0
  const timerPercentage = currentItem ? (timeLeftMs / currentItem.timeLimitMs) * 100 : 100

  return (
    <div className="min-h-screen pb-20 dot-grid mesh-glow">
      <FacilityNav />

      <main className="max-w-5xl mx-auto px-4 pt-8 space-y-6">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Link href="/facility" className="hover:underline">
                Facility
              </Link>
              <span>/</span>
              <span>Relational Gym</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-foreground flex items-center gap-2">
              <Layers className="w-6 h-6 text-cyan-400" />
              <span>Relational Integration Training (RIT)</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Grounded in Wang et al. (2025). Conditioning the biological core of Fluid Intelligence (Gf).
            </p>
          </div>

          {/* Theta Badge */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl cyber-card border border-cyan-500/30 font-mono text-xs text-right">
              <span className="text-[10px] text-muted-foreground block">ESTIMATED ABILITY θ</span>
              <span className="text-lg font-bold text-cyan-400 tabular">
                {theta >= 0 ? `+${theta}` : theta}
              </span>
            </div>
          </div>
        </div>

        {/* Modality Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
          <span className="text-muted-foreground text-[11px] uppercase mr-1">Modality:</span>
          {(["numerical", "causal", "verbal"] as RelationalModality[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModalityChange(m)}
              className={`px-3 py-1.5 rounded-lg border capitalize transition-all ${
                modality === m
                  ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/40 font-bold"
                  : "bg-muted/20 text-muted-foreground border-border/40 hover:text-foreground"
              }`}
            >
              {m} Reasoning
            </button>
          ))}
        </div>

        {/* Main Relational Arena Card */}
        {currentItem && (
          <div className="cyber-card p-6 sm:p-8 rounded-2xl border border-border/80 space-y-6 relative overflow-hidden">
            {/* Top Bar: Depth & Countdown */}
            <div className="flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold">
                  DEPTH R{currentItem.depth}
                </span>
                <span className="text-muted-foreground hidden sm:inline">
                  {currentItem.premises.length} Premise Coordinates
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span
                  className={`tabular font-bold ${
                    timeLeftMs < 5000 ? "text-red-400 animate-pulse" : "text-muted-foreground"
                  }`}
                >
                  {(timeLeftMs / 1000).toFixed(1)}s
                </span>
              </div>
            </div>

            {/* Countdown Progress Bar */}
            <div className="w-full h-1 bg-muted/40 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-75 ${
                  timerPercentage < 25 ? "bg-red-500" : timerPercentage < 50 ? "bg-amber-500" : "bg-cyan-500"
                }`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>

            {/* Premises Section */}
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Given Coordinate Premises:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {currentItem.premises.map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl border border-border/60 bg-muted/20 font-mono flex items-center justify-between text-sm shadow-sm"
                  >
                    <span className="text-foreground font-medium">{p.entityA}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold text-xs border border-cyan-500/20">
                      {p.relation}
                    </span>
                    <span className="text-foreground font-medium">{p.entityB}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Query Prompt */}
            <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 font-mono text-center space-y-1">
              <span className="text-xs uppercase text-cyan-400/80 block">Target Relational Deduction</span>
              <p className="text-base sm:text-lg font-bold text-foreground">
                Deduce the true relation between:{" "}
                <span className="text-cyan-400 underline decoration-cyan-500/40">{currentItem.targetEntityA}</span>
                {" "}and{" "}
                <span className="text-cyan-400 underline decoration-cyan-500/40">{currentItem.targetEntityB}</span>
              </p>
            </div>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono">
              {currentItem.options.map((opt) => {
                const isThisSelected = selectedOption === opt
                const isThisCorrect = opt === currentItem.correctDeduction

                let btnStyle = "bg-muted/20 border-border/50 text-foreground hover:bg-muted/40 hover:border-border"
                if (isAnswered) {
                  if (isThisCorrect) {
                    btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-sm shadow-emerald-500/20"
                  } else if (isThisSelected) {
                    btnStyle = "bg-red-500/20 border-red-500 text-red-300 font-bold"
                  } else {
                    btnStyle = "opacity-40 border-border/30 text-muted-foreground"
                  }
                }

                return (
                  <button
                    key={opt}
                    disabled={isAnswered}
                    onClick={() => handleOptionSelect(opt)}
                    className={`p-4 rounded-xl border text-sm text-left transition-all ${btnStyle}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opt}</span>
                      {isAnswered && isThisCorrect && (
                        <Award className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Post-Trial Explanation & Next Button */}
            {isAnswered && (
              <div className="p-5 rounded-xl border border-border/60 bg-muted/10 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold uppercase text-foreground">Deductive Proof:</span>
                  </div>
                  <span
                    className={`text-xs font-bold uppercase ${
                      isCorrect ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {isCorrect ? "Correct Deduction (+θ)" : "Error / Incomplete Binding (-θ)"}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                  {currentItem.explanation}
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2"
                  >
                    <span>Next Relational Problem</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Session Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl cyber-card border border-border/50">
            <span className="text-[10px] text-muted-foreground block">TRIALS COMPLETED</span>
            <span className="text-lg font-bold text-foreground tabular">{trialCount}</span>
          </div>
          <div className="p-3.5 rounded-xl cyber-card border border-border/50">
            <span className="text-[10px] text-muted-foreground block">DEDUCTION ACCURACY</span>
            <span className="text-lg font-bold text-cyan-400 tabular">{successRate}%</span>
          </div>
          <div className="p-3.5 rounded-xl cyber-card border border-border/50">
            <span className="text-[10px] text-muted-foreground block">AVERAGE LATENCY</span>
            <span className="text-lg font-bold text-foreground tabular">
              {avgLatency > 0 ? `${avgLatency} ms` : "—"}
            </span>
          </div>
          <div className="p-3.5 rounded-xl cyber-card border border-border/50">
            <span className="text-[10px] text-muted-foreground block">TARGET DEPTH</span>
            <span className="text-lg font-bold text-emerald-400 tabular">
              R{currentItem?.depth ?? 2}
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
