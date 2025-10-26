"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useScore } from "@/lib/score-context"
import { Eye, RotateCcw, CheckCircle, XCircle } from "lucide-react"
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
} from "react-share"
import { useRouter } from "next/navigation"

interface GridSquare {
  id: number
  isTarget: boolean
  isSelected: boolean
  wasTarget: boolean
}

export default function VisualMemoryTest() {
  const [gameState, setGameState] = useState<
    "instructions" | "showing" | "memorizing" | "selecting" | "result" | "gameOver"
  >("instructions")
  const [level, setLevel] = useState(1)
  const [grid, setGrid] = useState<GridSquare[]>([])
  const [gridSize, setGridSize] = useState(3)
  const [showTime, setShowTime] = useState(1000)
  const [selectedSquares, setSelectedSquares] = useState<number[]>([])
  const { addScore } = useScore()
  const [retriesLeft, setRetriesLeft] = useState(3)

  const getGridSize = (level: number) => {
    if (level <= 3) return 3
    if (level <= 6) return 4
    if (level <= 10) return 5
    if (level <= 15) return 6
    return 7
  }

  const getTargetCount = (level: number) => {
    return Math.min(level + 2, Math.floor(getGridSize(level) * getGridSize(level) * 0.4))
  }

  const getShowTime = (level: number) => {
    return Math.max(600, 1200 - level * 50)
  }

  const generateGrid = (level: number) => {
    const size = getGridSize(level)
    const targetCount = getTargetCount(level)
    const totalSquares = size * size

    const newGrid: GridSquare[] = []

    // Initialize all squares
    for (let i = 0; i < totalSquares; i++) {
      newGrid.push({
        id: i,
        isTarget: false,
        isSelected: false,
        wasTarget: false,
      })
    }

    // Randomly select target squares
    const targetIndices = new Set<number>()
    while (targetIndices.size < targetCount) {
      const randomIndex = Math.floor(Math.random() * totalSquares)
      targetIndices.add(randomIndex)
    }

    targetIndices.forEach((index) => {
      newGrid[index].isTarget = true
      newGrid[index].wasTarget = true
    })

    return newGrid
  }

  const startLevel = () => {
    const size = getGridSize(level)
    const showDuration = getShowTime(level)

    setGridSize(size)
    setShowTime(showDuration)
    setSelectedSquares([])

    const newGrid = generateGrid(level)
    setGrid(newGrid)
    setGameState("showing")

    // Show targets for specified duration
    setTimeout(() => {
      setGrid((prev) => prev.map((square) => ({ ...square, isTarget: false })))
      setGameState("selecting")
    }, showDuration)
  }

  const handleSquareClick = (squareId: number) => {
    if (gameState !== "selecting") return

    setGrid((prev) =>
      prev.map((square) => (square.id === squareId ? { ...square, isSelected: !square.isSelected } : square)),
    )

    setSelectedSquares((prev) => (prev.includes(squareId) ? prev.filter((id) => id !== squareId) : [...prev, squareId]))
  }

  const submitSelection = () => {
    const targetSquares = grid.filter((square) => square.wasTarget).map((square) => square.id)
    const isCorrect =
      selectedSquares.length === targetSquares.length && selectedSquares.every((id) => targetSquares.includes(id))

    if (isCorrect) {
      setGameState("result")
      setTimeout(() => {
        setLevel((prev) => prev + 1)
        startLevel()
      }, 1500)
    } else {
      if (retriesLeft > 0) {
        setRetriesLeft(retriesLeft - 1)
        // Reset the grid and show the pattern again for retry
        setGrid((prev) => prev.map((square) => ({ ...square, isSelected: false })))
        setSelectedSquares([])
        setGameState("showing")
        setTimeout(() => {
          setGrid((prev) => prev.map((square) => ({ ...square, isTarget: false })))
          setGameState("selecting")
        }, showTime)
      } else {
        // Save score
        addScore({
          testId: "visual-memory",
          testName: "Visual Memory",
          score: level,
          unit: "level",
          date: new Date(),
          details: {
            gridSize: gridSize,
            targetCount: getTargetCount(level),
            selectedCount: selectedSquares.length,
            correctTargets: targetSquares.length,
          },
        })

        setGameState("gameOver")
      }
    }
  }

  const restart = () => {
    setLevel(1)
    setGrid([])
    setSelectedSquares([])
    setRetriesLeft(3) // Reset retries
    setGameState("instructions")
  }

  const getSquareClass = (square: GridSquare) => {
    let baseClass = "w-full h-full border-2 border-muted-foreground/30 cursor-pointer transition-all duration-200 "

    if (gameState === "showing" && square.isTarget) {
      baseClass += "bg-primary border-primary shadow-lg "
    } else if (gameState === "selecting" && square.isSelected) {
      baseClass += "bg-primary/70 border-primary "
    } else if (gameState === "gameOver") {
      if (square.wasTarget && square.isSelected) {
        baseClass += "bg-green-500 border-green-500 " // Correct
      } else if (square.wasTarget && !square.isSelected) {
        baseClass += "bg-red-500 border-red-500 " // Missed target
      } else if (!square.wasTarget && square.isSelected) {
        baseClass += "bg-orange-500 border-orange-500 " // Wrong selection
      } else {
        baseClass += "bg-muted hover:bg-muted/80 "
      }
    } else {
      baseClass += "bg-muted hover:bg-muted/80 "
    }

    return baseClass
  }

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="glass-card">
          <CardHeader className="text-center">
            <Eye className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Visual Memory Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">Memorize the pattern of highlighted squares</p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold">How it works:</h3>
                <ul className="text-sm text-muted-foreground space-y-1 text-left">
                  <li>• Squares will light up briefly</li>
                  <li>• Memorize which squares were highlighted</li>
                  <li>• Click on the squares you remember</li>
                  <li>• Each level adds more squares to remember</li>
                  <li>• Make a mistake and the test ends</li>
                </ul>
              </div>
            </div>
            <Button onClick={startLevel} size="lg" className="w-full">
              Start Level 1
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "result") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="glass-card">
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-500 mb-2">Correct!</h2>
            <p className="text-muted-foreground">Moving to level {level + 1}...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "gameOver") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="glass-card">
          <CardHeader className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Game Over</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-primary">Level {level}</div>
              <p className="text-muted-foreground">You reached level {level}</p>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold">Final Challenge:</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    Grid Size: {gridSize}×{gridSize}
                  </div>
                  <div>Targets to Remember: {getTargetCount(level)}</div>
                  <div>Show Time: {showTime}ms</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Performance:</h4>
                <div className="text-sm text-muted-foreground">
                  {level >= 10 && "Excellent visual memory!"}
                  {level >= 7 && level < 10 && "Great performance!"}
                  {level >= 5 && level < 7 && "Good visual memory"}
                  {level < 5 && "Keep practicing to improve"}
                </div>
              </div>
            </div>

            {/* Show the final grid with correct answers */}
            <div className="space-y-4">
              <h4 className="font-semibold text-center">Solution:</h4>
              <div
                className="grid gap-2 mx-auto max-w-md"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  aspectRatio: "1",
                }}
              >
                {grid.map((square) => (
                  <div key={square.id} className={getSquareClass(square)} style={{ aspectRatio: "1" }} />
                ))}
              </div>
              <div className="text-xs text-muted-foreground text-center space-y-1">
                <div className="flex justify-center gap-4">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    Correct
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    Missed
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    Wrong
                  </span>
                </div>
              </div>
            </div>

            <Button onClick={restart} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => router.push("/")} variant="outline" className="w-full mt-2">
              Back to Menu
            </Button>
            <div className="mt-8 flex justify-center gap-4">
              <TwitterShareButton
                url={"https://humval2.vercel.app/tests/visual-memory-test"}
                title={`I reached level ${level} in the Visual Memory Test on HumanEval! Can you beat my score?`}
              >
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <FacebookShareButton
                url={"https://humval2.vercel.app/tests/visual-memory-test"}
                quote={`I reached level ${level} in the Visual Memory Test on HumanEval! Can you beat my score?`}
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <LinkedinShareButton
                url={"https://humval2.vercel.app/tests/visual-memory-test"}
                title={`Visual Memory Test Score on HumanEval`}
                summary={`I reached level ${level} in the Visual Memory Test on HumanEval! Can you beat my score?`}
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
      <Card className="glass-card">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Level {level}
            {gameState === "showing" && " - Memorize"}
            {gameState === "selecting" && " - Select"}
          </CardTitle>
          {gameState === "showing" && <p className="text-muted-foreground">Watch the highlighted squares</p>}
          {gameState === "selecting" && (
            <p className="text-muted-foreground">
              Click the squares that were highlighted ({selectedSquares.length} selected)
            </p>
          )}

        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="grid gap-2 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              maxWidth: "400px",
              aspectRatio: "1",
            }}
          >
            {grid.map((square) => (
              <div
                key={square.id}
                className={getSquareClass(square)}
                onClick={() => handleSquareClick(square.id)}
                style={{ aspectRatio: "1" }}
              />
            ))}
          </div>

          {gameState === "selecting" && (
            <div className="text-center">
              <Button onClick={submitSelection} disabled={selectedSquares.length === 0} size="lg">
                Submit ({selectedSquares.length} selected)
              </Button>
            </div>
          )}

          {gameState === "memorizing" && (
            <div className="text-center">
              <div className="text-muted-foreground">Get ready...</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
