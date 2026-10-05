// lib/engine/user-model.ts
/**
 * PERSONAL COGNITIVE MODEL & VULNERABILITY AUDIT
 * Computes latent ability vectors (Theta), tracks multi-dimensional bottlenecks,
 * and procedurally plans tailored daily workouts targeting specific cognitive limits.
 */

import { CognitiveDomain, DifficultyVector, TrialTelemetry, UserCognitiveProfile, ScheduledWorkoutSession } from "./types"
import { EXERCISE_REGISTRY } from "./registry"
import { SeededPRNG } from "./prng"

const STORAGE_KEY_PROFILE = "humaneval_engine_profile_v1"
const STORAGE_KEY_TELEMETRY = "humaneval_engine_telemetry_v1"

export const INITIAL_COGNITIVE_PROFILE: UserCognitiveProfile = {
  latentAbilities: {
    working_memory: 0.0,
    attention_inhibition: 0.0,
    executive_control: 0.0,
    processing_speed: 0.0,
    fluid_reasoning: 0.0,
    quantitative_logic: 0.0,
    linguistic_parsing: 0.0,
    composite: 0.0,
  },
  mechanismStrengths: {
    "Frontoparietal Inhibition": 50,
    "Prepotent Response Suppression": 50,
    "Selective Attention": 50,
    "Spatial Gating": 50,
    "Buffer Updating": 50,
    "Lure Rejection": 50,
    "Dual-Task Time-Sharing": 50,
    "Task-Set Reconfiguration": 50,
    "Hypothesis Generation": 50,
    "Inductive Logic": 50,
    "Base Rate Neglect Suppression": 50,
    "Decision Velocity": 50,
    "Cross-Modal Gating": 50,
  },
  vulnerabilityMatrix: {
    simpleWmVsInterferenceDrop: 0.18, // baseline estimate: 18% drop when lures/interference present
    wmUnderTaskSwitchingDrop: 0.22, // 22% drop under task switching
    speedUnderIncongruenceDrop: 140, // 140ms Stroop slowing effect
    reasoningUnderTimePressureDrop: 0.15, // 15% reasoning drop under deadline
  },
  historyCount: 0,
  lastUpdated: Date.now(),
}

/**
 * Loads the user's cognitive profile from localStorage or initializes default.
 */
export function getUserCognitiveProfile(): UserCognitiveProfile {
  if (typeof window === "undefined") return INITIAL_COGNITIVE_PROFILE
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE)
    if (!raw) return INITIAL_COGNITIVE_PROFILE
    const parsed = JSON.parse(raw) as UserCognitiveProfile
    return {
      ...INITIAL_COGNITIVE_PROFILE,
      ...parsed,
      latentAbilities: {
        ...INITIAL_COGNITIVE_PROFILE.latentAbilities,
        ...(parsed.latentAbilities || {}),
      },
      mechanismStrengths: {
        ...INITIAL_COGNITIVE_PROFILE.mechanismStrengths,
        ...(parsed.mechanismStrengths || {}),
      },
      vulnerabilityMatrix: {
        ...INITIAL_COGNITIVE_PROFILE.vulnerabilityMatrix,
        ...(parsed.vulnerabilityMatrix || {}),
      },
    }
  } catch (err) {
    console.error("Failed to parse cognitive profile from localStorage", err)
    return INITIAL_COGNITIVE_PROFILE
  }
}

/**
 * Persists updated profile to localStorage.
 */
export function saveUserCognitiveProfile(profile: UserCognitiveProfile): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile))
  } catch (err) {
    console.error("Failed to save cognitive profile", err)
  }
}

/**
 * Appends trial telemetry to history log.
 */
export function recordTrialTelemetry(telemetry: TrialTelemetry): void {
  if (typeof window === "undefined") return
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TELEMETRY)
    const history: TrialTelemetry[] = raw ? JSON.parse(raw) : []
    // Keep last 300 trials in rolling ring-buffer
    if (history.length >= 300) history.shift()
    history.push(telemetry)
    localStorage.setItem(STORAGE_KEY_TELEMETRY, JSON.stringify(history))
  } catch (err) {
    console.error("Failed to record trial telemetry", err)
  }
}

/**
 * Returns telemetry history log.
 */
export function getTelemetryHistory(): TrialTelemetry[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TELEMETRY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Computes an item difficulty scalar 'b' (-3.0 to +3.0) from a difficulty vector
 * aligned to the target domain.
 */
function computeItemDifficultyScalar(difficulty: DifficultyVector, domain: CognitiveDomain): number {
  let primaryWeight = 0.5
  switch (domain) {
    case "working_memory":
      primaryWeight = difficulty.memory_load * 0.7 + difficulty.interference * 0.3
      break
    case "attention_inhibition":
      primaryWeight = difficulty.interference * 0.7 + difficulty.processing_speed * 0.3
      break
    case "executive_control":
      primaryWeight = difficulty.switching_cost * 0.6 + difficulty.rule_complexity * 0.4
      break
    case "processing_speed":
      primaryWeight = difficulty.processing_speed * 0.8 + difficulty.rule_complexity * 0.2
      break
    case "fluid_reasoning":
      primaryWeight = difficulty.rule_complexity * 0.5 + difficulty.relational_depth * 0.5
      break
    case "quantitative_logic":
      primaryWeight = difficulty.rule_complexity * 0.6 + difficulty.relational_depth * 0.4
      break
    case "composite":
      primaryWeight = (difficulty.memory_load + difficulty.interference + difficulty.switching_cost) / 3
      break
    default:
      primaryWeight = 0.5
  }
  // Map normalized 0.0..1.0 to IRT Theta difficulty b in [-2.5, +2.5]
  return (primaryWeight - 0.5) * 5.0
}

/**
 * Updates latent ability theta & mechanism scores via Rasch Model IRT update step.
 */
export function updateProfileWithTrial(
  profile: UserCognitiveProfile,
  telemetry: TrialTelemetry
): UserCognitiveProfile {
  const exercise = EXERCISE_REGISTRY[telemetry.exerciseId]
  if (!exercise) return profile

  const domain = exercise.domain
  const currentTheta = profile.latentAbilities[domain] ?? 0.0
  const itemDifficulty_b = computeItemDifficultyScalar(telemetry.difficulty, domain)

  // Rasch model probability of success: P = 1 / (1 + exp(-(theta - b)))
  const expectedP = 1.0 / (1.0 + Math.exp(-(currentTheta - itemDifficulty_b)))
  const observedScore = telemetry.validation.score // 0.0 to 1.0

  // Adaptive learning rate K (dampens with trial count)
  const K = Math.max(0.08, 0.35 / (1.0 + profile.historyCount * 0.03))
  const deltaTheta = K * (observedScore - expectedP)
  const newTheta = Math.max(-3.0, Math.min(3.0, currentTheta + deltaTheta))

  // Update mechanism scores
  const updatedMechanisms = { ...profile.mechanismStrengths }
  for (const mech of exercise.mechanisms) {
    const curMech = updatedMechanisms[mech] ?? 50
    const mechDelta = observedScore > 0.5 ? (observedScore - 0.5) * 4 : -3
    updatedMechanisms[mech] = Math.max(5, Math.min(99, Math.round(curMech + mechDelta)))
  }

  // Update vulnerability matrix based on trial characteristics
  const updatedVulnerabilities = { ...profile.vulnerabilityMatrix }

  // 1. Interference sensitivity
  if (telemetry.difficulty.interference > 0.6) {
    if (!telemetry.validation.isCorrect) {
      updatedVulnerabilities.simpleWmVsInterferenceDrop = Math.min(
        0.5,
        updatedVulnerabilities.simpleWmVsInterferenceDrop + 0.02
      )
    } else {
      updatedVulnerabilities.simpleWmVsInterferenceDrop = Math.max(
        0.05,
        updatedVulnerabilities.simpleWmVsInterferenceDrop - 0.01
      )
    }
  }

  // 2. Switching cost sensitivity
  if (telemetry.difficulty.switching_cost > 0.6) {
    if (!telemetry.validation.isCorrect) {
      updatedVulnerabilities.wmUnderTaskSwitchingDrop = Math.min(
        0.6,
        updatedVulnerabilities.wmUnderTaskSwitchingDrop + 0.02
      )
    } else {
      updatedVulnerabilities.wmUnderTaskSwitchingDrop = Math.max(
        0.05,
        updatedVulnerabilities.wmUnderTaskSwitchingDrop - 0.01
      )
    }
  }

  // 3. Stroop Incongruency slowing
  if (telemetry.exerciseId === "stroop" && telemetry.metadata?.isIncongruent) {
    const baselineSpeed = 450 // expected congruent RT
    const observedSlowing = Math.max(0, telemetry.latencyMs - baselineSpeed)
    updatedVulnerabilities.speedUnderIncongruenceDrop = Math.round(
      updatedVulnerabilities.speedUnderIncongruenceDrop * 0.8 + observedSlowing * 0.2
    )
  }

  const updatedProfile: UserCognitiveProfile = {
    ...profile,
    latentAbilities: {
      ...profile.latentAbilities,
      [domain]: Math.round(newTheta * 100) / 100,
    },
    mechanismStrengths: updatedMechanisms,
    vulnerabilityMatrix: updatedVulnerabilities,
    historyCount: profile.historyCount + 1,
    lastUpdated: Date.now(),
  }

  saveUserCognitiveProfile(updatedProfile)
  return updatedProfile
}

/**
 * Identifies the user's primary cognitive bottleneck based on latent abilities and vulnerability matrix.
 */
export function identifyPrimaryBottleneck(profile: UserCognitiveProfile): {
  weakestDomain: CognitiveDomain
  bottleneckName: string
  diagnosticRationale: string
} {
  const domains: CognitiveDomain[] = [
    "working_memory",
    "attention_inhibition",
    "executive_control",
    "processing_speed",
    "fluid_reasoning",
    "quantitative_logic",
  ]

  // Find lowest theta domain
  let minDomain: CognitiveDomain = "attention_inhibition"
  let minTheta = 999
  for (const d of domains) {
    const val = profile.latentAbilities[d] ?? 0.0
    if (val < minTheta) {
      minTheta = val
      minDomain = d
    }
  }

  // Check vulnerability matrix for specific compound breakdowns
  if (profile.vulnerabilityMatrix.simpleWmVsInterferenceDrop > 0.25) {
    return {
      weakestDomain: "working_memory",
      bottleneckName: "Working Memory Collapse under Distractor Interference",
      diagnosticRationale: `Your retention drops by ${Math.round(
        profile.vulnerabilityMatrix.simpleWmVsInterferenceDrop * 100
      )}% when lures or irrelevant noise are introduced. Pure storage is intact, but active gating fails.`,
    }
  }

  if (profile.vulnerabilityMatrix.wmUnderTaskSwitchingDrop > 0.28) {
    return {
      weakestDomain: "executive_control",
      bottleneckName: "Executive Task-Set Reconfiguration Sluggishness",
      diagnosticRationale: `Switch cost penalty is elevated by ${Math.round(
        profile.vulnerabilityMatrix.wmUnderTaskSwitchingDrop * 100
      )}%. Previous mental models linger, causing perseverative friction when rules flip.`,
    }
  }

  if (profile.vulnerabilityMatrix.speedUnderIncongruenceDrop > 220) {
    return {
      weakestDomain: "attention_inhibition",
      bottleneckName: "High Prepotent Linguistic Reflex Intrusion",
      diagnosticRationale: `Automated word-reading reflex causes an excessive ${profile.vulnerabilityMatrix.speedUnderIncongruenceDrop}ms latency brake on executive focus.`,
    }
  }

  // Domain-specific rationale fallback
  const domainRationale: Record<CognitiveDomain, string> = {
    working_memory: "Working memory buffer maintenance has the lowest latent theta score.",
    attention_inhibition: "Frontoparietal inhibitory braking shows the greatest susceptibility to error.",
    executive_control: "Cognitive flexibility and rule-shifting exhibit high inertial drag.",
    processing_speed: "Motor decision selection latency requires baseline acceleration.",
    fluid_reasoning: "Complex relational binding and inductive extraction need progressive reinforcement.",
    quantitative_logic: "Base-rate calibration and probabilistic updating require deliberate sharpening.",
    linguistic_parsing: "Syntactic parsing depth requires focused exposure.",
    composite: "Cross-modal dual-task synthesis demonstrates systemic load saturation.",
  }

  return {
    weakestDomain: minDomain,
    bottleneckName: `${minDomain.replace("_", " ").toUpperCase()} Attenuation`,
    diagnosticRationale: domainRationale[minDomain] || "Targeting domain with lowest calibration index.",
  }
}

/**
 * Generates a tailored 5-Phase Daily Cognitive Workout targeting the user's specific weaknesses.
 */
export function generateDailyWorkout(
  profile: UserCognitiveProfile,
  customSeed?: number
): ScheduledWorkoutSession {
  const seed = customSeed ?? Math.floor(Math.random() * 1000000)
  const prng = new SeededPRNG(seed)
  const dateStr = new Date().toISOString().split("T")[0]

  const bottleneck = identifyPrimaryBottleneck(profile)

  // Map weakest domain to overload exercises
  const domainExerciseMap: Record<CognitiveDomain, string[]> = {
    working_memory: ["operation_span", "n_back"],
    attention_inhibition: ["stroop", "flanker"],
    executive_control: ["task_switch", "wcst"],
    processing_speed: ["choice_reaction", "flanker"],
    fluid_reasoning: ["progressive_matrices", "wcst"],
    quantitative_logic: ["bayesian_updating", "progressive_matrices"],
    linguistic_parsing: ["stroop", "operation_span"],
    composite: ["composite_stroop_nback", "operation_span"],
  }

  const primaryTargetIds = domainExerciseMap[bottleneck.weakestDomain] || ["stroop"]
  const primaryExerciseId = prng.choice(primaryTargetIds)
  const secondaryExerciseId =
    primaryTargetIds.length > 1
      ? primaryTargetIds.find((id) => id !== primaryExerciseId) || "n_back"
      : "composite_stroop_nback"

  // Base difficulty calibrated to user's latent theta (-3 to +3 converted to 0.2 to 0.8)
  const userTheta = profile.latentAbilities[bottleneck.weakestDomain] ?? 0.0
  const normalizedTheta = Math.max(0.15, Math.min(0.85, (userTheta + 3.0) / 6.0))

  const phases = [
    {
      phaseNumber: 1,
      durationMinutes: 2,
      exerciseId: "choice_reaction",
      exerciseName: EXERCISE_REGISTRY["choice_reaction"].name,
      phaseFocus: "Neuromotor Warmup & Saccade Activation",
      targetDifficulty: {
        ...EXERCISE_REGISTRY["choice_reaction"].defaultDifficulty,
        processing_speed: 0.6,
        rule_complexity: 0.3,
      },
    },
    {
      phaseNumber: 2,
      durationMinutes: 3,
      exerciseId: primaryExerciseId,
      exerciseName: EXERCISE_REGISTRY[primaryExerciseId].name,
      phaseFocus: "Diagnostic Baseline Probe (Zero Distractors)",
      targetDifficulty: {
        ...EXERCISE_REGISTRY[primaryExerciseId].defaultDifficulty,
        interference: 0.2,
        memory_load: normalizedTheta,
      },
    },
    {
      phaseNumber: 3,
      durationMinutes: 6,
      exerciseId: primaryExerciseId,
      exerciseName: EXERCISE_REGISTRY[primaryExerciseId].name,
      phaseFocus: "Targeted Weakness Overload (High Interference/Switching)",
      targetDifficulty: {
        ...EXERCISE_REGISTRY[primaryExerciseId].defaultDifficulty,
        interference: Math.min(0.9, normalizedTheta + 0.3),
        switching_cost: Math.min(0.9, normalizedTheta + 0.25),
        memory_load: Math.min(0.9, normalizedTheta + 0.2),
      },
    },
    {
      phaseNumber: 4,
      durationMinutes: 4,
      exerciseId: secondaryExerciseId,
      exerciseName: EXERCISE_REGISTRY[secondaryExerciseId].name,
      phaseFocus: "Near-Transfer Stress Under Novel Context",
      targetDifficulty: {
        ...EXERCISE_REGISTRY[secondaryExerciseId].defaultDifficulty,
        relational_depth: Math.min(0.85, normalizedTheta + 0.15),
        processing_speed: 0.7,
      },
    },
    {
      phaseNumber: 5,
      durationMinutes: 3,
      exerciseId: "bayesian_updating",
      exerciseName: EXERCISE_REGISTRY["bayesian_updating"].name,
      phaseFocus: "Metacognitive Calibration & Rational Evidence Audit",
      targetDifficulty: {
        ...EXERCISE_REGISTRY["bayesian_updating"].defaultDifficulty,
        rule_complexity: 0.7,
      },
    },
  ]

  return {
    sessionId: `workout_${dateStr}_${seed}`,
    date: dateStr,
    seed,
    primaryWeakness: bottleneck.bottleneckName,
    diagnosticRationale: bottleneck.diagnosticRationale,
    phases,
  }
}
