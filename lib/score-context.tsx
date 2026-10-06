"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { BENCHMARKS, calculatePercentile, calculateCGI } from "@/lib/benchmarks"

export interface GameScore {
  testId: string
  testName: string
  score: number
  unit: string
  percentile: number
  date: Date
  details?: Record<string, any>
}

export interface UserStats {
  totalGamesPlayed: number
  bestScores: Record<string, GameScore>
  recentScores: GameScore[]
  achievements: string[]
  cgi: number
  tier: string
  domainScores: Record<string, number>
  auxiliaryMotorScore?: number
}

interface ScoreContextType {
  userStats: UserStats
  addScore: (scoreData: {
    testId: string
    testName: string
    score: number
    unit: string
    details?: Record<string, any>
  }) => GameScore
  getTestHistory: (testId: string) => GameScore[]
  getBestScore: (testId: string) => GameScore | null
  getAverageScore: (testId: string) => number
  clearAllData: () => void
  exportBackupData: () => string
  importBackupData: (jsonData: string) => boolean
}

const initialStats: UserStats = {
  totalGamesPlayed: 0,
  bestScores: {},
  recentScores: [],
  achievements: [],
  cgi: 0,
  tier: "Uncalibrated",
  domainScores: { Speed: 0, Memory: 0, Motor: 0, Language: 0, Vision: 0 },
  auxiliaryMotorScore: 0,
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined)

export function isScoreBetter(testId: string, newScore: number, currentBest: number): boolean {
  const meta = BENCHMARKS[testId]
  if (meta && meta.lowerIsBetter) {
    return newScore < currentBest
  }
  return newScore > currentBest
}

/**
 * Computes robust representative scores (median of last 5 trials) per test
 * to prevent single-trial lucky anticipations or lucky guesses from corrupting CGI.
 */
export function computeRepresentativeScores(
  recent: GameScore[],
  bestScores: Record<string, GameScore>
): Record<string, number> {
  const byTest: Record<string, number[]> = {}
  recent.forEach((s) => {
    if (!byTest[s.testId]) byTest[s.testId] = []
    byTest[s.testId].push(s.score)
  })

  const representative: Record<string, number> = {}
  Object.entries(byTest).forEach(([testId, vals]) => {
    const meta = BENCHMARKS[testId]
    const lastN = vals.slice(0, 5).sort((a, b) => a - b)
    const mid = Math.floor(lastN.length / 2)
    const medianVal = lastN.length % 2 !== 0 ? lastN[mid] : (lastN[mid - 1] + lastN[mid]) / 2
    representative[testId] = medianVal
  })

  // Fallback to best score if test has not enough recent trials
  Object.entries(bestScores).forEach(([testId, gs]) => {
    if (representative[testId] === undefined) {
      representative[testId] = gs.score
    }
  })

  return representative
}

export function ScoreProvider({ children }: { children: React.ReactNode }) {
  const [userStats, setUserStats] = useState<UserStats>(initialStats)
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem("humaneval_stats_v2") || localStorage.getItem("humanBenchmarkStats")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.recentScores) {
          parsed.recentScores = parsed.recentScores.map((s: any) => ({
            ...s,
            date: new Date(s.date),
            percentile: calculatePercentile(s.testId, s.score),
          }))
        }
        if (parsed.bestScores) {
          Object.keys(parsed.bestScores).forEach((k) => {
            parsed.bestScores[k].date = new Date(parsed.bestScores[k].date)
            parsed.bestScores[k].percentile = calculatePercentile(k, parsed.bestScores[k].score)
          })
        }

        // Recompute CGI with robust median across recent sessions to prevent lucky outlier distortion
        const representativeScores = computeRepresentativeScores(parsed.recentScores || [], parsed.bestScores || {})
        const cgiData = calculateCGI(representativeScores)

        setUserStats({
          ...initialStats,
          ...parsed,
          cgi: cgiData.cgi,
          tier: cgiData.tier,
          domainScores: cgiData.domainScores,
          auxiliaryMotorScore: cgiData.auxiliaryMotorScore,
        })
      }
    } catch (e) {
      console.error("Failed to load scores from storage:", e)
    }
  }, [])

  // Sync to localStorage
  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem("humaneval_stats_v2", JSON.stringify(userStats))
    } catch (e) {
      console.error("Failed to save scores to storage:", e)
    }
  }, [userStats, mounted])

  const addScore = (scoreData: {
    testId: string
    testName: string
    score: number
    unit: string
    details?: Record<string, any>
  }): GameScore => {
    const percentile = calculatePercentile(scoreData.testId, scoreData.score)
    const newScore: GameScore = {
      ...scoreData,
      percentile,
      date: new Date(),
    }

    setUserStats((prev) => {
      const currentBest = prev.bestScores[newScore.testId]
      const updatedBestScores = { ...prev.bestScores }

      if (!currentBest || isScoreBetter(newScore.testId, newScore.score, currentBest.score)) {
        updatedBestScores[newScore.testId] = newScore
      }

      const totalGames = prev.totalGamesPlayed + 1
      const recent = [newScore, ...prev.recentScores].slice(0, 100)

      // Calculate new achievements
      const achievements = new Set(prev.achievements)
      if (totalGames >= 1) achievements.add("First Transmission")
      if (totalGames >= 10) achievements.add("Neural Calibration")
      if (totalGames >= 50) achievements.add("Hyper-Focused")
      if (percentile >= 90) achievements.add("Top 10% Neuro")
      if (percentile >= 99) achievements.add("Apex 99th Percentile")

      // Recompute CGI with robust median across recent sessions
      const representativeScores = computeRepresentativeScores(recent, updatedBestScores)
      const cgiData = calculateCGI(representativeScores)

      return {
        totalGamesPlayed: totalGames,
        bestScores: updatedBestScores,
        recentScores: recent,
        achievements: Array.from(achievements),
        cgi: cgiData.cgi,
        tier: cgiData.tier,
        domainScores: cgiData.domainScores,
        auxiliaryMotorScore: cgiData.auxiliaryMotorScore,
      }
    })

    return newScore
  }

  const getTestHistory = (testId: string): GameScore[] => {
    return userStats.recentScores.filter((s) => s.testId === testId)
  }

  const getBestScore = (testId: string): GameScore | null => {
    return userStats.bestScores[testId] || null
  }

  const getAverageScore = (testId: string): number => {
    const list = getTestHistory(testId)
    if (list.length === 0) return 0
    const sum = list.reduce((acc, curr) => acc + curr.score, 0)
    return Math.round((sum / list.length) * 10) / 10
  }

  const clearAllData = () => {
    setUserStats(initialStats)
    if (typeof window !== "undefined") {
      localStorage.removeItem("humaneval_stats_v2")
      localStorage.removeItem("humanBenchmarkStats")
    }
  }

  const exportBackupData = (): string => {
    return JSON.stringify(
      {
        version: "2.0",
        exportTimestamp: Date.now(),
        userStats,
      },
      null,
      2
    )
  }

  const importBackupData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData)
      const stats = parsed.userStats || parsed
      if (stats && typeof stats.totalGamesPlayed === "number" && stats.bestScores) {
        setUserStats(stats)
        if (typeof window !== "undefined") {
          localStorage.setItem("humaneval_stats_v2", JSON.stringify(stats))
        }
        return true
      }
      return false
    } catch {
      return false
    }
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
        exportBackupData,
        importBackupData,
      }}
    >
      {children}
    </ScoreContext.Provider>
  )
}

export function useScore() {
  const context = useContext(ScoreContext)
  if (!context) {
    throw new Error("useScore must be used within a ScoreProvider")
  }
  return context
}
