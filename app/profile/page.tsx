"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useScore } from "@/lib/score-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { Trophy, Target, Clock, Brain, Zap, Award, Trash2 } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const testIcons: Record<string, React.ReactNode> = {
  "reaction-time": <Zap className="w-5 h-5" />,
  "sequence-memory": <Brain className="w-5 h-5" />,
  "aim-trainer": <Target className="w-5 h-5" />,
  "number-memory": <Brain className="w-5 h-5" />,
  "verbal-memory": <Brain className="w-5 h-5" />,
  "chimp-test": <Brain className="w-5 h-5" />,
  "visual-memory": <Brain className="w-5 h-5" />,
  typing: <Clock className="w-5 h-5" />,
}

export default function ProfilePage() {
  const { userStats, clearAllData, getTestHistory } = useScore()

  const formatScore = (score: number, unit: string) => {
    if (unit === "ms") return `${score}ms`
    if (unit === "wpm") return `${score} WPM`
    if (unit === "level") return `Level ${score}`
    if (unit === "words") return `${score} words`
    if (unit === "targets") return `${score} targets`
    return `${score} ${unit}`
  }

  const getPerformanceData = (testId: string) => {
    const history = getTestHistory(testId).slice(-10).reverse()
    return history.map((score, index) => ({
      attempt: index + 1,
      score: score.score,
      date: score.date.toLocaleDateString(),
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Zap className="w-6 h-6" />
            <span className="text-lg font-semibold">Human Eval</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Profile Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">Track your cognitive performance across all tests</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">{userStats.totalGamesPlayed}</CardTitle>
              <CardDescription>Total Games Played</CardDescription>
            </CardHeader>
          </Card>
          <Card className="glass-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">
                {Object.keys(userStats.bestScores).length}
              </CardTitle>
              <CardDescription>Tests Completed</CardDescription>
            </CardHeader>
          </Card>
          <Card className="glass-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">{userStats.achievements.length}</CardTitle>
              <CardDescription>Achievements Unlocked</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Achievements */}
        {userStats.achievements.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userStats.achievements.map((achievement) => (
                  <Badge key={achievement} variant="secondary" className="bg-primary/10 text-primary">
                    {achievement}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Best Scores */}
        {Object.keys(userStats.bestScores).length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Best Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(userStats.bestScores).map(([testId, score]) => (
                  <div key={testId} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {testIcons[testId]}
                      <div>
                        <p className="font-medium">{score.testName}</p>
                        <p className="text-sm text-muted-foreground">{score.date.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{formatScore(score.score, score.unit)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        {userStats.recentScores.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userStats.recentScores.slice(0, 10).map((score, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      {testIcons[score.testId]}
                      <div>
                        <p className="font-medium">{score.testName}</p>
                        <p className="text-sm text-muted-foreground">
                          {score.date.toLocaleDateString()} at {score.date.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatScore(score.score, score.unit)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Performance Charts */}
        {Object.keys(userStats.bestScores).length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Your progress over the last 10 attempts for each test</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.keys(userStats.bestScores).map((testId) => {
                  const data = getPerformanceData(testId)
                  if (data.length < 2) return null

                  return (
                    <div key={testId} className="space-y-2">
                      <h4 className="font-medium">{userStats.bestScores[testId].testName}</h4>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="attempt" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {userStats.totalGamesPlayed === 0 && (
          <Card className="glass-card text-center py-12">
            <CardContent>
              <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No games played yet</h3>
              <p className="text-muted-foreground mb-6">Start playing some tests to see your stats here!</p>
              <Link href="/">
                <Button>Start Testing</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Clear Data */}
        {userStats.totalGamesPlayed > 0 && (
          <Card className="glass-card border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Permanently delete all your data and scores</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm("Are you sure you want to delete all your data? This cannot be undone.")) {
                    clearAllData()
                  }
                }}
              >
                Clear All Data
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
