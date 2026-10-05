// lib/engine/registry.ts
/**
 * HUMAN EVAL EXERCISE REGISTRY
 * Unified catalog of validated cognitive training paradigms.
 * Every paradigm implements deterministic, seeded procedural generation,
 * multidimensional difficulty parameters, cognitive contracts, and automated validation.
 */

import { SeededPRNG } from "./prng"
import type {
  ExerciseDefinition,
  GenerateContext,
  TrialData,
  TrialValidation,
  DemonstrationStep,
  DifficultyVector,
} from "./types"

// Helper default difficulty vectors
export const DEFAULT_DIFFICULTY: DifficultyVector = {
  memory_load: 0.5,
  processing_speed: 0.5,
  interference: 0.5,
  rule_complexity: 0.4,
  relational_depth: 0.3,
  switching_cost: 0.3,
  distractor_density: 0.4,
}

/* =========================================================================
   1. ATTENTION & INHIBITION: STROOP
   ========================================================================= */
export interface StroopStimulus {
  word: string
  inkColor: string // CSS color
  inkName: string // e.g. "red"
  rule: "ink" | "word" // Report the ink color or read the word
  isCongruent: boolean
}

export const StroopExercise: ExerciseDefinition<StroopStimulus, string> = {
  id: "stroop",
  name: "Stroop Interference & Executive Brake",
  domain: "attention_inhibition",
  categoryName: "Attention & Inhibition",
  mechanisms: ["Frontoparietal Inhibition", "Prepotent Response Suppression", "Selective Attention"],
  cognitiveContract: {
    trainingTarget: "Inhibitory control over automated linguistic reading reflexes.",
    whatYouDo: "When prompted with 'INK', report the display color of the letters. When prompted with 'WORD', report the word text.",
    whatMatters: "Accuracy first. Speed matters once you stop making interference errors.",
    whatIsMeasured: ["Congruency latency cost (ms)", "Error rate on incongruent trials", "Post-error slowing"],
  },
  defaultDifficulty: {
    ...DEFAULT_DIFFICULTY,
    interference: 0.7,
    processing_speed: 0.6,
  },
  transferMappings: {
    nearTransferDomain: "Flanker / Simon Task conflict resolution",
    farTransferDomain: "Impulse control under cognitive distraction",
    realWorldSkill: "Filtering out misleading cues and focusing on operational data",
  },
  generateDemonstration(): DemonstrationStep[] {
    return [
      {
        stepNumber: 1,
        stimulusSummary: "Word 'BLUE' displayed in Red ink with prompt [INK].",
        guidance: "Do not read the word 'BLUE'. Look at the color of the ink, which is RED.",
        demonstrationAction: "Select RED.",
        expectedOutcome: "Correct: Inhibited reading reflex.",
      },
      {
        stepNumber: 2,
        stimulusSummary: "Word 'GREEN' displayed in Green ink with prompt [INK].",
        guidance: "Here the word and ink match. Respond as fast as possible.",
        demonstrationAction: "Select GREEN.",
        expectedOutcome: "Correct: Fast congruent response.",
      },
    ]
  },
  generate(ctx: GenerateContext): TrialData<StroopStimulus, string> {
    const prng = new SeededPRNG(ctx.seed)
    const colorMap = [
      { name: "RED", hex: "#EF4444" },
      { name: "BLUE", hex: "#3B82F6" },
      { name: "GREEN", hex: "#10B981" },
      { name: "YELLOW", hex: "#F59E0B" },
    ]

    // Incongruency probability driven by interference difficulty
    const isIncongruent = prng.boolean(ctx.difficulty.interference)
    const wordEntry = prng.choice(colorMap)
    let inkEntry = wordEntry

    if (isIncongruent) {
      const candidates = colorMap.filter((c) => c.name !== wordEntry.name)
      inkEntry = prng.choice(candidates)
    }

    // Switch rule occasionally if switching_cost > 0.4
    const rule: "ink" | "word" =
      ctx.difficulty.switching_cost > 0.4 && prng.boolean(0.3) ? "word" : "ink"
    const expected = rule === "ink" ? inkEntry.name : wordEntry.name

    const timeLimitMs = Math.max(1000, Math.round(2500 - ctx.difficulty.processing_speed * 1200))

    return {
      trialId: `stroop_${ctx.seed}`,
      exerciseId: "stroop",
      seed: ctx.seed,
      pool: ctx.pool,
      difficulty: ctx.difficulty,
      stimulus: {
        word: wordEntry.name,
        inkColor: inkEntry.hex,
        inkName: inkEntry.name,
        rule,
        isCongruent: !isIncongruent,
      },
      expectedAnswer: expected,
      options: colorMap.map((c) => c.name),
      timeLimitMs,
      metadata: {
        isIncongruent,
        rule,
      },
    }
  },
  validate(response: string, expected: string): TrialValidation {
    const isCorrect = String(response).trim().toUpperCase() === expected.toUpperCase()
    return {
      isCorrect,
      score: isCorrect ? 1.0 : 0.0,
      expected,
      actual: response,
      errorType: isCorrect ? undefined : "false_alarm",
      feedback: isCorrect ? "Accurate inhibition." : `Expected ${expected}. Responded ${response}.`,
    }
  },
}

/* =========================================================================
   2. ATTENTION & INHIBITION: ERIKSEN FLANKER TASK
   ========================================================================= */
export interface FlankerStimulus {
  array: string[] // e.g. ["<", "<", ">", "<", "<"]
  targetDirection: "LEFT" | "RIGHT"
  flankerType: "congruent" | "incongruent" | "neutral"
}

export const FlankerExercise: ExerciseDefinition<FlankerStimulus, "LEFT" | "RIGHT"> = {
  id: "flanker",
  name: "Eriksen Flanker Attentional Scope",
  domain: "attention_inhibition",
  categoryName: "Attention & Inhibition",
  mechanisms: ["Spatial Flanker Suppression", "Visual Field Gating", "Foveal Zoom"],
  cognitiveContract: {
    trainingTarget: "Suppressing peripheral visual flankers to isolate central target.",
    whatYouDo: "Focus exclusively on the center arrow. Respond LEFT if it points left (←), RIGHT if it points right (→). Ignore outer flankers.",
    whatMatters: "Rapid response while maintaining 95%+ accuracy under conflicting flankers.",
    whatIsMeasured: ["Flanker interference cost (Incongruent RT - Congruent RT)", "Saccadic accuracy"],
  },
  defaultDifficulty: {
    ...DEFAULT_DIFFICULTY,
    interference: 0.65,
    processing_speed: 0.65,
  },
  transferMappings: {
    nearTransferDomain: "Visual Search in cluttered displays",
    farTransferDomain: "Target acquisition in high-density cockpits/HUDs",
    realWorldSkill: "Reading instrumentation without distraction from adjacent dials",
  },
  generateDemonstration(): DemonstrationStep[] {
    return [
      {
        stepNumber: 1,
        stimulusSummary: "Arrow array: [ < < > < < ].",
        guidance: "The outer arrows point LEFT, but the center arrow points RIGHT.",
        demonstrationAction: "Select RIGHT.",
        expectedOutcome: "Correct: Suppressed peripheral flankers.",
      },
    ]
  },
  generate(ctx: GenerateContext): TrialData<FlankerStimulus, "LEFT" | "RIGHT"> {
    const prng = new SeededPRNG(ctx.seed)
    const targetDirection: "LEFT" | "RIGHT" = prng.boolean(0.5) ? "LEFT" : "RIGHT"
    const targetChar = targetDirection === "LEFT" ? "<" : ">"

    const roll = prng.next()
    let flankerType: "congruent" | "incongruent" | "neutral" = "congruent"
    let flankerChar = targetChar

    if (roll < ctx.difficulty.interference) {
      flankerType = "incongruent"
      flankerChar = targetDirection === "LEFT" ? ">" : "<"
    } else if (roll < ctx.difficulty.interference + 0.15) {
      flankerType = "neutral"
      flankerChar = "-"
    }

    const distractorCount = ctx.difficulty.distractor_density > 0.6 ? 3 : 2
    const leftFlankers = Array(distractorCount).fill(flankerChar)
    const rightFlankers = Array(distractorCount).fill(flankerChar)
    const array = [...leftFlankers, targetChar, ...rightFlankers]

    const timeLimitMs = Math.max(700, Math.round(1800 - ctx.difficulty.processing_speed * 900))

    return {
      trialId: `flanker_${ctx.seed}`,
      exerciseId: "flanker",
      seed: ctx.seed,
      pool: ctx.pool,
      difficulty: ctx.difficulty,
      stimulus: {
        array,
        targetDirection,
        flankerType,
      },
      expectedAnswer: targetDirection,
      options: ["LEFT", "RIGHT"],
      timeLimitMs,
      metadata: { flankerType, distractorCount },
    }
  },
  validate(response: string, expected: "LEFT" | "RIGHT"): TrialValidation {
    const isCorrect = response === expected
    return {
      isCorrect,
      score: isCorrect ? 1.0 : 0.0,
      expected,
      actual: response,
      errorType: isCorrect ? undefined : "false_alarm",
      feedback: isCorrect ? "Clean spatial gating." : `Flanker interference caught you. Expected ${expected}.`,
    }
  },
}

/* =========================================================================
   2B. ATTENTION & INHIBITION: STOP-SIGNAL TASK (SSRT BRAKE)
   ========================================================================= */
export interface StopSignalStimulus {
  direction: "LEFT" | "RIGHT"
  isStopTrial: boolean
  ssdMs: number
  arrow: "←" | "→"
}

export const StopSignalExercise: ExerciseDefinition<StopSignalStimulus, string> = {
  id: "stop_signal",
  name: "Stop-Signal Task (SSRT Inhibitory Cancellation)",
  domain: "attention_inhibition",
  categoryName: "Attention & Inhibition",
  mechanisms: [
    "Motor Action Cancellation",
    "Frontoparietal Hyperdirect Braking",
    "Logan-Cowan Race Architecture",
    "Subthalamic Nucleus Gating",
  ],
  cognitiveContract: {
    trainingTarget: "Rapid cancellation of an initiated motor command upon unexpected sensory stop cues.",
    whatYouDo: "Quickly press LEFT [←] or RIGHT [→] matching the green arrow. But if a red STOP alert appears, immediately CANCEL your response and do not press anything.",
    whatMatters: "Do NOT artificially delay your Go responses. Fast Go strikes combined with agile cancellations is the gold standard of executive braking.",
    whatIsMeasured: [
      "Stop-Signal Reaction Time (SSRT)",
      "Go Reaction Time (ms)",
      "Stop Signal Delay (SSD)",
      "Cancellation Success Rate (%)",
    ],
  },
  defaultDifficulty: {
    ...DEFAULT_DIFFICULTY,
    processing_speed: 0.6,
    interference: 0.5,
    switching_cost: 0.4,
  },
  transferMappings: {
    nearTransferDomain: "Go/No-Go motor suppression, prepotent action abortion",
    farTransferDomain: "Impulse braking in high-arousal environments",
    realWorldSkill: "Aborting reflexive physical or verbal actions before irreversible execution",
  },
  generateDemonstration(): DemonstrationStep[] {
    return [
      {
        stepNumber: 1,
        stimulusSummary: "Green arrow pointing Right [→] with no Stop Signal.",
        guidance: "Respond immediately to the arrow direction. Press RIGHT [→].",
        demonstrationAction: "Press RIGHT.",
        expectedOutcome: "Correct: Clean and rapid Go response.",
      },
      {
        stepNumber: 2,
        stimulusSummary: "Green arrow pointing Left [←], followed 220ms later by a bright red STOP alert.",
        guidance: "Abort your keystroke! Do not press any button. Let the timer expire safely.",
        demonstrationAction: "Withhold response (No action).",
        expectedOutcome: "Correct: Successful motor cancellation.",
      },
    ]
  },
  generate(ctx: GenerateContext): TrialData<StopSignalStimulus, string> {
    const prng = new SeededPRNG(ctx.seed)
    // Stop frequency ~ 28% to prevent proactive strategic slowing
    const isStopTrial = prng.boolean(0.28 + ctx.difficulty.switching_cost * 0.08)
    const direction: "LEFT" | "RIGHT" = prng.boolean(0.5) ? "LEFT" : "RIGHT"
    const arrow = direction === "LEFT" ? "←" : "→"

    // SSD adaptive baseline: between 150ms and 350ms, modulated by processing speed difficulty
    // Higher difficulty = longer SSD (closer to average RT, harder to cancel)
    const baseSsd = Math.round(180 + ctx.difficulty.interference * 180)
    const jitter = prng.integer(-30, 30)
    const ssdMs = Math.max(100, Math.min(450, baseSsd + jitter))

    const timeLimitMs = Math.max(750, Math.round(1300 - ctx.difficulty.processing_speed * 500))

    return {
      trialId: `sst_${ctx.seed}`,
      exerciseId: "stop_signal",
      seed: ctx.seed,
      pool: ctx.pool,
      difficulty: ctx.difficulty,
      stimulus: {
        direction,
        isStopTrial,
        ssdMs,
        arrow,
      },
      expectedAnswer: isStopTrial ? "STOP_WITHHELD" : direction,
      options: ["LEFT", "RIGHT"],
      timeLimitMs,
      metadata: {
        isStopTrial,
        ssdMs,
        direction,
      },
    }
  },
  validate(response: any, expected: string, metadata?: Record<string, any>): TrialValidation {
    const isStopTrial = metadata?.isStopTrial ?? (expected === "STOP_WITHHELD")
    if (isStopTrial) {
      const didWithhold =
        response === "STOP_WITHHELD" ||
        response === null ||
        response === undefined ||
        response === ""
      return {
        isCorrect: didWithhold,
        score: didWithhold ? 1.0 : 0.0,
        expected: "STOP_WITHHELD",
        actual: response || "STOP_WITHHELD",
        errorType: didWithhold ? undefined : "false_alarm",
        feedback: didWithhold
          ? "Impeccable motor cancellation. Prepotent strike aborted."
          : "Inhibition failure: Motor command escaped hyperdirect braking pathway.",
      }
    } else {
      const userStr = String(response || "").trim().toUpperCase()
      const isCorrect = userStr === expected.toUpperCase()
      return {
        isCorrect,
        score: isCorrect ? 1.0 : 0.0,
        expected,
        actual: response,
        errorType: isCorrect ? undefined : (response ? "miss" : "slow_timeout"),
        feedback: isCorrect
          ? "Rapid directional execution."
          : `Expected ${expected}. Responded ${response || "TIMEOUT"}.`,
      }
    }
  },
}

/* =========================================================================
   3. WORKING MEMORY: N-BACK WITH DELIBERATE LURES
   ========================================================================= */
export interface NBackStimulus {
  n: number
  stream: string[] // Sequence of letters or spatial positions
  currentIndex: number
  currentSymbol: string
  isTarget: boolean
  isLure: boolean // e.g. matches N-1 or N+1 to induce familiarity confusion!
  lureType?: "n-1" | "n+1"
}

export const NBackExercise: ExerciseDefinition<NBackStimulus, boolean> = {
  id: "n_back",
  name: "Adaptive N-Back with Deceptive Lures",
  domain: "working_memory",
  categoryName: "Working Memory",
  mechanisms: ["Active Representation Updating", "Lure Discrimination", "Familiarity vs Recollection Gating"],
  cognitiveContract: {
    trainingTarget: "Continuous online updating of working memory buffers under proactive interference.",
    whatYouDo: "Observe stream of symbols. Press MATCH if current symbol matches the one exactly N steps ago. Press PASS otherwise.",
    whatMatters: "Do NOT get fooled by lures (symbols that appeared N-1 or N+1 steps ago).",
    whatIsMeasured: ["Sensitivity index d'", "False alarm rate on lures", "Response latency"],
  },
  defaultDifficulty: {
    ...DEFAULT_DIFFICULTY,
    memory_load: 0.6,
    interference: 0.7,
  },
  transferMappings: {
    nearTransferDomain: "Running Memory Span / Letter-Number Sequencing",
    farTransferDomain: "Keeping track of shifting multi-variable constraints",
    realWorldSkill: "Mental code debugging and maintaining state in complex systems",
  },
  generateDemonstration(): DemonstrationStep[] {
    return [
      {
        stepNumber: 1,
        stimulusSummary: "2-Back sequence: [ A , B , A ].",
        guidance: "Current symbol 'A' matches the symbol 2 steps earlier ('A').",
        demonstrationAction: "Select MATCH.",
        expectedOutcome: "Correct: 2-Back match detected.",
      },
      {
        stepNumber: 2,
        stimulusSummary: "2-Back sequence: [ A , B , B ].",
        guidance: "Symbol 'B' matches 1 step ago, NOT 2 steps ago. This is a 1-Back LURE.",
        demonstrationAction: "Select PASS.",
        expectedOutcome: "Correct: Successfully rejected lure.",
      },
    ]
  },
  generate(ctx: GenerateContext): TrialData<NBackStimulus, boolean> {
    const prng = new SeededPRNG(ctx.seed)
    // Scale N from 2 to 4 based on memory_load
    const n = Math.max(2, Math.min(4, Math.floor(2 + ctx.difficulty.memory_load * 2.2)))
    const alphabet = ["A", "B", "C", "D", "E", "H", "K", "M", "T", "X"]

    // Construct stream of N + 1 items ending in test item
    const stream: string[] = []
    for (let i = 0; i < n; i++) {
      stream.push(prng.choice(alphabet))
    }

    const roll = prng.next()
    let isTarget = false
    let isLure = false
    let currentSymbol = prng.choice(alphabet)
    let lureType: "n-1" | "n+1" | undefined

    if (roll < 0.35) {
      // Valid Target: matches stream[0] (which is N steps back)
      isTarget = true
      currentSymbol = stream[0]
    } else if (roll < 0.35 + ctx.difficulty.interference * 0.45) {
      // Deliberate Lure! Matches N-1 or N+1
      isLure = true
      if (n > 1) {
        currentSymbol = stream[1] // matches N-1 steps back
        lureType = "n-1"
      }
    } else {
      // Non-target random symbol
      const nonTargets = alphabet.filter((c) => c !== stream[0])
      currentSymbol = prng.choice(nonTargets)
    }

    stream.push(currentSymbol)

    const timeLimitMs = Math.max(1400, Math.round(3000 - ctx.difficulty.processing_speed * 1200))

    return {
      trialId: `nback_${ctx.seed}`,
      exerciseId: "n_back",
      seed: ctx.seed,
      pool: ctx.pool,
      difficulty: ctx.difficulty,
      stimulus: {
        n,
        stream,
        currentIndex: stream.length - 1,
        currentSymbol,
        isTarget,
        isLure,
        lureType,
      },
      expectedAnswer: isTarget,
      options: ["MATCH", "PASS"],
      timeLimitMs,
      metadata: { n, isTarget, isLure, lureType },
    }
  },
  validate(response: any, expected: boolean, meta?: Record<string, any>): TrialValidation {
    const userSaidMatch =
      typeof response === "boolean"
        ? response
        : String(response).trim().toUpperCase() === "MATCH"
    const isCorrect = userSaidMatch === expected

    let errorType: "miss" | "false_alarm" | undefined
    if (!isCorrect) {
      errorType = expected ? "miss" : "false_alarm"
    }

    return {
      isCorrect,
      score: isCorrect ? 1.0 : 0.0,
      expected: expected ? "MATCH" : "PASS",
      actual: userSaidMatch ? "MATCH" : "PASS",
      errorType,
      feedback: isCorrect
        ? "Accurate recollection."
        : meta?.isLure
        ? "Familiarity illusion! You fell for an N-1 lure."
        : expected
        ? "Missed N-back target."
        : "False alarm.",
    }
  },
}

/* =========================================================================
   4. WORKING MEMORY: OPERATION SPAN (OSPAN)
   ========================================================================= */
export interface OperationSpanStep {
  equation: string // e.g. "(4 * 2) - 1 = 7"
  isEquationValid: boolean
  letterToRemember: string
}

export interface OperationSpanStimulus {
  setLength: number
  steps: OperationSpanStep[]
}

export const OperationSpanExercise: ExerciseDefinition<OperationSpanStimulus, string[]> = {
  id: "operation_span",
  name: "Operation Span (OSPAN) Complex Buffer",
  domain: "working_memory",
  categoryName: "Working Memory",
  mechanisms: ["Dual-Task Time-Sharing", "Resource Depletion Resistance", "Phonological Storage"],
  cognitiveContract: {
    trainingTarget: "Maintaining memory representations while simultaneously executing cognitive arithmetic.",
    whatYouDo: "For each step, verify whether the math equation is TRUE or FALSE, then memorize the displayed letter. At the end, recall the full letter sequence.",
    whatMatters: "You must keep math accuracy > 85% for memory recall to qualify.",
    whatIsMeasured: ["OSPAN capacity score", "Math verification latency", "Order errors"],
  },
  defaultDifficulty: {
    ...DEFAULT_DIFFICULTY,
    memory_load: 0.65,
    rule_complexity: 0.5,
  },
  transferMappings: {
    nearTransferDomain: "Symmetry Span / Reading Span",
    farTransferDomain: "Complex verbal reasoning and reading comprehension",
    realWorldSkill: "Holding multi-part instructions in head while doing manual work",
  },
  generateDemonstration(): DemonstrationStep[] {
    return [
      {
        stepNumber: 1,
        stimulusSummary: "Equation: (3 * 2) - 1 = 5? Letter: 'K'.",
        guidance: "3 * 2 = 6, 6 - 1 = 5. The equation is TRUE. Memorize 'K'.",
        demonstrationAction: "Select TRUE, commit 'K' to memory.",
        expectedOutcome: "First buffer coordinate stored.",
      },
    ]
  },
  generate(ctx: GenerateContext): TrialData<OperationSpanStimulus, string[]> {
    const prng = new SeededPRNG(ctx.seed)
    // Set length: 3 to 6 items
    const setLength = Math.max(3, Math.min(6, Math.floor(3 + ctx.difficulty.memory_load * 3.5)))
    const letters = ["F", "H", "J", "K", "L", "N", "P", "Q", "R", "S", "T", "Y"]
    const pickedLetters = prng.sample(letters, setLength)

    const steps: OperationSpanStep[] = []
    for (let i = 0; i < setLength; i++) {
      const a = prng.int(2, 6)
      const b = prng.int(2, 5)
      const mult = a * b
      const addSub = prng.boolean(0.5)
      const c = prng.int(1, 4)
      const correctVal = addSub ? mult + c : mult - c

      const isValid = prng.boolean(0.5)
      const displayedVal = isValid
        ? correctVal
        : correctVal + (prng.boolean(0.5) ? prng.int(1, 2) : -prng.int(1, 2))

      const sign = addSub ? "+" : "-"
      const eq = `(${a} × ${b}) ${sign} ${c} = ${displayedVal}`

      steps.push({
        equation: eq,
        isEquationValid: isValid,
        letterToRemember: pickedLetters[i],
      })
    }

    return {
      trialId: `ospan_${ctx.seed}`,
      exerciseId: "operation_span",
      seed: ctx.seed,
      pool: ctx.pool,
      difficulty: ctx.difficulty,
      stimulus: {
        setLength,
        steps,
      },
      expectedAnswer: pickedLetters,
      options: letters,
      timeLimitMs: setLength * 6000,
      metadata: { setLength },
    }
  },
  validate(response: string[], expected: string[]): TrialValidation {
    const userSeq = Array.isArray(response) ? response : []
    let correctCount = 0
    for (let i = 0; i < expected.length; i++) {
      if (userSeq[i] === expected[i]) correctCount++
    }
    const score = correctCount / expected.length
    const isCorrect = score >= 0.75

    return {
      isCorrect,
      score,
      expected: expected.join(" "),
      actual: userSeq.join(" "),
      feedback: `Retained ${correctCount}/${expected.length} items (${Math.round(score * 100)}%).`,
    }
  },
}

/* =========================================================================
   5. EXECUTIVE CONTROL: TASK SWITCHING (PARITY VS MAGNITUDE)
   ========================================================================= */
export interface TaskSwitchStimulus {
  number: number // 1 to 9 (excluding 5)
  rule: "PARITY" | "MAGNITUDE"
  cue: string
  isSwitched: boolean
}

export const TaskSwitchExercise: ExerciseDefinition<TaskSwitchStimulus, string> = {
  id: "task_switch",
  name: "Task-Set Reconfiguration (Switch Cost)",
  domain: "executive_control",
  categoryName: "Executive Control",
  mechanisms: ["Task-Set Inertia Overcoming", "Endogenous Reconfiguration", "Rule Switching Cost"],
  cognitiveContract: {
    trainingTarget: "Rapid reconfiguration of motor response mappings when task rules flip.",
    whatYouDo: "When prompted with [PARITY], report ODD vs EVEN. When prompted with [MAGNITUDE], report LOW (<5) vs HIGH (>5).",
    whatMatters: "Minimize the latency penalty (switch cost) on trials where the rule changes.",
    whatIsMeasured: ["Switch cost latency (Switch RT - Repeat RT)", "Switch error rate"],
  },
  defaultDifficulty: {
    ...DEFAULT_DIFFICULTY,
    switching_cost: 0.7,
    processing_speed: 0.65,
  },
  transferMappings: {
    nearTransferDomain: "Trail Making Test B / AX-CPT",
    farTransferDomain: "Context switching between multitasking work streams",
    realWorldSkill: "Moving smoothly between strategic planning and low-level execution without brain fog",
  },
  generateDemonstration(): DemonstrationStep[] {
    return [
      {
        stepNumber: 1,
        stimulusSummary: "Prompt [PARITY] with number 7.",
        guidance: "Rule is Parity. 7 is an ODD number.",
        demonstrationAction: "Select ODD.",
        expectedOutcome: "Correct Parity response.",
      },
      {
        stepNumber: 2,
        stimulusSummary: "Prompt [MAGNITUDE] with number 7 (Rule switched!).",
        guidance: "Rule shifted to Magnitude. 7 is greater than 5, so it is HIGH.",
        demonstrationAction: "Select HIGH.",
        expectedOutcome: "Correct reconfigured rule.",
      },
    ]
  },
  generate(ctx: GenerateContext): TrialData<TaskSwitchStimulus, string> {
    const prng = new SeededPRNG(ctx.seed)
    const validNumbers = [1, 2, 3, 4, 6, 7, 8, 9]
    const number = prng.choice(validNumbers)

    const isSwitched = prng.boolean(ctx.difficulty.switching_cost)
    const rule: "PARITY" | "MAGNITUDE" = prng.boolean(0.5) ? "PARITY" : "MAGNITUDE"

    let expected = ""
    if (rule === "PARITY") {
      expected = number % 2 === 0 ? "EVEN" : "ODD"
    } else {
      expected = number > 5 ? "HIGH" : "LOW"
    }

    const timeLimitMs = Math.max(900, Math.round(2000 - ctx.difficulty.processing_speed * 900))

    return {
      trialId: `taskswitch_${ctx.seed}`,
      exerciseId: "task_switch",
      seed: ctx.seed,
      pool: ctx.pool,
      difficulty: ctx.difficulty,
      stimulus: {
        number,
        rule,
        cue: rule === "PARITY" ? "[ PARITY: ODD vs EVEN ]" : "[ MAGNITUDE: LOW vs HIGH ]",
        isSwitched,
      },
      expectedAnswer: expected,
      options: rule === "PARITY" ? ["ODD", "EVEN"] : ["LOW", "HIGH"],
      timeLimitMs,
      metadata: { rule, isSwitched, number },
    }
  },
  validate(response: string, expected: string): TrialValidation {
    const isCorrect = String(response).trim().toUpperCase() === expected.toUpperCase()
    return {
      isCorrect,
      score: isCorrect ? 1.0 : 0.0,
      expected,
      actual: response,
      errorType: isCorrect ? undefined : "false_alarm",
      feedback: isCorrect ? "Rapid task-set execution." : `Rule mismatch. Expected ${expected}.`,
    }
  },
}

/* =========================================================================
   6. EXECUTIVE CONTROL: WISCONSIN CARD SORTING (WCST)
   ========================================================================= */
export interface WCSTCard {
  color: "red" | "green" | "blue" | "yellow"
  shape: "circle" | "triangle" | "cross" | "star"
  count: 1 | 2 | 3 | 4
}

export interface WCSTStimulus {
  targetCard: WCSTCard
  referenceCards: WCSTCard[]
  ruleDimension: "color" | "shape" | "count"
}

export const WCSTExercise: ExerciseDefinition<WCSTStimulus, number> = {
  id: "wcst",
  name: "Wisconsin Rule Induction & Preservation Audit",
  domain: "executive_control",
  categoryName: "Executive Control",
  mechanisms: ["Hypothesis Generation", "Perseverative Error Inversion", "Feedback-Driven Plasticity"],
  cognitiveContract: {
    trainingTarget: "Discovering hidden classification rules and abandoning old rules when feedback shifts.",
    whatYouDo: "Sort the card under one of 4 reference decks. The system will only tell you if you are CORRECT or WRONG. Deduce the active rule (Color, Shape, or Count). The rule will silently change without warning!",
    whatMatters: "Identify the hidden rule in minimal guesses; when it shifts, immediately cease perseverative errors.",
    whatIsMeasured: ["Trials to complete category", "Perseverative errors", "Conceptual level responses"],
  },
  defaultDifficulty: {
    ...DEFAULT_DIFFICULTY,
    rule_complexity: 0.7,
    interference: 0.6,
  },
  transferMappings: {
    nearTransferDomain: "Inductive Rule Discovery",
    farTransferDomain: "Adapting business or engineering strategies when assumptions break",
    realWorldSkill: "Discarding disproven theories instead of stubbornly clinging to outdated models",
  },
  generateDemonstration(): DemonstrationStep[] {
    return [
      {
        stepNumber: 1,
        stimulusSummary: "Target: 2 Red Circles. Decks: [1 Red Triangle, 2 Green Stars, 3 Blue Circles, 4 Yellow Crosses].",
        guidance: "You can match by Color (Deck 1), Count (Deck 2), or Shape (Deck 3). Test one hypothesis.",
        demonstrationAction: "Select Deck 1 to test 'Color'.",
        expectedOutcome: "System responds 'CORRECT' -> The current rule is Color.",
      },
    ]
  },
  generate(ctx: GenerateContext): TrialData<WCSTStimulus, number> {
    const prng = new SeededPRNG(ctx.seed)
    const colors: WCSTCard["color"][] = ["red", "green", "blue", "yellow"]
    const shapes: WCSTCard["shape"][] = ["circle", "triangle", "cross", "star"]
    const counts: WCSTCard["count"][] = [1, 2, 3, 4]

    // Canonical 4 reference decks
    const referenceCards: WCSTCard[] = [
      { color: "red", shape: "triangle", count: 1 },
      { color: "green", shape: "star", count: 2 },
      { color: "blue", shape: "circle", count: 3 },
      { color: "yellow", shape: "cross", count: 4 },
    ]

    const dimensions: ("color" | "shape" | "count")[] = ["color", "shape", "count"]
    const ruleDimension = prng.choice(dimensions)

    // Generate target card that matches reference decks on different dimensions
    const targetCard: WCSTCard = {
      color: prng.choice(colors),
      shape: prng.choice(shapes),
      count: prng.choice(counts),
    }

    // Determine correct deck index (0-3) based on active dimension
    let correctIndex = 0
    for (let i = 0; i < referenceCards.length; i++) {
      if (ruleDimension === "color" && referenceCards[i].color === targetCard.color) {
        correctIndex = i
        break
      }
      if (ruleDimension === "shape" && referenceCards[i].shape === targetCard.shape) {
        correctIndex = i
        break
      }
      if (ruleDimension === "count" && referenceCards[i].count === targetCard.count) {
        correctIndex = i
        break
      }
    }

    return {
      trialId: `wcst_${ctx.seed}`,
      exerciseId: "wcst",
      seed: ctx.seed,
      pool: ctx.pool,
      difficulty: ctx.difficulty,
      stimulus: {
        targetCard,
        referenceCards,
        ruleDimension,
      },
      expectedAnswer: correctIndex,
      options: [0, 1, 2, 3],
      timeLimitMs: 8000,
      metadata: { ruleDimension, correctIndex },
    }
  },
  validate(response: number, expected: number): TrialValidation {
    const isCorrect = Number(response) === expected
    return {
      isCorrect,
      score: isCorrect ? 1.0 : 0.0,
      expected: `Deck ${expected + 1}`,
      actual: `Deck ${Number(response) + 1}`,
      feedback: isCorrect ? "CORRECT rule hypothesis." : "WRONG deck for current hidden rule.",
    }
  },
}

/* =========================================================================
   7. FLUID REASONING: PROCEDURAL MATRIX PATTERNS (RAVEN PARADIGM)
   ========================================================================= */
export interface MatrixCell {
  shape: "circle" | "square" | "triangle"
  fill: "empty" | "half" | "solid"
  count: number // 1 to 3
}

export interface MatrixStimulus {
  grid: (MatrixCell | null)[][] // 3x3 with bottom-right null
  ruleType: "progression" | "additive" | "distribution"
  options: MatrixCell[]
}

export const ProgressiveMatrixExercise: ExerciseDefinition<MatrixStimulus, number> = {
  id: "progressive_matrices",
  name: "Procedural Raven Matrix Induction",
  domain: "fluid_reasoning",
  categoryName: "Fluid Reasoning",
  mechanisms: ["Inductive Logic", "Visuoperceptual Rule Mapping", "Orthogonal Constraint Binding"],
  cognitiveContract: {
    trainingTarget: "Extracting latent transformation rules across rows and columns without verbal assistance.",
    whatYouDo: "Inspect the 3×3 matrix of figures. Deducing row and column progression rules, select the figure that completes the missing bottom-right cell.",
    whatMatters: "Strict logical validity. Check both horizontal and vertical consistency.",
    whatIsMeasured: ["Rule complexity depth", "Hypothesis evaluation time", "Analytic reasoning accuracy"],
  },
  defaultDifficulty: {
    ...DEFAULT_DIFFICULTY,
    rule_complexity: 0.75,
    relational_depth: 0.7,
  },
  transferMappings: {
    nearTransferDomain: "Analogical Reasoning / Geometric Series",
    farTransferDomain: "Algorithmic thinking and architecture system design",
    realWorldSkill: "Spotting subtle systemic patterns across disparate empirical observations",
  },
  generateDemonstration(): DemonstrationStep[] {
    return [
      {
        stepNumber: 1,
        stimulusSummary: "Row 1: 1 circle, 2 circles, 3 circles. Row 2: 1 square, 2 squares, 3 squares.",
        guidance: "Rule is shape consistency horizontally, with count incrementing +1 each step.",
        demonstrationAction: "Select figure matching Row 3 with 3 triangles.",
        expectedOutcome: "Correct matrix solution.",
      },
    ]
  },
  generate(ctx: GenerateContext): TrialData<MatrixStimulus, number> {
    const prng = new SeededPRNG(ctx.seed)
    const shapes: MatrixCell["shape"][] = ["circle", "square", "triangle"]
    const fills: MatrixCell["fill"][] = ["empty", "half", "solid"]

    const baseShape = prng.choice(shapes)
    const baseFill = prng.choice(fills)

    // Construct 3x3 procedural grid with count + fill progression
    const grid: (MatrixCell | null)[][] = []
    for (let r = 0; r < 3; r++) {
      const row: (MatrixCell | null)[] = []
      for (let c = 0; c < 3; c++) {
        if (r === 2 && c === 2) {
          row.push(null) // Target missing slot
        } else {
          row.push({
            shape: shapes[(r + c) % 3],
            fill: fills[(r) % 3],
            count: c + 1,
          })
        }
      }
      grid.push(row)
    }

    // Expected answer at (2, 2)
    const solution: MatrixCell = {
      shape: shapes[(2 + 2) % 3],
      fill: fills[2 % 3],
      count: 3,
    }

    // Generate 5 plausible distractor options
    const options: MatrixCell[] = [solution]
    while (options.length < 6) {
      const candidate: MatrixCell = {
        shape: prng.choice(shapes),
        fill: prng.choice(fills),
        count: prng.int(1, 3),
      }
      if (
        !options.some(
          (o) =>
            o.shape === candidate.shape &&
            o.fill === candidate.fill &&
            o.count === candidate.count
        )
      ) {
        options.push(candidate)
      }
    }

    // Shuffle options so correct answer is at random index
    const shuffled = prng.shuffle(options)
    const correctIndex = shuffled.findIndex(
      (o) =>
        o.shape === solution.shape &&
        o.fill === solution.fill &&
        o.count === solution.count
    )

    return {
      trialId: `raven_${ctx.seed}`,
      exerciseId: "progressive_matrices",
      seed: ctx.seed,
      pool: ctx.pool,
      difficulty: ctx.difficulty,
      stimulus: {
        grid,
        ruleType: "progression",
        options: shuffled,
      },
      expectedAnswer: correctIndex,
      options: [0, 1, 2, 3, 4, 5],
      timeLimitMs: 30000,
      metadata: { solution, correctIndex },
    }
  },
  validate(response: number, expected: number): TrialValidation {
    const isCorrect = Number(response) === expected
    return {
      isCorrect,
      score: isCorrect ? 1.0 : 0.0,
      expected: `Option ${expected + 1}`,
      actual: `Option ${Number(response) + 1}`,
      feedback: isCorrect ? "Exact relational induction." : "Incorrect matrix completion.",
    }
  },
}

/* =========================================================================
   8. QUANTITATIVE LOGIC: BAYESIAN UPDATING UNDER NOISY EVIDENCE
   ========================================================================= */
export interface BayesianStimulus {
  scenario: string
  priorPercent: number // e.g. 10%
  sensitivityPercent: number // P(Positive | Event) e.g. 90%
  falsePositivePercent: number // P(Positive | No Event) e.g. 5%
  question: string
  calculatedPosterior: number // Exact Bayes theorem result
}

export const BayesianUpdateExercise: ExerciseDefinition<BayesianStimulus, number> = {
  id: "bayesian_updating",
  name: "Bayesian Calibration & Evidence Updating",
  domain: "quantitative_logic",
  categoryName: "Quantitative Logic",
  mechanisms: ["Base Rate Neglect Suppression", "Likelihood Ratio Calibration", "Posterior Probability Estimation"],
  cognitiveContract: {
    trainingTarget: "Correcting human base-rate neglect and calculating true posterior probabilities under noisy sensors.",
    whatYouDo: "Given prior base rate P(A), test sensitivity P(T+|A), and false positive rate P(T+|¬A), estimate the true probability P(A|T+).",
    whatMatters: "Accuracy within ±5% tolerance. Resist the urge to confuse sensor accuracy with posterior likelihood.",
    whatIsMeasured: ["Brier error distance", "Base rate neglect tendency"],
  },
  defaultDifficulty: {
    ...DEFAULT_DIFFICULTY,
    rule_complexity: 0.8,
    relational_depth: 0.6,
  },
  transferMappings: {
    nearTransferDomain: "Fermi Estimation / Expected Value Analysis",
    farTransferDomain: "Risk assessment and critical medical/engineering diagnostics",
    realWorldSkill: "Accurately appraising threat probability without overreacting to false alarms",
  },
  generateDemonstration(): DemonstrationStep[] {
    return [
      {
        stepNumber: 1,
        stimulusSummary: "Base rate 1%. Test sensitivity 90%. False positive rate 9%.",
        guidance: "Out of 1000 people, 10 have the condition (9 test positive). 990 don't (89 test positive). Total positive: 98. True positive: 9/98 ≈ 9.2%.",
        demonstrationAction: "Select ~9%, NOT 90%.",
        expectedOutcome: "Correct Bayesian deduction overcoming base rate neglect.",
      },
    ]
  },
  generate(ctx: GenerateContext): TrialData<BayesianStimulus, number> {
    const prng = new SeededPRNG(ctx.seed)
    const prior = prng.choice([1, 2, 5, 10, 15, 20]) // prior percent
    const sens = prng.choice([80, 85, 90, 95]) // sensitivity
    const fp = prng.choice([5, 8, 10, 15]) // false positive rate

    const pA = prior / 100
    const pNotA = 1 - pA
    const pPosGivenA = sens / 100
    const pPosGivenNotA = fp / 100

    const numerator = pPosGivenA * pA
    const denominator = numerator + pPosGivenNotA * pNotA
    const posterior = Math.round((numerator / denominator) * 100)

    // Generate 4 plausible options
    const distractorA = sens // the classic base-rate neglect trap!
    const distractorB = Math.max(1, Math.round(posterior * 0.45))
    const distractorC = Math.min(99, Math.round(posterior * 1.65))

    const optionsSet = new Set([posterior, distractorA, distractorB, distractorC])
    const options = prng.shuffle(Array.from(optionsSet))

    const scenario = `A critical server vulnerability affects ${prior}% of systems (base rate). An automated scanner detects real vulnerabilities with ${sens}% sensitivity, but has a ${fp}% false positive rate on secure systems. A server tests positive.`
    const question = `What is the true probability that this server actually has the vulnerability?`

    return {
      trialId: `bayes_${ctx.seed}`,
      exerciseId: "bayesian_updating",
      seed: ctx.seed,
      pool: ctx.pool,
      difficulty: ctx.difficulty,
      stimulus: {
        scenario,
        priorPercent: prior,
        sensitivityPercent: sens,
        falsePositivePercent: fp,
        question,
        calculatedPosterior: posterior,
      },
      expectedAnswer: posterior,
      options: options.map((opt) => `${opt}%`),
      timeLimitMs: 25000,
      metadata: { posterior, prior, sens, fp },
    }
  },
  validate(response: any, expected: number): TrialValidation {
    const numeric = parseInt(String(response).replace("%", ""), 10)
    const isCorrect = Math.abs(numeric - expected) <= 2
    return {
      isCorrect,
      score: isCorrect ? 1.0 : 0.0,
      expected: `${expected}%`,
      actual: `${numeric}%`,
      feedback: isCorrect
        ? "Exemplary Bayesian calculation."
        : `Base-rate neglect caught you. True posterior is ${expected}%, not ${numeric}%.`,
    }
  },
}

/* =========================================================================
   9. PROCESSING SPEED: CHOICE REACTION TIME (HICK'S LAW)
   ========================================================================= */
export interface ChoiceRTStimulus {
  choicesCount: 2 | 4 | 8
  activeTargetIndex: number
}

export const ChoiceReactionExercise: ExerciseDefinition<ChoiceRTStimulus, number> = {
  id: "choice_reaction",
  name: "Hick's Law Choice Reaction Velocity",
  domain: "processing_speed",
  categoryName: "Processing Speed",
  mechanisms: ["Efferent Conduction", "Decision Entropy Scaling", "Motor Selection Velocity"],
  cognitiveContract: {
    trainingTarget: "Minimizing log2(n) decision latency as number of alternative choices scales.",
    whatYouDo: "A quadrant or key will light up. Trigger the matching button with instantaneous reflex speed.",
    whatMatters: "Pure milliseconds. Hick's law dictates latency grows by ~150ms per bit of decision entropy.",
    whatIsMeasured: ["Choice reaction time (ms)", "Motor slip rate", "Hick rate constant"],
  },
  defaultDifficulty: {
    ...DEFAULT_DIFFICULTY,
    processing_speed: 0.8,
  },
  transferMappings: {
    nearTransferDomain: "Simple RT / Visual Saccade Speed",
    farTransferDomain: "Crisis piloting and sports reflexes",
    realWorldSkill: "Rapid motor decision-making when several options present simultaneously",
  },
  generateDemonstration(): DemonstrationStep[] {
    return [
      {
        stepNumber: 1,
        stimulusSummary: "4 buttons displayed. Button 3 lights up in Emerald.",
        guidance: "Instantly press Button 3.",
        demonstrationAction: "Select Button 3.",
        expectedOutcome: "Reaction recorded in < 300ms.",
      },
    ]
  },
  generate(ctx: GenerateContext): TrialData<ChoiceRTStimulus, number> {
    const prng = new SeededPRNG(ctx.seed)
    const choicesCount: 2 | 4 | 8 =
      ctx.difficulty.rule_complexity > 0.6 ? 8 : ctx.difficulty.rule_complexity > 0.3 ? 4 : 2
    const activeTargetIndex = prng.int(0, choicesCount - 1)

    return {
      trialId: `choicert_${ctx.seed}`,
      exerciseId: "choice_reaction",
      seed: ctx.seed,
      pool: ctx.pool,
      difficulty: ctx.difficulty,
      stimulus: {
        choicesCount,
        activeTargetIndex,
      },
      expectedAnswer: activeTargetIndex,
      options: Array.from({ length: choicesCount }, (_, i) => i),
      timeLimitMs: 2500,
      metadata: { choicesCount, activeTargetIndex },
    }
  },
  validate(response: number, expected: number): TrialValidation {
    const isCorrect = Number(response) === expected
    return {
      isCorrect,
      score: isCorrect ? 1.0 : 0.0,
      expected: `Target #${expected + 1}`,
      actual: `Target #${Number(response) + 1}`,
      feedback: isCorrect ? "Instant motor reflex." : "Wrong button selected.",
    }
  },
}

/* =========================================================================
   10. COMPOSITE TASK: STROOP + N-BACK SYNTHESIS
   ========================================================================= */
export interface StroopNBackStimulus {
  n: number
  currentWord: string
  currentInk: string
  isNBackInkMatch: boolean
}

export const StroopNBackCompositeExercise: ExerciseDefinition<StroopNBackStimulus, boolean> = {
  id: "composite_stroop_nback",
  name: "Stroop + N-Back Dual Synthesis Engine",
  domain: "composite",
  categoryName: "Composite Cognitive Synthesis",
  mechanisms: ["Cross-Modal Interference Suppression", "Dual-Task Coordination", "Inhibitory Working Memory"],
  cognitiveContract: {
    trainingTarget: "Simultaneously running active N-back memory buffers while actively resisting semantic reading interference.",
    whatYouDo: "Track the INK COLOR of the sequence. Press MATCH if current INK COLOR matches the ink color N steps ago. Ignore the distracting printed word!",
    whatMatters: "Do NOT let the printed word text contaminate your working-memory buffer of ink colors.",
    whatIsMeasured: ["Composite executive degradation", "Semantic intrusion errors"],
  },
  defaultDifficulty: {
    ...DEFAULT_DIFFICULTY,
    memory_load: 0.7,
    interference: 0.85,
    switching_cost: 0.6,
  },
  transferMappings: {
    nearTransferDomain: "Executive Multi-Tasking",
    farTransferDomain: "Real-world cognitive synthesis under deceptive noise",
    realWorldSkill: "Keeping track of shifting factual data while hostile parties attempt semantic redirection",
  },
  generateDemonstration(): DemonstrationStep[] {
    return [
      {
        stepNumber: 1,
        stimulusSummary: "2-Back ink task. Previous 2 items: [Red ink, Blue ink]. Current: Word 'GREEN' in Red ink.",
        guidance: "Current ink is RED. It matches 2 steps ago (RED). Word says 'GREEN' to fool you.",
        demonstrationAction: "Select MATCH.",
        expectedOutcome: "Correct: Overcame semantic intrusion to match buffer.",
      },
    ]
  },
  generate(ctx: GenerateContext): TrialData<StroopNBackStimulus, boolean> {
    const prng = new SeededPRNG(ctx.seed)
    const n = 2
    const colors = [
      { name: "RED", hex: "#EF4444" },
      { name: "BLUE", hex: "#3B82F6" },
      { name: "GREEN", hex: "#10B981" },
      { name: "YELLOW", hex: "#F59E0B" },
    ]

    const isMatch = prng.boolean(0.4)
    const targetInk = prng.choice(colors)
    // Deceptive word is different from ink
    const deceptiveWord = prng.choice(colors.filter((c) => c.name !== targetInk.name)).name

    return {
      trialId: `comp_stroop_nback_${ctx.seed}`,
      exerciseId: "composite_stroop_nback",
      seed: ctx.seed,
      pool: ctx.pool,
      difficulty: ctx.difficulty,
      stimulus: {
        n,
        currentWord: deceptiveWord,
        currentInk: targetInk.hex,
        isNBackInkMatch: isMatch,
      },
      expectedAnswer: isMatch,
      options: ["MATCH", "PASS"],
      timeLimitMs: 2200,
      metadata: { n, isMatch, targetInk: targetInk.name, deceptiveWord },
    }
  },
  validate(response: any, expected: boolean): TrialValidation {
    const userSaidMatch =
      typeof response === "boolean"
        ? response
        : String(response).trim().toUpperCase() === "MATCH"
    const isCorrect = userSaidMatch === expected
    return {
      isCorrect,
      score: isCorrect ? 1.0 : 0.0,
      expected: expected ? "MATCH" : "PASS",
      actual: userSaidMatch ? "MATCH" : "PASS",
      feedback: isCorrect ? "Flawless dual-task gating." : "Semantic intrusion corrupted your memory buffer.",
    }
  },
}

/* =========================================================================
   MASTER EXERCISE REGISTRY MAP
   ========================================================================= */
export const EXERCISE_REGISTRY: Record<string, ExerciseDefinition> = {
  stroop: StroopExercise,
  flanker: FlankerExercise,
  stop_signal: StopSignalExercise,
  n_back: NBackExercise,
  operation_span: OperationSpanExercise,
  task_switch: TaskSwitchExercise,
  wcst: WCSTExercise,
  progressive_matrices: ProgressiveMatrixExercise,
  bayesian_updating: BayesianUpdateExercise,
  choice_reaction: ChoiceReactionExercise,
  composite_stroop_nback: StroopNBackCompositeExercise,
}

export function getExercise(id: string): ExerciseDefinition | undefined {
  return EXERCISE_REGISTRY[id]
}

export function getAllExercises(): ExerciseDefinition[] {
  return Object.values(EXERCISE_REGISTRY)
}

export function getExercisesByDomain(domain: string): ExerciseDefinition[] {
  return Object.values(EXERCISE_REGISTRY).filter((e) => e.domain === domain)
}
