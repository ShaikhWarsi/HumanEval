"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useScore } from "@/lib/score-context"
import { sound } from "@/lib/audio"
import BellCurve from "@/components/bell-curve"
import { Keyboard, RotateCcw, Clock, Zap } from "lucide-react"

type GameState = "instructions" | "typing" | "results"

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog while cognitive sensors monitor the precision of neural transmissions. Speed and accuracy define the modern computational mind.",
  "Digital systems process immense volumes of data every second. Human intellect adapts by expanding working memory and reflex velocity across distributed biological circuits.",
  "Deep neural networks mirror human cortical hierarchies to classify patterns. Mastery emerges from disciplined repetition, acute concentration, and continuous neuroplastic adaptation.",
  "In physics, velocity describes the rate of change of position with respect to a frame of reference. Fine motor typing reflects microsecond coordination between vision and finger muscles."
]

export default function TypingTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [targetText, setTargetText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [errors, setErrors] = useState(0)
  const [finalWpm, setFinalWpm] = useState(0)
  const [finalAccuracy, setFinalAccuracy] = useState(100)
  const [percentile, setPercentile] = useState(50)

  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { addScore } = useScore()

  const startTest = () => {
    const text = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]
    setTargetText(text)
    setUserInput("")
    setStartTime(null)
    setElapsedSeconds(0)
    setErrors(0)
    setGameState("typing")
    setTimeout(() => hiddenInputRef.current?.focus(), 50)
  }

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== "typing") return
    const val = e.target.value

    sound.playKeyType()

    if (!startTime) {
      const now = Date.now()
      setStartTime(now)
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - now) / 1000))
      }, 500)
    }

    // Check errors
    let errCount = 0
    for (let i = 0; i < val.length; i++) {
      if (val[i] !== targetText[i]) {
        errCount++
      }
    }
    setErrors(errCount)
    setUserInput(val)

    // Completed?
    if (val.length >= targetText.length) {
      finishTest(val, errCount)
    }
  }

  const finishTest = (finalVal: string, errCount: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    const endTime = Date.now()
    const durationMin = Math.max(0.05, ((startTime ? endTime - startTime : 1000) / 1000) / 60)
    
    // Standard WPM: (characters / 5) / minutes
    const netChars = Math.max(0, finalVal.length - errCount * 2)
    const wpm = Math.round((netChars / 5) / durationMin)
    const acc = Math.max(0, Math.round(((finalVal.length - errCount) / finalVal.length) * 100))

    setFinalWpm(wpm)
    setFinalAccuracy(acc)

    const saved = addScore({
      testId: "typing",
      testName: "Typing Speed",
      score: wpm,
      unit: "WPM",
      details: { accuracy: acc, errors: errCount, timeSeconds: Math.round(durationMin * 60) },
    })
    setPercentile(saved.percentile)
    setGameState("results")
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto cyber-card rounded-2xl p-8 sm:p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-6">
          <Keyboard className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-mono tracking-tight text-foreground mb-3">
          Typing Speed Benchmark
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-6">
          Type the benchmark text with maximum cadence and accuracy. 
          The test initiates automatically upon your first keystroke.
        </p>

        <Button
          onClick={startTest}
          size="lg"
          className="bg-indigo-500 hover:bg-indigo-400 text-white font-mono font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
        >
          Initialize Keyboard
        </Button>
      </div>
    )
  }

  if (gameState === "results") {
    return (
      <div className="max-w-2xl mx-auto cyber-card rounded-2xl p-8 text-center animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <Keyboard className="w-8 h-8" />
        </div>
        <h2 className="text-xs font-mono uppercase text-muted-foreground tracking-wider mb-1">
          Net Typing Speed
        </h2>
        <div className="text-5xl font-mono font-black text-foreground mb-2 tabular">
          {finalWpm} <span className="text-2xl text-indigo-400">WPM</span>
        </div>

        <div className="flex justify-center gap-6 my-4 text-sm font-mono">
          <div className="px-4 py-2 rounded-xl bg-card/60 border border-border/50">
            <span className="text-muted-foreground text-xs block">Accuracy</span>
            <span className="text-lg font-bold text-emerald-400">{finalAccuracy}%</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-card/60 border border-border/50">
            <span className="text-muted-foreground text-xs block">Errors</span>
            <span className="text-lg font-bold text-rose-400">{errors}</span>
          </div>
        </div>

        <BellCurve testId="typing" score={finalWpm} unit="WPM" percentile={percentile} />

        <div className="flex gap-3 justify-center mt-6">
          <Button
            onClick={startTest}
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-mono font-bold px-6 py-2.5 rounded-xl transition-all"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Live typing display
  const currentLen = userInput.length

  return (
    <div
      onClick={() => hiddenInputRef.current?.focus()}
      className="max-w-3xl mx-auto cyber-card rounded-2xl p-8 sm:p-10 cursor-text select-none"
    >
      {/* Hidden input to capture keystrokes smoothly */}
      <input
        ref={hiddenInputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        className="opacity-0 absolute -top-9999px left-0"
        autoFocus
      />

      {/* Telemetry bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-6">
          <div>
            Time: <span className="text-foreground font-bold tabular">{elapsedSeconds}s</span>
          </div>
          <div>
            Errors: <span className="text-rose-400 font-bold tabular">{errors}</span>
          </div>
        </div>
        <div className="text-indigo-400 font-semibold">
          {startTime ? "● TYPING..." : "TYPE ANY KEY TO START"}
        </div>
      </div>

      {/* Text rendering with Monkeytype-style character states */}
      <div className="text-xl sm:text-2xl font-mono leading-relaxed tracking-wide">
        {targetText.split("").map((char, index) => {
          let charClass = "text-muted-foreground/40"
          const isCurrent = index === currentLen

          if (index < currentLen) {
            if (userInput[index] === char) {
              charClass = "text-emerald-400"
            } else {
              charClass = "text-rose-400 bg-rose-500/20 rounded"
            }
          }

          return (
            <span key={index} className={`relative ${charClass}`}>
              {isCurrent && (
                <span className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-indigo-400 animate-pulse" />
              )}
              {char}
            </span>
          )
        })}
      </div>
    </div>
  )
}
