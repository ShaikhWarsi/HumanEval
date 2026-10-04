// app/facility/calibration/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Compass,
  ArrowRight,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Award,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  BarChart3,
} from "lucide-react"
import { FacilityNav } from "@/components/facility-nav"
import { ConfidenceSlider } from "@/components/confidence-slider"
import {
  CalibrationEngine,
  CURATED_CALIBRATION_ITEMS,
  type CalibrationItem,
  type CalibrationSummary,
  type ErrorHypothesis,
} from "@/lib/calibration-engine"
import { sound } from "@/lib/audio"

export default function CalibrationPage() {
  const [items] = useState<CalibrationItem[]>(CURATED_CALIBRATION_ITEMS)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [probability, setProbability] = useState<number>(0.5)
  const [selectedHypothesis, setSelectedHypothesis] = useState<ErrorHypothesis>("heuristic_bias")
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [lastBrier, setLastBrier] = useState<number | null>(null)
  const [summary, setSummary] = useState<CalibrationSummary | null>(null)

  const currentItem = items[currentIndex]

  useEffect(() => {
    setSummary(CalibrationEngine.computeSummary())
  }, [])

  const handleSubmit = () => {
    if (isSubmitted) return
    const trial = CalibrationEngine.recordTrial(
      currentItem.id,
      probability,
      currentItem.isTrue,
      selectedHypothesis
    )

    setLastBrier(trial.brierScore)
    setIsSubmitted(true)
    setSummary(CalibrationEngine.computeSummary())

    if (trial.isCorrect) {
      sound.playSuccess()
    } else {
      sound.playError()
    }
  }

  const handleNext = () => {
    sound.playClick()
    const nextIdx = (currentIndex + 1) % items.length
    setCurrentIndex(nextIdx)
    setIsSubmitted(false)
    setProbability(0.5)
    setLastBrier(null)
  }

  const hypothesisOptions: { id: ErrorHypothesis; label: string; desc: string }[] = [
    {
      id: "heuristic_bias",
      label: "Heuristic Intuition Trap",
      desc: "Fast System 1 intuition jumped before analytical verification",
    },
    {
      id: "misread_premise",
      label: "Misread Constraint",
      desc: "Glanced past an essential condition or negative quantifier",
    },
    {
      id: "edge_case",
      label: "Boundary / Edge Case Blindspot",
      desc: "Rule holds generally but collapses under extreme values (0, 1, infinity)",
    },
    {
      id: "computation_lapse",
      label: "Analytical Computation Slip",
      desc: "Correct model structure but made an arithmetic or logic error",
    },
    {
      id: "knowledge_void",
      label: "Epistemic Unfamiliarity",
      desc: "Genuinely unfamiliar with domain constants or physical proofs",
    },
  ]

  return (
    <div className="min-h-screen pb-20 dot-grid mesh-glow">
      <FacilityNav />

      <main className="max-w-5xl mx-auto px-4 pt-8 space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <Link href="/facility" className="hover:underline">
                Facility
              </Link>
              <span>/</span>
              <span>Metacognitive Calibration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-foreground flex items-center gap-2">
              <Compass className="w-6 h-6 text-amber-400" />
              <span>Metacognitive Calibration Arena</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Tetlock Brier Scoring: Assess subjective certainty (0%–100%) and classify failure modes before feedback.
            </p>
          </div>

          {/* Brier Score Badge */}
          {summary && (
            <div className="p-3 rounded-xl cyber-card border border-amber-500/30 font-mono text-xs text-right">
              <span className="text-[10px] text-muted-foreground block">LIFETIME BRIER SCORE</span>
              <span
                className={`text-lg font-bold tabular ${
                  summary.overallBrierScore < 0.15
                    ? "text-emerald-400"
                    : summary.overallBrierScore < 0.25
                    ? "text-amber-400"
                    : "text-red-400"
                }`}
              >
                {summary.overallBrierScore.toFixed(3)}
              </span>
              <span className="text-[9px] text-muted-foreground block">
                Bias: {summary.directionalBias >= 0 ? `+${summary.directionalBias}` : summary.directionalBias}
              </span>
            </div>
          )}
        </div>

        {/* Calibration Proposition Card */}
        <div className="cyber-card p-6 sm:p-8 rounded-2xl border border-border/80 space-y-6">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold uppercase">
              Item #{currentIndex + 1} // Domain: {currentItem.domain}
            </span>
            <span className="text-muted-foreground">
              {currentIndex + 1} of {items.length} items
            </span>
          </div>

          {/* Proposition Statement */}
          <div className="p-5 rounded-xl bg-muted/20 border border-border/60">
            <h2 className="text-base sm:text-lg font-mono font-bold text-foreground leading-relaxed">
              &ldquo;{currentItem.statement}&rdquo;
            </h2>
          </div>

          {/* Continuous Probability Slider */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-muted-foreground">
              Estimate Proposition Truth Probability (Credence):
            </span>
            <ConfidenceSlider
              value={probability}
              onChange={setProbability}
              disabled={isSubmitted}
            />
          </div>

          {/* Pre-Feedback Error Hypothesis Classification */}
          {!isSubmitted && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="uppercase font-bold">
                  Forced Pre-Feedback Error Hypothesis:
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-sans">
                If your prediction turns out to be false, what is the most likely cognitive failure mechanism?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                {hypothesisOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedHypothesis(opt.id)
                      sound.playClick()
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedHypothesis === opt.id
                        ? "bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold"
                        : "bg-muted/20 border-border/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="font-semibold">{opt.label}</div>
                    <div className="text-[10px] opacity-70 font-sans mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-mono font-bold text-sm hover:bg-amber-400 transition-all flex items-center gap-2"
                >
                  <span>Commit Credence & Reveal Outcome</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Post-Feedback Debrief */}
          {isSubmitted && (
            <div className="p-6 rounded-xl border border-border/70 bg-muted/10 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-2">
                  {currentItem.isTrue ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className="font-bold text-base text-foreground uppercase">
                    Ground Truth: Proposition is {currentItem.isTrue ? "TRUE" : "FALSE"}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">TRIAL BRIER PENALTY</span>
                  <span
                    className={`font-bold text-sm tabular ${
                      (lastBrier ?? 0) <= 0.1 ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {lastBrier?.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Logical Proof */}
              <div className="space-y-1">
                <span className="text-amber-400 font-bold uppercase block">Rigorous Proof / Explanation:</span>
                <p className="text-muted-foreground font-sans text-xs leading-relaxed">
                  {currentItem.explanation}
                </p>
              </div>

              {/* Common Pitfall */}
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 space-y-1">
                <span className="font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Cognitive Pitfall Trigger:</span>
                </span>
                <p className="font-sans text-[11px] leading-relaxed">
                  {currentItem.commonPitfall}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-2"
                >
                  <span>Next Calibration Problem</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5-Bin Calibration Curve Breakdown */}
        {summary && summary.totalTrials > 0 && (
          <div className="cyber-card p-6 rounded-2xl border border-border/80 space-y-4 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-foreground">
                  Empirical Calibration Curve (Observed Accuracy vs Confidence)
                </h3>
              </div>
              <span className="text-xs text-muted-foreground">
                Total Trials: {summary.totalTrials}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {summary.binnedCurves.map((bin) => (
                <div
                  key={bin.binLabel}
                  className="p-3 rounded-xl border border-border/50 bg-muted/20 text-center space-y-1 text-xs"
                >
                  <span className="text-muted-foreground block text-[11px]">{bin.binLabel}</span>
                  <div className="text-sm font-bold text-foreground tabular">
                    {bin.observedAccuracy}% Hit
                  </div>
                  <span className="text-[10px] text-muted-foreground block">
                    Ideal: ~{bin.midProb * 100}%
                  </span>
                  <span className="text-[9px] text-muted-foreground block">
                    {bin.trialsCount} trials
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
