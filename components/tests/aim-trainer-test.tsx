// components/tests/aim-trainer-test.tsx
"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useScore } from "@/lib/score-context"
import { sound } from "@/lib/audio"
import BellCurve from "@/components/bell-curve"
import { Target, RotateCcw } from "lucide-react"

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
  const [targetTimes, setTargetTimes] = useState<number[]>([])
  const [lastTargetTime, setLastTargetTime] = useState(0)
  const [finalAvgTime, setFinalAvgTime] = useState(0)
  const [finalAccuracy, setFinalAccuracy] = useState(100)
  const [percentile, setPercentile] = useState(50)

  const arenaRef = useRef<HTMLDivElement>(null)
  const { addScore } = useScore()

  const spawnRandomTarget = (prevPos: TargetPosition | null = null): TargetPosition => {
    if (!arenaRef.current) return { x: 100, y: 100 }
    const rect = arenaRef.current.getBoundingClientRect()
    const margin = TARGET_SIZE / 2 + 15
    const minDistance = 120

    let candidate = { x: 100, y: 100 }
    let attempts = 0

    do {
      const x = Math.floor(Math.random() * (rect.width - margin * 2)) + margin
      const y = Math.floor(Math.random() * (rect.height - margin * 2)) + margin
      candidate = { x, y }
      attempts++

      if (!prevPos) break
      const dist = Math.hypot(candidate.x - prevPos.x, candidate.y - prevPos.y)
      if (dist >= minDistance || attempts > 15) break
    } while (true)

    return candidate
  }

  const startGame = () => {
    setGameState("playing")
    setTargetsHit(0)
    setTotalClicks(0)
    setMisses(0)
    setTargetTimes([])
    const now = performance.now()
    setLastTargetTime(now)
    setTimeout(() => {
      setCurrentTarget(spawnRandomTarget(null))
    }, 50)
  }

  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (gameState !== "playing" || !currentTarget) return

    sound.playTargetHit()
    const now = performance.now()
    const delta = Math.round(now - lastTargetTime)
    const newTimes = [...targetTimes, delta]
    setTargetTimes(newTimes)
    setLastTargetTime(now)

    const newHitCount = targetsHit + 1
    const newTotalClicks = totalClicks + 1
    setTargetsHit(newHitCount)
    setTotalClicks(newTotalClicks)

    if (newHitCount >= TOTAL_TARGETS) {
      // Battery complete
      const avg = Math.round(newTimes.reduce((a, b) => a + b, 0) / newTimes.length)
      const acc = Math.round((newHitCount / newTotalClicks) * 100)

      setFinalAvgTime(avg)
      setFinalAccuracy(acc)

      const saved = addScore({
        testId: "aim-trainer",
        testName: "Aim Trainer",
        score: avg,
        unit: "ms",
        details: { accuracy: acc, totalMisses: misses, hitCount: newHitCount },
      })
      setPercentile(saved.percentile)
      setGameState("result")
    } else {
      setCurrentTarget(spawnRandomTarget(currentTarget))
    }
  }

  const handleArenaMiss = () => {
    if (gameState !== "playing") return
    sound.playError()
    setMisses((m) => m + 1)
    setTotalClicks((c) => c + 1)
  }

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto brutal-card p-8 sm:p-12 text-center font-mono">
        <div className="w-16 h-16 border-2 border-black dark:border-white bg-rose-500 text-white flex items-center justify-center mx-auto mb-6 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
          <Target className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-3">
          Neuromuscular Aim Trainer
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-6">
          Eliminate 30 randomized targets as quickly and accurately as possible.
          Measures ballistic saccadic acquisition latency and target click precision.
        </p>

        <Button
          onClick={startGame}
          size="lg"
        >
          Start Aim Trainer
        </Button>
      </div>
    )
  }

  if (gameState === "result") {
    return (
      <div className="max-w-2xl mx-auto brutal-card p-8 text-center font-mono">
        <div className="w-16 h-16 border-2 border-black dark:border-white bg-rose-500 text-white flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_#0A0A0A]">
          <Target className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-xs uppercase text-muted-foreground tracking-wider mb-1 font-bold">
          Mean Target Acquisition Latency
        </h2>
        <div className="text-6xl font-black text-foreground mb-2 tabular">
          {finalAvgTime}
          <span className="text-2xl text-rose-500 ml-1">ms</span>
        </div>

        <div className="flex items-center justify-center gap-6 my-4 text-xs font-bold uppercase">
          <span>
            Accuracy: <strong className="text-foreground">{finalAccuracy}%</strong>
          </span>
          <span>•</span>
          <span>
            Misses: <strong className="text-rose-500">{misses}</strong>
          </span>
        </div>

        <BellCurve testId="aim-trainer" score={finalAvgTime} unit="ms" percentile={percentile} />

        <div className="flex gap-3 justify-center mt-6">
          <Button
            onClick={startGame}
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Retest Aim
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-3 font-mono">
      {/* Telemetry bar */}
      <div className="flex items-center justify-between text-xs font-bold uppercase px-2">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            Targets: <strong className="text-rose-500 tabular">{TOTAL_TARGETS - targetsHit}</strong> remaining
          </span>
          <span className="text-muted-foreground">
            Misses: <strong className="text-foreground tabular">{misses}</strong>
          </span>
        </div>

        <div className="text-muted-foreground">
          Accuracy:{" "}
          <strong className="text-foreground tabular">
            {totalClicks > 0 ? `${Math.round((targetsHit / totalClicks) * 100)}%` : "100%"}
          </strong>
        </div>
      </div>

      {/* Target Arena Canvas */}
      <div
        ref={arenaRef}
        onClick={handleArenaMiss}
        className="w-full h-[460px] sm:h-[520px] brutal-card relative overflow-hidden cursor-crosshair select-none"
      >
        {currentTarget && (
          <button
            onClick={handleTargetClick}
            style={{
              position: "absolute",
              left: `${currentTarget.x - TARGET_SIZE / 2}px`,
              top: `${currentTarget.y - TARGET_SIZE / 2}px`,
              width: `${TARGET_SIZE}px`,
              height: `${TARGET_SIZE}px`,
            }}
            className="rounded-full bg-rose-500 hover:bg-rose-400 border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF] flex items-center justify-center transition-transform duration-75 active:scale-95"
          >
            <div className="w-6 h-6 rounded-full border border-black dark:border-white flex items-center justify-center pointer-events-none">
              <div className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white pointer-events-none" />
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
