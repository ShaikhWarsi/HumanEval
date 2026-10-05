"use client"

import React, { useState, use } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getExercise } from "@/lib/engine/registry"
import { ExerciseRunner } from "@/components/engine/ExerciseRunner"
import { DifficultyVector, PoolType } from "@/lib/engine/types"
import { sound } from "@/lib/audio"
import {
  ArrowLeft,
  Sliders,
  RotateCcw,
  ShieldCheck,
  Zap,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

export default function ExerciseExecutionPage({
  params,
}: {
  params: Promise<{ exerciseId: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialPool = (searchParams.get("pool") as PoolType) || "training"
  const [pool, setPool] = useState<PoolType>(initialPool)
  const [showConfig, setShowConfig] = useState(false)

  const exercise = getExercise(resolvedParams.exerciseId)

  const [customDifficulty, setCustomDifficulty] = useState<DifficultyVector>(
    exercise?.defaultDifficulty || {
      memory_load: 0.5,
      processing_speed: 0.5,
      interference: 0.5,
      rule_complexity: 0.4,
      relational_depth: 0.3,
      switching_cost: 0.3,
      distractor_density: 0.4,
    }
  )

  if (!exercise) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="border-2 border-black dark:border-white bg-card p-8 max-w-md text-center space-y-4 shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#FFFFFF]">
          <h1 className="font-mono font-black text-xl text-red-500 uppercase">
            PARADIGM NOT FOUND
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            The exercise identifier &quot;{resolvedParams.exerciseId}&quot; is not registered in the cognitive engine.
          </p>
          <Link
            href="/engine"
            className="inline-block px-5 py-2 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black font-mono text-xs font-black uppercase"
          >
            RETURN TO ENGINE
          </Link>
        </div>
      </div>
    )
  }

  const handleDifficultyChange = (key: keyof DifficultyVector, value: number) => {
    setCustomDifficulty((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetDifficulty = () => {
    sound.playClick()
    setCustomDifficulty(exercise.defaultDifficulty)
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
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                {exercise.categoryName}
              </span>
              <h1 className="text-sm sm:text-base font-black text-foreground uppercase truncate">
                {exercise.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Pool Selector */}
            <div className="hidden sm:flex border-2 border-black dark:border-white bg-secondary p-0.5 text-xs">
              {(["training", "practice", "assessment"] as PoolType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    sound.playClick()
                    setPool(p)
                  }}
                  className={`px-2.5 py-1 uppercase font-bold transition-colors cursor-pointer ${
                    pool === p
                      ? "bg-black text-white dark:bg-white dark:text-black font-black"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Custom Parameters Toggle */}
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="px-3 py-1.5 border-2 border-black dark:border-white bg-card font-mono text-xs font-bold uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">VECTORS</span>
              {showConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Difficulty Vector Sliders Drawer */}
        {showConfig && (
          <div className="border-2 border-black dark:border-white bg-card p-5 shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#FFFFFF] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-500 dark:text-cyan-400" />
                <h3 className="font-mono font-black text-sm uppercase">
                  Multidimensional Difficulty Parameters
                </h3>
              </div>
              <button
                onClick={resetDifficulty}
                className="font-mono text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 uppercase font-bold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Defaults</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
              {(
                [
                  { key: "memory_load", label: "Memory Load" },
                  { key: "processing_speed", label: "Processing Speed" },
                  { key: "interference", label: "Interference / Lures" },
                  { key: "rule_complexity", label: "Rule Complexity" },
                  { key: "relational_depth", label: "Relational Depth" },
                  { key: "switching_cost", label: "Switching Cost" },
                  { key: "distractor_density", label: "Distractor Density" },
                ] as { key: keyof DifficultyVector; label: string }[]
              ).map(({ key, label }) => (
                <div key={key} className="border border-black dark:border-white p-3 space-y-2 bg-secondary/20">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold uppercase">{label}</span>
                    <span className="font-black tabular text-amber-500 dark:text-cyan-400">
                      {customDifficulty[key].toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={customDifficulty[key]}
                    onChange={(e) => handleDifficultyChange(key, parseFloat(e.target.value))}
                    className="w-full accent-black dark:accent-white cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Universal 5-Phase Exercise Runner */}
        <ExerciseRunner
          key={`${exercise.id}-${pool}-${JSON.stringify(customDifficulty)}`}
          exercise={exercise}
          pool={pool}
          initialDifficulty={customDifficulty}
          trialCount={pool === "assessment" ? 15 : 10}
          onExit={() => router.push("/engine")}
        />
      </div>
    </div>
  )
}
