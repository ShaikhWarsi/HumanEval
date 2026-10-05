"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useScore } from "@/lib/score-context"
import { sound } from "@/lib/audio"
import BellCurve from "@/components/bell-curve"
import { Zap, RotateCcw, AlertTriangle, ArrowRight } from "lucide-react"

type GameState = "instructions" | "ready" | "waiting" | "click" | "result" | "too-early" | "completed"

const TOTAL_ROUNDS = 5

export default function ReactionTimeTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [currentRound, setCurrentRound] = useState(1)
  const [attempts, setAttempts] = useState<number[]>([])
  const [lastTime, setLastTime] = useState<number>(0)
  const [startTime, setStartTime] = useState<number>(0)
  const [finalScore, setFinalScore] = useState<number | null>(null)
  const [percentile, setPercentile] = useState<number>(50)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { addScore } = useScore()

  const startBattery = () => {
    setAttempts([])
    setCurrentRound(1)
    setFinalScore(null)
    setGameState("ready")
  }

  const beginWaiting = () => {
    setGameState("waiting")
    // Randomized delay between 1.5s and 4.5s
    const delay = Math.random() * 3000 + 1500

    timeoutRef.current = setTimeout(() => {
      setGameState("click")
      setStartTime(performance.now())
      sound.playSuccess()
    }, delay)
  }

  const handleClick = () => {
    if (gameState === "ready") {
      beginWaiting()
    } else if (gameState === "waiting") {
      // Too early!
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      sound.playError()
      setGameState("too-early")
    } else if (gameState === "click") {
      // Valid reaction click
      const rawElapsed = performance.now() - startTime
      // Filter out physiologically impossible anticipations (< 120ms) as false starts
      if (rawElapsed < 120) {
        sound.playError()
        setGameState("too-early")
        return
      }

      const elapsed = Math.round(rawElapsed)
      sound.playClick()
      setLastTime(elapsed)
      const newAttempts = [...attempts, elapsed]
      setAttempts(newAttempts)

      if (newAttempts.length >= TOTAL_ROUNDS) {
        // Battery complete - calculate robust median score to reject motor outliers
        const sorted = [...newAttempts].sort((a, b) => a - b)
        const mid = Math.floor(sorted.length / 2)
        const robustScore = sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2)
        setFinalScore(robustScore)
        const saved = addScore({
          testId: "reaction-time",
          testName: "Reaction Time",
          score: robustScore,
          unit: "ms",
          details: { attempts: newAttempts, median: robustScore },
        })
        setPercentile(saved.percentile)
        setGameState("completed")
      } else {
        setGameState("result")
      }
    } else if (gameState === "result") {
      nextRound()
    } else if (gameState === "too-early") {
      tryAgainRound()
    }
  }

  const nextRound = () => {
    setCurrentRound((prev) => prev + 1)
    beginWaiting()
  }

  const tryAgainRound = () => {
    beginWaiting()
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto brutal-card p-8 sm:p-12 text-center font-mono">
        <div className="w-16 h-16 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black flex items-center justify-center mx-auto mb-6 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
          <Zap className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-3">
          Reaction Time Benchmark
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-6">
          When the red area turns <span className="text-emerald-500 font-black">GREEN</span>, click as fast as humanly possible. 
          You will complete 5 trials to record your true mean synaptic latency.
        </p>

        <Button
          onClick={startBattery}
          size="lg"
        >
          Begin Benchmark
        </Button>
      </div>
    )
  }

  if (gameState === "completed" && finalScore !== null) {
    return (
      <div className="max-w-2xl mx-auto brutal-card p-8 text-center font-mono">
        <div className="w-16 h-16 border-2 border-black dark:border-white bg-emerald-400 text-black flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_#0A0A0A]">
          <Zap className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-xs uppercase text-muted-foreground tracking-wider mb-1 font-bold">
          Mean Latency ({TOTAL_ROUNDS} Rounds)
        </h2>
        <div className="text-6xl font-black text-foreground mb-2 tabular">
          {finalScore}
          <span className="text-2xl text-amber-500 dark:text-cyan-400 ml-1">ms</span>
        </div>

        {/* Normal distribution curve */}
        <BellCurve testId="reaction-time" score={finalScore} unit="ms" percentile={percentile} />

        <div className="grid grid-cols-5 gap-2 my-6">
          {attempts.map((att, i) => (
            <div key={i} className="p-2.5 border-2 border-black dark:border-white bg-card text-center shadow-[1.5px_1.5px_0px_0px_#0A0A0A] dark:shadow-[1.5px_1.5px_0px_0px_#FFFFFF]">
              <span className="text-[10px] text-muted-foreground font-bold block">R{i + 1}</span>
              <span className="text-xs font-black text-foreground tabular">{att}ms</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center mt-6">
          <Button
            onClick={startBattery}
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Retest Battery
          </Button>
        </div>
      </div>
    )
  }

  // Interactive Click Arena
  return (
    <div className="max-w-3xl mx-auto font-mono">
      {/* Round counter bar */}
      <div className="flex items-center justify-between mb-3 text-xs uppercase font-bold text-muted-foreground px-1">
        <span>Round {currentRound} of {TOTAL_ROUNDS}</span>
        <span>{attempts.length > 0 ? `Current Mean: ${Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)}ms` : "Waiting for trial 1"}</span>
      </div>

      <div
        onClick={handleClick}
        className={`w-full min-h-[380px] sm:min-h-[440px] border-2 border-black dark:border-white flex flex-col items-center justify-center text-center p-8 cursor-pointer select-none transition-all shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#FFFFFF] ${
          gameState === "ready"
            ? "bg-card text-foreground hover:translate-x-[-1px] hover:translate-y-[-1px]"
            : gameState === "waiting"
            ? "bg-rose-500 text-white"
            : gameState === "click"
            ? "bg-emerald-400 text-black shadow-[6px_6px_0px_0px_#0A0A0A]"
            : gameState === "too-early"
            ? "bg-amber-400 text-black"
            : "bg-card text-foreground"
        }`}
      >
        {gameState === "ready" && (
          <div className="space-y-4">
            <div className="w-14 h-14 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black flex items-center justify-center mx-auto shadow-[2px_2px_0px_0px_#0A0A0A]">
              <Zap className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tight">Click to Arm</h3>
            <p className="text-xs uppercase font-bold text-muted-foreground">
              Click anywhere inside this arena to prime the trigger.
            </p>
          </div>
        )}

        {gameState === "waiting" && (
          <div className="space-y-3">
            <h3 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">WAIT FOR GREEN</h3>
            <p className="text-xs uppercase font-black tracking-widest opacity-90">DO NOT TRIGGER EARLY...</p>
          </div>
        )}

        {gameState === "click" && (
          <div className="space-y-2">
            <h3 className="text-6xl sm:text-7xl font-black uppercase tracking-tight">CLICK NOW!</h3>
            <p className="text-xs uppercase font-black tracking-widest">MAXIMUM VELOCITY</p>
          </div>
        )}

        {gameState === "too-early" && (
          <div className="space-y-4">
            <AlertTriangle className="w-14 h-14 stroke-[2.5] mx-auto text-black" />
            <div>
              <h3 className="text-3xl font-black uppercase">TOO EARLY!</h3>
              <p className="text-xs uppercase font-bold mt-1">You reacted before the signal turned green.</p>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                tryAgainRound()
              }}
              variant="outline"
              size="sm"
            >
              Retry Round {currentRound}
            </Button>
          </div>
        )}

        {gameState === "result" && (
          <div className="space-y-4">
            <div className="text-6xl sm:text-7xl font-black text-foreground tabular">
              {lastTime} <span className="text-2xl text-amber-500 dark:text-cyan-400">ms</span>
            </div>
            <p className="text-xs uppercase font-bold text-muted-foreground">
              Round {currentRound} Recorded • Click anywhere to continue
            </p>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                nextRound()
              }}
              size="sm"
            >
              Continue to Round {currentRound + 1} <ArrowRight className="w-3.5 h-3.5 ml-1 stroke-[3]" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
