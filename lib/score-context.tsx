"use client"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface GameScore {
  testId: string
  testName: string
  score: number
  unit: string
  date: Date
  details?: Record<string, any>
}

export interface UserStats {
  totalGamesPlayed: number
  averageScore: number
  bestScores: Record<string, GameScore>
  recentScores: GameScore[]
  achievements: string[]
}

interface ScoreContextType {
  userStats: UserStats
  addScore: (score: GameScore) => void
  getTestHistory: (testId: string) => GameScore[]
  getBestScore: (testId: string) => GameScore | null
  getAverageScore: (testId: string) => number
  clearAllData: () => void
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined)

const initialStats: UserStats = {
  totalGamesPlayed: 0,
  averageScore: 0,
  bestScores: {},
  recentScores: [],
  achievements: [],
}

export function ScoreProvider({ children }: { children: React.ReactNode }) {
  const [userStats, setUserStats] = useState<UserStats>(initialStats)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem("humanBenchmarkStats")
    if (savedStats) {
      const parsed = JSON.parse(savedStats)
      // Convert date strings back to Date objects
      parsed.recentScores = parsed.recentScores.map((score: any) => ({
        ...score,
        date: new Date(score.date),
      }))
      Object.keys(parsed.bestScores).forEach((key) => {
        parsed.bestScores[key].date = new Date(parsed.bestScores[key].date)
      })
      setUserStats(parsed)
    }
  }, [])

  // Save to localStorage whenever stats change
  useEffect(() => {
    localStorage.setItem("humanBenchmarkStats", JSON.stringify(userStats))
  }, [userStats])

  const addScore = (score: GameScore) => {
    setUserStats((prev) => {
      const newStats = { ...prev }

      // Add to recent scores (keep last 50)
      newStats.recentScores = [score, ...prev.recentScores].slice(0, 50)

      // Update best score if this is better
      const currentBest = prev.bestScores[score.testId]
      if (!currentBest || isScoreBetter(score, currentBest)) {
        newStats.bestScores[score.testId] = score
      }

      // Update total games played
      newStats.totalGamesPlayed = prev.totalGamesPlayed + 1

      // Check for achievements
      newStats.achievements = [...prev.achievements]
      if (newStats.totalGamesPlayed === 1 && !newStats.achievements.includes("First Game")) {
        newStats.achievements.push("First Game")
      }
      if (newStats.totalGamesPlayed === 10 && !newStats.achievements.includes("Getting Started")) {
        newStats.achievements.push("Getting Started")
      }
      if (newStats.totalGamesPlayed === 50 && !newStats.achievements.includes("Dedicated Player")) {
        newStats.achievements.push("Dedicated Player")
      }

      return newStats
    })
  }

  const isScoreBetter = (newScore: GameScore, currentBest: GameScore): boolean => {
    // For reaction time, aim trainer, typing - lower is better
    if (["reaction-time", "aim-trainer", "typing"].includes(newScore.testId)) {
      return newScore.score < currentBest.score
    }
    // For memory tests - higher is better
    return newScore.score > currentBest.score
  }

  const getTestHistory = (testId: string): GameScore[] => {
    return userStats.recentScores.filter((score) => score.testId === testId)
  }

  const getBestScore = (testId: string): GameScore | null => {
    return userStats.bestScores[testId] || null
  }

  const clearAllData = () => {
    setUserStats(initialStats)
    localStorage.removeItem("humanBenchmarkStats")
  }

  const getAverageScore = (testId: string): number => {
    const testScores = userStats.recentScores.filter((score) => score.testId === testId)
    if (testScores.length === 0) return 0
    const sum = testScores.reduce((acc, score) => acc + score.score, 0)
    return sum / testScores.length
  }

  return (
    <ScoreContext.Provider
      value={{
        userStats,
        addScore,
        getTestHistory,
        getBestScore,
        getAverageScore,
        clearAllData,
      }}
    >
      {children}
    </ScoreContext.Provider>
  )
}

export function useScore() {
  const context = useContext(ScoreContext)
  if (context === undefined) {
    throw new Error("useScore must be used within a ScoreProvider")
  }
  return context
}

