"use client"
import { useState, useRef } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useScore } from "@/lib/score-context"
import { Keyboard, RotateCcw, Clock, Target, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

const typingTexts = [
  {
    id: 1,
    title: "The Quick Brown Fox",
    text: "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. It has been used for typing practice and font testing for many years. The phrase is simple yet effective for testing keyboard skills and letter recognition.",
  },
  {
    id: 2,
    title: "Technology and Innovation",
    text: "Technology continues to evolve at an unprecedented pace, transforming how we work, communicate, and live. From artificial intelligence to renewable energy, innovations are reshaping our world. The digital revolution has connected billions of people and created new opportunities for collaboration and creativity.",
  },
  {
    id: 3,
    title: "The Art of Learning",
    text: "Learning is a lifelong journey that requires curiosity, patience, and persistence. Whether mastering a new skill or exploring complex concepts, the process of learning shapes our understanding of the world. Effective learning involves practice, reflection, and the willingness to make mistakes and grow from them.",
  },
  {
    id: 4,
    title: "Nature and Environment",
    text: "Our planet is home to incredible biodiversity, from the smallest microorganisms to the largest mammals. Protecting our environment is crucial for future generations. Climate change, deforestation, and pollution pose significant challenges that require global cooperation and sustainable solutions.",
  },
  {
    id: 5,
    title: "Human Achievement",
    text: "Throughout history, humans have achieved remarkable feats through determination and innovation. From exploring space to curing diseases, our species has consistently pushed the boundaries of what is possible. These achievements remind us of our potential when we work together toward common goals.",
  },
]

export default function TypingTest() {
  const [gameState, setGameState] = useState<"instructions" | "typing" | "results">("instructions")
  const [currentText, setCurrentText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [startTime, setStartTime] = useState<number>(0)
  const [endTime, setEndTime] = useState<number>(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [errors, setErrors] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { addScore } = useScore()

  const startTest = () => {
    const randomText = typingTexts[Math.floor(Math.random() * typingTexts.length)]
    setCurrentText(randomText.text)
    setUserInput("")
    setCurrentIndex(0)
    setErrors(0)
    setIsComplete(false)
    setStartTime(Date.now())
    setGameState("typing")

    // Focus input after state update
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const currentChar = currentText[currentIndex]

    // Don't allow typing beyond the text length
    if (value.length > currentText.length) return

    setUserInput(value)

    // Check if the current character is correct
    if (value.length > userInput.length) {
      // User added a character
      const typedChar = value[value.length - 1]
      if (typedChar !== currentChar) {
        setErrors((prev) => prev + 1)
      }
      setCurrentIndex(value.length)
    } else if (value.length < userInput.length) {
      // User deleted a character
      setCurrentIndex(value.length)
    }

    // Check if test is complete
    if (value.length === currentText.length) {
      setEndTime(Date.now())
      setIsComplete(true)
      calculateResults(value)
    }
  }

  const calculateResults = (finalInput: string) => {
    const timeInMinutes = (Date.now() - startTime) / 60000
    const charactersTyped = finalInput.length
    const wpm = Math.round(charactersTyped / 5 / timeInMinutes)
    const accuracy = Math.round(((charactersTyped - errors) / charactersTyped) * 100)

    // Save score
    addScore({
      testId: "typing",
      testName: "Typing Test",
      score: wpm,
      unit: "wpm",
      date: new Date(),
      details: {
        accuracy: accuracy,
        errors: errors,
        timeInSeconds: (Date.now() - startTime) / 1000,
        charactersTyped: charactersTyped,
        totalCharacters: currentText.length,
      },
    })

    setGameState("results")
  }

  const restart = () => {
    setGameState("instructions")
    setUserInput("")
    setCurrentIndex(0)
    setErrors(0)
    setIsComplete(false)
  }

  const getCharacterClass = (index: number) => {
    if (index < userInput.length) {
      // Character has been typed
      if (userInput[index] === currentText[index]) {
        return "text-green-600 bg-green-100 dark:bg-green-900/30"
      } else {
        return "text-red-600 bg-red-100 dark:bg-red-900/30"
      }
    } else if (index === currentIndex) {
      // Current character to type
      return "bg-primary/20 border-b-2 border-primary animate-pulse"
    } else {
      // Not yet typed
      return "text-muted-foreground"
    }
  }

  const getResults = () => {
    if (!isComplete) return { wpm: 0, accuracy: 0, timeInSeconds: 0 }

    const timeInMinutes = (endTime - startTime) / 60000
    const charactersTyped = userInput.length
    const wpm = Math.round(charactersTyped / 5 / timeInMinutes)
    const accuracy = Math.round(((charactersTyped - errors) / charactersTyped) * 100)
    const timeInSeconds = (endTime - startTime) / 1000

    return { wpm, accuracy, timeInSeconds }
  }

  const router = useRouter()

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="glass-card">
          <CardHeader className="text-center">
            <Keyboard className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Typing Speed Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">Test your typing speed and accuracy</p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold">How it works:</h3>
                <ul className="text-sm text-muted-foreground space-y-1 text-left">
                  <li>• Type the given text as quickly and accurately as possible</li>
                  <li>• Green characters are correct, red are incorrect</li>
                  <li>• Your WPM and accuracy will be calculated</li>
                  <li>• The test ends when you complete the passage</li>
                </ul>
              </div>
            </div>
            <Button onClick={startTest} size="lg" className="w-full">
              Start Typing Test
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "typing") {
    const progress = (userInput.length / currentText.length) * 100
    const currentWPM = startTime ? Math.round(userInput.length / 5 / ((Date.now() - startTime) / 60000)) || 0 : 0
    const currentAccuracy =
      userInput.length > 0 ? Math.round(((userInput.length - errors) / userInput.length) * 100) : 100

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Typing Test</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {currentWPM} WPM
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {currentAccuracy}% Accuracy
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {Math.floor((Date.now() - startTime) / 1000)}s
                </div>
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Text Display */}
            <div className="bg-muted/30 p-6 rounded-lg font-mono text-lg leading-relaxed">
              {currentText.split("").map((char, index) => (
                <span key={index} className={getCharacterClass(index)}>
                  {char}
                </span>
              ))}
            </div>

            {/* Input Field */}
            <div className="space-y-2">
              <label htmlFor="typing-input" className="text-sm font-medium">
                Type the text above:
              </label>
              <input
                ref={inputRef}
                id="typing-input"
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className="w-full p-4 text-lg font-mono border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Start typing here..."
                disabled={isComplete}
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{userInput.length}</div>
                <div className="text-muted-foreground">Characters</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{errors}</div>
                <div className="text-muted-foreground">Errors</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{currentText.length - userInput.length}</div>
                <div className="text-muted-foreground">Remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "results") {
    const { wpm, accuracy, timeInSeconds } = getResults()
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Test Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-4xl font-bold text-primary">{wpm}</div>
                <div className="text-muted-foreground">WPM</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">{accuracy}%</div>
                <div className="text-muted-foreground">Accuracy</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">{timeInSeconds.toFixed(1)}s</div>
                <div className="text-muted-foreground">Time</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={startTest} size="lg">
                Play Again
              </Button>
              <Button onClick={() => router.push("/")} variant="outline" size="lg">
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
