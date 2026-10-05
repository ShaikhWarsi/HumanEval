// components/tests/number-memory-test.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useScore } from "@/lib/score-context"
import { sound } from "@/lib/audio"
import BellCurve from "@/components/bell-curve"
import { Hash, RotateCcw, ArrowRight, CheckCircle2 } from "lucide-react"

type GameState = "instructions" | "showing" | "input" | "correct-step" | "result"

export default function NumberMemoryTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [isReverseMode, setIsReverseMode] = useState(false)
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
    const digits = lvl
    const num = generateNumber(digits)
    setCurrentNumber(num)
    setUserInput("")
    setGameState("showing")
    setProgress(100)

    // Base duration: 1.4s + 0.7s per digit
    const durationMs = 1400 + digits * 700
    const intervalStep = 20
    const decrement = 100 / (durationMs / intervalStep)

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

  const handleNextLevel = () => {
    sound.playClick()
    const nextLevel = level + 1
    setLevel(nextLevel)
    startLevel(nextLevel)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (gameState !== "input") return

    const expected = isReverseMode
      ? currentNumber.split("").reverse().join("")
      : currentNumber

    if (userInput.trim() === expected) {
      // Correct! Show confirmation before advancing
      sound.playSuccess()
      setGameState("correct-step")
    } else {
      // Incorrect! Game Over
      sound.playError()
      const finalScore = level - 1
      const saved = addScore({
        testId: "number-memory",
        testName: isReverseMode ? "Reverse Digit Span" : "Number Memory",
        score: finalScore,
        unit: "digits",
        details: {
          mode: isReverseMode ? "reverse" : "forward",
          target: currentNumber,
          expected,
          input: userInput,
        },
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
      <div className="max-w-2xl mx-auto brutal-card p-8 sm:p-12 text-center font-mono">
        <div className="w-16 h-16 border-2 border-black dark:border-white bg-emerald-400 text-black flex items-center justify-center mx-auto mb-6 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
          <Hash className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-3">
          Working Memory Digit Span
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-6">
          {isReverseMode
            ? "Executive Manipulation: Observe digits, then reverse them in your mind and enter them backwards (e.g. 741 → 147)."
            : "Passive Storage: Hold progressively longer sequences of numerical digits in memory and enter them in order."}
        </p>

        {/* Mode Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => setIsReverseMode(false)}
            className={`px-4 py-2 border-2 border-black dark:border-white font-mono text-xs font-black uppercase transition-all cursor-pointer ${
              !isReverseMode
                ? "bg-amber-400 dark:bg-cyan-400 text-black shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            Forward Span (Storage)
          </button>
          <button
            type="button"
            onClick={() => setIsReverseMode(true)}
            className={`px-4 py-2 border-2 border-black dark:border-white font-mono text-xs font-black uppercase transition-all cursor-pointer ${
              isReverseMode
                ? "bg-pink-500 text-white shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            Reverse Span (Executive WM)
          </button>
        </div>

        <Button
          onClick={startGame}
          size="lg"
        >
          Start {isReverseMode ? "Reverse" : "Forward"} Digit Span
        </Button>
      </div>
    )
  }

  if (gameState === "correct-step") {
    return (
      <div className="max-w-md mx-auto brutal-card p-8 text-center space-y-6 font-mono">
        <div className="w-14 h-14 border-2 border-black dark:border-white bg-emerald-400 text-black flex items-center justify-center mx-auto shadow-[2px_2px_0px_0px_#0A0A0A]">
          <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-black uppercase text-foreground">Level {level} Cleared!</h3>
          <p className="text-xs text-muted-foreground uppercase font-bold">Digit sequence verified.</p>
        </div>

        <div className="p-4 border-2 border-black dark:border-white bg-card text-xs space-y-2 shadow-[2px_2px_0px_0px_#0A0A0A]">
          <div className="flex justify-between">
            <span className="text-muted-foreground font-bold uppercase">Target Number:</span>
            <span className="text-emerald-500 font-black">{currentNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground font-bold uppercase">Your Input:</span>
            <span className="text-foreground font-black">{userInput}</span>
          </div>
        </div>

        <Button
          onClick={handleNextLevel}
          autoFocus
          className="w-full"
        >
          Advance to Level {level + 1} ({level + 1} Digits) <ArrowRight className="w-4 h-4 ml-1.5 stroke-[3]" />
        </Button>
      </div>
    )
  }

  if (gameState === "result") {
    return (
      <div className="max-w-2xl mx-auto brutal-card p-8 text-center font-mono">
        <div className="w-16 h-16 border-2 border-black dark:border-white bg-emerald-400 text-black flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_#0A0A0A]">
          <Hash className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-xs uppercase text-muted-foreground tracking-wider mb-1 font-bold">
          Final Digit Span
        </h2>
        <div className="text-6xl font-black text-foreground mb-4 tabular">
          {level - 1} <span className="text-2xl text-emerald-500">digits</span>
        </div>

        {/* Diff breakdown */}
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-6 text-xs">
          <div className="p-3 border-2 border-black dark:border-white bg-card text-left shadow-[2px_2px_0px_0px_#0A0A0A]">
            <span className="text-muted-foreground block text-[10px] font-bold uppercase">Actual</span>
            <span className="text-emerald-500 font-black break-all">{currentNumber}</span>
          </div>
          <div className="p-3 border-2 border-black dark:border-white bg-card text-left shadow-[2px_2px_0px_0px_#0A0A0A]">
            <span className="text-muted-foreground block text-[10px] font-bold uppercase">Your Input</span>
            <span className="text-rose-500 font-black break-all">{userInput || "(empty)"}</span>
          </div>
        </div>

        <BellCurve testId="number-memory" score={level - 1} unit="digits" percentile={percentile} />

        <div className="flex gap-3 justify-center mt-6">
          <Button
            onClick={startGame}
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto brutal-card p-8 sm:p-12 text-center font-mono">
      <div className="flex items-center justify-between mb-8 text-xs font-bold uppercase text-muted-foreground">
        <span>Level {level}</span>
        <span>{level} Digits</span>
      </div>

      {gameState === "showing" && (
        <div className="space-y-8">
          <div className="text-5xl sm:text-6xl font-black tracking-widest text-foreground tabular select-none">
            {currentNumber}
          </div>

          {/* Countdown timer bar */}
          <div className="w-full h-2 border-2 border-black dark:border-white bg-secondary max-w-xs mx-auto overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs uppercase font-bold text-muted-foreground">
            Memorize the digits before the timer expires...
          </p>
        </div>
      )}

      {gameState === "input" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-black uppercase text-foreground">
              {isReverseMode ? "Type the digits in REVERSE order" : "What was the number?"}
            </h3>
            <p className="text-xs uppercase text-muted-foreground font-bold">
              {isReverseMode
                ? "First shown digit should be typed LAST (e.g. 5-9-2 → 295)"
                : "Press Enter or Submit when ready"}
            </p>
          </div>

          <Input
            ref={inputRef}
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.replace(/\D/g, ""))}
            placeholder="Type digits here"
            className="text-center text-3xl font-black tracking-widest max-w-sm mx-auto h-14"
            autoFocus
          />

          <Button
            type="submit"
            className="w-full max-w-sm mx-auto"
          >
            Submit Answer <ArrowRight className="w-4 h-4 ml-1 stroke-[3]" />
          </Button>
        </form>
      )}
    </div>
  )
}
