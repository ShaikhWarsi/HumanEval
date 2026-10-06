"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useScore } from "@/lib/score-context"
import { sound } from "@/lib/audio"
import BellCurve from "@/components/bell-curve"
import { Grid3X3, RotateCcw } from "lucide-react"

type GameState = "instructions" | "showing" | "playing" | "gameover"

export default function SequenceMemoryTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [sequence, setSequence] = useState<number[]>([])
  const [userStep, setUserStep] = useState<number>(0)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const [activeClickIndex, setActiveClickIndex] = useState<number | null>(null)
  const [level, setLevel] = useState<number>(1)
  const [percentile, setPercentile] = useState<number>(50)

  const { addScore } = useScore()
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t))
    timeoutsRef.current = []
  }

  useEffect(() => {
    return () => clearAllTimeouts()
  }, [])

  const startGame = () => {
    clearAllTimeouts()
    // Start with 1 item
    const firstItem = Math.floor(Math.random() * 9)
    const initialSeq = [firstItem]
    setSequence(initialSeq)
    setLevel(1)
    setUserStep(0)
    setGameState("showing")
    playSequence(initialSeq)
  }

  const playSequence = (seq: number[]) => {
    setGameState("showing")
    setUserStep(0)
    setHighlightedIndex(null)

    // Adaptive presentation pace (Audit Issue 3.A.4):
    // As sequence length grows from 1 to 15+, scale the inter-stimulus interval dynamically
    // from 460ms down to 260ms, preventing tedious 8-second passive observation delays
    // while keeping flash duration crisp and identifiable.
    const stepInterval = Math.max(260, 460 - Math.min(seq.length * 15, 200))
    const flashDuration = Math.max(170, Math.floor(stepInterval * 0.68))

    seq.forEach((tileIndex, idx) => {
      // Stagger each tile
      const onTimeout = setTimeout(() => {
        setHighlightedIndex(tileIndex)
        sound.playTileNote(tileIndex)

        const offTimeout = setTimeout(() => {
          setHighlightedIndex(null)
          if (idx === seq.length - 1) {
            setGameState("playing")
          }
        }, flashDuration)
        timeoutsRef.current.push(offTimeout)
      }, 350 + idx * stepInterval)

      timeoutsRef.current.push(onTimeout)
    })
  }

  const handleTileClick = (tileIndex: number) => {
    if (gameState !== "playing") return

    // Quick user touch feedback
    setActiveClickIndex(tileIndex)
    sound.playTileNote(tileIndex)
    setTimeout(() => setActiveClickIndex(null), 180)

    // Check if correct
    if (tileIndex === sequence[userStep]) {
      const nextStep = userStep + 1
      if (nextStep === sequence.length) {
        const nextLevel = level + 1
        setLevel(nextLevel)
        const lastTile = sequence[sequence.length - 1]
        let nextTile = Math.floor(Math.random() * 9)
        while (nextTile === lastTile) {
          nextTile = Math.floor(Math.random() * 9)
        }
        const nextSeq = [...sequence, nextTile]
        setSequence(nextSeq)
        setGameState("showing")

        const waitTimeout = setTimeout(() => {
          playSequence(nextSeq)
        }, 450)
        timeoutsRef.current.push(waitTimeout)
      } else {
        setUserStep(nextStep)
      }
    } else {
      // WRONG tile! Game Over
      sound.playError()
      clearAllTimeouts()
      const finalScore = level - 1
      const saved = addScore({
        testId: "sequence-memory",
        testName: "Sequence Memory",
        score: finalScore,
        unit: "lvl",
        details: { finalLevel: level, sequenceLength: sequence.length },
      })
      setPercentile(saved.percentile)
      setGameState("gameover")
    }
  }

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto brutal-card p-8 sm:p-12 text-center font-sans">
        <div className="w-16 h-16 border-2 border-black dark:border-slate-700 bg-purple-500 text-white flex items-center justify-center mx-auto mb-6 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
          <Grid3X3 className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-foreground mb-3">
          Sequence Memory Span
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto mb-8 font-sans">
          Memorize the sequence of flashing tiles. Tap them in exact temporal order.
          Each completed round appends an additional coordinate to the sequence.
        </p>

        <Button
          onClick={startGame}
          size="lg"
        >
          Begin Sequence Test
        </Button>
      </div>
    )
  }

  if (gameState === "gameover") {
    return (
      <div className="max-w-2xl mx-auto brutal-card p-8 text-center font-sans">
        <div className="w-16 h-16 border-2 border-black dark:border-slate-700 bg-purple-500 text-white flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
          <Grid3X3 className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-xs uppercase text-muted-foreground tracking-wider mb-1 font-bold font-mono">
          Max Sequence Replicated
        </h2>
        <div className="text-6xl font-black text-foreground mb-2 tabular font-mono">
          Level {level - 1}
        </div>

        <BellCurve testId="sequence-memory" score={level - 1} unit="lvl" percentile={percentile} />

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
    <div className="max-w-md mx-auto font-sans">
      {/* Level counter */}
      <div className="flex items-center justify-between mb-4 px-2 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase text-muted-foreground font-bold">Level</span>
          <span className="text-lg font-black text-purple-500 tabular">{level}</span>
        </div>
        <div className="text-xs uppercase font-bold text-muted-foreground">
          {gameState === "showing" ? (
            <span className="text-amber-500 animate-pulse">● MEMORIZE PATTERN</span>
          ) : (
            <span className="text-emerald-500">● YOUR TURN ({userStep}/{sequence.length})</span>
          )}
        </div>
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-3 p-4 brutal-card">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
          const isHighlighted = highlightedIndex === index || activeClickIndex === index
          return (
            <button
              key={index}
              disabled={gameState === "showing"}
              onClick={() => handleTileClick(index)}
              className={`aspect-square border-2 border-black dark:border-slate-700 transition-all select-none cursor-pointer ${
                isHighlighted
                  ? "bg-purple-400 text-slate-950 shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#000000] translate-x-[-1px] translate-y-[-1px]"
                  : "bg-card hover:bg-secondary shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
