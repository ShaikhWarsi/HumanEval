"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  EXERCISE_REGISTRY,
  getAllExercises,
} from "@/lib/engine/registry"
import {
  getUserCognitiveProfile,
  identifyPrimaryBottleneck,
} from "@/lib/engine/user-model"
import { CognitiveDomain, ExerciseDefinition, UserCognitiveProfile } from "@/lib/engine/types"
import { sound } from "@/lib/audio"
import {
  Brain,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Play,
  RotateCw,
  CheckCircle,
  Cpu,
  BarChart2,
  Sliders,
  Layers,
  Activity,
  Flame,
} from "lucide-react"

export default function EngineCatalogPage() {
  const [profile, setProfile] = useState<UserCognitiveProfile | null>(null)
  const [selectedDomain, setSelectedDomain] = useState<string>("all")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setProfile(getUserCognitiveProfile())
  }, [])

  const exercises = getAllExercises()
  const filteredExercises =
    selectedDomain === "all"
      ? exercises
      : exercises.filter((e) => e.domain === selectedDomain)

  const bottleneck = profile ? identifyPrimaryBottleneck(profile) : null

  const domainFilters = [
    { id: "all", label: "ALL PARADIGMS" },
    { id: "working_memory", label: "WORKING MEMORY" },
    { id: "attention_inhibition", label: "ATTENTION & INHIBITION" },
    { id: "executive_control", label: "EXECUTIVE CONTROL" },
    { id: "processing_speed", label: "PROCESSING SPEED" },
    { id: "fluid_reasoning", label: "FLUID REASONING" },
    { id: "quantitative_logic", label: "QUANTITATIVE LOGIC" },
    { id: "composite", label: "COMPOSITE SYNTHESIS" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Banner / Hero */}
      <section className="border-b-2 border-black dark:border-white bg-card py-10 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 border border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-black uppercase">
                  PROCEDURAL COGNITIVE ENGINE
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 border border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black font-black uppercase">
                  v2.0 IRT-DDA
                </span>
              </div>
              <h1 className="font-mono font-black text-3xl sm:text-4xl uppercase tracking-tight">
                Experimental Training Engine
              </h1>
              <p className="font-mono text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                No hand-authored static questionnaires. Procedurally generated, seeded experimental paradigms with multidimensional difficulty vectors, latent ability modeling (\(\theta\)), and honest transfer boundaries.
              </p>
            </div>

            {/* Quick action button */}
            <Link
              href="/engine/workout"
              onClick={() => sound.playStart()}
              className="px-6 py-3 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black font-mono text-xs font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <Flame className="w-4 h-4 stroke-[2.5]" />
              <span>START TAILORED DAILY WORKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Personal Cognitive Profile & Weakness Discovery Card */}
        {mounted && profile && bottleneck && (
          <section className="border-2 border-black dark:border-white bg-card p-6 shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#FFFFFF] space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b-2 border-black dark:border-white pb-4 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black flex items-center justify-center font-mono font-black">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-mono font-black text-lg sm:text-xl uppercase">
                    Personal Latent Cognitive Model
                  </h2>
                  <p className="text-[11px] font-mono text-muted-foreground uppercase">
                    Rasch Item Response Theory (\(\theta\)) + Bottleneck Interaction Matrix
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">
                  HISTORY SAMPLES: <strong className="text-foreground">{profile.historyCount}</strong>
                </span>
              </div>
            </div>

            {/* Detected Vulnerability Callout */}
            <div className="border-2 border-black dark:border-white bg-red-500/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  <span className="font-mono font-black text-xs text-red-500 uppercase tracking-wider">
                    PRIMARY DETECTED BOTTLENECK
                  </span>
                </div>
                <h3 className="font-mono font-black text-base text-foreground uppercase">
                  {bottleneck.bottleneckName}
                </h3>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed max-w-2xl">
                  {bottleneck.diagnosticRationale}
                </p>
              </div>

              <Link
                href="/engine/workout"
                onClick={() => sound.playClick()}
                className="px-4 py-2 border-2 border-black dark:border-white bg-card font-mono text-xs font-black uppercase text-foreground hover:bg-secondary whitespace-nowrap shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]"
              >
                TARGET THIS WEAKNESS →
              </Link>
            </div>

            {/* Latent Abilities Domain Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {(
                [
                  "working_memory",
                  "attention_inhibition",
                  "executive_control",
                  "processing_speed",
                  "fluid_reasoning",
                  "quantitative_logic",
                  "composite",
                ] as CognitiveDomain[]
              ).map((dom) => {
                const theta = profile.latentAbilities[dom] ?? 0.0
                const normalizedScore = Math.round(((theta + 3.0) / 6.0) * 100)
                const isWeakest = bottleneck.weakestDomain === dom

                return (
                  <div
                    key={dom}
                    className={`border-2 p-3 font-mono transition-all ${
                      isWeakest
                        ? "border-red-500 bg-red-500/5 shadow-[2px_2px_0px_0px_#EF4444]"
                        : "border-black dark:border-white bg-card shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]"
                    }`}
                  >
                    <span className="text-[9px] text-muted-foreground uppercase font-bold block truncate">
                      {dom.replace("_", " ")}
                    </span>
                    <div className="flex items-baseline justify-between mt-1 mb-2">
                      <span className="text-xl font-black text-foreground">
                        {theta > 0 ? `+${theta.toFixed(2)}` : theta.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-bold">{normalizedScore}%</span>
                    </div>
                    {/* Mini bar */}
                    <div className="h-1.5 border border-black dark:border-white bg-secondary overflow-hidden">
                      <div
                        className={`h-full ${isWeakest ? "bg-red-500" : "bg-amber-400 dark:bg-cyan-400"}`}
                        style={{ width: `${normalizedScore}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Catalog Filter Tabs */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-black dark:border-white pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500 dark:text-cyan-400" />
              <h2 className="font-mono font-black text-xl uppercase">
                Experimental Paradigms ({filteredExercises.length})
              </h2>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {domainFilters.map((tab) => {
                const isActive = selectedDomain === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sound.playClick()
                      setSelectedDomain(tab.id)
                    }}
                    className={`px-2.5 py-1 font-mono text-[11px] font-bold uppercase border-2 transition-all cursor-pointer ${
                      isActive
                        ? "border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]"
                        : "border-transparent hover:border-black dark:hover:border-white bg-card text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Grid of Paradigms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExercises.map((exercise) => {
              const contract = exercise.cognitiveContract
              return (
                <div
                  key={exercise.id}
                  className="border-2 border-black dark:border-white bg-card p-5 shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#FFFFFF] flex flex-col justify-between space-y-4 hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 border border-black dark:border-white bg-secondary font-bold uppercase">
                          {exercise.categoryName}
                        </span>
                        <h3 className="font-mono font-black text-lg text-foreground uppercase mt-1">
                          {exercise.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono uppercase text-muted-foreground border border-black dark:border-white px-1.5 py-0.5">
                        {exercise.domain.replace("_", " ")}
                      </span>
                    </div>

                    {/* Mechanisms */}
                    <div className="flex flex-wrap gap-1.5">
                      {exercise.mechanisms.map((mech, i) => (
                        <span
                          key={i}
                          className="font-mono text-[10px] px-2 py-0.5 bg-secondary text-foreground font-semibold border border-black/30 dark:border-white/30"
                        >
                          {mech}
                        </span>
                      ))}
                    </div>

                    {/* Target */}
                    <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                      {contract.trainingTarget}
                    </p>

                    {/* Transfer targets */}
                    <div className="border border-black dark:border-white bg-secondary/20 p-2.5 font-mono text-[11px] space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-muted-foreground uppercase text-[10px]">Near Transfer:</span>
                        <span className="font-bold text-foreground">{exercise.transferMappings.nearTransferDomain}</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-muted-foreground uppercase text-[10px]">Operational:</span>
                        <span className="font-bold text-foreground">{exercise.transferMappings.realWorldSkill}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t-2 border-black dark:border-white flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/engine/${exercise.id}?pool=practice`}
                      onClick={() => sound.playClick()}
                      className="px-3 py-1.5 border border-black dark:border-white bg-secondary font-mono text-[11px] font-bold uppercase hover:bg-secondary/70 transition-colors"
                    >
                      Demo / Practice
                    </Link>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/engine/${exercise.id}?pool=assessment`}
                        onClick={() => sound.playClick()}
                        className="px-3 py-1.5 border border-black dark:border-white bg-card font-mono text-[11px] font-bold uppercase hover:bg-secondary transition-colors"
                      >
                        Assessment
                      </Link>

                      <Link
                        href={`/engine/${exercise.id}?pool=training`}
                        onClick={() => sound.playStart()}
                        className="px-4 py-1.5 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black font-mono text-xs font-black uppercase shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>TRAIN</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
