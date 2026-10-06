// components/tests/visual-memory-test.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useScore } from "@/lib/score-context"
import { sound } from "@/lib/audio"
import BellCurve from "@/components/bell-curve"
import { Eye, RotateCcw } from "lucide-react"

type GameState = "instructions" | "showing" | "selecting" | "failed-reveal" | "result"

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

      // Psychometric alignment: Standard Human Benchmark allows 3 mistakes per board.
      // Only exceeding 3 mistakes fails the board and consumes 1 of the 3 overall lives.
      if (newWrong.size >= 3) {
        const newLives = lives - 1
        setLives(newLives)

        // Reveal correct layout momentarily
        setGameState("failed-reveal")

        if (newLives <= 0) {
          // Game Over!
          setTimeout(() => {
            const finalScore = level - 1
            const saved = addScore({
              testId: "visual-memory",
              testName: "Visual Memory",
              score: finalScore,
              unit: "lvl",
              details: { finalLevel: level, gridDimension: gridDim },
            })
            setPercentile(saved.percentile)
            setGameState("result")
          }, 1100)
        } else {
          // Retry current level after momentary reveal
          setTimeout(() => startLevel(level), 1100)
        }
      }
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const totalCells = gridDim * gridDim

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto brutal-card p-8 sm:p-12 text-center font-sans">
        <div className="w-16 h-16 border-2 border-black dark:border-slate-700 bg-cyan-400 text-slate-950 flex items-center justify-center mx-auto mb-6 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
          <Eye className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-foreground mb-3">
          Visual Spatial Memory
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto mb-8 font-sans">
          A grid of tiles will flash briefly. Memorize and tap the coordinates of all active tiles.
          The spatial dimensions scale up as your level increases. You have 3 lives.
        </p>

        <Button
          onClick={startGame}
          size="lg"
        >
          Start Visual Memory
        </Button>
      </div>
    )
  }

  if (gameState === "result") {
    return (
      <div className="max-w-2xl mx-auto brutal-card p-8 text-center font-sans">
        <div className="w-16 h-16 border-2 border-black dark:border-slate-700 bg-cyan-400 text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
          <Eye className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-xs uppercase text-muted-foreground tracking-wider mb-1 font-bold font-mono">
          Max Matrix Completed
        </h2>
        <div className="text-6xl font-black text-foreground mb-2 tabular font-mono">
          Level {level - 1}
        </div>

        <p className="text-sm text-muted-foreground font-medium mb-4 font-sans">
          Spatial Sketchpad Capacity: <strong className="text-foreground font-mono">{gridDim}×{gridDim}</strong> Matrix
        </p>

        <BellCurve testId="visual-memory" score={level - 1} unit="lvl" percentile={percentile} />

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
    <div className="max-w-lg mx-auto font-sans">
      {/* Telemetry header */}
      <div className="flex items-center justify-between text-xs uppercase font-mono font-bold px-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Lives:</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((heart) => (
              <div
                key={heart}
                className={`w-3.5 h-3.5 border-2 border-black dark:border-slate-700 shadow-[1px_1px_0px_0px_#0A0A0A] ${
                  heart <= lives ? "bg-rose-500" : "bg-card"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Board Strikes:</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((strike) => (
                <div
                  key={strike}
                  className={`w-3 h-3 border border-black dark:border-slate-700 shadow-[1px_1px_0px_0px_#0A0A0A] ${
                    strike <= wrongSelections.size ? "bg-rose-500" : "bg-card"
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="text-muted-foreground">
            Grid: <strong className="text-foreground tabular">{gridDim}×{gridDim}</strong>
          </span>
          <span className="text-muted-foreground">
            Level: <strong className="text-amber-500 dark:text-sky-400 tabular text-sm">{level}</strong>
          </span>
        </div>
      </div>

      {/* Grid Container */}
      <div
        className="brutal-card p-4 sm:p-6"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridDim}, minmax(0, 1fr))`,
          gap: "8px",
        }}
      >
        {Array.from({ length: totalCells }).map((_, index) => {
          const isTarget = targets.has(index)
          const isSelected = selected.has(index)
          const isWrong = wrongSelections.has(index)
          const isShowing = gameState === "showing"
          const isRevealingFail = gameState === "failed-reveal"

          let cellStyle = "bg-card hover:bg-secondary text-transparent"

          if (isShowing && isTarget) {
            cellStyle = "bg-cyan-400 text-slate-950 shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#000000]"
          } else if (isSelected) {
            cellStyle = "bg-emerald-400 text-slate-950 shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#000000]"
          } else if (isWrong) {
            cellStyle = "bg-rose-500 text-white shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#000000]"
          } else if (isRevealingFail && isTarget) {
            cellStyle = "bg-cyan-400/80 animate-pulse text-transparent"
          }

          return (
            <button
              key={index}
              disabled={gameState !== "selecting"}
              onClick={() => handleCellClick(index)}
              className={`aspect-square border-2 border-black dark:border-slate-700 transition-all shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000] ${cellStyle} active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer disabled:cursor-default`}
            />
          )
        })}
      </div>
    </div>
  )
}
