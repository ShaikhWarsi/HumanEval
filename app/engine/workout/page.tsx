"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  getUserCognitiveProfile,
  generateDailyWorkout,
} from "@/lib/engine/user-model"
import { getExercise } from "@/lib/engine/registry"
import { ExerciseRunner } from "@/components/engine/ExerciseRunner"
import { ScheduledWorkoutSession, TrialTelemetry } from "@/lib/engine/types"
import { sound } from "@/lib/audio"
import {
  ArrowLeft,
  Flame,
  CheckCircle2,
  Clock,
  Target,
  ChevronRight,
  Sparkles,
  Zap,
  Activity,
  Award,
} from "lucide-react"

export default function DailyWorkoutPage() {
  const router = useRouter()
  const [workout, setWorkout] = useState<ScheduledWorkoutSession | null>(null)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [allSessionTelemetry, setAllSessionTelemetry] = useState<Record<number, TrialTelemetry[]>>({})
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false)

  useEffect(() => {
    const profile = getUserCognitiveProfile()
    const session = generateDailyWorkout(profile)
    setWorkout(session)
  }, [])

  if (!workout) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-mono">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 animate-spin text-amber-500 dark:text-cyan-400" />
          <span>GENERATING ADAPTIVE WORKOUT PROGRAM...</span>
        </div>
      </div>
    )
  }

  const currentPhase = workout.phases[currentPhaseIndex]
  const currentExercise = getExercise(currentPhase.exerciseId)

  const handlePhaseComplete = (telemetryList: TrialTelemetry[]) => {
    setAllSessionTelemetry((prev) => ({
      ...prev,
      [currentPhaseIndex]: telemetryList,
    }))

    if (currentPhaseIndex + 1 < workout.phases.length) {
      sound.playLevelUp()
      setCurrentPhaseIndex((prev) => prev + 1)
    } else {
      sound.playComplete()
      setIsWorkoutComplete(true)
    }
  }

  // Workout Complete View
  if (isWorkoutComplete) {
    const totalTrials = Object.values(allSessionTelemetry).flat().length
    const correctTrials = Object.values(allSessionTelemetry).flat().filter((t) => t.validation.isCorrect).length
    const overallAccuracy = totalTrials > 0 ? Math.round((correctTrials / totalTrials) * 100) : 0

    return (
      <div className="min-h-screen bg-background text-foreground py-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full border-2 border-black dark:border-white bg-card p-8 shadow-[6px_6px_0px_0px_#0A0A0A] dark:shadow-[6px_6px_0px_0px_#FFFFFF] space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-black dark:border-white pb-4">
            <div className="w-12 h-12 border-2 border-black dark:border-white bg-emerald-500 text-black flex items-center justify-center shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF]">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-black">
                PROGRAM COMPLETED
              </span>
              <h1 className="font-mono font-black text-2xl text-foreground uppercase mt-1">
                Daily Cognitive Regimen Finished
              </h1>
            </div>
          </div>

          <div className="border-2 border-black dark:border-white bg-secondary/30 p-4 font-mono text-xs space-y-2">
            <span className="text-amber-500 dark:text-cyan-400 font-black uppercase block">
              // TARGETED INTERVENTION
            </span>
            <p className="text-foreground font-bold">{workout.primaryWeakness}</p>
            <p className="text-muted-foreground">{workout.diagnosticRationale}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 font-mono text-center">
            <div className="border-2 border-black dark:border-white bg-card p-3 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
              <span className="text-[10px] text-muted-foreground uppercase block font-bold">Phases Done</span>
              <span className="text-xl font-black text-foreground">5 / 5</span>
            </div>
            <div className="border-2 border-black dark:border-white bg-card p-3 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
              <span className="text-[10px] text-muted-foreground uppercase block font-bold">Total Accuracy</span>
              <span className="text-xl font-black text-amber-500 dark:text-cyan-400">{overallAccuracy}%</span>
            </div>
            <div className="border-2 border-black dark:border-white bg-card p-3 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
              <span className="text-[10px] text-muted-foreground uppercase block font-bold">Total Trials</span>
              <span className="text-xl font-black text-foreground">{totalTrials}</span>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-black dark:border-white flex justify-end gap-3 font-mono">
            <Link
              href="/engine"
              className="px-6 py-2.5 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black font-mono text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF]"
            >
              RETURN TO CATALOG
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Header */}
      <header className="border-b-2 border-black dark:border-white bg-card py-4 px-4 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3">
            <Link
              href="/engine"
              onClick={() => sound.playClick()}
              className="p-2 border-2 border-black dark:border-white bg-secondary hover:bg-secondary/70 transition-colors shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-1.5 py-0.2 border border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black">
                  DAILY REGIMEN
                </span>
                <span className="text-xs text-muted-foreground uppercase hidden sm:inline">
                  {workout.date}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-black text-foreground uppercase truncate">
                PHASE {currentPhase.phaseNumber} / 5: {currentPhase.phaseFocus}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-muted-foreground uppercase hidden sm:inline">Target:</span>
            <span className="font-black text-amber-500 dark:text-cyan-400 uppercase truncate max-w-[140px] sm:max-w-none">
              {currentExercise?.name}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* 5-Phase Sequence Ribbon */}
        <div className="border-2 border-black dark:border-white bg-card p-4 shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF] space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase">
              <Flame className="w-4 h-4 text-amber-500 dark:text-cyan-400" />
              <span>Session Protocol Sequence</span>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">
              EST. TIME: ~18 MIN
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {workout.phases.map((ph, idx) => {
              const isActive = idx === currentPhaseIndex
              const isPast = idx < currentPhaseIndex
              return (
                <div
                  key={ph.phaseNumber}
                  className={`p-2.5 border-2 transition-all ${
                    isActive
                      ? "border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] font-black"
                      : isPast
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 font-bold"
                      : "border-border bg-secondary/30 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span>PHASE {ph.phaseNumber}</span>
                    {isPast && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                  </div>
                  <div className="text-xs truncate font-bold mt-0.5">{ph.exerciseName}</div>
                  <div className="text-[9px] opacity-80 truncate">{ph.durationMinutes}m • {ph.phaseFocus}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Phase Exercise Runner */}
        {currentExercise && (
          <ExerciseRunner
            key={`phase-${currentPhaseIndex}-${currentExercise.id}`}
            exercise={currentExercise}
            pool="training"
            initialDifficulty={currentPhase.targetDifficulty}
            trialCount={8}
            onComplete={handlePhaseComplete}
            onExit={() => router.push("/engine")}
          />
        )}
      </div>
    </div>
  )
}
