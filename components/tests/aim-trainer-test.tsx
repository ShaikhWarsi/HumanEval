"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

type GameState = "instructions" | "playing" | "result"

interface Target {
  id: number
  x: number
  y: number
}

export default function AimTrainerTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [currentTarget, setCurrentTarget] = useState<Target | null>(null)
  const [targetsHit, setTargetsHit] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [targetTimes, setTargetTimes] = useState<number[]>([])
  const [lastTargetTime, setLastTargetTime] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const TOTAL_TARGETS = 30
  const TARGET_SIZE = 60

  const generateRandomTarget = (): Target => {
    if (!gameAreaRef.current) return { id: Date.now(), x: 50, y: 50 }

    const rect = gameAreaRef.current.getBoundingClientRect()
    const margin = TARGET_SIZE / 2

    const x = Math.random() * (rect.width - TARGET_SIZE) + margin
    const y = Math.random() * (rect.height - TARGET_SIZE) + margin

    return {
      id: Date.now(),
      x,
      y,
    }
  }

  const startGame = () => {
    setGameState("playing")
    setTargetsHit(0)
    setTargetTimes([])
    setStartTime(Date.now())
    setLastTargetTime(Date.now())
    setCurrentTarget(generateRandomTarget())
  }

  const handleTargetClick = () => {
    if (gameState !== "playing" || !currentTarget) return

    const now = Date.now()
    const timeSinceLastTarget = now - lastTargetTime
    setTargetTimes((prev) => [...prev, timeSinceLastTarget])
    setLastTargetTime(now)

    const newTargetsHit = targetsHit + 1
    setTargetsHit(newTargetsHit)

    if (newTargetsHit >= TOTAL_TARGETS) {
      // Game complete
      setTotalTime(now - startTime)
      setGameState("result")
      setCurrentTarget(null)
    } else {
      // Generate next target
      setCurrentTarget(generateRandomTarget())
    }
  }

  const handleMissClick = () => {
    // Optional: Could track misses here
  }

  const resetGame = () => {
    setGameState("instructions")
    setCurrentTarget(null)
    setTargetsHit(0)
    setTargetTimes([])
    setTotalTime(0)
  }

  const getAverageTime = () => {
    if (targetTimes.length === 0) return 0
    return Math.round(targetTimes.reduce((a, b) => a + b, 0) / targetTimes.length)
  }

  const getAccuracy = () => {
    // For now, assume 100% accuracy since we only count successful hits
    // In a more advanced version, you could track misses
    return 100
  }

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Aim Trainer</h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-base sm:text-lg">Hit 30 targets as quickly as you can.</p>
            <p className="text-gray-600 mb-8 leading-relaxed text-base sm:text-lg">Click the target above to begin.</p>
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Results</h2>

            <div className="grid grid-cols-2 gap-6 mb-8 text-base sm:text-lg">
              <div>
                <div className="text-3xl font-bold text-blue-600">{getAverageTime()}ms</div>
                <div className="text-sm text-gray-600">Average Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{(totalTime / 1000).toFixed(1)}s</div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              You hit {TOTAL_TARGETS} targets with an average time of {getAverageTime()}ms per target.
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
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Targets: {targetsHit} / {TOTAL_TARGETS}
        </h2>
        <p className="text-blue-100 text-base sm:text-lg">Click the targets as quickly as you can!</p>
      </div>

      <Card className="bg-white/95 backdrop-blur">
        <CardContent className="p-0">
          <div
            ref={gameAreaRef}
            className="relative w-full h-[70vh] max-h-[500px] min-h-[300px] bg-gray-50 cursor-crosshair overflow-hidden rounded-lg"
            onClick={handleMissClick}
          >
            {currentTarget && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: currentTarget.x,
                  top: currentTarget.y,
                  width: TARGET_SIZE,
                  height: TARGET_SIZE,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleTargetClick()
                }}
              >
                {/* Target design - concentric circles */}
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-red-500 rounded-full"></div>
                  <div className="absolute inset-2 bg-white rounded-full"></div>
                  <div className="absolute inset-4 bg-red-500 rounded-full"></div>
                  <div className="absolute inset-6 bg-white rounded-full"></div>
                  <div className="absolute inset-8 bg-red-500 rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-white/95 backdrop-blur">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center text-sm sm:text-base">
            <div>
              <div className="text-lg font-bold text-blue-600">{targetsHit}</div>
              <div className="text-gray-600">Targets Hit</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">{targetTimes.length > 0 ? getAverageTime() : 0}ms</div>
              <div className="text-gray-600">Avg Time</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">{((Date.now() - startTime) / 1000).toFixed(1)}s</div>
              <div className="text-gray-600">Elapsed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
