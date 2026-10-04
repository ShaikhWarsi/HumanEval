// lib/calibration-engine.ts
// Metacognitive Calibration & Brier Scoring Engine
// Grounded in Superforecasting (Tetlock) & Lichtenstein & Fischhoff Calibration Curves

export type ErrorHypothesis =
  | "heuristic_bias"
  | "misread_premise"
  | "edge_case"
  | "computation_lapse"
  | "knowledge_void"

export interface CalibrationItem {
  id: string
  statement: string
  domain: "probability" | "physics-systems" | "epistemology" | "logic" | "cognition"
  isTrue: boolean
  explanation: string
  commonPitfall: string
}

export interface CalibrationTrial {
  itemId: string
  timestamp: number
  assessedProbability: number // 0.0 to 1.0 (e.g. 0.85 = 85% confidence it is TRUE)
  userSaidTrue: boolean // true if assessedProbability > 0.5
  actualOutcome: boolean // item.isTrue
  isCorrect: boolean
  brierScore: number // (assessedProbability - (actualOutcome ? 1 : 0))^2
  errorHypothesis?: ErrorHypothesis
}

export interface CalibrationSummary {
  totalTrials: number
  overallBrierScore: number // 0.00 (perfect) to 1.00 (worst)
  directionalBias: number // positive = overconfident, negative = underconfident
  accuracy: number // raw % correct
  binnedCurves: {
    binLabel: string
    minProb: number
    maxProb: number
    midProb: number
    trialsCount: number
    observedAccuracy: number
  }[]
}

export const CURATED_CALIBRATION_ITEMS: CalibrationItem[] = [
  {
    id: "cal-01",
    statement:
      "If you roll a fair 6-sided die 4 times, the probability of rolling AT LEAST ONE six is greater than 50%.",
    domain: "probability",
    isTrue: true,
    explanation:
      "P(at least one 6) = 1 - P(no sixes in 4 rolls) = 1 - (5/6)^4 = 1 - 625/1296 ≈ 1 - 0.482 = 51.8%. Since 51.8% > 50%, the proposition is TRUE.",
    commonPitfall: "Miscalculating without the complement rule, or estimating 4 × (1/6) = 66% with incorrect independence assumptions.",
  },
  {
    id: "cal-02",
    statement:
      "In a 2-child family, given that at least one child is a boy born on a Tuesday, the probability that the other child is also a boy remains exactly 50%.",
    domain: "probability",
    isTrue: false,
    explanation:
      "Under classical conditioning, the Tuesday detail reduces the sample space of pairs. Total valid pairs with at least one Tuesday boy is 27; pairs where both are boys is 13. The probability is 13/27 ≈ 48.1%, NOT 50%.",
    commonPitfall: "Assuming the birth-day specification is irrelevant noise rather than an event filter.",
  },
  {
    id: "cal-03",
    statement:
      "A helium balloon tied to the floor of a sealed car with closed windows will lean FORWARD toward the dashboard when the car accelerates forward.",
    domain: "physics-systems",
    isTrue: true,
    explanation:
      "When the car accelerates forward, the denser air molecules inside are pushed rearward by inertia, creating a forward pressure gradient. Because helium is less dense than air, buoyant force pushes the balloon forward.",
    commonPitfall: "Intuitively treating the balloon as a solid object governed solely by backwards mechanical inertia.",
  },
  {
    id: "cal-04",
    statement:
      "In psychometrics, high test-retest reliability of a task guarantees that the task has high construct validity.",
    domain: "cognition",
    isTrue: false,
    explanation:
      "Reliability is necessary but not sufficient for validity. A broken scale that consistently overweighs by exactly 10kg has near-perfect reliability (repeatability) but zero validity for true weight.",
    commonPitfall: "Confusing consistency (variance minimization) with truth-tracking (measuring the actual target construct).",
  },
  {
    id: "cal-05",
    statement:
      "In modern cognitive training research, practicing Dual N-Back for 20 hours reliably causes far transfer to untaught fluid intelligence (Gf) tests in double-blind preregistered RCTs.",
    domain: "cognition",
    isTrue: false,
    explanation:
      "Preregistered double-blind randomized controlled trials (including 2025 large-scale RCTs) systematically show task-specific gains on N-Back updating, but fail to replicate statistically significant far transfer to untrained fluid reasoning matrices.",
    commonPitfall: "Relying on early non-blinded 2008 literature (Jaeggi et al.) that suffered from publication bias and active control flaws.",
  },
  {
    id: "cal-06",
    statement:
      "The equation x^3 + y^3 = z^3 has no non-zero integer solutions.",
    domain: "logic",
    isTrue: true,
    explanation:
      "This is Fermat's Last Theorem for n = 3, proven by Leonhard Euler in 1770 and generalized by Andrew Wiles in 1995. There are no non-trivial integer solutions.",
    commonPitfall: "Believing that small cube combinations might exist before Euler's proof.",
  },
  {
    id: "cal-07",
    statement:
      "If a proposition P implies Q, then having empirical evidence that Q is true increases the Bayesian probability that P is true (provided P had non-zero prior).",
    domain: "epistemology",
    isTrue: true,
    explanation:
      "By Bayes' Theorem, P(P|Q) = P(Q|P) × P(P) / P(Q). Since P implies Q, P(Q|P) = 1.0. Unless P(Q) was already 1.0, 1.0 / P(Q) > 1, so the posterior P(P|Q) strictly exceeds the prior P(P).",
    commonPitfall: "Confusing the logical fallacy of 'Affirming the Consequent' (deductive certainty) with Bayesian evidential confirmation (probabilistic induction).",
  },
  {
    id: "cal-08",
    statement:
      "Two electrons with opposite spin can simultaneously occupy the exact same quantum state in an atom.",
    domain: "physics-systems",
    isTrue: false,
    explanation:
      "According to the Pauli Exclusion Principle, no two identical fermions can occupy the same quantum state. If their spins differ, their spin quantum number differs, meaning they occupy DIFFERENT quantum states, not the same.",
    commonPitfall: "Sloppy colloquial phrasing: they can share spatial orbitals, but their total quantum states are strictly distinct.",
  },
]

export class CalibrationEngine {
  private static STORAGE_KEY = "humaneval_calibration_trials_v2"

  public static getTrials(): CalibrationTrial[] {
    if (typeof window === "undefined") return []
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  public static recordTrial(
    itemId: string,
    assessedProbability: number,
    actualOutcome: boolean,
    errorHypothesis?: ErrorHypothesis
  ): CalibrationTrial {
    const userSaidTrue = assessedProbability >= 0.5
    const isCorrect = userSaidTrue === actualOutcome
    const outcomeValue = actualOutcome ? 1.0 : 0.0
    // Standard Brier Score: (p - o)^2
    const brierScore = Math.round(Math.pow(assessedProbability - outcomeValue, 2) * 10000) / 10000

    const trial: CalibrationTrial = {
      itemId,
      timestamp: Date.now(),
      assessedProbability,
      userSaidTrue,
      actualOutcome,
      isCorrect,
      brierScore,
      errorHypothesis,
    }

    if (typeof window !== "undefined") {
      try {
        const trials = this.getTrials()
        trials.push(trial)
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trials))
      } catch {
        // Fallback
      }
    }

    return trial
  }

  public static computeSummary(trials: CalibrationTrial[] = this.getTrials()): CalibrationSummary {
    if (trials.length === 0) {
      return {
        totalTrials: 0,
        overallBrierScore: 0.25, // Uniform 0.5 guess baseline
        directionalBias: 0.0,
        accuracy: 0.0,
        binnedCurves: this.emptyBins(),
      }
    }

    let totalBrier = 0
    let totalBias = 0
    let correctCount = 0

    trials.forEach((t) => {
      totalBrier += t.brierScore
      const outcome = t.actualOutcome ? 1.0 : 0.0
      // If user predicted true with 0.8, and it was true: bias component is (0.8 - 1.0)
      // For subjective calibration: Overconfidence = assessed confidence - realized accuracy
      const confidence = t.userSaidTrue ? t.assessedProbability : 1 - t.assessedProbability
      const hit = t.isCorrect ? 1.0 : 0.0
      totalBias += confidence - hit
      if (t.isCorrect) correctCount++
    })

    const overallBrierScore = Math.round((totalBrier / trials.length) * 1000) / 1000
    const directionalBias = Math.round((totalBias / trials.length) * 1000) / 1000
    const accuracy = Math.round((correctCount / trials.length) * 1000) / 10

    // 5 Calibration Bins: [0.5-0.6], [0.6-0.7], [0.7-0.8], [0.8-0.9], [0.9-1.0]
    const bins = [
      { label: "50-60%", min: 0.5, max: 0.6, mid: 0.55 },
      { label: "60-70%", min: 0.6, max: 0.7, mid: 0.65 },
      { label: "70-80%", min: 0.7, max: 0.8, mid: 0.75 },
      { label: "80-90%", min: 0.8, max: 0.9, mid: 0.85 },
      { label: "90-100%", min: 0.9, max: 1.0, mid: 0.95 },
    ]

    const binnedCurves = bins.map((bin) => {
      const inBin = trials.filter((t) => {
        const conf = t.userSaidTrue ? t.assessedProbability : 1 - t.assessedProbability
        return conf >= bin.min && (bin.max === 1.0 ? conf <= bin.max : conf < bin.max)
      })

      const binHits = inBin.filter((t) => t.isCorrect).length
      const observedAccuracy = inBin.length > 0 ? Math.round((binHits / inBin.length) * 100) : bin.mid * 100

      return {
        binLabel: bin.label,
        minProb: bin.min,
        maxProb: bin.max,
        midProb: bin.mid,
        trialsCount: inBin.length,
        observedAccuracy,
      }
    })

    return {
      totalTrials: trials.length,
      overallBrierScore,
      directionalBias,
      accuracy,
      binnedCurves,
    }
  }

  private static emptyBins() {
    return [
      { binLabel: "50-60%", minProb: 0.5, maxProb: 0.6, midProb: 0.55, trialsCount: 0, observedAccuracy: 55 },
      { binLabel: "60-70%", minProb: 0.6, maxProb: 0.7, midProb: 0.65, trialsCount: 0, observedAccuracy: 65 },
      { binLabel: "70-80%", minProb: 0.7, maxProb: 0.8, midProb: 0.75, trialsCount: 0, observedAccuracy: 75 },
      { binLabel: "80-90%", minProb: 0.8, maxProb: 0.9, midProb: 0.85, trialsCount: 0, observedAccuracy: 85 },
      { binLabel: "90-100%", minProb: 0.9, maxProb: 1.0, midProb: 0.95, trialsCount: 0, observedAccuracy: 95 },
    ]
  }
}
