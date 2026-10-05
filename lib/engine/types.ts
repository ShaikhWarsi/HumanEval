// lib/engine/types.ts

export type CognitiveDomain =
  | "working_memory"
  | "attention_inhibition"
  | "executive_control"
  | "processing_speed"
  | "fluid_reasoning"
  | "quantitative_logic"
  | "linguistic_parsing"
  | "composite"

export type PoolType = "training" | "practice" | "assessment"

/**
 * Multidimensional Difficulty Vector.
 * Instead of scalar difficulty (1, 2, 3), tasks manipulate independent cognitive dimensions.
 */
export interface DifficultyVector {
  memory_load: number // 0.0 to 1.0 (digit count, n-level, items to maintain)
  processing_speed: number // 0.0 to 1.0 (stimulus presentation duration, response deadline)
  interference: number // 0.0 to 1.0 (semantic conflict, lures, incongruency)
  rule_complexity: number // 0.0 to 1.0 (single rule to compound conditional logic)
  relational_depth: number // 0.0 to 1.0 (unary to 4-ary premise coordination)
  switching_cost: number // 0.0 to 1.0 (frequency of paradigm rule alternation)
  distractor_density: number // 0.0 to 1.0 (visual/auditory flankers or background noise)
}

export interface CognitiveContract {
  trainingTarget: string
  whatYouDo: string
  whatMatters: string
  whatIsMeasured: string[]
}

export interface DemonstrationStep {
  stepNumber: number
  stimulusSummary: string
  guidance: string
  demonstrationAction: string
  expectedOutcome: string
}

export interface GenerateContext {
  difficulty: DifficultyVector
  seed: number
  pool: PoolType
  trialIndex?: number
  parameters?: Record<string, any>
}

export interface TrialValidation {
  isCorrect: boolean
  score: number // Normalized 0.0 to 1.0
  expected: any
  actual: any
  errorType?: "miss" | "false_alarm" | "intrusion" | "slow_timeout" | "syntax_error"
  feedback?: string
}

export interface TrialTelemetry {
  trialId: string
  exerciseId: string
  seed: number
  pool: PoolType
  timestamp: number
  latencyMs: number
  validation: TrialValidation
  difficulty: DifficultyVector
  metadata: Record<string, any>
}

export interface TrialData<TStimulus = any, TAnswer = any> {
  trialId: string
  exerciseId: string
  seed: number
  pool: PoolType
  difficulty: DifficultyVector
  stimulus: TStimulus
  expectedAnswer: TAnswer
  options?: any[]
  timeLimitMs: number
  stimulusDurationMs?: number
  metadata: Record<string, any>
}

export interface ExerciseDefinition<TStimulus = any, TAnswer = any> {
  id: string
  name: string
  domain: CognitiveDomain
  categoryName: string
  mechanisms: string[]
  cognitiveContract: CognitiveContract
  defaultDifficulty: DifficultyVector
  generate(ctx: GenerateContext): TrialData<TStimulus, TAnswer>
  validate(response: any, expected: TAnswer, metadata?: Record<string, any>): TrialValidation
  generateDemonstration(): DemonstrationStep[]
  transferMappings: {
    nearTransferDomain: string
    farTransferDomain: string
    realWorldSkill: string
  }
}

export interface UserCognitiveProfile {
  latentAbilities: Record<CognitiveDomain, number> // Theta parameters (-3.0 to +3.0)
  mechanismStrengths: Record<string, number> // 0 to 100 percentiles
  vulnerabilityMatrix: {
    simpleWmVsInterferenceDrop: number // e.g. -24% drop when distractors present
    wmUnderTaskSwitchingDrop: number // e.g. -31% drop when switching rules
    speedUnderIncongruenceDrop: number // Stroop slowing effect in ms
    reasoningUnderTimePressureDrop: number // Accuracy deterioration under deadline
  }
  historyCount: number
  lastUpdated: number
}

export interface ScheduledWorkoutSession {
  sessionId: string
  date: string
  seed: number
  primaryWeakness: string
  diagnosticRationale: string
  phases: {
    phaseNumber: number
    durationMinutes: number
    exerciseId: string
    exerciseName: string
    phaseFocus: string
    targetDifficulty: DifficultyVector
  }[]
}
