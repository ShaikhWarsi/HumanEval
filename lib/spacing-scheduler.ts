// lib/spacing-scheduler.ts
// Reconstructive Retrieval Practice & Exponential Forgetting Curve Engine
// Grounded in Ebbinghaus-Bjork Desirable Difficulties & Karpicke & Roediger (2008)

export interface ConceptItem {
  id: string
  title: string
  category: "cognitive-science" | "logic-probability" | "systems-engineering" | "neurobiology"
  keyPrinciple: string
  denseExplanation: string
  distractorTask: string // 5-second cognitive interference prompt
  retrievalPrompt: string
  modelAnswer: string
  crucialCheckpoints: string[]
}

export interface ReviewRecord {
  conceptId: string
  stabilityDays: number // S in R = e^(-t/S)
  lastReviewedAt: number // timestamp
  reviewCount: number
  retrievalQuality: number // 1 (total failure) to 5 (flawless effortless recall)
  history: {
    reviewedAt: number
    quality: number
    latencyMs: number
  }[]
}

export const CURATED_CONCEPTS: ConceptItem[] = [
  {
    id: "concept-ddm",
    title: "Drift-Diffusion Model (DDM) of Decision Making",
    category: "cognitive-science",
    keyPrinciple: "Evidence accumulation drift rate (v) vs Decision boundary threshold (a)",
    denseExplanation:
      "The Drift-Diffusion Model represents two-alternative forced-choice decisions as continuous noisy accumulation of sensory/cognitive evidence toward one of two absorbing decision boundaries. Drift rate (v) quantifies signal extraction efficiency; boundary separation (a) regulates the speed-accuracy tradeoff; non-decision time (Ter) isolates sensory encoding and motor latency.",
    distractorTask: "Calculate mentally: 17 × 4 - 29 = ?",
    retrievalPrompt:
      "Explain the Drift-Diffusion Model without looking: What do drift rate (v), boundary separation (a), and non-decision time (Ter) measure? What happens when a subject rushes their decision?",
    modelAnswer:
      "DDM models decision making as continuous noisy stochastic evidence accumulation. Drift rate (v) reflects information processing quality; boundary separation (a) sets the conservative threshold (speed-accuracy criterion); non-decision time (Ter) covers sensory and motor overhead. Lowering boundary separation produces faster responses but escalates false alarm errors.",
    crucialCheckpoints: [
      "Noisy evidence accumulation toward absorbing boundaries",
      "Drift rate (v) = cognitive extraction speed/quality",
      "Boundary separation (a) = speed-accuracy tradeoff criterion",
      "Non-decision time (Ter) = sensory + motor execution",
    ],
  },
  {
    id: "concept-relational-integration",
    title: "Relational Integration & Fluid Intelligence (Gf)",
    category: "cognitive-science",
    keyPrinciple: "Simultaneous binding of coordinate mental relations in frontoparietal cortex",
    denseExplanation:
      "Relational Integration is the capacity to bind multiple independently extracted relations into a coordinated compound representation (e.g. A > B and B > C implies A > C). Unlike passive storage (digit span), relational integration demands active co-activation in the rostrolateral prefrontal cortex (rlPFC), constituting the core cognitive engine of Fluid Intelligence (Wang et al., 2025).",
    distractorTask: "Spell the word 'NEUROTRANSMITTER' backwards in your mind for 4 seconds.",
    retrievalPrompt:
      "Without looking: Distinguish passive working memory storage from relational integration. Which brain region governs multi-premise relational binding and why is it considered the biological core of Gf?",
    modelAnswer:
      "Passive storage buffers representations without relational manipulation. Relational integration coordinates and evaluates mappings across multiple premises simultaneously. It relies heavily on the rostrolateral prefrontal cortex (rlPFC) and frontoparietal networks to synthesize compound propositions into novel inferences.",
    crucialCheckpoints: [
      "Binding distinct relationships into a single coherent deduction",
      "Diverges from passive buffer storage",
      "Recruits rostrolateral prefrontal cortex (rlPFC)",
      "Direct structural bottleneck of fluid intelligence (Gf)",
    ],
  },
  {
    id: "concept-bayes-base-rate",
    title: "Bayesian Updating & Base Rate Neglect",
    category: "logic-probability",
    keyPrinciple: "Posterior Odds = Likelihood Ratio × Prior Odds",
    denseExplanation:
      "Base rate neglect occurs when human intuition privileges representative case evidence over prior background probability. Under Bayes' Theorem, P(H|E) = [P(E|H) × P(H)] / P(E). When the prior P(H) is extremely rare (e.g., 0.1%), even an 99% accurate test yields a substantial false positive fraction due to the overwhelming mass of true negatives.",
    distractorTask: "Count down by 7s from 93 to 65 mentally.",
    retrievalPrompt:
      "Explain Base Rate Neglect through Bayes' theorem: Why can a medical test with 99% accuracy still produce mostly false positives when testing for a 1-in-1000 disease?",
    modelAnswer:
      "In a population of 100,000 with a 0.1% incidence, only 100 people have the disease (99 test true positive). The 99,900 healthy individuals generate 1% false positives (~999 people). Thus, out of ~1,098 total positive tests, 999 are false (~91% false positive rate). Intuition fails because it neglects the overwhelming prior weight of non-cases.",
    crucialCheckpoints: [
      "Prior probability (base rate) heavily dominates rare conditions",
      "P(H|E) combines test sensitivity and prior odds",
      "False positives from the healthy majority dwarf true positives",
      "Representativeness heuristic drives the cognitive error",
    ],
  },
  {
    id: "concept-amdahl-law",
    title: "Amdahl's Law & Cognitive Bottlenecks",
    category: "systems-engineering",
    keyPrinciple: "Overall speedup is bounded by the non-parallelizable serial fraction S",
    denseExplanation:
      "Amdahl's Law states that the theoretical speedup S_latency of a task execution is limited by: Speedup = 1 / ((1 - p) + (p / s)), where p is the proportion of the task that can be parallelized, and s is the speedup factor of that parallelized component. If 30% of a cognitive workflow is fundamentally serial (e.g., deep verbal reasoning), infinite parallel processing of the remainder cannot achieve more than a 3.33x speedup.",
    distractorTask: "Visualize a cube. Count its edges and vertices mentally.",
    retrievalPrompt:
      "Formulate Amdahl's Law and explain its implication for human cognitive augmentation. What is the maximum theoretical speedup if 25% of your work is strictly serial?",
    modelAnswer:
      "Speedup = 1 / ((1 - p) + p/s). If the serial component (1 - p) is 0.25 (25%), then even with infinite acceleration (s -> infinity) of the parallel part, maximum theoretical speedup is 1 / 0.25 = 4.0x. Cognitive augmentation of auxiliary tasks cannot overcome serial bottleneck thinking.",
    crucialCheckpoints: [
      "Formula: 1 / ((1 - p) + p/s)",
      "Strict upper bound dictated by the serial fraction",
      "25% serial fraction caps speedup at 4x",
      "Cognitive implication: Accelerating non-critical sub-tasks cannot bypass serial executive deliberation",
    ],
  },
  {
    id: "concept-desirable-difficulties",
    title: "Desirable Difficulties & Retrieval Effort",
    category: "cognitive-science",
    keyPrinciple: "Storage strength vs Retrieval strength (Bjork Framework)",
    denseExplanation:
      "Robert Bjork established that conditions that induce short-term performance friction (spacing, interleaving, test-enhanced generation) trigger deep durable long-term storage strength. Conversely, fluent re-reading yields high immediate retrieval strength but negligible long-term retention. Effortful, near-failure retrieval reconstructs synaptic access pathways far more reliably than passive review.",
    distractorTask: "Name 3 prime numbers between 40 and 60.",
    retrievalPrompt:
      "Contrast 'Storage Strength' with 'Retrieval Strength'. Why does effortless re-reading create an illusion of competence while difficult retrieval cements long-term memory?",
    modelAnswer:
      "Retrieval strength measures momentary ease of access; storage strength measures structural durability. Re-reading inflates retrieval strength via perceptual fluency without requiring synaptic reconstruction. Difficult retrieval forces reconstructive cognitive effort, signaling to hippocampus and cortex that the neural pathway is critical, permanently boosting storage strength.",
    crucialCheckpoints: [
      "Retrieval strength = immediate access fluency",
      "Storage strength = long-term structural durability",
      "Fluency heuristic causes illusions of competence",
      "Frictional reconstructive effort drives synaptic stabilization",
    ],
  },
]

export class SpacingScheduler {
  private static STORAGE_KEY = "humaneval_spaced_records_v2"

  /**
   * Retrieves user review records from localStorage
   */
  public static getRecords(): Record<string, ReviewRecord> {
    if (typeof window === "undefined") return {}
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      return data ? JSON.parse(data) : {}
    } catch {
      return {}
    }
  }

  /**
   * Saves records to localStorage
   */
  public static saveRecords(records: Record<string, ReviewRecord>) {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records))
    } catch {
      // Storage error fallback
    }
  }

  /**
   * Calculates current retention probability R = e^(-t / S)
   */
  public static calculateRetention(record: ReviewRecord): number {
    const elapsedDays = (Date.now() - record.lastReviewedAt) / (1000 * 60 * 60 * 24)
    const stability = Math.max(0.2, record.stabilityDays)
    return Math.exp(-elapsedDays / stability)
  }

  /**
   * Updates memory stability based on retrieval performance (quality: 1 to 5)
   * Formula adapted from SuperMemo / FSRS principles
   */
  public static computeNextReview(
    currentRecord: ReviewRecord | null,
    conceptId: string,
    quality: number, // 1 to 5
    latencyMs: number
  ): ReviewRecord {
    const now = Date.now()
    if (!currentRecord) {
      // First review
      const initialStability = quality >= 4 ? 2.5 : quality >= 3 ? 1.0 : 0.3
      return {
        conceptId,
        stabilityDays: initialStability,
        lastReviewedAt: now,
        reviewCount: 1,
        retrievalQuality: quality,
        history: [{ reviewedAt: now, quality, latencyMs }],
      }
    }

    const elapsedDays = (now - currentRecord.lastReviewedAt) / (1000 * 60 * 60 * 24)
    let newStability = currentRecord.stabilityDays

    if (quality >= 3) {
      // Successful retrieval: stability expands
      const factor = 1.0 + (quality - 2) * 0.65
      // Desirable difficulty bonus: if retrieved close to forgetting threshold, stability multiplies more
      const difficultyBonus = Math.min(1.8, Math.max(1.0, elapsedDays / currentRecord.stabilityDays))
      newStability = Math.round(currentRecord.stabilityDays * factor * difficultyBonus * 10) / 10
    } else {
      // Retrieval failure (lapse): stability collapses to consolidation baseline
      newStability = Math.max(0.4, Math.round(currentRecord.stabilityDays * 0.3 * 10) / 10)
    }

    return {
      conceptId,
      stabilityDays: Math.min(365, newStability),
      lastReviewedAt: now,
      reviewCount: currentRecord.reviewCount + 1,
      retrievalQuality: quality,
      history: [...currentRecord.history, { reviewedAt: now, quality, latencyMs }],
    }
  }

  /**
   * Categorizes items into Overdue (R < 0.85), Due Soon, or Solid
   */
  public static getQueue(concepts: ConceptItem[] = CURATED_CONCEPTS) {
    const records = this.getRecords()
    const overdue: { concept: ConceptItem; retention: number; record?: ReviewRecord }[] = []
    const upcoming: { concept: ConceptItem; retention: number; record?: ReviewRecord }[] = []
    const unlearned: ConceptItem[] = []

    concepts.forEach((concept) => {
      const rec = records[concept.id]
      if (!rec) {
        unlearned.push(concept)
      } else {
        const retention = this.calculateRetention(rec)
        if (retention < 0.85) {
          overdue.push({ concept, retention, record: rec })
        } else {
          upcoming.push({ concept, retention, record: rec })
        }
      }
    })

    return { overdue, upcoming, unlearned }
  }
}
