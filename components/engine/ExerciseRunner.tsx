"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import {
  ExerciseDefinition,
  DifficultyVector,
  PoolType,
  TrialData,
  TrialTelemetry,
  TrialValidation,
} from "@/lib/engine/types"
import { recordTrialTelemetry, updateProfileWithTrial, getUserCognitiveProfile } from "@/lib/engine/user-model"
import { sound } from "@/lib/audio"
import {
  Brain,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  Layers,
  ChevronRight,
  ShieldAlert,
} from "lucide-react"

type RunnerPhase = "contract" | "demonstration" | "practice" | "run" | "summary"

interface ExerciseRunnerProps {
  exercise: ExerciseDefinition
  pool?: PoolType
  initialDifficulty?: DifficultyVector
  trialCount?: number
  onComplete?: (telemetryList: TrialTelemetry[]) => void
  onExit?: () => void
}

export function ExerciseRunner({
  exercise,
  pool = "training",
  initialDifficulty,
  trialCount = 10,
  onComplete,
  onExit,
}: ExerciseRunnerProps) {
  const [phase, setPhase] = useState<RunnerPhase>("contract")
  const [difficulty, setDifficulty] = useState<DifficultyVector>(
    initialDifficulty || exercise.defaultDifficulty
  )
  const [trialIndex, setTrialIndex] = useState(0)
  const [currentTrial, setCurrentTrial] = useState<TrialData | null>(null)
  const [telemetryList, setTelemetryList] = useState<TrialTelemetry[]>([])
  const [selectedResponse, setSelectedResponse] = useState<any>(null)
  const [feedback, setFeedback] = useState<TrialValidation | null>(null)
  const [isAnsweringLocked, setIsAnsweringLocked] = useState(false)
  const [timeLeftMs, setTimeLeftMs] = useState<number>(0)

  // OSPAN state management
  const [ospanStepIndex, setOspanStepIndex] = useState(0)
  const [ospanPhase, setOspanPhase] = useState<"math" | "letter" | "recall">("math")
  const [ospanRecalledLetters, setOspanRecalledLetters] = useState<string[]>([])

  // Stop Signal state management
  const [stopSignalActive, setStopSignalActive] = useState(false)
  const stopTimerRef = useRef<any>(null)

  const stimulusStartTimeRef = useRef<number>(0)
  const timerIntervalRef = useRef<any>(null)
  const baseSeedRef = useRef<number>(Math.floor(Math.random() * 1000000))

  // Load a trial
  const loadTrial = useCallback(
    (index: number, currentPool: PoolType) => {
      const trialSeed = baseSeedRef.current + index * 1337
      const trialData = exercise.generate({
        difficulty,
        seed: trialSeed,
        pool: currentPool,
        trialIndex: index,
      })

      setCurrentTrial(trialData)
      setSelectedResponse(null)
      setFeedback(null)
      setIsAnsweringLocked(false)
      setTimeLeftMs(trialData.timeLimitMs || 10000)

      // Reset OSPAN state
      if (exercise.id === "operation_span") {
        setOspanStepIndex(0)
        setOspanPhase("math")
        setOspanRecalledLetters([])
      }

      // Reset & Arm Stop Signal
      if (exercise.id === "stop_signal") {
        setStopSignalActive(false)
        if (stopTimerRef.current) clearTimeout(stopTimerRef.current)
        if (trialData.metadata?.isStopTrial) {
          stopTimerRef.current = setTimeout(() => {
            setStopSignalActive(true)
            sound.playAlert()
          }, trialData.metadata.ssdMs)
        }
      }

      stimulusStartTimeRef.current = performance.now()
    },
    [exercise, difficulty]
  )

  // Start Phase 4 formal run
  const startFormalRun = () => {
    sound.playStart()
    setTrialIndex(0)
    setTelemetryList([])
    setPhase("run")
    loadTrial(0, pool)
  }

  // Start Practice
  const startPractice = () => {
    sound.playClick()
    setTrialIndex(0)
    setTelemetryList([])
    setPhase("practice")
    loadTrial(0, "practice")
  }

  // Timer countdown
  useEffect(() => {
    if (phase !== "run" && phase !== "practice") return
    if (!currentTrial || isAnsweringLocked) return

    clearInterval(timerIntervalRef.current)
    const interval = 50
    timerIntervalRef.current = setInterval(() => {
      setTimeLeftMs((prev) => {
        if (prev <= interval) {
          clearInterval(timerIntervalRef.current)
          handleTimeout()
          return 0
        }
        return prev - interval
      })
    }, interval)

    return () => clearInterval(timerIntervalRef.current)
  }, [currentTrial, isAnsweringLocked, phase])

  // Handle timeout
  const handleTimeout = () => {
    if (isAnsweringLocked || !currentTrial) return

    if (stopTimerRef.current) clearTimeout(stopTimerRef.current)

    // For Stop-Signal, if this was a Stop trial, withholding until timeout is successful!
    if (exercise.id === "stop_signal" && currentTrial.metadata?.isStopTrial) {
      submitResponse("STOP_WITHHELD")
      return
    }

    setIsAnsweringLocked(true)
    sound.playTimeout()

    const validation: TrialValidation = {
      isCorrect: false,
      score: 0.0,
      expected: currentTrial.expectedAnswer,
      actual: "TIMEOUT",
      errorType: "slow_timeout",
      feedback: "Response deadline exceeded.",
    }

    recordTrial(validation, currentTrial.timeLimitMs)
  }

  // Submit Response
  const submitResponse = (response: any) => {
    if (isAnsweringLocked || !currentTrial) return
    setIsAnsweringLocked(true)
    clearInterval(timerIntervalRef.current)
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current)

    const latencyMs = Math.round(performance.now() - stimulusStartTimeRef.current)
    setSelectedResponse(response)

    const validation = exercise.validate(response, currentTrial.expectedAnswer, currentTrial.metadata)
    setFeedback(validation)

    if (validation.isCorrect) {
      sound.playCorrect()
    } else {
      sound.playIncorrect()
    }

    recordTrial(validation, latencyMs)
  }

  // Record trial telemetry
  const recordTrial = (validation: TrialValidation, latencyMs: number) => {
    if (!currentTrial) return

    const telemetry: TrialTelemetry = {
      trialId: currentTrial.trialId,
      exerciseId: exercise.id,
      seed: currentTrial.seed,
      pool: currentTrial.pool,
      timestamp: Date.now(),
      latencyMs,
      validation,
      difficulty: currentTrial.difficulty,
      metadata: currentTrial.metadata || {},
    }

    const nextList = [...telemetryList, telemetry]
    setTelemetryList(nextList)

    if (phase === "run") {
      recordTrialTelemetry(telemetry)
      const userProfile = getUserCognitiveProfile()
      updateProfileWithTrial(userProfile, telemetry)
    }

    // Adaptive difficulty adjustment in training mode
    if (phase === "run" && pool === "training") {
      if (validation.isCorrect && latencyMs < currentTrial.timeLimitMs * 0.7) {
        setDifficulty((prev) => ({
          ...prev,
          processing_speed: Math.min(1.0, prev.processing_speed + 0.03),
          interference: Math.min(1.0, prev.interference + 0.02),
        }))
      } else if (!validation.isCorrect) {
        setDifficulty((prev) => ({
          ...prev,
          processing_speed: Math.max(0.1, prev.processing_speed - 0.04),
          interference: Math.max(0.1, prev.interference - 0.03),
        }))
      }
    }

    // Delay before next trial or finish
    const delay = phase === "practice" ? 1400 : 600
    setTimeout(() => {
      const targetCount = phase === "practice" ? 3 : trialCount
      if (trialIndex + 1 < targetCount) {
        setTrialIndex((prev) => prev + 1)
        loadTrial(trialIndex + 1, phase === "practice" ? "practice" : pool)
      } else {
        if (phase === "practice") {
          // Practice done, return or offer formal run
          setPhase("demonstration")
        } else {
          // Run complete
          sound.playComplete()
          setPhase("summary")
          if (onComplete) onComplete(nextList)
        }
      }
    }, delay)
  }

  // OSPAN step handler
  const handleOspanMathAnswer = (isTrue: boolean) => {
    if (!currentTrial) return
    const stimulus = currentTrial.stimulus
    const step = stimulus.steps[ospanStepIndex]

    if (isTrue === step.isEquationValid) {
      sound.playClick()
    } else {
      sound.playIncorrect()
    }

    // Show letter to remember for 1200ms
    setOspanPhase("letter")
    setTimeout(() => {
      if (ospanStepIndex + 1 < stimulus.steps.length) {
        setOspanStepIndex((prev) => prev + 1)
        setOspanPhase("math")
      } else {
        // Move to recall phase
        setOspanPhase("recall")
        setOspanRecalledLetters([])
      }
    }, 1200)
  }

  // OSPAN letter recall
  const handleOspanLetterClick = (letter: string) => {
    sound.playClick()
    const nextList = [...ospanRecalledLetters, letter]
    setOspanRecalledLetters(nextList)
  }

  const handleOspanRecallSubmit = () => {
    submitResponse(ospanRecalledLetters)
  }

  // Keyboard controls
  useEffect(() => {
    if (phase !== "run" && phase !== "practice") return
    if (isAnsweringLocked || !currentTrial) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()

      // Stroop colors
      if (exercise.id === "stroop") {
        if (key === "1" || key === "R") submitResponse("RED")
        if (key === "2" || key === "B") submitResponse("BLUE")
        if (key === "3" || key === "G") submitResponse("GREEN")
        if (key === "4" || key === "Y") submitResponse("YELLOW")
      }

      // Flanker & Stop-Signal
      if (exercise.id === "flanker" || exercise.id === "stop_signal") {
        if (e.key === "ArrowLeft" || key === "A") submitResponse("LEFT")
        if (e.key === "ArrowRight" || key === "D") submitResponse("RIGHT")
      }

      // N-Back & Composite
      if (exercise.id === "n_back" || exercise.id === "composite_stroop_nback") {
        if (key === "M" || key === "1" || e.key === "ArrowLeft") submitResponse("MATCH")
        if (key === "P" || key === "2" || e.key === "ArrowRight") submitResponse("PASS")
      }

      // Task Switch
      if (exercise.id === "task_switch") {
        if (currentTrial.stimulus.rule === "PARITY") {
          if (key === "O" || key === "1") submitResponse("ODD")
          if (key === "E" || key === "2") submitResponse("EVEN")
        } else {
          if (key === "L" || key === "1") submitResponse("LOW")
          if (key === "H" || key === "2") submitResponse("HIGH")
        }
      }

      // General numerical options (1-6)
      if (currentTrial.options && currentTrial.options.length <= 6) {
        const num = parseInt(key, 10)
        if (!isNaN(num) && num >= 1 && num <= currentTrial.options.length) {
          const opt = currentTrial.options[num - 1]
          submitResponse(opt)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [phase, isAnsweringLocked, currentTrial, exercise.id])

  /* =========================================================================
     RENDER HELPERS: SHAPES & STIMULI
     ========================================================================= */

  const renderProgressiveMatrixCell = (cell: any, isTarget: boolean = false) => {
    if (!cell) {
      return (
        <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed border-black dark:border-white bg-amber-400/20 dark:bg-cyan-400/20 flex items-center justify-center font-mono font-black text-2xl text-amber-500 dark:text-cyan-400">
          ?
        </div>
      )
    }

    const { shape, fill, count } = cell
    const fillColor =
      fill === "solid"
        ? "currentColor"
        : fill === "half"
        ? "url(#hatch)"
        : "transparent"

    return (
      <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-black dark:border-white bg-card flex items-center justify-center p-2 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-foreground stroke-current">
          <defs>
            <pattern id="hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="2" />
            </pattern>
          </defs>
          {Array.from({ length: count }).map((_, i) => {
            const offsetX = count === 1 ? 50 : count === 2 ? 30 + i * 40 : 20 + i * 30
            const size = count === 1 ? 32 : count === 2 ? 22 : 16
            if (shape === "circle") {
              return (
                <circle
                  key={i}
                  cx={offsetX}
                  cy="50"
                  r={size}
                  fill={fillColor}
                  stroke="currentColor"
                  strokeWidth="4"
                />
              )
            }
            if (shape === "square") {
              return (
                <rect
                  key={i}
                  x={offsetX - size}
                  y={50 - size}
                  width={size * 2}
                  height={size * 2}
                  fill={fillColor}
                  stroke="currentColor"
                  strokeWidth="4"
                />
              )
            }
            // Triangle
            return (
              <polygon
                key={i}
                points={`${offsetX},${50 - size} ${offsetX - size},${50 + size} ${offsetX + size},${50 + size}`}
                fill={fillColor}
                stroke="currentColor"
                strokeWidth="4"
              />
            )
          })}
        </svg>
      </div>
    )
  }

  const renderWCSTCard = (card: any, label?: string) => {
    const { color, shape, count } = card
    const colorClasses: Record<string, string> = {
      red: "text-red-500 fill-red-500",
      green: "text-emerald-500 fill-emerald-500",
      blue: "text-blue-500 fill-blue-500",
      yellow: "text-amber-500 fill-amber-500",
    }

    return (
      <div className="w-24 h-32 border-2 border-black dark:border-white bg-card flex flex-col items-center justify-between p-2 shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF]">
        <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{label || "CARD"}</span>
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 w-full flex-1">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className={`w-6 h-6 flex items-center justify-center ${colorClasses[color]}`}>
              {shape === "circle" && <div className="w-5 h-5 rounded-full border-2 border-current bg-current" />}
              {shape === "triangle" && (
                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[18px] border-b-current" />
              )}
              {shape === "cross" && (
                <div className="font-mono text-xl font-black leading-none text-current">+</div>
              )}
              {shape === "star" && (
                <div className="font-mono text-lg font-black leading-none text-current">★</div>
              )}
            </div>
          ))}
        </div>
        <div className="text-[9px] font-mono uppercase text-muted-foreground">
          {count}× {color}
        </div>
      </div>
    )
  }

  /* =========================================================================
     PHASE 1: COGNITIVE CONTRACT
     ========================================================================= */
  if (phase === "contract") {
    const contract = exercise.cognitiveContract
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="border-2 border-black dark:border-white bg-card p-6 shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#FFFFFF]">
          <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black flex items-center justify-center font-mono font-black text-xl shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-black dark:border-white bg-secondary font-bold">
                  {exercise.categoryName}
                </span>
                <h1 className="font-mono font-black text-xl sm:text-2xl text-foreground uppercase mt-1">
                  {exercise.name}
                </h1>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-xs font-mono text-muted-foreground uppercase">Domain</span>
              <p className="font-mono font-black text-sm text-foreground uppercase">{exercise.domain.replace("_", " ")}</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Target */}
            <div className="border-2 border-black dark:border-white bg-secondary/40 p-4">
              <span className="text-xs font-mono font-black text-amber-500 dark:text-cyan-400 uppercase tracking-wider block mb-1">
                // COGNITIVE TARGET
              </span>
              <p className="font-mono text-sm text-foreground font-medium">{contract.trainingTarget}</p>
            </div>

            {/* Protocol */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-black dark:border-white bg-card p-4">
                <span className="text-xs font-mono font-black text-foreground uppercase tracking-wider block mb-1">
                  1. WHAT YOU DO
                </span>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">{contract.whatYouDo}</p>
              </div>

              <div className="border-2 border-black dark:border-white bg-card p-4">
                <span className="text-xs font-mono font-black text-foreground uppercase tracking-wider block mb-1">
                  2. WHAT MATTERS
                </span>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">{contract.whatMatters}</p>
              </div>
            </div>

            {/* Telemetry Metrics */}
            <div className="border-2 border-black dark:border-white bg-card p-4">
              <span className="text-xs font-mono font-black text-foreground uppercase tracking-wider block mb-2">
                3. WHAT IS MEASURED
              </span>
              <div className="flex flex-wrap gap-2">
                {contract.whatIsMeasured.map((m, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-xs px-2.5 py-1 border border-black dark:border-white bg-secondary text-foreground font-semibold"
                  >
                    • {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Transfer mappings */}
            <div className="border-2 border-black dark:border-white bg-card p-4">
              <span className="text-xs font-mono font-black text-foreground uppercase tracking-wider block mb-2">
                4. SCIENTIFIC TRANSFER MAPPINGS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block">Near Transfer</span>
                  <span className="font-bold text-foreground">{exercise.transferMappings.nearTransferDomain}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block">Far Transfer</span>
                  <span className="font-bold text-foreground">{exercise.transferMappings.farTransferDomain}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block">Real-World Skill</span>
                  <span className="font-bold text-foreground">{exercise.transferMappings.realWorldSkill}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t-2 border-black dark:border-white">
            {onExit ? (
              <button
                onClick={onExit}
                className="w-full sm:w-auto px-4 py-2 border-2 border-black dark:border-white bg-secondary font-mono text-xs font-bold uppercase hover:bg-secondary/70 transition-colors"
              >
                [ EXIT TO CATALOG ]
              </button>
            ) : <div />}

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  sound.playClick()
                  setPhase("demonstration")
                }}
                className="flex-1 sm:flex-none px-6 py-2.5 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black font-mono text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>PROCEED TO DEMONSTRATION</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* =========================================================================
     PHASE 2: INTERACTIVE DEMONSTRATION
     ========================================================================= */
  if (phase === "demonstration") {
    const demoSteps = exercise.generateDemonstration()

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="border-2 border-black dark:border-white bg-card p-6 shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#FFFFFF]">
          <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-4 mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-black dark:border-white bg-secondary font-bold">
                PHASE 2 / 5
              </span>
              <h2 className="font-mono font-black text-xl text-foreground uppercase mt-1">
                Guided Interactive Demonstration
              </h2>
            </div>
            <button
              onClick={() => {
                sound.playClick()
                setPhase("contract")
              }}
              className="text-xs font-mono text-muted-foreground uppercase hover:text-foreground font-bold"
            >
              [ REVIEW CONTRACT ]
            </button>
          </div>

          <div className="space-y-4">
            {demoSteps.map((step) => (
              <div
                key={step.stepNumber}
                className="border-2 border-black dark:border-white bg-secondary/20 p-4 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-mono font-black text-xs flex items-center justify-center">
                    {step.stepNumber}
                  </span>
                  <span className="font-mono font-black text-xs uppercase tracking-wider text-foreground">
                    WALKTHROUGH EXAMPLE
                  </span>
                </div>

                <div className="border-2 border-black dark:border-white bg-card p-3 font-mono text-sm font-bold text-foreground">
                  {step.stimulusSummary}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="border border-black dark:border-white bg-card p-2.5">
                    <span className="text-[10px] text-muted-foreground uppercase block font-bold">Action</span>
                    <span className="text-amber-500 dark:text-cyan-400 font-black">{step.demonstrationAction}</span>
                  </div>
                  <div className="border border-black dark:border-white bg-card p-2.5">
                    <span className="text-[10px] text-muted-foreground uppercase block font-bold">Outcome</span>
                    <span className="text-emerald-500 font-bold">{step.expectedOutcome}</span>
                  </div>
                </div>

                <p className="text-xs font-mono text-muted-foreground leading-relaxed italic">
                  💡 {step.guidance}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-black dark:border-white">
            <button
              onClick={startPractice}
              className="w-full sm:w-auto px-5 py-2.5 border-2 border-black dark:border-white bg-secondary text-foreground font-mono text-xs font-black uppercase tracking-wider hover:bg-secondary/70 transition-colors"
            >
              [ RUN 3 PRACTICE TRIALS ]
            </button>

            <button
              onClick={startFormalRun}
              className="w-full sm:w-auto px-6 py-2.5 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black font-mono text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>COMMENCE FORMAL {pool.toUpperCase()}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* =========================================================================
     PHASE 3 & 4: INTERACTIVE TRIAL EXECUTION (PRACTICE / RUN)
     ========================================================================= */
  if (phase === "practice" || phase === "run") {
    if (!currentTrial) return null

    const maxTrials = phase === "practice" ? 3 : trialCount
    const progressPercent = Math.round(((trialIndex + 1) / maxTrials) * 100)
    const timeRatio = Math.max(0, timeLeftMs / (currentTrial.timeLimitMs || 10000))

    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Top Telemetry & Status HUD */}
        <div className="border-2 border-black dark:border-white bg-card p-3 shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF] flex items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 border border-black dark:border-white ${
              phase === "practice" ? "bg-amber-400 text-black" : "bg-black text-white dark:bg-white dark:text-black"
            }`}>
              {phase === "practice" ? "PRACTICE" : pool.toUpperCase()}
            </span>
            <span className="text-xs font-bold text-foreground">
              TRIAL {trialIndex + 1} / {maxTrials}
            </span>
          </div>

          {/* Time bar */}
          <div className="flex-1 max-w-xs mx-2">
            <div className="h-2 border border-black dark:border-white bg-secondary overflow-hidden">
              <div
                className={`h-full transition-all duration-75 ${
                  timeRatio > 0.4 ? "bg-emerald-500" : timeRatio > 0.15 ? "bg-amber-500" : "bg-red-500"
                }`}
                style={{ width: `${Math.round(timeRatio * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-muted-foreground hidden sm:inline">SEED #{currentTrial.seed}</span>
            <span className="font-bold tabular text-foreground">
              {(timeLeftMs / 1000).toFixed(1)}s
            </span>
          </div>
        </div>

        {/* Central Neo-Brutalist Stimulus Stage */}
        <div
          className={`border-2 border-black dark:border-white bg-card min-h-[360px] p-6 shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#FFFFFF] flex flex-col items-center justify-center relative transition-all ${
            feedback
              ? feedback.isCorrect
                ? "border-emerald-500 bg-emerald-500/5"
                : "border-red-500 bg-red-500/5"
              : ""
          }`}
        >
          {/* Feedback Overlay */}
          {feedback && (
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between border-2 border-black dark:border-white p-2 font-mono text-xs font-bold z-20 bg-background">
              <div className="flex items-center gap-2">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span>{feedback.feedback || (feedback.isCorrect ? "CORRECT" : "INCORRECT")}</span>
              </div>
              <span className="text-muted-foreground uppercase">Next trial queued...</span>
            </div>
          )}

          {/* 1. STROOP STIMULUS */}
          {exercise.id === "stroop" && (
            <div className="text-center space-y-6 my-auto">
              <div className="inline-block border-2 border-black dark:border-white bg-secondary px-3 py-1 font-mono text-xs font-black uppercase tracking-wider">
                RULE: REPORT [{currentTrial.stimulus.rule.toUpperCase()}]
              </div>
              <div
                className="font-mono text-6xl sm:text-7xl font-black uppercase tracking-tight select-none py-4"
                style={{ color: currentTrial.stimulus.inkColor }}
              >
                {currentTrial.stimulus.word}
              </div>
              <p className="font-mono text-xs text-muted-foreground uppercase">
                {currentTrial.stimulus.rule === "ink" ? "Ignore the word letters. Click the INK color." : "Read the word letters."}
              </p>
            </div>
          )}

          {/* 2. FLANKER STIMULUS */}
          {exercise.id === "flanker" && (
            <div className="text-center space-y-6 my-auto">
              <div className="inline-block border-2 border-black dark:border-white bg-secondary px-3 py-1 font-mono text-xs font-black uppercase tracking-wider">
                TARGET: CENTER ARROW
              </div>
              <div className="font-mono text-5xl sm:text-7xl font-black tracking-widest select-none py-6 border-2 border-black dark:border-white bg-background px-8 shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF]">
                {currentTrial.stimulus.flankerString}
              </div>
              <p className="font-mono text-xs text-muted-foreground uppercase">
                Ignore flankers. Identify which way the center arrow points.
              </p>
            </div>
          )}

          {/* 2B. STOP-SIGNAL STIMULUS */}
          {exercise.id === "stop_signal" && (
            <div className="text-center space-y-6 my-auto">
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`inline-block border-2 border-black dark:border-white px-3 py-1 font-mono text-xs font-black uppercase tracking-wider transition-colors ${
                    stopSignalActive
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {stopSignalActive ? "⛔ INHIBIT! STOP SIGNAL FIRED!" : "TARGET: RESPOND TO ARROW"}
                </span>
                <span className="font-mono text-xs text-muted-foreground border border-black dark:border-white px-2 py-0.5 bg-background">
                  SSD: {currentTrial.stimulus.ssdMs}ms
                </span>
              </div>

              <div
                className={`w-44 h-44 border-4 mx-auto flex items-center justify-center transition-all ${
                  stopSignalActive
                    ? "border-red-600 bg-red-500/20 shadow-[6px_6px_0px_0px_#EF4444]"
                    : "border-black dark:border-white bg-background shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#FFFFFF]"
                }`}
              >
                <span
                  className={`font-mono text-7xl font-black select-none ${
                    stopSignalActive ? "text-red-600" : "text-emerald-500 dark:text-emerald-400"
                  }`}
                >
                  {currentTrial.stimulus.arrow}
                </span>
              </div>

              <p className="font-mono text-xs text-muted-foreground uppercase max-w-sm mx-auto">
                {stopSignalActive
                  ? "STOP SIGNAL FIRED! Do NOT click any button. Withhold response."
                  : "Strike matching direction [← Left (A) / → Right (D)] before timeout."}
              </p>
            </div>
          )}

          {/* 3. N-BACK STIMULUS */}
          {exercise.id === "n_back" && (
            <div className="text-center space-y-6 my-auto">
              <div className="inline-block border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black px-3 py-1 font-mono text-xs font-black uppercase tracking-wider">
                {currentTrial.stimulus.n}-BACK BUFFER UPDATING
              </div>
              <div className="w-32 h-32 border-2 border-black dark:border-white bg-background flex items-center justify-center font-mono text-6xl font-black uppercase shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#FFFFFF]">
                {currentTrial.stimulus.currentSymbol}
              </div>
              <p className="font-mono text-xs text-muted-foreground uppercase">
                Does this match the symbol from exactly {currentTrial.stimulus.n} steps ago?
              </p>
            </div>
          )}

          {/* 4. OPERATION SPAN STIMULUS */}
          {exercise.id === "operation_span" && (
            <div className="w-full text-center space-y-6 my-auto">
              {ospanPhase === "math" && (
                <div className="space-y-4">
                  <div className="inline-block border-2 border-black dark:border-white bg-secondary px-3 py-1 font-mono text-xs font-black uppercase tracking-wider">
                    MATH VERIFICATION (STEP {ospanStepIndex + 1}/{currentTrial.stimulus.steps.length})
                  </div>
                  <div className="font-mono text-3xl sm:text-4xl font-black p-4 border-2 border-black dark:border-white bg-background shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF]">
                    {currentTrial.stimulus.steps[ospanStepIndex].equation}
                  </div>
                  <div className="flex justify-center gap-4 pt-2">
                    <button
                      onClick={() => handleOspanMathAnswer(true)}
                      className="px-6 py-2.5 border-2 border-black dark:border-white bg-emerald-500 text-black font-mono font-black text-sm uppercase shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] cursor-pointer"
                    >
                      [ TRUE ]
                    </button>
                    <button
                      onClick={() => handleOspanMathAnswer(false)}
                      className="px-6 py-2.5 border-2 border-black dark:border-white bg-red-500 text-black font-mono font-black text-sm uppercase shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] cursor-pointer"
                    >
                      [ FALSE ]
                    </button>
                  </div>
                </div>
              )}

              {ospanPhase === "letter" && (
                <div className="space-y-4">
                  <div className="inline-block border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black px-3 py-1 font-mono text-xs font-black uppercase tracking-wider">
                    COMMIT TO MEMORY
                  </div>
                  <div className="w-24 h-24 mx-auto border-2 border-black dark:border-white bg-background flex items-center justify-center font-mono text-5xl font-black shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF]">
                    {currentTrial.stimulus.steps[ospanStepIndex].letterToRemember}
                  </div>
                </div>
              )}

              {ospanPhase === "recall" && (
                <div className="space-y-4">
                  <div className="inline-block border-2 border-black dark:border-white bg-secondary px-3 py-1 font-mono text-xs font-black uppercase tracking-wider">
                    RECALL FULL LETTER SEQUENCE IN ORDER
                  </div>
                  <div className="border-2 border-black dark:border-white bg-background p-3 font-mono text-xl font-black min-h-[48px] flex items-center justify-center gap-2">
                    {ospanRecalledLetters.length === 0 ? (
                      <span className="text-muted-foreground text-xs uppercase">[SELECT LETTERS BELOW]</span>
                    ) : (
                      ospanRecalledLetters.map((l, i) => (
                        <span key={i} className="px-2 py-0.5 border border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black">
                          {l}
                        </span>
                      ))
                    )}
                  </div>
                  <div className="grid grid-cols-6 gap-2 max-w-sm mx-auto">
                    {(currentTrial.options || []).map((letter: string) => (
                      <button
                        key={letter}
                        onClick={() => handleOspanLetterClick(letter)}
                        className="p-2 border-2 border-black dark:border-white bg-card font-mono font-bold text-sm uppercase hover:bg-secondary cursor-pointer"
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => setOspanRecalledLetters([])}
                      className="px-4 py-2 border-2 border-black dark:border-white bg-secondary font-mono text-xs font-bold uppercase cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleOspanRecallSubmit}
                      className="px-6 py-2 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black font-mono text-xs font-black uppercase cursor-pointer shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]"
                    >
                      SUBMIT SEQUENCE
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. TASK SWITCH STIMULUS */}
          {exercise.id === "task_switch" && (
            <div className="text-center space-y-6 my-auto">
              <div className="inline-block border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black px-4 py-1.5 font-mono text-sm font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
                {currentTrial.stimulus.cue}
              </div>
              <div className="w-28 h-28 mx-auto border-2 border-black dark:border-white bg-background flex items-center justify-center font-mono text-6xl font-black shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#FFFFFF]">
                {currentTrial.stimulus.number}
              </div>
              <p className="font-mono text-xs text-muted-foreground uppercase">
                {currentTrial.stimulus.rule === "PARITY"
                  ? "Rule: Is the number ODD or EVEN?"
                  : "Rule: Is the number LOW (<5) or HIGH (>5)?"}
              </p>
            </div>
          )}

          {/* 6. WISCONSIN CARD SORTING (WCST) */}
          {exercise.id === "wcst" && (
            <div className="w-full space-y-6 my-auto">
              <div className="text-center">
                <span className="inline-block border-2 border-black dark:border-white bg-secondary px-3 py-1 font-mono text-xs font-black uppercase tracking-wider">
                  DEDUCE HIDDEN RULE (COLOR, SHAPE, OR COUNT)
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div>
                  <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block text-center mb-1">
                    TARGET CARD
                  </span>
                  {renderWCSTCard(currentTrial.stimulus.targetCard, "TARGET")}
                </div>
                <div className="text-center font-mono font-black text-xl text-muted-foreground">→</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currentTrial.stimulus.referenceCards.map((refCard: any, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => !isAnsweringLocked && submitResponse(idx)}
                      className={`cursor-pointer transition-transform hover:scale-105 ${
                        isAnsweringLocked && selectedResponse === idx ? "ring-2 ring-amber-400" : ""
                      }`}
                    >
                      {renderWCSTCard(refCard, `DECK ${idx + 1}`)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 7. PROGRESSIVE MATRICES (RAVEN) */}
          {exercise.id === "progressive_matrices" && (
            <div className="space-y-4 my-auto">
              <div className="grid grid-cols-3 gap-2 mx-auto w-fit p-3 border-2 border-black dark:border-white bg-secondary/30">
                {currentTrial.stimulus.grid.map((row: any[], r: number) =>
                  row.map((cell: any, c: number) => (
                    <div key={`${r}-${c}`}>
                      {renderProgressiveMatrixCell(cell, r === 2 && c === 2)}
                    </div>
                  ))
                )}
              </div>
              <p className="font-mono text-xs text-muted-foreground text-center uppercase">
                Select the figure that correctly completes row & column progression logic:
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 justify-center max-w-lg mx-auto">
                {currentTrial.stimulus.options.map((opt: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => !isAnsweringLocked && submitResponse(idx)}
                    className="border-2 border-black dark:border-white bg-card p-1 hover:bg-secondary cursor-pointer shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] transition-transform active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <div className="text-[10px] font-mono text-muted-foreground font-bold text-center">#{idx + 1}</div>
                    {renderProgressiveMatrixCell(opt)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 8. BAYESIAN UPDATING */}
          {exercise.id === "bayesian_updating" && (
            <div className="max-w-xl mx-auto space-y-4 my-auto">
              <div className="border-2 border-black dark:border-white bg-background p-4 shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF] space-y-3 font-mono">
                <span className="text-[10px] font-bold text-amber-500 dark:text-cyan-400 uppercase tracking-wider block">
                  // EMPIRICAL EVIDENCE PROFILE
                </span>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {currentTrial.stimulus.scenario}
                </p>
                <div className="grid grid-cols-3 gap-2 border-t border-black dark:border-white pt-2 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block uppercase">Base Rate</span>
                    <span className="font-bold">{currentTrial.stimulus.priorPercent}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block uppercase">Sensitivity</span>
                    <span className="font-bold">{currentTrial.stimulus.sensitivityPercent}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block uppercase">False Positive</span>
                    <span className="font-bold">{currentTrial.stimulus.falsePositivePercent}%</span>
                  </div>
                </div>
              </div>
              <p className="font-mono text-xs font-bold text-foreground text-center uppercase">
                {currentTrial.stimulus.question}
              </p>
            </div>
          )}

          {/* 9. CHOICE REACTION TIME */}
          {exercise.id === "choice_reaction" && (
            <div className="space-y-6 my-auto text-center">
              <div className="inline-block border-2 border-black dark:border-white bg-secondary px-3 py-1 font-mono text-xs font-black uppercase tracking-wider">
                TRIGGER ILLUMINATED TARGET INSTANTLY
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md mx-auto">
                {(currentTrial.options || []).map((optIdx: number) => {
                  const isActive = optIdx === currentTrial.stimulus.activeTargetIndex
                  return (
                    <button
                      key={optIdx}
                      onClick={() => !isAnsweringLocked && submitResponse(optIdx)}
                      className={`h-24 border-2 border-black dark:border-white font-mono font-black text-xl transition-all shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF] cursor-pointer ${
                        isActive
                          ? "bg-amber-400 dark:bg-cyan-400 text-black scale-105 animate-pulse"
                          : "bg-card text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {optIdx + 1}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* 10. COMPOSITE STROOP + N-BACK */}
          {exercise.id === "composite_stroop_nback" && (
            <div className="text-center space-y-6 my-auto">
              <div className="inline-block border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black px-3 py-1 font-mono text-xs font-black uppercase tracking-wider">
                DUAL TASK: TRACK INK COLOR ({currentTrial.stimulus.n}-BACK)
              </div>
              <div
                className="font-mono text-6xl sm:text-7xl font-black uppercase tracking-tight select-none py-4"
                style={{ color: currentTrial.stimulus.currentInk }}
              >
                {currentTrial.stimulus.currentWord}
              </div>
              <p className="font-mono text-xs text-muted-foreground uppercase">
                IGNORE PRINTED WORD. Does the current INK COLOR match the ink color {currentTrial.stimulus.n} steps ago?
              </p>
            </div>
          )}
        </div>

        {/* Bottom Universal Options Toolbar */}
        {exercise.id !== "operation_span" &&
          exercise.id !== "wcst" &&
          exercise.id !== "progressive_matrices" &&
          exercise.id !== "choice_reaction" && (
            <div className="border-2 border-black dark:border-white bg-card p-4 shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF]">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {currentTrial.options?.map((opt: any, idx: number) => {
                  const isSelected = selectedResponse === opt
                  return (
                    <button
                      key={idx}
                      disabled={isAnsweringLocked}
                      onClick={() => submitResponse(opt)}
                      className={`min-w-[120px] px-5 py-3 border-2 border-black dark:border-white font-mono font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer disabled:opacity-60 ${
                        isSelected
                          ? "bg-amber-400 dark:bg-cyan-400 text-black"
                          : "bg-secondary hover:bg-secondary/80 text-foreground"
                      }`}
                    >
                      <span className="text-[10px] text-muted-foreground mr-1.5 font-normal">[{idx + 1}]</span>
                      {String(opt)}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
      </div>
    )
  }

  /* =========================================================================
     PHASE 5: SESSION SUMMARY & TELEMETRY BREAKDOWN
     ========================================================================= */
  if (phase === "summary") {
    const totalTrials = telemetryList.length
    const correctTrials = telemetryList.filter((t) => t.validation.isCorrect).length
    const accuracyPercent = totalTrials > 0 ? Math.round((correctTrials / totalTrials) * 100) : 0
    const avgLatency =
      totalTrials > 0
        ? Math.round(telemetryList.reduce((acc, t) => acc + t.latencyMs, 0) / totalTrials)
        : 0

    // Compute error breakdown
    const misses = telemetryList.filter((t) => t.validation.errorType === "miss").length
    const falseAlarms = telemetryList.filter((t) => t.validation.errorType === "false_alarm").length
    const timeouts = telemetryList.filter((t) => t.validation.errorType === "slow_timeout").length

    // Stop Signal Task (SSRT) Logan & Cowan Race Model calculations
    const isStopSignal = exercise.id === "stop_signal"
    const goTrials = telemetryList.filter((t) => !t.metadata?.isStopTrial)
    const stopTrials = telemetryList.filter((t) => t.metadata?.isStopTrial)
    const meanGoRt =
      goTrials.length > 0
        ? Math.round(goTrials.reduce((acc, t) => acc + t.latencyMs, 0) / goTrials.length)
        : avgLatency
    const meanSsd =
      stopTrials.length > 0
        ? Math.round(stopTrials.reduce((acc, t) => acc + (t.metadata?.ssdMs || 250), 0) / stopTrials.length)
        : 250
    const estimatedSsrt = Math.max(120, meanGoRt - meanSsd)
    const stopSuccessRate =
      stopTrials.length > 0
        ? Math.round(
            (stopTrials.filter((t) => t.validation.isCorrect).length / stopTrials.length) * 100
          )
        : 100

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="border-2 border-black dark:border-white bg-card p-6 shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#FFFFFF] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-black dark:border-white bg-emerald-500 text-black font-black">
                SESSION COMPLETED
              </span>
              <h2 className="font-mono font-black text-2xl text-foreground uppercase mt-1">
                Cognitive Telemetry Audit
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-muted-foreground uppercase">Mode</span>
              <p className="font-mono font-black text-sm text-foreground uppercase">{pool}</p>
            </div>
          </div>

          {/* Primary Telemetry Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="border-2 border-black dark:border-white bg-card p-3 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
              <span className="text-[10px] font-mono text-muted-foreground uppercase block font-bold">Accuracy</span>
              <span className="font-mono font-black text-2xl text-amber-500 dark:text-cyan-400">
                {accuracyPercent}%
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block mt-1">
                {correctTrials} / {totalTrials} trials
              </span>
            </div>

            <div className="border-2 border-black dark:border-white bg-card p-3 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
              <span className="text-[10px] font-mono text-muted-foreground uppercase block font-bold">Mean Latency</span>
              <span className="font-mono font-black text-2xl text-foreground">
                {avgLatency}ms
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block mt-1">
                Motor + decision RT
              </span>
            </div>

            <div className="border-2 border-black dark:border-white bg-card p-3 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
              <span className="text-[10px] font-mono text-muted-foreground uppercase block font-bold">Error Profile</span>
              <span className="font-mono font-black text-lg text-foreground">
                {totalTrials - correctTrials} Total
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block mt-1">
                FA: {falseAlarms} | Miss: {misses}
              </span>
            </div>

            <div className="border-2 border-black dark:border-white bg-card p-3 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
              <span className="text-[10px] font-mono text-muted-foreground uppercase block font-bold">IRT Parameter</span>
              <span className="font-mono font-black text-lg text-emerald-500">
                θ Calibrated
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block mt-1">
                Profile updated
              </span>
            </div>
          </div>

          {/* Dedicated Logan & Cowan SSRT Decomposition for Stop Signal Task */}
          {isStopSignal && (
            <div className="border-2 border-black dark:border-white bg-amber-400/10 dark:bg-cyan-400/10 p-4 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-black dark:border-white pb-2">
                <span className="text-xs font-black uppercase text-foreground">
                  ⚡ SSRT Inhibitory Cancellation Decomposition
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  Logan & Cowan (1984) Race Architecture
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="border border-black dark:border-white bg-card p-2">
                  <span className="text-[10px] text-muted-foreground block uppercase">SSRT (Brake Speed)</span>
                  <span className="font-black text-xl text-emerald-500">{estimatedSsrt}ms</span>
                </div>
                <div className="border border-black dark:border-white bg-card p-2">
                  <span className="text-[10px] text-muted-foreground block uppercase">Go Reaction Time</span>
                  <span className="font-black text-xl text-foreground">{meanGoRt}ms</span>
                </div>
                <div className="border border-black dark:border-white bg-card p-2">
                  <span className="text-[10px] text-muted-foreground block uppercase">Mean SSD Delay</span>
                  <span className="font-black text-xl text-foreground">{meanSsd}ms</span>
                </div>
                <div className="border border-black dark:border-white bg-card p-2">
                  <span className="text-[10px] text-muted-foreground block uppercase">Stop Success Rate</span>
                  <span className="font-black text-xl text-foreground">{stopSuccessRate}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Scientific Transfer Impact */}
          <div className="border-2 border-black dark:border-white bg-secondary/30 p-4 space-y-2">
            <span className="text-xs font-mono font-black text-foreground uppercase tracking-wider block">
              // TRANSFER EXPECTATIONS (NO FALSE CLAIMS)
            </span>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              Performance gains on this specific computerized task do not imply general fluid intelligence inflation. Real-world transfer operates through the following specific mechanisms:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs font-mono">
              <div className="border border-black dark:border-white bg-card p-2">
                <span className="text-[10px] text-muted-foreground uppercase block">Near Transfer</span>
                <span className="font-bold text-foreground">{exercise.transferMappings.nearTransferDomain}</span>
              </div>
              <div className="border border-black dark:border-white bg-card p-2">
                <span className="text-[10px] text-muted-foreground uppercase block">Operational Skill</span>
                <span className="font-bold text-foreground">{exercise.transferMappings.realWorldSkill}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t-2 border-black dark:border-white">
            <button
              onClick={() => {
                baseSeedRef.current = Math.floor(Math.random() * 1000000)
                startFormalRun()
              }}
              className="w-full sm:w-auto px-5 py-2.5 border-2 border-black dark:border-white bg-secondary text-foreground font-mono text-xs font-bold uppercase hover:bg-secondary/70 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RETRY WITH NEW SEED</span>
            </button>

            {onExit && (
              <button
                onClick={onExit}
                className="w-full sm:w-auto px-6 py-2.5 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black font-mono text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>RETURN TO ENGINE CATALOG</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}
