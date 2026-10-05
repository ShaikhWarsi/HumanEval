// lib/calibration-engine.ts
// Metacognitive Calibration & Brier Scoring Engine
// Grounded in Superforecasting (Tetlock) & Lichtenstein & Fischhoff Calibration Curves

import { SeededPRNG } from "@/lib/engine/prng"

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
  {
    id: "cal-09",
    statement:
      "In the Monty Hall problem, if the host reveals a goat behind door 3, switching doors doubles your win probability from 1/3 to 2/3.",
    domain: "probability",
    isTrue: true,
    explanation:
      "Your initial choice has a 1/3 chance of holding the car and a 2/3 chance of being wrong. Because the host intentionally avoids the car when opening a door, the entire 2/3 probability mass concentrates on the remaining closed door.",
    commonPitfall: "Assuming the two remaining doors must have equal 50/50 odds after one is opened.",
  },
  {
    id: "cal-10",
    statement:
      "In computability theory, there exists an algorithm that can determine whether ANY arbitrary computer program will halt.",
    domain: "logic",
    isTrue: false,
    explanation:
      "This is Alan Turing's Halting Problem (1936). Turing proved by diagonal self-contradiction that no general algorithm can decide whether every program halts.",
    commonPitfall: "Believing that with sufficient computing power or AI, all code execution paths can be solved.",
  },
  {
    id: "cal-11",
    statement:
      "In a room of 23 people, the probability that at least two share the exact same birthday exceeds 50%.",
    domain: "probability",
    isTrue: true,
    explanation:
      "With 23 people, there are (23 × 22) / 2 = 253 pairs of people. P(no shared birthday) = (365/365) × (364/365) ... × (343/365) ≈ 49.3%. Thus P(shared) ≈ 50.7%, which is > 50%.",
    commonPitfall: "Focusing on the probability that someone shares YOUR birthday (~1/365) rather than the combinatorial explosion of distinct pairs.",
  },
  {
    id: "cal-12",
    statement:
      "A mirror reverses left and right, but does not reverse up and down.",
    domain: "physics-systems",
    isTrue: false,
    explanation:
      "Mirrors reverse along the perpendicular z-axis (front-to-back), NOT left-to-right. A glove pushed against a mirror has its palm facing back at itself. The perception of left-right reversal is a psychological projection of imagining turning around.",
    commonPitfall: "Accepting visual egocentric projection as optical physics.",
  },
  {
    id: "cal-13",
    statement:
      "In game theory's iterated Prisoner's Dilemma, Tit-for-Tat was proven to be unbeatable in every single individual match.",
    domain: "logic",
    isTrue: false,
    explanation:
      "Tit-for-Tat can never score higher than its opponent in a single head-to-head match (it either ties or loses by one defection). It wins tournaments by eliciting mutual cooperation over many rounds across diverse opponents.",
    commonPitfall: "Confusing aggregate tournament success with winning every individual head-to-head game.",
  },
  {
    id: "cal-14",
    statement:
      "Correlation between variables X and Y does not imply causation, but zero correlation guarantees that X and Y are independent.",
    domain: "probability",
    isTrue: false,
    explanation:
      "Pearson correlation measures only LINEAR association. If Y = X² where X is symmetric about zero (e.g. -2, -1, 0, 1, 2), the correlation is exactly 0.0 despite Y being 100% deterministically dependent on X.",
    commonPitfall: "Equating zero linear correlation with general statistical independence.",
  },
  {
    id: "cal-15",
    statement:
      "In thermodynamics, it is theoretically possible to construct a device whose sole effect is to extract heat from a single reservoir and convert it entirely into work.",
    domain: "physics-systems",
    isTrue: false,
    explanation:
      "This directly violates the Kelvin-Planck statement of the Second Law of Thermodynamics (Perpetual Motion of the Second Kind). You must always reject some heat to a lower-temperature sink.",
    commonPitfall: "Confusing the First Law (energy conservation) with the Second Law (entropy generation).",
  },
  {
    id: "cal-16",
    statement:
      "In cognitive psychology, the Dunning-Kruger effect states that low-performing individuals believe they are smarter than high-performing individuals.",
    domain: "cognition",
    isTrue: false,
    explanation:
      "In the original Kruger & Dunning (1999) study, low performers estimated their score around the 60th percentile (overconfident, but lower than top performers). Top performers estimated around the 70th-75th percentile (underconfident). Low performers never rated themselves higher in absolute terms than top performers.",
    commonPitfall: "Pop-psychology misrepresentation of the original calibration curve data.",
  },
  {
    id: "cal-17",
    statement:
      "If you continuously shuffle a standard 52-card deck 7 times, the resulting arrangement is overwhelmingly likely to be completely unique in human history.",
    domain: "probability",
    isTrue: true,
    explanation:
      "52! ≈ 8.06 × 10^67. If every human who ever lived shuffled a deck every second since the Big Bang, the total shuffles would still be a microscopic fraction of 52!.",
    commonPitfall: "Failing to comprehend the staggering magnitude of factorial growth.",
  },
  {
    id: "cal-18",
    statement:
      "A person running in the rain will always get wetter by running faster than walking.",
    domain: "physics-systems",
    isTrue: false,
    explanation:
      "Running faster sweeps out the same total volume of raindrops from the front between two fixed points, but minimizes the time exposed to rain falling vertically from above. Running almost always reduces total water absorbed.",
    commonPitfall: "Assuming faster forward velocity increases total frontal water encountered over a fixed travel distance.",
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

  public static generateProceduralItems(count: number = 20, seed?: number): CalibrationItem[] {
    return generateProceduralCalibrationItems(count, seed)
  }
}

/**
 * Procedural Calibration Question Generator.
 * Generates dynamic mathematical and empirical probability scenarios with exact truth values.
 * Eliminates static item memorization.
 */
export function generateProceduralCalibrationItems(count: number = 20, seed?: number): CalibrationItem[] {
  const prng = new SeededPRNG(seed ?? Math.floor(Math.random() * 1000000))
  const items: CalibrationItem[] = []

  for (let i = 0; i < count; i++) {
    const type = prng.int(1, 5)

    if (type === 1) {
      // Dice complement
      const sides = prng.choice([6, 8, 12, 20])
      const rolls = prng.int(3, 6)
      const targetP = 1 - Math.pow((sides - 1) / sides, rolls)
      const cutoff = prng.choice([40, 50, 60])
      const isTrue = targetP > cutoff / 100
      const actualPct = Math.round(targetP * 1000) / 10

      items.push({
        id: `cal_dice_${prng.int(1000, 9999)}`,
        domain: "probability",
        statement: `If you roll a fair ${sides}-sided die ${rolls} times, the probability of rolling AT LEAST ONE highest face is greater than ${cutoff}%.`,
        isTrue,
        explanation: `Under the complement rule, P(at least one) = 1 - (${sides - 1}/${sides})^${rolls} = 1 - ${(Math.pow((sides - 1)/sides, rolls)).toFixed(3)} ≈ ${actualPct}%. Since ${actualPct}% ${isTrue ? ">" : "≤"} ${cutoff}%, the proposition is ${isTrue ? "TRUE" : "FALSE"}.`,
        commonPitfall: `Attempting linear addition (${rolls} × 1/${sides} = ${Math.round((rolls/sides)*100)}%) which erroneously ignores overlapping multi-outcome intersections.`,
      })
    } else if (type === 2) {
      // Bayesian Screening
      const prior = prng.choice([1, 2, 5, 10])
      const sens = prng.choice([85, 90, 95])
      const fp = prng.choice([5, 8, 12])
      const pA = prior / 100
      const pNotA = 1 - pA
      const num = (sens / 100) * pA
      const den = num + (fp / 100) * pNotA
      const posterior = (num / den) * 100
      const cutoff = prng.choice([40, 50, 60])
      const isTrue = posterior > cutoff

      items.push({
        id: `cal_bayes_${prng.int(1000, 9999)}`,
        domain: "probability",
        statement: `A condition affects ${prior}% of a population. A diagnostic scanner has ${sens}% sensitivity and an ${fp}% false positive rate. A randomly selected unit tests positive. The true probability that the unit actually has the condition is greater than ${cutoff}%.`,
        isTrue,
        explanation: `Applying Bayes' Theorem: P(Condition | Positive) = (${sens/100} × ${pA}) / [(${sens/100} × ${pA}) + (${fp/100} × ${pNotA.toFixed(2)})] = ${(num/den * 100).toFixed(1)}%. Since ${(num/den * 100).toFixed(1)}% ${isTrue ? ">" : "≤"} ${cutoff}%, the statement is ${isTrue ? "TRUE" : "FALSE"}.`,
        commonPitfall: `Base rate neglect: intuitively focusing on the ${sens}% sensitivity while ignoring the overwhelming pool of false positives from the non-affected majority.`,
      })
    } else if (type === 3) {
      // Birthday collision variant
      const groupSize = prng.int(20, 28)
      let pNone = 1.0
      for (let k = 0; k < groupSize; k++) {
        pNone *= (365 - k) / 365
      }
      const pCollision = (1 - pNone) * 100
      const isTrue = pCollision > 50

      items.push({
        id: `cal_bday_${prng.int(1000, 9999)}`,
        domain: "probability",
        statement: `In a randomly assembled group of ${groupSize} unrelated individuals, the probability that at least two people share the exact same birthday (month and day) is greater than 50%.`,
        isTrue,
        explanation: `The probability of at least one shared birthday is 1 - ∏_{k=0}^{${groupSize-1}} (365-k)/365 ≈ ${pCollision.toFixed(1)}%. Since ${pCollision.toFixed(1)}% ${isTrue ? ">" : "≤"} 50%, the proposition is ${isTrue ? "TRUE" : "FALSE"}. (The 50% crossover threshold occurs at 23 individuals).`,
        commonPitfall: `Comparing each person only to oneself instead of counting all pairwise combinations: N×(N-1)/2 = ${(groupSize * (groupSize - 1))/2} pairs.`,
      })
    } else if (type === 4) {
      // Urn without replacement
      const red = prng.int(4, 8)
      const blue = prng.int(4, 8)
      const total = red + blue
      const draws = 2
      let pAllRed = (red / total) * ((red - 1) / (total - 1))
      const pPct = pAllRed * 100
      const cutoff = prng.choice([15, 25, 35])
      const isTrue = pPct > cutoff

      items.push({
        id: `cal_urn_${prng.int(1000, 9999)}`,
        domain: "probability",
        statement: `An urn contains ${red} red marbles and ${blue} blue marbles. If you draw 2 marbles consecutively WITHOUT replacement, the probability that both drawn marbles are red exceeds ${cutoff}%.`,
        isTrue,
        explanation: `Probability is (${red}/${total}) × (${red - 1}/${total - 1}) ≈ ${pPct.toFixed(1)}%. Since ${pPct.toFixed(1)}% ${isTrue ? ">" : "≤"} ${cutoff}%, the statement is ${isTrue ? "TRUE" : "FALSE"}.`,
        commonPitfall: `Treating draws as independent with replacement (${Math.pow(red/total, 2).toFixed(3)}), ignoring the conditional depletion of the urn.`,
      })
    } else {
      // Epistemic curated item
      const curated = prng.choice(CURATED_CALIBRATION_ITEMS)
      items.push(curated)
    }
  }

  return items
}
