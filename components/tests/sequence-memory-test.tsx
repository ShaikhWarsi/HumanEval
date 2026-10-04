"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useScore } from "@/lib/score-context"
import { sound } from "@/lib/audio"
import BellCurve from "@/components/bell-curve"
import { Grid3X3, RotateCcw, Award } from "lucide-react"

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
        }, 400)
        timeoutsRef.current.push(offTimeout)
      }, 700 + idx * 550)

      timeoutsRef.current.push(onTimeout)
    })
  }

  const handleTileClick = (tileIndex: number) => {
    if (gameState !== "playing") return

    // Quick user touch feedback
    setActiveClickIndex(tileIndex)
    sound.playTileNote(tileIndex)
    setTimeout(() => setActiveClickIndex(null), 200)

    // Check if correct
    if (tileIndex === sequence[userStep]) {
      const nextStep = userStep + 1
      if (nextStep === sequence.length) {
        // Level complete! Add ONE new tile to sequence
        const nextLevel = level + 1
        setLevel(nextLevel)
        const nextTile = Math.floor(Math.random() * 9)
        const nextSeq = [...sequence, nextTile]
        setSequence(nextSeq)
        setGameState("showing")

        const waitTimeout = setTimeout(() => {
          playSequence(nextSeq)
        }, 800)
        timeoutsRef.current.push(waitTimeout)
      } else {
        setUserStep(nextStep)
      }
    } else {
      // WRONG tile! Game Over
      sound.playError()
      clearAllTimeouts()
      setHighlightedIndex(null)
      const finalScore = level - 1 // Levels completed
      const saved = addScore({
        testId: "sequence-memory",
        testName: "Sequence Memory",
        score: finalScore,
        unit: "lvl",
        details: { sequenceLength: sequence.length },
      })
      setPercentile(saved.percentile)
      setGameState("gameover")
    }
  }

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto cyber-card rounded-2xl p-8 sm:p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto mb-6">
          <Grid3X3 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-mono tracking-tight text-foreground mb-3">
          Sequence Memory
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-6">
          Memorize the sequence of flashing tiles and acoustic notes. 
          Each round appends one additional step to the pattern. One misstep terminates the session.
        </p>

        <Button
          onClick={startGame}
          size="lg"
          className="bg-violet-500 hover:bg-violet-400 text-white font-mono font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-violet-500/20"
        >
          Start Protocol
        </Button>
      </div>
    )
  }

  if (gameState === "gameover") {
    return (
      <div className="max-w-2xl mx-auto cyber-card rounded-2xl p-8 text-center animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-xs font-mono uppercase text-muted-foreground tracking-wider mb-1">
          Final Score
        </h2>
        <div className="text-5xl font-mono font-black text-foreground mb-2 tabular">
          Level {level - 1}
        </div>

        <BellCurve testId="sequence-memory" score={level - 1} unit="lvl" percentile={percentile} />

        <div className="flex gap-3 justify-center mt-6">
          <Button
            onClick={startGame}
            className="bg-violet-500 hover:bg-violet-400 text-white font-mono font-bold px-6 py-2.5 rounded-xl transition-all"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Level counter */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground uppercase">Level</span>
          <span className="text-lg font-mono font-bold text-violet-400 tabular">{level}</span>
        </div>
        <div className="text-xs font-mono text-muted-foreground">
          {gameState === "showing" ? (
            <span className="text-amber-400 animate-pulse">● MEMORIZE PATTERN</span>
          ) : (
            <span className="text-emerald-400 font-semibold">● YOUR TURN ({userStep}/{sequence.length})</span>
          )}
        </div>
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-card/60 border border-border/50">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
          const isHighlighted = highlightedIndex === index || activeClickIndex === index
          return (
            <button
              key={index}
              disabled={gameState === "showing"}
              onClick={() => handleTileClick(index)}
              className={`aspect-square rounded-xl border transition-all duration-150 select-none ${
                isHighlighted
                  ? "bg-violet-400 border-violet-200 shadow-xl shadow-violet-500/50 scale-[0.98]"
                  : "bg-secondary/60 border-border/60 hover:border-violet-500/30 hover:bg-secondary/90 active:scale-95"
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
