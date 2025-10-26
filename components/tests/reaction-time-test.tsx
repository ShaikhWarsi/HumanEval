"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

type GameState = "instructions" | "ready" | "waiting" | "click" | "result" | "too-early"

export default function ReactionTimeTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [reactionTime, setReactionTime] = useState<number>(0)
  const [attempts, setAttempts] = useState<number[]>([])
  const [startTime, setStartTime] = useState<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const router = useRouter()

  const startTest = () => {
    setGameState("ready")
  }

  const beginWaiting = () => {
    setGameState("waiting")

    // Random delay between 1-5 seconds
    const delay = Math.random() * 4000 + 1000

    timeoutRef.current = setTimeout(() => {
      setGameState("click")
      setStartTime(Date.now())
    }, delay)
  }

  const handleClick = () => {
    if (gameState === "waiting") {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setGameState("too-early")
    } else if (gameState === "click") {
      // Valid click - measure reaction time
      const endTime = Date.now()
      const reaction = endTime - startTime
      setReactionTime(reaction)
      setAttempts((prev) => [...prev, reaction])
      setGameState("result")
    } else if (gameState === "ready") {
      beginWaiting()
    }
  }

  const resetTest = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setGameState("instructions")
    setReactionTime(0)
  }

  const tryAgain = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setGameState("ready")
  }

  const getAverageTime = () => {
    if (attempts.length === 0) return 0
    return Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
  }

  const getBackgroundColor = () => {
    switch (gameState) {
      case "waiting":
        return "bg-red-500"
      case "click":
        return "bg-green-500"
      case "too-early":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  const getTextColor = () => {
    return "text-white"
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
      <div className="max-w-full sm:max-w-2xl mx-auto">
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-6">⚡</div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Reaction Time Test</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
              When the red box turns green, click as quickly as you can.
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">Click anywhere to keep going.</p>
            <Button
              onClick={startTest}
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 sm:px-8 py-3 text-base sm:text-lg"
            >
              Start Test
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-full sm:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className={`${getBackgroundColor()} ${getTextColor()} rounded-lg p-8 sm:p-16 text-center cursor-pointer transition-colors duration-200 min-h-[400px] flex flex-col items-center justify-center`}
        onClick={handleClick}
      >
        {gameState === "ready" && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Click to start</h2>
            <p className="text-lg sm:text-xl opacity-90">Get ready...</p>
          </div>
        )}

        {gameState === "waiting" && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Wait for green</h2>
            <p className="text-lg sm:text-xl opacity-90">Don't click yet...</p>
          </div>
        )}

        {gameState === "click" && (
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Click!</h2>
            <p className="text-lg sm:text-xl opacity-90">Click as fast as you can!</p>
          </div>
        )}

        {gameState === "too-early" && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Too early!</h2>
            <p className="text-lg sm:text-xl opacity-90 mb-6">You clicked before it turned green.</p>
            <Button onClick={tryAgain} className="bg-white text-red-500 hover:bg-gray-100 font-semibold px-4 sm:px-6 py-2 text-base sm:text-lg">
              Try Again
            </Button>
          </div>
        )}

        {gameState === "result" && (
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{reactionTime}ms</h2>
            <p className="text-lg sm:text-xl opacity-90 mb-6">
              {attempts.length > 1 && `Average: ${getAverageTime()}ms (${attempts.length} attempts)`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={tryAgain} className="bg-white text-blue-500 hover:bg-gray-100 font-semibold px-4 sm:px-6 py-2 text-base sm:text-lg">
                Try Again
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-blue-500 font-semibold px-4 sm:px-6 py-2 text-base sm:text-lg"
              >
                Back to Menu
              </Button>
            </div>
          </div>
        )}
      </div>

      {attempts.length > 0 && (
        <Card className="mt-4 sm:mt-8 bg-white/95 backdrop-blur">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Your Results</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{reactionTime}ms</div>
                <div className="text-sm sm:text-base text-gray-600">Last Result</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{getAverageTime()}ms</div>
                <div className="text-sm sm:text-base text-gray-600">Average ({attempts.length} attempts)</div>
              </div>
            </div>
            <div className="mt-4 text-xs sm:text-sm text-gray-500">Recent attempts: {attempts.slice(-5).join("ms, ")}ms</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
