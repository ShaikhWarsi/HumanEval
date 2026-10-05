// components/tests/chimp-test.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useScore } from "@/lib/score-context"
import { sound } from "@/lib/audio"
import BellCurve from "@/components/bell-curve"
import { Brain, RotateCcw } from "lucide-react"

type GameState = "instructions" | "playing" | "result"

interface Tile {
  id: number
  num: number
  row: number
  col: number
  cleared: boolean
}

const GRID_ROWS = 6
const GRID_COLS = 8
const INITIAL_COUNT = 4

export default function ChimpTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [level, setLevel] = useState(1)
  const [strikes, setStrikes] = useState(0)
  const [tiles, setTiles] = useState<Tile[]>([])
  const [nextExpected, setNextExpected] = useState(1)
  const [masked, setMasked] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [percentile, setPercentile] = useState(50)

  const { addScore } = useScore()

  const generateLevelTiles = (lvl: number) => {
    const count = INITIAL_COUNT + lvl - 1
    const totalCells = GRID_ROWS * GRID_COLS
    const chosenIndices = new Set<number>()

    while (chosenIndices.size < count) {
      chosenIndices.add(Math.floor(Math.random() * totalCells))
    }

    const indicesArray = Array.from(chosenIndices)
    const newTiles: Tile[] = indicesArray.map((idx, i) => {
      const row = Math.floor(idx / GRID_COLS)
      const col = idx % GRID_COLS
      return {
        id: i,
        num: i + 1,
        row,
        col,
        cleared: false,
      }
    })

    return newTiles
  }

  const startLevel = (lvl: number) => {
    const newTiles = generateLevelTiles(lvl)
    setTiles(newTiles)
    setNextExpected(1)
    setMasked(false)
    setIsLocked(false)
  }

  const startGame = () => {
    setLevel(1)
    setStrikes(0)
    setGameState("playing")
    startLevel(1)
  }

  const handleTileClick = (tile: Tile) => {
    if (gameState !== "playing" || tile.cleared || isLocked) return

    if (tile.num === nextExpected) {
      // Correct click
      sound.playClick()
      // First click masks all tiles
      if (nextExpected === 1) {
        setMasked(true)
      }

      const updated = tiles.map((t) => (t.id === tile.id ? { ...t, cleared: true } : t))
      setTiles(updated)

      const nextNum = nextExpected + 1
      setNextExpected(nextNum)

      // Level cleared?
      if (nextNum > tiles.length) {
        sound.playSuccess()
        setIsLocked(true)
        const nextLevel = level + 1
        setLevel(nextLevel)
        setTimeout(() => startLevel(nextLevel), 600)
      }
    } else {
      // Wrong click - Strike!
      sound.playError()
      setIsLocked(true)
      setMasked(false) // Unmask on failure
      const newStrikes = strikes + 1
      setStrikes(newStrikes)

      if (newStrikes >= 3) {
        // Game Over!
        const finalScore = Math.max(0, INITIAL_COUNT + level - 2)
        const saved = addScore({
          testId: "chimp-test",
          testName: "Chimp Test",
          score: finalScore,
          unit: "pts",
          details: { strikes: newStrikes, levelReached: level },
        })
        setPercentile(saved.percentile)
        setTimeout(() => setGameState("result"), 1000)
      } else {
        // Retry level after momentary pause
        setTimeout(() => startLevel(level), 900)
      }
    }
  }

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto brutal-card p-8 sm:p-12 text-center font-mono">
        <div className="w-16 h-16 border-2 border-black dark:border-white bg-pink-400 text-black flex items-center justify-center mx-auto mb-6 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
          <Brain className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-3">
          Chimp Test (Ayumu Spatial Span)
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-6">
          Click the numbers in ascending order (1, 2, 3...). Clicking &ldquo;1&rdquo; masks the remaining tiles.
          Inspired by cognitive studies at Kyoto University where chimpanzee Ayumu scored 9+ effortlessly.
        </p>

        <Button
          onClick={startGame}
          size="lg"
        >
          Start Chimp Memory
        </Button>
      </div>
    )
  }

  if (gameState === "result") {
    const finalScore = Math.max(0, INITIAL_COUNT + level - 2)
    return (
      <div className="max-w-2xl mx-auto brutal-card p-8 text-center font-mono">
        <div className="w-16 h-16 border-2 border-black dark:border-white bg-pink-400 text-black flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_#0A0A0A]">
          <Brain className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-xs uppercase text-muted-foreground tracking-wider mb-1 font-bold">
          Working Memory Span
        </h2>
        <div className="text-6xl font-black text-foreground mb-2 tabular">
          {finalScore} <span className="text-2xl text-pink-500">numbers</span>
        </div>

        <p className="text-xs text-muted-foreground uppercase font-bold mb-4">
          {finalScore >= 9
            ? "Ayumu Chimpanzee parity achieved! Elite iconic visual memory."
            : "Average human score is 7 to 9. Ayumu (Chimp) retains 9 digits in 0.5s."}
        </p>

        <BellCurve testId="chimp-test" score={finalScore} unit="pts" percentile={percentile} />

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

  // Create grid matrix
  const gridCells = []
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const tile = tiles.find((t) => t.row === r && t.col === c)
      gridCells.push({ r, c, tile })
    }
  }

  return (
    <div className="max-w-2xl mx-auto font-mono">
      {/* Telemetry header */}
      <div className="flex items-center justify-between mb-3 px-2 text-xs uppercase font-bold">
        <div>
          <span className="text-muted-foreground">Numbers: </span>
          <span className="text-pink-500 font-black tabular">{INITIAL_COUNT + level - 1}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground mr-1">Strikes:</span>
          {[0, 1, 2].map((s) => (
            <span
              key={s}
              className={`w-3.5 h-3.5 border-2 border-black dark:border-white inline-block shadow-[1px_1px_0px_0px_#0A0A0A] ${
                s < strikes ? "bg-red-500" : "bg-card"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="grid grid-cols-8 gap-2 p-4 brutal-card">
        {gridCells.map(({ r, c, tile }) => {
          if (!tile || tile.cleared) {
            return <div key={`${r}-${c}`} className="aspect-square" />
          }

          return (
            <button
              key={`${r}-${c}`}
              disabled={isLocked}
              onClick={() => handleTileClick(tile)}
              className={`aspect-square border-2 border-black dark:border-white ${
                masked ? "bg-card hover:bg-secondary" : "bg-pink-400 text-black font-black"
              } shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center font-mono text-lg sm:text-xl transition-all select-none cursor-pointer disabled:cursor-not-allowed`}
            >
              {masked ? "" : tile.num}
            </button>
          )
        })}
      </div>
    </div>
  )
}
