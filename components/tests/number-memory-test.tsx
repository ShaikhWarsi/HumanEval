"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
} from "react-share"
import { useRouter } from "next/navigation"

type GameState = "instructions" | "showing" | "input" | "result"

export default function NumberMemoryTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [currentNumber, setCurrentNumber] = useState("")
  const [userInput, setUserInput] = useState("")
  const [currentLevel, setCurrentLevel] = useState(1)
  const [finalLevel, setFinalLevel] = useState(0)
  const [showTime, setShowTime] = useState(3000) // 3 seconds initially
  const [retriesLeft, setRetriesLeft] = useState(3)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const generateNumber = (digits: number) => {
    let number = ""
    for (let i = 0; i < digits; i++) {
      // First digit shouldn't be 0
      if (i === 0) {
        number += Math.floor(Math.random() * 9) + 1
      } else {
        number += Math.floor(Math.random() * 10)
      }
    }
    return number
  }

  const startGame = () => {
    setCurrentLevel(1)
    setFinalLevel(0)
    setUserInput("")
    setRetriesLeft(3) // Reset retries
    startLevel(1)
  }

  const startLevel = (level: number) => {
    const digits = Math.min(level + 2, 15) // Start with 3 digits, max 15
    const number = generateNumber(digits)
    setCurrentNumber(number)
    setGameState("showing")
    setUserInput("")

    // Show the number for a duration based on length and level
    const duration = Math.max(1000, digits * 500 + (level - 1) * 200) // Increase duration by 200ms per level
    setShowTime(duration)

    setTimeout(() => {
      setGameState("input")
      // Focus input after a brief delay to ensure it's rendered
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }, duration)
  }

  const handleSubmit = () => {
    if (userInput.trim() === currentNumber) {
      // Correct! Move to next level
      const nextLevel = currentLevel + 1
      setCurrentLevel(nextLevel)
      setTimeout(() => {
        startLevel(nextLevel)
      }, 1000)
    } else {
      // Wrong! Check retries
      if (retriesLeft > 0) {
        setRetriesLeft(retriesLeft - 1)
        // Display wrong answer message temporarily
        setGameState("showing") // Show the number again for the user to re-memorize
        setTimeout(() => {
          setGameState("input")
          setTimeout(() => {
            inputRef.current?.focus()
          }, 100)
        }, showTime) // Show for the same duration as before
      } else {
        setFinalLevel(currentLevel)
        setGameState("result")
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  const resetGame = () => {
    setGameState("instructions")
    setCurrentNumber("")
    setUserInput("")
    setCurrentLevel(1)
    setFinalLevel(0)
    setRetriesLeft(3) // Reset retries
  }

  const getDigitCount = () => {
    return Math.min(currentLevel + 2, 15)
  }

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="text-6xl mb-6">🔢</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Number Memory Test</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              The average person can remember 7 numbers at once. Can you do more?
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">Memorize the number, then type it back.</p>
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
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="text-6xl mb-6">🔢</div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Level {finalLevel}</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">You remembered {getDigitCount() - 1} digits.</p>
            <p className="text-gray-600 mb-8 leading-relaxed">The average person can remember 7 digits. Well done!</p>
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">The number was:</p>
              <p className="text-2xl font-mono font-bold text-gray-800">{currentNumber}</p>
              <p className="text-sm text-gray-600 mt-2">You entered:</p>
              <p className="text-2xl font-mono font-bold text-red-600">{userInput}</p>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
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
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <TwitterShareButton
                url={"https://humval2.vercel.app/tests/number-memory-test"}
                title={`I remembered ${getDigitCount() - 1} digits in the Number Memory Test on HumanEval! Can you beat my score?`}
              >
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <FacebookShareButton
                url={"https://humval2.vercel.app/tests/number-memory-test"}
                quote={`I remembered ${getDigitCount() - 1} digits in the Number Memory Test on HumanEval! Can you beat my score?`}
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <LinkedinShareButton
                url={"https://humval2.vercel.app/tests/number-memory-test"}
                title={`Number Memory Test Score on HumanEval`}
                summary={`I remembered ${getDigitCount() - 1} digits in the Number Memory Test on HumanEval! Can you beat my score?`}
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

  if (gameState === "showing") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Level {currentLevel}</h2>
          <p className="text-blue-100">Memorize this number</p>
          {retriesLeft < 3 && (
            <p className="text-red-300 text-sm mt-1">Retries left: {retriesLeft}</p>
          )}
        </div>

        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="text-5xl sm:text-6xl font-mono font-bold text-gray-800 mb-8 tracking-wider">{currentNumber}</div>
            <div className="text-sm text-gray-500">{getDigitCount()} digits • Memorize it!</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "input") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Level {currentLevel}</h2>
          <p className="text-blue-100">What was the number?</p>
          {retriesLeft < 3 && (
            <p className="text-red-300 text-sm mt-1">Retries left: {retriesLeft}</p>
          )}
        </div>

        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="mb-8">
              <Input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter the number"
                className="text-2xl sm:text-3xl font-mono text-center h-14 sm:h-16 text-gray-800"
                maxLength={15}
              />
            </div>
            <div className="text-sm text-gray-500 mb-6">{getDigitCount()} digits • Press Enter or click Submit</div>
            <Button
              onClick={handleSubmit}
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 text-lg"
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
}
