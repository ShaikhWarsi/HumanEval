"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
} from "react-share"
import { useRouter } from "next/navigation"

type GameState = "instructions" | "showing" | "playing" | "result"

interface Square {
  id: number
  number: number
  row: number
  col: number
  clicked: boolean
}

export default function ChimpTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [squares, setSquares] = useState<Square[]>([])
  const [currentLevel, setCurrentLevel] = useState(1)
  const [nextNumber, setNextNumber] = useState(1)
  const [finalLevel, setFinalLevel] = useState(0)
  const [retriesLeft, setRetriesLeft] = useState(3)
  const [showNumbers, setShowNumbers] = useState(true)
  const router = useRouter()

  const GRID_SIZE = 8 // 8x8 grid
  const INITIAL_NUMBERS = 4 // Start with numbers 1-4

  const generateSquares = (level: number) => {
    const numSquares = INITIAL_NUMBERS + level - 1
    const positions = new Set<string>()
    const newSquares: Square[] = []

    // Generate unique random positions
    while (positions.size < numSquares) {
      const row = Math.floor(Math.random() * GRID_SIZE)
      const col = Math.floor(Math.random() * GRID_SIZE)
      const key = `${row}-${col}`

      if (!positions.has(key)) {
        positions.add(key)
        newSquares.push({
          id: newSquares.length,
          number: newSquares.length + 1,
          row,
          col,
          clicked: false,
        })
      }
    }

    return newSquares
  }

  const startGame = () => {
    setCurrentLevel(1)
    setFinalLevel(0)
    setRetriesLeft(3) // Reset retries
    startLevel(1)
  }

  const startLevel = (level: number) => {
    const newSquares = generateSquares(level)
    setSquares(newSquares)
    setNextNumber(1)
    setShowNumbers(true)
    setGameState("showing")

    // Show numbers briefly, then hide them
    setTimeout(() => {
      setGameState("playing")
    }, 2000)
  }

  const handleSquareClick = (square: Square) => {
    if (gameState !== "showing" && gameState !== "playing") return
    if (square.clicked) return

    if (square.number === nextNumber) {
      // Correct click
      const updatedSquares = squares.map((s) => (s.id === square.id ? { ...s, clicked: true } : s))
      setSquares(updatedSquares)

      // Hide numbers after first click
      if (nextNumber === 1) {
        setShowNumbers(false)
        setGameState("playing")
      }

      const newNextNumber = nextNumber + 1
      setNextNumber(newNextNumber)

      // Check if level is complete
      if (newNextNumber > squares.length) {
        // Level complete! Move to next level
        const nextLevel = currentLevel + 1
        setCurrentLevel(nextLevel)

        setTimeout(() => {
          startLevel(nextLevel)
        }, 1000)
      }
    } else {
      // Wrong click - check retries
      if (retriesLeft > 0) {
        setRetriesLeft(retriesLeft - 1)
        // Optionally, reset the current level or just let the user continue with fewer retries
        // For now, we'll just decrement retries and let them continue
      } else {
        setFinalLevel(currentLevel)
        setGameState("result")
      }
    }
  }

  const resetGame = () => {
    setGameState("instructions")
    setSquares([])
    setCurrentLevel(1)
    setNextNumber(1)
    setFinalLevel(0)
    setRetriesLeft(3) // Reset retries
    setShowNumbers(true)
  }

  const getSquareAtPosition = (row: number, col: number) => {
    return squares.find((s) => s.row === row && s.col === col)
  }

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-6">🔲</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Are You Smarter Than a Chimpanzee?</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">Click the squares in order according to their numbers.</p>
            <p className="text-gray-600 mb-8 leading-relaxed">The test will get progressively harder.</p>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 text-lg"
            >
              Start Test
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
            <p className="text-gray-600 mb-4 leading-relaxed">
              You made it to level {finalLevel} with {INITIAL_NUMBERS + finalLevel - 1} numbers.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              The average person gets to level 5. Chimpanzees consistently outperform humans on this task!
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
                onClick={() => router.push("/")}
                variant="outline"
                size="lg"
                className="font-semibold px-6 py-3 bg-transparent"
              >
                Back to Menu
              </Button>
            </div>
            <div className="mt-8 flex justify-center gap-4">
              <TwitterShareButton
                url={"https://humval2.vercel.app/tests/chimp-test"}
                title={`I made it to level ${finalLevel} in the Chimp Test on HumanEval! Can you beat my score?`}
              >
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <FacebookShareButton
                url={"https://humval2.vercel.app/tests/chimp-test"}
                quote={`I made it to level ${finalLevel} in the Chimp Test on HumanEval! Can you beat my score?`}
              > 
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <LinkedinShareButton
                url={"https://humval2.vercel.app/tests/chimp-test"}
                title={`Chimp Test Score on HumanEval`}
                summary={`I made it to level ${finalLevel} in the Chimp Test on HumanEval! Can you beat my score?`}
                source={"HumanEval"}
              >
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
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
        <p className="text-blue-100">
          {gameState === "showing" ? "Memorize the positions..." : `Click number ${nextNumber}`}
        </p>
        <p className="text-blue-100 text-sm mt-1">{INITIAL_NUMBERS + currentLevel - 1} numbers total</p>
        {retriesLeft > 0 && (
          <p className="text-red-300 text-sm mt-1">Retries left: {retriesLeft}</p>
        )}
      </div>

      <Card className="bg-white/95 backdrop-blur">
        <CardContent className="p-8">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 max-w-full sm:max-w-md mx-auto">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
              const row = Math.floor(index / GRID_SIZE)
              const col = index % GRID_SIZE
              const square = getSquareAtPosition(row, col)

              return (
                <div
                  key={index}
                  className={`
                    aspect-square rounded border-2 flex items-center justify-center text-lg font-bold cursor-pointer transition-all duration-200
                    ${
                      square
                        ? square.clicked
                          ? "bg-gray-300 border-gray-400 text-gray-500"
                          : "bg-white border-blue-300 text-blue-600 hover:bg-blue-50 shadow-sm"
                        : "bg-gray-50 border-gray-200"
                    }
                    ${gameState === "showing" && square ? "scale-100 opacity-100" : "scale-0 opacity-0"}
                    ${gameState === "playing" && square && showNumbers ? "scale-100 opacity-100" : "scale-0 opacity-0"}
                    ${gameState === "playing" && square && !showNumbers && !square.clicked ? "scale-100 opacity-100" : "scale-0 opacity-0"}
                  `}
                  onClick={() => square && handleSquareClick(square)}
                >
                  {(gameState === "showing" || (gameState === "playing" && showNumbers)) && square && square.number}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

