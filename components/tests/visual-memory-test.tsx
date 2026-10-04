"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useScore } from "@/lib/score-context"
import { sound } from "@/lib/audio"
import BellCurve from "@/components/bell-curve"
import { Eye, RotateCcw, Heart } from "lucide-react"

type GameState = "instructions" | "showing" | "selecting" | "result"

export default function VisualMemoryTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [gridDim, setGridDim] = useState(3)
  const [targets, setTargets] = useState<Set<number>>(new Set())
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [wrongSelections, setWrongSelections] = useState<Set<number>>(new Set())
  const [percentile, setPercentile] = useState(50)

  const { addScore } = useScore()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const getDimension = (lvl: number) => {
    if (lvl <= 2) return 3
    if (lvl <= 5) return 4
    if (lvl <= 9) return 5
    if (lvl <= 14) return 6
    return 7
  }

  const getTargetCount = (lvl: number, dim: number) => {
    return Math.min(Math.floor(dim * dim * 0.45), lvl + 2)
  }

  const startLevel = (lvl: number) => {
    const dim = getDimension(lvl)
    setGridDim(dim)
    setSelected(new Set())
    setWrongSelections(new Set())

    const count = getTargetCount(lvl, dim)
    const totalCells = dim * dim
    const newTargets = new Set<number>()

    while (newTargets.size < count) {
      newTargets.add(Math.floor(Math.random() * totalCells))
    }

    setTargets(newTargets)
    setGameState("showing")

    // Show targets for 1.2s
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setGameState("selecting")
    }, 1200)
  }

  const startGame = () => {
    setLevel(1)
    setLives(3)
    startLevel(1)
  }

  const handleCellClick = (index: number) => {
    if (gameState !== "selecting" || selected.has(index) || wrongSelections.has(index)) return

    if (targets.has(index)) {
      // Correct tile!
      sound.playClick()
      const newSelected = new Set(selected)
      newSelected.add(index)
      setSelected(newSelected)

      if (newSelected.size === targets.size) {
        // Level cleared!
        sound.playSuccess()
        const nextLevel = level + 1
        setLevel(nextLevel)
        setTimeout(() => startLevel(nextLevel), 700)
      }
    } else {
      // Wrong tile!
      sound.playError()
      const newWrong = new Set(wrongSelections)
      newWrong.add(index)
      setWrongSelections(newWrong)

      const newLives = lives - 1
      setLives(newLives)

      if (newLives <= 0) {
        // Game Over!
        const finalScore = level - 1
        const saved = addScore({
          testId: "visual-memory",
          testName: "Visual Memory",
          score: Math.max(0, finalScore),
          unit: "lvl",
          details: { maxLevel: level, gridDimension: gridDim },
        })
        setPercentile(saved.percentile)
        setGameState("result")
      }
    }
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
          <Eye className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-mono tracking-tight text-foreground mb-3">
          Visual Memory Test
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-6">
          Memorize the pattern of illuminated tiles. Once hidden, reconstruct the coordinates.
          The matrix dynamically expands as your retention scales. You have 3 lives.
        </p>

        <Button
          onClick={startGame}
          size="lg"
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
        >
          Initialize Matrix
        </Button>
      </div>
    )
  }

  if (gameState === "result") {
    return (
      <div className="max-w-2xl mx-auto cyber-card rounded-2xl p-8 text-center animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8" />
        </div>
        <h2 className="text-xs font-mono uppercase text-muted-foreground tracking-wider mb-1">
          Spatial Visual Capacity
        </h2>
        <div className="text-5xl font-mono font-black text-foreground mb-2 tabular">
          Level {level - 1}
        </div>

        <BellCurve testId="visual-memory" score={level - 1} unit="lvl" percentile={percentile} />

        <div className="flex gap-3 justify-center mt-6">
          <Button
            onClick={startGame}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold px-6 py-2.5 rounded-xl transition-all"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </div>
      </div>
    )
  }

  const totalCells = gridDim * gridDim

  return (
    <div className="max-w-md mx-auto">
      {/* Telemetry bar */}
      <div className="flex items-center justify-between mb-4 px-2 text-xs font-mono">
        <div>
          <span className="text-muted-foreground">Level: </span>
          <span className="font-bold text-cyan-400 tabular">{level}</span>
        </div>
        <div className="flex items-center gap-1.5 text-rose-400">
          {[...Array(3)].map((_, i) => (
            <Heart
              key={i}
              className={`w-4 h-4 ${i < lives ? "fill-rose-500 text-rose-500" : "text-muted-foreground/30"}`}
            />
          ))}
        </div>
      </div>

      {/* Dynamic Grid */}
      <div
        className="grid gap-2.5 p-4 rounded-2xl bg-card/60 border border-border/50 max-w-[380px] mx-auto"
        style={{
          gridTemplateColumns: `repeat(${gridDim}, minmax(0, 1fr))`,
        }}
      >
        {[...Array(totalCells)].map((_, index) => {
          const isTarget = targets.has(index)
          const isCorrectSelected = selected.has(index)
          const isWrongSelected = wrongSelections.has(index)

          const isLit = (gameState === "showing" && isTarget) || isCorrectSelected

          return (
            <button
              key={index}
              disabled={gameState === "showing"}
              onClick={() => handleCellClick(index)}
              className={`aspect-square rounded-xl border transition-all duration-200 select-none ${
                isLit
                  ? "bg-cyan-400 border-cyan-200 shadow-lg shadow-cyan-500/40 scale-[0.98]"
                  : isWrongSelected
                  ? "bg-rose-500 border-rose-300 shadow-lg shadow-rose-500/30"
                  : "bg-secondary/60 border-border/60 hover:border-cyan-500/30 hover:bg-secondary/90 active:scale-95"
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
