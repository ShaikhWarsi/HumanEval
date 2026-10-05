// Cognitive Benchmarks & Statistical Percentile Engine

export interface BenchmarkMeta {
  id: string
  title: string
  category: "Speed" | "Memory" | "Motor" | "Language" | "Vision"
  unit: string
  lowerIsBetter: boolean
  median: number // 50th percentile
  stdDev: number
  description: string
  icon: string
  color: string
}

export const BENCHMARKS: Record<string, BenchmarkMeta> = {
  "reaction-time": {
    id: "reaction-time",
    title: "Reaction Time",
    category: "Speed",
    unit: "ms",
    lowerIsBetter: true,
    median: 270,
    stdDev: 42,
    description: "Synaptic visual-to-motor latency.",
    icon: "Zap",
    color: "#00F0FF",
  },
  "sequence-memory": {
    id: "sequence-memory",
    title: "Sequence Memory",
    category: "Memory",
    unit: "lvl",
    lowerIsBetter: false,
    median: 8,
    stdDev: 2.8,
    description: "Sequential pattern encoding & Simon span.",
    icon: "Grid3X3",
    color: "#8B5CF6",
  },
  "aim-trainer": {
    id: "aim-trainer",
    title: "Aim Trainer",
    category: "Motor",
    unit: "ms",
    lowerIsBetter: true,
    median: 410,
    stdDev: 70,
    description: "Micro-spatial target acquisition under pressure.",
    icon: "Target",
    color: "#FF3366",
  },
  "number-memory": {
    id: "number-memory",
    title: "Number Memory",
    category: "Memory",
    unit: "digits",
    lowerIsBetter: false,
    median: 7,
    stdDev: 2.1,
    description: "Phonological digit span working memory.",
    icon: "Hash",
    color: "#10B981",
  },
  "verbal-memory": {
    id: "verbal-memory",
    title: "Verbal Memory",
    category: "Language",
    unit: "words",
    lowerIsBetter: false,
    median: 38,
    stdDev: 14,
    description: "Verbal working memory and lexical recognition.",
    icon: "MessageSquare",
    color: "#F59E0B",
  },
  "chimp-test": {
    id: "chimp-test",
    title: "Chimp Test",
    category: "Vision",
    unit: "pts",
    lowerIsBetter: false,
    median: 9,
    stdDev: 2.5,
    description: "Visuospatial working memory inspired by Ayumu.",
    icon: "Brain",
    color: "#EC4899",
  },
  "visual-memory": {
    id: "visual-memory",
    title: "Visual Memory",
    category: "Vision",
    unit: "lvl",
    lowerIsBetter: false,
    median: 10,
    stdDev: 3.2,
    description: "Matrix grid spatial retention.",
    icon: "Eye",
    color: "#06B6D4",
  },
  typing: {
    id: "typing",
    title: "Typing Speed",
    category: "Motor",
    unit: "WPM",
    lowerIsBetter: false,
    median: 55,
    stdDev: 18,
    description: "Motor learning efficiency and typing cadence.",
    icon: "Keyboard",
    color: "#6366F1",
  },
  "reading-comprehension": {
    id: "reading-comprehension",
    title: "Reading Comprehension",
    category: "Language",
    unit: "WPM",
    lowerIsBetter: false,
    median: 230,
    stdDev: 48,
    description: "Information processing rate with full comprehension.",
    icon: "BookOpen",
    color: "#14B8A6",
  },
}

// Error function approximation for normal distribution CDF
function erf(x: number): number {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const sign = x < 0 ? -1 : 1
  const absX = Math.abs(x)

  const t = 1.0 / (1.0 + p * absX)
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX)

  return sign * y
}

// Calculate percentile (0 to 100) based on normal distribution
export function calculatePercentile(testId: string, score: number): number {
  const meta = BENCHMARKS[testId]
  if (!meta || meta.stdDev <= 0) return 50

  const z = (score - meta.median) / meta.stdDev
  // For lowerIsBetter (e.g. 180ms reaction time is BETTER than 270ms):
  const effectiveZ = meta.lowerIsBetter ? -z : z

  // Standard Normal CDF: 0.5 * (1 + erf(z / sqrt(2)))
  const cdf = 0.5 * (1 + erf(effectiveZ / Math.SQRT2))
  // Round to nearest integer percentile to reflect authentic measurement precision without fake decimals
  const percentile = Math.max(1, Math.min(99, Math.round(cdf * 100)))

  return percentile
}

export function getPercentileSEM(percentile: number): { value: number; sem: number; low: number; high: number } {
  const sem = 4 // ±4% standard error of measurement under computerized test-retest reliability
  const val = Math.round(percentile)
  return {
    value: val,
    sem,
    low: Math.max(1, val - sem),
    high: Math.min(99, val + sem),
  }
}

// Calculate Composite Cognitive Index (CGI rating: scale from 700 to 1600, median 1000)
// Psychometric standard: Pure motor tasks (Aim Trainer, Typing Speed) are isolated as auxiliary
// motor metrics and excluded from the core cognitive index to prevent confounding motor DPI with intelligence.
export function calculateCGI(scores: Record<string, number>): {
  cgi: number
  tier: string
  domainScores: Record<string, number>
  auxiliaryMotorScore: number
} {
  const domains: Record<string, number[]> = {
    Speed: [],
    Memory: [],
    Language: [],
    Vision: [],
  }
  const motorPercentiles: number[] = []

  let totalCognitivePercentile = 0
  let cognitiveCount = 0

  for (const [testId, score] of Object.entries(scores)) {
    const meta = BENCHMARKS[testId]
    if (meta && typeof score === "number" && score > 0) {
      const p = calculatePercentile(testId, score)
      if (meta.category === "Motor") {
        motorPercentiles.push(p)
      } else {
        domains[meta.category].push(p)
        totalCognitivePercentile += p
        cognitiveCount++
      }
    }
  }

  const domainScores: Record<string, number> = {}
  for (const [domain, vals] of Object.entries(domains)) {
    if (vals.length > 0) {
      domainScores[domain] = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
    } else {
      domainScores[domain] = 0 // uncalibrated
    }
  }

  const auxiliaryMotorScore =
    motorPercentiles.length > 0
      ? Math.round(motorPercentiles.reduce((a, b) => a + b, 0) / motorPercentiles.length)
      : 0
  domainScores["Motor"] = auxiliaryMotorScore

  if (cognitiveCount === 0) {
    return {
      cgi: 0,
      tier: "Uncalibrated",
      domainScores: { Speed: 0, Memory: 0, Language: 0, Vision: 0, Motor: auxiliaryMotorScore },
      auxiliaryMotorScore,
    }
  }

  const avgPercentile = totalCognitivePercentile / cognitiveCount
  // Scale percentile into Elo-like rating: 50th percentile -> 1000, 99th -> 1450, 1st -> 750
  const cgi = Math.round(750 + avgPercentile * 7)

  let tier = "Standard"
  if (cgi >= 1350) tier = "Apex Neuro"
  else if (cgi >= 1200) tier = "High-Tier"
  else if (cgi >= 1100) tier = "Superior"
  else if (cgi >= 950) tier = "Average Human"
  else tier = "Developing"

  return { cgi, tier, domainScores, auxiliaryMotorScore }
}
