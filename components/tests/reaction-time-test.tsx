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
      setStartTime(Date.now())
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
      const elapsed = Date.now() - startTime
      sound.playClick()
      setLastTime(elapsed)
      const newAttempts = [...attempts, elapsed]
      setAttempts(newAttempts)

      if (newAttempts.length >= TOTAL_ROUNDS) {
        // Battery complete - calculate median/average
        const avg = Math.round(newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length)
        setFinalScore(avg)
        const saved = addScore({
          testId: "reaction-time",
          testName: "Reaction Time",
          score: avg,
          unit: "ms",
          details: { attempts: newAttempts },
        })
        setPercentile(saved.percentile)
        setGameState("completed")
      } else {
        setGameState("result")
      }
    }
  }

  const nextRound = () => {
    setCurrentRound((prev) => prev + 1)
    setGameState("ready")
  }

  const tryAgainRound = () => {
    setGameState("ready")
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto cyber-card rounded-2xl p-8 sm:p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-6">
          <Zap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-mono tracking-tight text-foreground mb-3">
          Reaction Time Benchmark
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-6">
          When the red area turns <span className="text-emerald-400 font-semibold">GREEN</span>, click as fast as humanly possible. 
          You will complete 5 trials to record your true mean synaptic latency.
        </p>

        <Button
          onClick={startBattery}
          size="lg"
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
        >
          Begin Benchmark
        </Button>
      </div>
    )
  }

  if (gameState === "completed" && finalScore !== null) {
    return (
      <div className="max-w-2xl mx-auto cyber-card rounded-2xl p-8 text-center animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8" />
        </div>
        <h2 className="text-sm font-mono uppercase text-muted-foreground tracking-wider mb-1">
          Mean Latency ({TOTAL_ROUNDS} Rounds)
        </h2>
        <div className="text-5xl font-mono font-extrabold text-foreground mb-2 tabular">
          {finalScore}
          <span className="text-2xl text-cyan-400 ml-1">ms</span>
        </div>

        {/* Normal distribution curve */}
        <BellCurve testId="reaction-time" score={finalScore} unit="ms" percentile={percentile} />

        <div className="grid grid-cols-5 gap-2 my-6">
          {attempts.map((att, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-card/60 border border-border/50 text-center">
              <span className="text-[10px] text-muted-foreground font-mono block">R{i + 1}</span>
              <span className="text-xs font-mono font-bold text-foreground tabular">{att}ms</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center mt-6">
          <Button
            onClick={startBattery}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold px-6 py-2.5 rounded-xl transition-all"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Retest Battery
          </Button>
        </div>
      </div>
    )
  }

  // Interactive Click Arena
  return (
    <div className="max-w-3xl mx-auto">
      {/* Round counter bar */}
      <div className="flex items-center justify-between mb-3 text-xs font-mono text-muted-foreground px-1">
        <span>Round {currentRound} of {TOTAL_ROUNDS}</span>
        <span>{attempts.length > 0 ? `Current Mean: ${Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)}ms` : "Waiting for trial 1"}</span>
      </div>

      <div
        onClick={handleClick}
        className={`w-full min-h-[380px] sm:min-h-[440px] rounded-2xl flex flex-col items-center justify-center text-center p-8 cursor-pointer select-none transition-colors border ${
          gameState === "ready"
            ? "bg-card/70 border-border/60 hover:border-cyan-500/40 text-foreground"
            : gameState === "waiting"
            ? "bg-rose-950/70 border-rose-500/60 text-rose-200"
            : gameState === "click"
            ? "bg-emerald-600 border-emerald-400 text-white shadow-2xl shadow-emerald-500/30"
            : gameState === "too-early"
            ? "bg-amber-950/80 border-amber-500/60 text-amber-200"
            : "bg-cyan-950/70 border-cyan-500/50 text-cyan-200"
        }`}
      >
        {gameState === "ready" && (
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-2xl font-mono font-bold tracking-tight">Click to Arm</h3>
            <p className="text-xs text-muted-foreground font-mono">
              Click anywhere inside this arena to prime the trigger.
            </p>
          </div>
        )}

        {gameState === "waiting" && (
          <div className="space-y-3">
            <h3 className="text-3xl font-mono font-extrabold tracking-tight">WAIT FOR GREEN</h3>
            <p className="text-xs text-rose-300/80 font-mono">Do not trigger early...</p>
          </div>
        )}

        {gameState === "click" && (
          <div className="space-y-2">
            <h3 className="text-5xl font-mono font-black tracking-tight drop-shadow-md">CLICK NOW!</h3>
            <p className="text-xs text-white/90 font-mono">MAXIMUM VELOCITY</p>
          </div>
        )}

        {gameState === "too-early" && (
          <div className="space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
            <div>
              <h3 className="text-2xl font-mono font-bold text-amber-300">Too Early!</h3>
              <p className="text-xs text-amber-300/80 font-mono mt-1">You reacted before the signal turned green.</p>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                tryAgainRound()
              }}
              variant="outline"
              className="bg-amber-500/20 border-amber-400 text-amber-300 hover:bg-amber-500/30 font-mono text-xs"
            >
              Retry Round {currentRound}
            </Button>
          </div>
        )}

        {gameState === "result" && (
          <div className="space-y-4">
            <div className="text-5xl font-mono font-black text-cyan-300 tabular">
              {lastTime} <span className="text-2xl">ms</span>
            </div>
            <p className="text-xs font-mono text-cyan-300/80">
              Round {currentRound} Recorded.
            </p>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                nextRound()
              }}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold px-6 py-2 rounded-xl text-xs"
            >
              Continue to Round {currentRound + 1} <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
