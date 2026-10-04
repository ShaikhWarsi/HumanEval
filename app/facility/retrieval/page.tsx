// app/facility/retrieval/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Repeat,
  Brain,
  ArrowRight,
  RotateCcw,
  Clock,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  BookOpen,
} from "lucide-react"
import { FacilityNav } from "@/components/facility-nav"
import {
  SpacingScheduler,
  CURATED_CONCEPTS,
  type ConceptItem,
  type ReviewRecord,
} from "@/lib/spacing-scheduler"
import { sound } from "@/lib/audio"

type Stage = "learn" | "distract" | "recall" | "verify"

export default function RetrievalPage() {
  const [concepts] = useState<ConceptItem[]>(CURATED_CONCEPTS)
  const [selectedConcept, setSelectedConcept] = useState<ConceptItem>(CURATED_CONCEPTS[0])
  const [stage, setStage] = useState<Stage>("learn")
  const [distractSeconds, setDistractSeconds] = useState<number>(5)
  const [userRecallText, setUserRecallText] = useState<string>("")
  const [recallStartTime, setRecallStartTime] = useState<number>(0)
  const [records, setRecords] = useState<Record<string, ReviewRecord>>({})
  const [selectedRating, setSelectedRating] = useState<number | null>(null)

  const distractTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setRecords(SpacingScheduler.getRecords())
  }, [])

  const currentRecord = records[selectedConcept.id] || null
  const currentRetention = currentRecord ? SpacingScheduler.calculateRetention(currentRecord) : null

  const handleStartDistraction = () => {
    sound.playClick()
    setStage("distract")
    setDistractSeconds(5)

    if (distractTimerRef.current) clearInterval(distractTimerRef.current)
    distractTimerRef.current = setInterval(() => {
      setDistractSeconds((prev) => {
        if (prev <= 1) {
          if (distractTimerRef.current) clearInterval(distractTimerRef.current)
          setStage("recall")
          setRecallStartTime(Date.now())
          sound.playTone(520, "triangle", 100, 0.15)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSubmitRecall = () => {
    if (!userRecallText.trim()) return
    sound.playClick()
    setStage("verify")
  }

  const handleRateRetrieval = (quality: number) => {
    sound.playSuccess()
    setSelectedRating(quality)
    const latency = Date.now() - recallStartTime
    const updatedRecord = SpacingScheduler.computeNextReview(
      currentRecord,
      selectedConcept.id,
      quality,
      latency
    )

    const updatedMap = {
      ...records,
      [selectedConcept.id]: updatedRecord,
    }
    setRecords(updatedMap)
    SpacingScheduler.saveRecords(updatedMap)
  }

  const handleNextConcept = (c: ConceptItem) => {
    sound.playClick()
    if (distractTimerRef.current) clearInterval(distractTimerRef.current)
    setSelectedConcept(c)
    setStage("learn")
    setUserRecallText("")
    setSelectedRating(null)
    setDistractSeconds(5)
  }

  return (
    <div className="min-h-screen pb-20 dot-grid mesh-glow">
      <FacilityNav />

      <main className="max-w-5xl mx-auto px-4 pt-8 space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <Link href="/facility" className="hover:underline">
                Facility
              </Link>
              <span>/</span>
              <span>Reconstructive Retrieval</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-foreground flex items-center gap-2">
              <Repeat className="w-6 h-6 text-emerald-400" />
              <span>Frictional Retrieval Arena</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Desirable difficulties protocol: Learn → Wipe echoic memory → Cold reconstruction → Stability update.
            </p>
          </div>

          {currentRecord && (
            <div className="p-3 rounded-xl cyber-card border border-emerald-500/30 font-mono text-xs text-right">
              <span className="text-[10px] text-muted-foreground block">ESTIMATED RETENTION</span>
              <span className="text-lg font-bold text-emerald-400 tabular">
                {currentRetention ? `${Math.round(currentRetention * 100)}%` : "100%"}
              </span>
              <span className="text-[9px] text-muted-foreground block">
                Half-Life S: {currentRecord.stabilityDays}d
              </span>
            </div>
          )}
        </div>

        {/* Concept Selector Drawer */}
        <div className="cyber-card p-4 rounded-xl border border-border/70 space-y-2 font-mono">
          <span className="text-xs text-muted-foreground uppercase">Target Concept Dossier:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {concepts.map((c) => {
              const rec = records[c.id]
              const ret = rec ? SpacingScheduler.calculateRetention(rec) : null
              const isSelected = selectedConcept.id === c.id

              return (
                <button
                  key={c.id}
                  onClick={() => handleNextConcept(c)}
                  className={`p-3 rounded-lg text-left border transition-all ${
                    isSelected
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold"
                      : "bg-muted/20 border-border/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="text-xs truncate">{c.title}</div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                    <span>{c.category}</span>
                    <span className="tabular">
                      {ret !== null ? `${Math.round(ret * 100)}% retention` : "New Concept"}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 4-Stage Protocol Stepper */}
        <div className="grid grid-cols-4 gap-2 font-mono text-xs text-center">
          {[
            { id: "learn", label: "1. Encoding" },
            { id: "distract", label: "2. Interference" },
            { id: "recall", label: "3. Cold Recall" },
            { id: "verify", label: "4. Verification" },
          ].map((s) => (
            <div
              key={s.id}
              className={`p-2 rounded-lg border transition-all ${
                stage === s.id
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold"
                  : "bg-muted/10 text-muted-foreground border-border/30 opacity-70"
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>

        {/* STAGE 1: ENCODING */}
        {stage === "learn" && (
          <div className="cyber-card p-6 sm:p-8 rounded-2xl border border-border/80 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                Phase 1 // High-Density Encoding
              </span>
              <h2 className="text-xl sm:text-2xl font-mono font-bold text-foreground">
                {selectedConcept.title}
              </h2>
              <p className="text-xs font-mono text-muted-foreground">
                Core Principle: {selectedConcept.keyPrinciple}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-muted/20 border border-border/60 text-sm text-foreground/90 leading-relaxed font-sans">
              {selectedConcept.denseExplanation}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/40 font-mono text-xs">
              <span className="text-muted-foreground">
                Read carefully. The text will be hidden completely.
              </span>
              <button
                onClick={handleStartDistraction}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all flex items-center gap-2"
              >
                <span>Initiate Interference Task</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: INTERFERENCE / DISTRACTION */}
        {stage === "distract" && (
          <div className="cyber-card p-8 sm:p-12 rounded-2xl border border-amber-500/40 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto animate-pulse">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-amber-400">
                Phase 2 // Echoic Memory Interference
              </span>
              <h2 className="text-xl sm:text-2xl font-mono font-bold text-foreground">
                Wiping Phonological Buffer ({distractSeconds}s)
              </h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Execute this mental operation immediately to prevent shallow echoic replay:
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-background/80 border border-border/70 max-w-lg mx-auto font-mono text-base font-bold text-amber-300">
              {selectedConcept.distractorTask}
            </div>
          </div>
        )}

        {/* STAGE 3: COLD RECONSTRUCTIVE RECALL */}
        {stage === "recall" && (
          <div className="cyber-card p-6 sm:p-8 rounded-2xl border border-border/80 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                Phase 3 // Cold Reconstructive Retrieval
              </span>
              <h2 className="text-lg sm:text-xl font-mono font-bold text-foreground">
                {selectedConcept.retrievalPrompt}
              </h2>
              <p className="text-xs text-muted-foreground font-mono">
                Reconstruct the concept from first principles without looking at notes.
              </p>
            </div>

            <textarea
              rows={6}
              value={userRecallText}
              onChange={(e) => setUserRecallText(e.target.value)}
              placeholder="Type your reconstruction here: detail the core equations, mechanisms, and boundary implications..."
              className="w-full p-4 rounded-xl border border-border/60 bg-muted/20 text-sm font-sans text-foreground focus:outline-none focus:border-emerald-500 transition-colors"
            />

            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-muted-foreground">
                Word count: {userRecallText.trim().split(/\s+/).filter(Boolean).length}
              </span>
              <button
                disabled={!userRecallText.trim()}
                onClick={handleSubmitRecall}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all flex items-center gap-2 disabled:opacity-40"
              >
                <span>Verify Active Reconstruction</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 4: VERIFICATION & STABILITY UPDATE */}
        {stage === "verify" && (
          <div className="cyber-card p-6 sm:p-8 rounded-2xl border border-border/80 space-y-6">
            <div className="flex items-center justify-between font-mono">
              <span className="text-xs uppercase text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                Phase 4 // Side-by-Side Epistemic Delta
              </span>
              <span className="text-xs text-muted-foreground">{selectedConcept.title}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* User Recall */}
              <div className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-2">
                <span className="text-xs font-mono uppercase text-muted-foreground font-bold">
                  Your Reconstructed Output:
                </span>
                <p className="text-xs font-sans text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {userRecallText}
                </p>
              </div>

              {/* Model Gold Standard */}
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                  Model Theoretical Answer:
                </span>
                <p className="text-xs font-sans text-foreground/90 leading-relaxed">
                  {selectedConcept.modelAnswer}
                </p>
              </div>
            </div>

            {/* Crucial Checkpoints */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-muted-foreground font-bold">
                Checkpoints Required for True Grounding:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedConcept.crucialCheckpoints.map((pt, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-border/40 bg-muted/20 text-xs font-mono flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-foreground/90">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FSRS / Quality Self-Rating */}
            <div className="p-5 rounded-xl border border-border/60 bg-muted/20 space-y-3 font-mono">
              <span className="text-xs uppercase font-bold text-foreground block">
                Rate Reconstructive Retrieval Quality (Updates Stability S):
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { q: 1, label: "1: Blackout", desc: "Complete lapse" },
                  { q: 2, label: "2: High Friction", desc: "Heavy cues needed" },
                  { q: 3, label: "3: Core Pass", desc: "Slight hesitation" },
                  { q: 4, label: "4: Crisp Recall", desc: "Effortless grasp" },
                  { q: 5, label: "5: Mastered", desc: "Flawless automaticity" },
                ].map((item) => (
                  <button
                    key={item.q}
                    onClick={() => handleRateRetrieval(item.q)}
                    className={`p-3 rounded-xl border text-xs text-left transition-all ${
                      selectedRating === item.q
                        ? "bg-emerald-500/25 border-emerald-500 text-emerald-300 font-bold"
                        : "bg-muted/30 border-border/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="font-bold">{item.label}</div>
                    <div className="text-[10px] opacity-70">{item.desc}</div>
                  </button>
                ))}
              </div>

              {selectedRating && (
                <div className="pt-3 flex justify-between items-center text-xs">
                  <span className="text-emerald-400">
                    Exponential Stability Half-Life updated to{" "}
                    <strong>{records[selectedConcept.id]?.stabilityDays} days</strong>.
                  </span>
                  <button
                    onClick={() => {
                      const nextIdx = (concepts.findIndex((c) => c.id === selectedConcept.id) + 1) % concepts.length
                      handleNextConcept(concepts[nextIdx])
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all flex items-center gap-1.5"
                  >
                    <span>Next Review Item</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
