"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

type GameState = "instructions" | "playing" | "result"

// Common English words for the test
const WORD_POOL = [
  "apple",
  "house",
  "water",
  "light",
  "music",
  "happy",
  "green",
  "table",
  "phone",
  "paper",
  "chair",
  "money",
  "friend",
  "family",
  "school",
  "computer",
  "garden",
  "window",
  "coffee",
  "book",
  "flower",
  "mountain",
  "ocean",
  "forest",
  "bridge",
  "castle",
  "dragon",
  "wizard",
  "magic",
  "sword",
  "shield",
  "crown",
  "treasure",
  "island",
  "pirate",
  "ship",
  "anchor",
  "compass",
  "map",
  "journey",
  "adventure",
  "mystery",
  "secret",
  "puzzle",
  "riddle",
  "answer",
  "question",
  "story",
  "legend",
  "myth",
  "hero",
  "villain",
  "battle",
  "victory",
  "defeat",
  "courage",
  "wisdom",
  "strength",
  "power",
  "energy",
  "spirit",
  "soul",
  "heart",
  "mind",
  "dream",
  "hope",
  "faith",
  "love",
  "peace",
  "harmony",
  "balance",
  "nature",
  "earth",
  "sky",
  "star",
  "moon",
  "sun",
  "cloud",
  "rain",
  "snow",
  "fire",
  "ice",
  "wind",
  "storm",
  "thunder",
  "lightning",
  "rainbow",
  "sunrise",
  "sunset",
  "dawn",
  "dusk",
  "night",
  "day",
  "time",
  "space",
  "universe",
  "galaxy",
  "planet",
  "comet",
  "meteor",
]

export default function VerbalMemoryTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [currentWord, setCurrentWord] = useState("")
  const [seenWords, setSeenWords] = useState<Set<string>>(new Set())
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [isCurrentWordSeen, setIsCurrentWordSeen] = useState(false)
  const [gameWords, setGameWords] = useState<string[]>([])

  const shuffleArray = (array: string[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const startGame = () => {
    setGameState("playing")
    setSeenWords(new Set())
    setScore(0)
    setLives(3)
    setGameWords(shuffleArray(WORD_POOL))
    showNextWord(new Set(), shuffleArray(WORD_POOL))
  }

  const showNextWord = (currentSeenWords: Set<string>, wordPool: string[]) => {
    // Decide whether to show a new word or repeat a seen word
    const shouldRepeat = currentSeenWords.size > 0 && Math.random() < 0.3 // 30% chance to repeat

    let nextWord: string
    let isSeen: boolean

    if (shouldRepeat) {
      // Show a word that has been seen before
      const seenWordsArray = Array.from(currentSeenWords)
      nextWord = seenWordsArray[Math.floor(Math.random() * seenWordsArray.length)]
      isSeen = true
    } else {
      // Show a new word
      const availableWords = wordPool.filter((word) => !currentSeenWords.has(word))
      if (availableWords.length === 0) {
        // Fallback: use any word from the pool
        nextWord = wordPool[Math.floor(Math.random() * wordPool.length)]
        isSeen = currentSeenWords.has(nextWord)
      } else {
        nextWord = availableWords[Math.floor(Math.random() * availableWords.length)]
        isSeen = false
      }
    }

    setCurrentWord(nextWord)
    setIsCurrentWordSeen(isSeen)

    // Add to seen words if it's new
    if (!isSeen) {
      currentSeenWords.add(nextWord)
      setSeenWords(new Set(currentSeenWords))
    }
  }

  const handleAnswer = (userSaidSeen: boolean) => {
    if (userSaidSeen === isCurrentWordSeen) {
      // Correct answer
      setScore((prev) => prev + 1)
      showNextWord(seenWords, gameWords)
    } else {
      // Wrong answer
      const newLives = lives - 1
      setLives(newLives)

      if (newLives <= 0) {
        // Game over
        setGameState("result")
      } else {
        // Continue with fewer lives
        showNextWord(seenWords, gameWords)
      }
    }
  }

  const resetGame = () => {
    setGameState("instructions")
    setCurrentWord("")
    setSeenWords(new Set())
    setScore(0)
    setLives(3)
    setGameWords([])
  }

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Verbal Memory Test</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">You will be shown words, one at a time.</p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              If you've seen the word during this test, click <strong>SEEN</strong>. Otherwise, click{" "}
              <strong>NEW</strong>.
            </p>
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
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Score: {score}</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You correctly identified {score} words before making 3 mistakes.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              The average person scores around 15-20 words. Well done!
            </p>
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Last word:</p>
              <p className="text-2xl font-bold text-gray-800">{currentWord}</p>
              <p className="text-sm text-gray-600 mt-2">This word was {isCurrentWordSeen ? "SEEN" : "NEW"}</p>
            </div>
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

  if (gameState === "playing") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-8 mb-4">
            <div className="text-white">
              <span className="text-lg font-bold">Score: {score}</span>
            </div>
            <div className="text-white">
              <span className="text-lg font-bold">Lives: {lives}</span>
            </div>
          </div>
          <p className="text-blue-100">Have you seen this word in this test?</p>
        </div>

        <Card className="bg-white/95 backdrop-blur mb-8">
          <CardContent className="p-12 text-center">
            <div className="text-5xl font-bold text-gray-800 mb-8">{currentWord}</div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => handleAnswer(true)}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-12 py-4 text-xl"
          >
            SEEN
          </Button>
          <Button
            onClick={() => handleAnswer(false)}
            size="lg"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-12 py-4 text-xl"
          >
            NEW
          </Button>
        </div>

        <div className="text-center mt-6">
          <p className="text-blue-100 text-sm">Words seen so far: {seenWords.size}</p>
        </div>
      </div>
    )
  }

  return null
}
