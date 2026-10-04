"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useScore } from "@/lib/score-context"
import { sound } from "@/lib/audio"
import BellCurve from "@/components/bell-curve"
import { Target, RotateCcw, Crosshair } from "lucide-react"

type GameState = "instructions" | "playing" | "result"

interface TargetPosition {
  x: number
  y: number
}

const TOTAL_TARGETS = 30
const TARGET_SIZE = 58

export default function AimTrainerTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [currentTarget, setCurrentTarget] = useState<TargetPosition | null>(null)
  const [targetsHit, setTargetsHit] = useState(0)
  const [totalClicks, setTotalClicks] = useState(0)
  const [misses, setMisses] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [targetTimes, setTargetTimes] = useState<number[]>([])
  const [lastTargetTime, setLastTargetTime] = useState(0)
  const [finalAvgTime, setFinalAvgTime] = useState(0)
  const [finalAccuracy, setFinalAccuracy] = useState(100)
  const [percentile, setPercentile] = useState(50)

  const arenaRef = useRef<HTMLDivElement>(null)
  const { addScore } = useScore()

  const spawnRandomTarget = (): TargetPosition => {
    if (!arenaRef.current) return { x: 50, y: 50 }
    const rect = arenaRef.current.getBoundingClientRect()
    const margin = TARGET_SIZE / 2 + 10
    const x = Math.floor(Math.random() * (rect.width - margin * 2)) + margin
    const y = Math.floor(Math.random() * (rect.height - margin * 2)) + margin
    return { x, y }
  }

  const startGame = () => {
    setGameState("playing")
    setTargetsHit(0)
    setTotalClicks(0)
    setMisses(0)
    setTargetTimes([])
    const now = Date.now()
    setStartTime(now)
    setLastTargetTime(now)
    // Delay slightly to let arena render
    setTimeout(() => {
      setCurrentTarget(spawnRandomTarget())
    }, 50)
  }

  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (gameState !== "playing") return

    sound.playTargetHit()
    const now = Date.now()
    const delta = now - lastTargetTime
    setTargetTimes((prev) => [...prev, delta])
    setLastTargetTime(now)

    const newHitCount = targetsHit + 1
    const newTotalClicks = totalClicks + 1
    setTargetsHit(newHitCount)
    setTotalClicks(newTotalClicks)

    if (newHitCount >= TOTAL_TARGETS) {
      // Game complete
      const allTimes = [...targetTimes, delta]
      const avg = Math.round(allTimes.reduce((a, b) => a + b, 0) / allTimes.length)
      const acc = Math.round((newHitCount / newTotalClicks) * 100)

      setFinalAvgTime(avg)
      setFinalAccuracy(acc)

      const saved = addScore({
        testId: "aim-trainer",
        testName: "Aim Trainer",
        score: avg,
        unit: "ms",
        details: { accuracy: acc, targetsHit: newHitCount, totalClicks: newTotalClicks, misses },
      })
      setPercentile(saved.percentile)
      setGameState("result")
      setCurrentTarget(null)
    } else {
      setCurrentTarget(spawnRandomTarget())
    }
  }

  const handleArenaMiss = () => {
    if (gameState !== "playing") return
    sound.playClick()
    setTotalClicks((prev) => prev + 1)
    setMisses((prev) => prev + 1)
  }

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto cyber-card rounded-2xl p-8 sm:p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-6">
          <Target className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-mono tracking-tight text-foreground mb-3">
          Aim Precision Benchmark
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-6">
          Eliminate 30 randomized targets as quickly as possible.
          Accuracy is strictly evaluated: missed clicks penalize your precision score.
        </p>

        <Button
          onClick={startGame}
          size="lg"
          className="bg-rose-500 hover:bg-rose-400 text-white font-mono font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-rose-500/20"
        >
          Initialize Arena
        </Button>
      </div>
    )
  }

  if (gameState === "result") {
    return (
      <div className="max-w-2xl mx-auto cyber-card rounded-2xl p-8 text-center animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <Crosshair className="w-8 h-8" />
        </div>
        <h2 className="text-xs font-mono uppercase text-muted-foreground tracking-wider mb-1">
          Average Target Acquisition Time
        </h2>
        <div className="text-5xl font-mono font-black text-foreground mb-2 tabular">
          {finalAvgTime} <span className="text-2xl text-rose-400">ms</span>
        </div>

        <div className="flex justify-center gap-6 my-4 text-sm font-mono">
          <div className="px-4 py-2 rounded-xl bg-card/60 border border-border/50">
            <span className="text-muted-foreground text-xs block">Accuracy</span>
            <span className="text-lg font-bold text-emerald-400">{finalAccuracy}%</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-card/60 border border-border/50">
            <span className="text-muted-foreground text-xs block">Targets</span>
            <span className="text-lg font-bold text-foreground">30 / 30</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-card/60 border border-border/50">
            <span className="text-muted-foreground text-xs block">Misses</span>
            <span className="text-lg font-bold text-rose-400">{misses}</span>
          </div>
        </div>

        <BellCurve testId="aim-trainer" score={finalAvgTime} unit="ms" percentile={percentile} />

        <div className="flex gap-3 justify-center mt-6">
          <Button
            onClick={startGame}
            className="bg-rose-500 hover:bg-rose-400 text-white font-mono font-bold px-6 py-2.5 rounded-xl transition-all"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Live Telemetry Bar */}
      <div className="flex items-center justify-between mb-4 px-2 text-xs font-mono">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-muted-foreground">Target: </span>
            <span className="font-bold text-foreground tabular">{targetsHit}</span>
            <span className="text-muted-foreground"> / {TOTAL_TARGETS}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Accuracy: </span>
            <span className="font-bold text-emerald-400 tabular">
              {totalClicks > 0 ? Math.round((targetsHit / totalClicks) * 100) : 100}%
            </span>
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Avg: </span>
          <span className="font-bold text-rose-400 tabular">
            {targetTimes.length > 0
              ? `${Math.round(targetTimes.reduce((a, b) => a + b, 0) / targetTimes.length)}ms`
              : "0ms"}
          </span>
        </div>
      </div>

      {/* Crosshair Arena */}
      <div
        ref={arenaRef}
        onClick={handleArenaMiss}
        className="relative w-full h-[460px] rounded-2xl bg-black/40 border border-border/60 overflow-hidden cursor-cross select-none shadow-inner"
      >
        {currentTarget && (
          <button
            onClick={handleTargetClick}
            style={{
              left: currentTarget.x,
              top: currentTarget.y,
              width: TARGET_SIZE,
              height: TARGET_SIZE,
              transform: "translate(-50%, -50%)",
            }}
            className="absolute rounded-full flex items-center justify-center p-0 border-0 outline-none transition-transform active:scale-90"
          >
            {/* Bullseye rings */}
            <div className="w-full h-full rounded-full bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/50 animate-in zoom-in-50 duration-75">
              <div className="w-3/4 h-3/4 rounded-full bg-white flex items-center justify-center">
                <div className="w-1/2 h-1/2 rounded-full bg-rose-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
