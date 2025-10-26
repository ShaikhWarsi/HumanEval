"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

type GameState = "instructions" | "showing" | "waiting" | "result"

export default function SequenceMemoryTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [sequence, setSequence] = useState<number[]>([])
  const [playerSequence, setPlayerSequence] = useState<number[]>([])
  const [currentLevel, setCurrentLevel] = useState(1)
  const [showingIndex, setShowingIndex] = useState(0)
  const [highlightedButton, setHighlightedButton] = useState<number | null>(null)
  const [finalLevel, setFinalLevel] = useState(0)

  const timeoutRef = useRef<NodeJS.Timeout>()
  const router = useRouter()

  const generateSequence = (level: number) => {
    const newSequence = []
    for (let i = 0; i < level; i++) {
      newSequence.push(Math.floor(Math.random() * 9))
    }
    return newSequence
  }

  const startGame = () => {
    setCurrentLevel(1)
    setPlayerSequence([])
    setFinalLevel(0)
    startLevel(1)
  }

  const startLevel = (level: number) => {
    const newSequence = generateSequence(level)
    setSequence(newSequence)
    setPlayerSequence([])
    setShowingIndex(0)
    setGameState("showing")
    showSequence(newSequence)
  }

  const showSequence = (seq: number[]) => {
    let index = 0

    const showNext = () => {
      if (index < seq.length) {
        setHighlightedButton(seq[index])

        timeoutRef.current = setTimeout(() => {
          setHighlightedButton(null)

          timeoutRef.current = setTimeout(() => {
            index++
            showNext()
          }, 200)
        }, 600)
      } else {
        setGameState("waiting")
      }
    }

    // Initial delay before starting
    timeoutRef.current = setTimeout(showNext, 1000)
  }

  const handleButtonClick = (buttonIndex: number) => {
    if (gameState !== "waiting") return

    const newPlayerSequence = [...playerSequence, buttonIndex]
    setPlayerSequence(newPlayerSequence)

    // Check if the click is correct
    if (buttonIndex !== sequence[newPlayerSequence.length - 1]) {
      // Wrong button - game over
      setFinalLevel(currentLevel)
      setGameState("result")
      return
    }

    // Check if sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      // Level complete - move to next level
      const nextLevel = currentLevel + 1
      setCurrentLevel(nextLevel)

      // Brief pause before next level
      timeoutRef.current = setTimeout(() => {
        startLevel(nextLevel)
      }, 1000)
    }
  }

  const resetGame = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setGameState("instructions")
    setSequence([])
    setPlayerSequence([])
    setCurrentLevel(1)
    setHighlightedButton(null)
    setFinalLevel(0)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-6">🔲</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Sequence Memory Test</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Memorize the sequence of buttons that light up, then press them in order.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Every time you finish the pattern, it gets longer. Make a mistake, and the test is over.
            </p>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 text-lg"
            >
              Start
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "result") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-6">🔲</div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Level {finalLevel}</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              You made it to level {finalLevel}. The average person gets to level 8.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={startGame}
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3"
              >
                Try Again
              </Button>
              <Button
                onClick={resetGame}
                variant="outline"
                size="lg"
                className="font-semibold px-6 py-3 bg-transparent"
              >
                Back to Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Level {currentLevel}</h2>
        {gameState === "showing" && <p className="text-blue-100">Watch the pattern...</p>}
        {gameState === "waiting" && <p className="text-blue-100">Repeat the pattern</p>}
      </div>

      <Card className="bg-white/95 backdrop-blur p-8">
        <CardContent>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {Array.from({ length: 9 }, (_, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(index)}
                disabled={gameState !== "waiting"}
                className={`
                  aspect-square rounded-lg border-2 transition-all duration-200 text-2xl font-bold
                  ${
                    highlightedButton === index
                      ? "bg-blue-400 border-blue-500 text-white shadow-lg scale-105"
                      : "bg-gray-100 border-gray-300 text-gray-400 hover:bg-gray-200"
                  }
                  ${gameState === "waiting" ? "cursor-pointer" : "cursor-not-allowed"}
                `}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {gameState === "waiting" && playerSequence.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Progress: {playerSequence.length} / {sequence.length}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
