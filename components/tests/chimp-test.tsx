"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useScore } from "@/lib/score-context"
import { sound } from "@/lib/audio"
import BellCurve from "@/components/bell-curve"
import { Brain, RotateCcw, AlertCircle } from "lucide-react"

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
  }

  const startGame = () => {
    setLevel(1)
    setStrikes(0)
    setGameState("playing")
    startLevel(1)
  }

  const handleTileClick = (tile: Tile) => {
    if (gameState !== "playing" || tile.cleared) return

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
        const nextLevel = level + 1
        setLevel(nextLevel)
        setTimeout(() => startLevel(nextLevel), 600)
      }
    } else {
      // Strike!
      sound.playError()
      const newStrikes = strikes + 1
      setStrikes(newStrikes)

      if (newStrikes >= 3) {
        // Game Over
        const finalScore = INITIAL_COUNT + level - 2
        const saved = addScore({
          testId: "chimp-test",
          testName: "Chimp Test",
          score: Math.max(0, finalScore),
          unit: "pts",
          details: { maxTilesCompleted: finalScore, levelReached: level },
        })
        setPercentile(saved.percentile)
        setGameState("result")
      } else {
        // Retry current level with fresh tiles
        setTimeout(() => startLevel(level), 800)
      }
    }
  }

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto cyber-card rounded-2xl p-8 sm:p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mx-auto mb-6">
          <Brain className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-mono tracking-tight text-foreground mb-3">
          Chimp Test (Ayumu Protocol)
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-6">
          Click the numbers in ascending order (1, 2, 3...). 
          <span className="text-pink-400 font-semibold block mt-1">
            As soon as you click 1, all other numbers are masked into blank tiles!
          </span>
          Chimpanzees routinely outscore 95% of human adults on this test. 3 strikes and you are out.
        </p>

        <Button
          onClick={startGame}
          size="lg"
          className="bg-pink-500 hover:bg-pink-400 text-white font-mono font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-pink-500/20"
        >
          Begin Ayumu Trial
        </Button>
      </div>
    )
  }

  if (gameState === "result") {
    const finalScore = Math.max(0, INITIAL_COUNT + level - 2)
    return (
      <div className="max-w-2xl mx-auto cyber-card rounded-2xl p-8 text-center animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8" />
        </div>
        <h2 className="text-xs font-mono uppercase text-muted-foreground tracking-wider mb-1">
          Working Memory Span
        </h2>
        <div className="text-5xl font-mono font-black text-foreground mb-2 tabular">
          {finalScore} <span className="text-2xl text-pink-400">numbers</span>
        </div>

        <p className="text-xs text-muted-foreground font-mono mb-4">
          {finalScore >= 9
            ? "Ayumu Chimpanzee parity achieved! Elite iconic visual memory."
            : "Average human score is 7 to 9. Ayumu (Chimp) retains 9 digits in 0.5s."}
        </p>

        <BellCurve testId="chimp-test" score={finalScore} unit="pts" percentile={percentile} />

        <div className="flex gap-3 justify-center mt-6">
          <Button
            onClick={startGame}
            className="bg-pink-500 hover:bg-pink-400 text-white font-mono font-bold px-6 py-2.5 rounded-xl transition-all"
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
    <div className="max-w-2xl mx-auto">
      {/* Telemetry header */}
      <div className="flex items-center justify-between mb-4 px-2 text-xs font-mono">
        <div>
          <span className="text-muted-foreground">Numbers: </span>
          <span className="font-bold text-pink-400 tabular">{INITIAL_COUNT + level - 1}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground mr-1">Strikes:</span>
          {[0, 1, 2].map((s) => (
            <span
              key={s}
              className={`w-2.5 h-2.5 rounded-full inline-block ${
                s < strikes ? "bg-rose-500 shadow-sm shadow-rose-500/50" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="grid grid-cols-8 gap-2 p-4 rounded-2xl bg-card/60 border border-border/50">
        {gridCells.map(({ r, c, tile }) => {
          if (!tile || tile.cleared) {
            return <div key={`${r}-${c}`} className="aspect-square rounded-xl" />
          }

          return (
            <button
              key={`${r}-${c}`}
              onClick={() => handleTileClick(tile)}
              className="aspect-square rounded-xl border border-pink-500/40 bg-pink-500/10 hover:bg-pink-500/20 active:scale-90 flex items-center justify-center font-mono font-extrabold text-lg sm:text-xl text-foreground transition-all select-none shadow-sm shadow-pink-500/20"
            >
              {masked ? "" : tile.num}
            </button>
          )
        })}
      </div>
    </div>
  )
}
