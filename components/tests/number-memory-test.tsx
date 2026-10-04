"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useScore } from "@/lib/score-context"
import { sound } from "@/lib/audio"
import BellCurve from "@/components/bell-curve"
import { Hash, RotateCcw, ArrowRight } from "lucide-react"

type GameState = "instructions" | "showing" | "input" | "result"

export default function NumberMemoryTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [level, setLevel] = useState(1)
  const [currentNumber, setCurrentNumber] = useState("")
  const [userInput, setUserInput] = useState("")
  const [progress, setProgress] = useState(100)
  const [percentile, setPercentile] = useState(50)

  const inputRef = useRef<HTMLInputElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { addScore } = useScore()

  const generateNumber = (digits: number) => {
    let str = ""
    for (let i = 0; i < digits; i++) {
      if (i === 0) {
        str += Math.floor(Math.random() * 9) + 1
      } else {
        str += Math.floor(Math.random() * 10)
      }
    }
    return str
  }

  const startLevel = (lvl: number) => {
    const digits = lvl // Level 1 = 1 digit, Level 2 = 2 digits, etc.
    const num = generateNumber(digits)
    setCurrentNumber(num)
    setUserInput("")
    setGameState("showing")
    setProgress(100)

    // Base duration: 1.2s + 0.6s per digit
    const durationMs = 1200 + digits * 650
    const intervalStep = 20
    const decrement = (100 / (durationMs / intervalStep))

    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setGameState("input")
          setTimeout(() => inputRef.current?.focus(), 50)
          return 0
        }
        return prev - decrement
      })
    }, intervalStep)
  }

  const startGame = () => {
    setLevel(1)
    startLevel(1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (gameState !== "input") return

    if (userInput.trim() === currentNumber) {
      // Correct!
      sound.playSuccess()
      const nextLevel = level + 1
      setLevel(nextLevel)
      startLevel(nextLevel)
    } else {
      // Incorrect! Game Over
      sound.playError()
      const finalScore = level - 1
      const saved = addScore({
        testId: "number-memory",
        testName: "Number Memory",
        score: finalScore,
        unit: "digits",
        details: { target: currentNumber, input: userInput },
      })
      setPercentile(saved.percentile)
      setGameState("result")
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto cyber-card rounded-2xl p-8 sm:p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6">
          <Hash className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-mono tracking-tight text-foreground mb-3">
          Number Memory (Digit Span)
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-6">
          The average human can hold 7 numbers in working memory (Miller's Law). 
          Each round appends one additional digit to recall.
        </p>

        <Button
          onClick={startGame}
          size="lg"
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
        >
          Start Memory Span
        </Button>
      </div>
    )
  }

  if (gameState === "result") {
    return (
      <div className="max-w-2xl mx-auto cyber-card rounded-2xl p-8 text-center animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <Hash className="w-8 h-8" />
        </div>
        <h2 className="text-xs font-mono uppercase text-muted-foreground tracking-wider mb-1">
          Final Digit Span
        </h2>
        <div className="text-5xl font-mono font-black text-foreground mb-4 tabular">
          {level - 1} <span className="text-2xl text-emerald-400">digits</span>
        </div>

        {/* Diff breakdown */}
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-6 text-xs font-mono">
          <div className="p-3 rounded-xl bg-card/60 border border-border/50 text-left">
            <span className="text-muted-foreground block text-[10px]">Actual Number</span>
            <span className="text-emerald-400 font-bold break-all">{currentNumber}</span>
          </div>
          <div className="p-3 rounded-xl bg-card/60 border border-border/50 text-left">
            <span className="text-muted-foreground block text-[10px]">Your Answer</span>
            <span className="text-rose-400 font-bold break-all">{userInput || "(empty)"}</span>
          </div>
        </div>

        <BellCurve testId="number-memory" score={level - 1} unit="digits" percentile={percentile} />

        <div className="flex gap-3 justify-center mt-6">
          <Button
            onClick={startGame}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold px-6 py-2.5 rounded-xl transition-all"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto cyber-card rounded-2xl p-8 sm:p-12 text-center">
      <div className="flex items-center justify-between mb-8 text-xs font-mono text-muted-foreground">
        <span>Level {level}</span>
        <span>{level} Digits</span>
      </div>

      {gameState === "showing" && (
        <div className="space-y-8 animate-in fade-in">
          <div className="text-5xl sm:text-6xl font-mono font-black tracking-widest text-foreground tabular">
            {currentNumber}
          </div>

          {/* Countdown timer bar */}
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden max-w-xs mx-auto">
            <div
              className="h-full bg-emerald-400 transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {gameState === "input" && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in">
          <p className="text-sm font-mono text-muted-foreground">What was the number?</p>
          <Input
            ref={inputRef}
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="text-center text-3xl font-mono font-bold tracking-widest h-14 bg-background border-border/80 focus:border-emerald-400 rounded-xl"
            autoFocus
          />
          <Button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold py-3 rounded-xl transition-all"
          >
            Submit Answer <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>
      )}
    </div>
  )
}
