"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useScore } from "@/lib/score-context"
import { sound } from "@/lib/audio"
import BellCurve from "@/components/bell-curve"
import { MessageSquare, RotateCcw, Heart } from "lucide-react"

type GameState = "instructions" | "playing" | "result"

const WORD_BANK = [
  "matrix", "quantum", "neural", "pulse", "beacon", "crypto", "signal", "photon",
  "nebula", "zenith", "orbit", "vortex", "echo", "vertex", "plasma", "dynamo",
  "vector", "tensor", "nexus", "flux", "aurora", "prism", "binary", "cipher",
  "strata", "titan", "radius", "hyper", "cyber", "lumen", "apex", "synthesis",
  "entropy", "cosmos", "chronos", "gravity", "quasar", "eclipse", "stellar", "cortex",
  "synapse", "axon", "proton", "neutron", "circuit", "silicon", "optics", "sonar",
  "radar", "spectrum", "wavelength", "frequency", "resonance", "amplitude", "harmonic",
  "crystal", "prism", "mirror", "shadow", "spark", "ember", "frost", "blaze",
  "whisper", "thunder", "meteor", "comet", "galaxy", "cluster", "vacuum", "void",
  "origin", "terminal", "packet", "router", "gateway", "proxy", "token", "hash",
  "kernel", "daemon", "thread", "process", "socket", "buffer", "cache", "driver",
  "sensor", "actuator", "chassis", "module", "relay", "switch", "diode", "transistor",
  "battery", "engine", "turbine", "rudder", "anchor", "compass", "voyage", "horizon"
]

export default function VerbalMemoryTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [currentWord, setCurrentWord] = useState("")
  const [seenWords, setSeenWords] = useState<Set<string>>(new Set())
  const [isCurrentWordSeen, setIsCurrentWordSeen] = useState(false)
  const [percentile, setPercentile] = useState(50)

  const { addScore } = useScore()

  const pickNextWord = (seen: Set<string>) => {
    // 50% chance to repeat if we have seen at least 2 words
    const shouldRepeat = seen.size >= 2 && Math.random() < 0.5

    if (shouldRepeat) {
      const seenArray = Array.from(seen)
      const randomSeen = seenArray[Math.floor(Math.random() * seenArray.length)]
      setCurrentWord(randomSeen)
      setIsCurrentWordSeen(true)
    } else {
      // Pick an unseen word
      const available = WORD_BANK.filter((w) => !seen.has(w))
      const word = available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : `word_${Math.floor(Math.random() * 1000)}` // fallback
      
      setCurrentWord(word)
      setIsCurrentWordSeen(false)
    }
  }

  const startGame = () => {
    setScore(0)
    setLives(3)
    const initialSeen = new Set<string>()
    setSeenWords(initialSeen)
    setGameState("playing")
    pickNextWord(initialSeen)
  }

  const handleDecision = (userClaimedSeen: boolean) => {
    if (gameState !== "playing") return

    if (userClaimedSeen === isCurrentWordSeen) {
      // Correct!
      sound.playClick()
      const newScore = score + 1
      setScore(newScore)

      const updatedSeen = new Set(seenWords)
      if (!isCurrentWordSeen) {
        updatedSeen.add(currentWord)
        setSeenWords(updatedSeen)
      }
      pickNextWord(updatedSeen)
    } else {
      // Wrong!
      sound.playError()
      const newLives = lives - 1
      setLives(newLives)

      if (newLives <= 0) {
        // Game Over
        const saved = addScore({
          testId: "verbal-memory",
          testName: "Verbal Memory",
          score: score,
          unit: "words",
          details: { livesRemaining: 0, seenWordCount: seenWords.size },
        })
        setPercentile(saved.percentile)
        setGameState("result")
      } else {
        const updatedSeen = new Set(seenWords)
        if (!isCurrentWordSeen) {
          updatedSeen.add(currentWord)
          setSeenWords(updatedSeen)
        }
        pickNextWord(updatedSeen)
      }
    }
  }

  // Keyboard controls: ArrowLeft or 'S' for SEEN, ArrowRight or 'N' for NEW
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "s") {
        handleDecision(true)
      } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "n") {
        handleDecision(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameState, currentWord, isCurrentWordSeen, score, lives, seenWords])

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto cyber-card rounded-2xl p-8 sm:p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-mono tracking-tight text-foreground mb-3">
          Verbal Memory Protocol
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-6">
          Words will be presented one at a time. If you have seen the word in this session, choose <strong className="text-amber-400">SEEN</strong>. 
          If the word is novel, choose <strong className="text-cyan-400">NEW</strong>. You have 3 lives.
        </p>

        <Button
          onClick={startGame}
          size="lg"
          className="bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20"
        >
          Initialize Word Stream
        </Button>
      </div>
    )
  }

  if (gameState === "result") {
    return (
      <div className="max-w-2xl mx-auto cyber-card rounded-2xl p-8 text-center animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h2 className="text-xs font-mono uppercase text-muted-foreground tracking-wider mb-1">
          Lexical Memory Capacity
        </h2>
        <div className="text-5xl font-mono font-black text-foreground mb-2 tabular">
          {score} <span className="text-2xl text-amber-400">words</span>
        </div>

        <BellCurve testId="verbal-memory" score={score} unit="words" percentile={percentile} />

        <div className="flex gap-3 justify-center mt-6">
          <Button
            onClick={startGame}
            className="bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold px-6 py-2.5 rounded-xl transition-all"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto cyber-card rounded-2xl p-8 sm:p-12 text-center">
      {/* Telemetry bar */}
      <div className="flex items-center justify-between mb-8 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-rose-400">
          {[...Array(3)].map((_, i) => (
            <Heart
              key={i}
              className={`w-4 h-4 ${i < lives ? "fill-rose-500 text-rose-500" : "text-muted-foreground/30"}`}
            />
          ))}
        </div>
        <div className="text-muted-foreground">
          Score: <span className="text-foreground font-bold text-sm tabular">{score}</span>
        </div>
      </div>

      {/* Target Word */}
      <div className="my-10 animate-in zoom-in-95 duration-100">
        <span className="text-4xl sm:text-5xl font-mono font-black tracking-wider text-foreground">
          {currentWord}
        </span>
      </div>

      {/* Decision Buttons */}
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        <Button
          onClick={() => handleDecision(true)}
          size="lg"
          className="bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold py-6 text-base rounded-xl transition-all shadow-md active:scale-95"
        >
          SEEN <span className="text-[10px] opacity-70 ml-1">(← / S)</span>
        </Button>
        <Button
          onClick={() => handleDecision(false)}
          size="lg"
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold py-6 text-base rounded-xl transition-all shadow-md active:scale-95"
        >
          NEW <span className="text-[10px] opacity-70 ml-1">(→ / N)</span>
        </Button>
      </div>
    </div>
  )
}
