// lib/fatigue-engine.ts
// Intra-Individual Response Time Variability (IIV) & Neural Fatigue Monitoring Engine
// Grounded in psychometric vigilance research & neuroplastic protection protocols

export interface LatencySample {
  timestamp: number
  latencyMs: number
  isError: boolean
}

export type FatigueState = "fresh" | "optimal" | "attenuating" | "exhausted"

export interface FatigueStatus {
  baselineIIV: number // sigma_0 in ms
  currentIIV: number // sliding window sigma_k in ms
  meanLatency: number // sliding window mean in ms
  fatigueRatio: number // currentIIV / baselineIIV
  state: FatigueState
  shouldTerminateEarly: boolean
  advisory: string
  sampleCount: number
}

export class FatigueMonitor {
  private static STORAGE_KEY = "humaneval_fatigue_session_v2"
  private static BASELINE_WINDOW = 8 // First 8 samples calibrate baseline
  private static SLIDING_WINDOW = 6 // Last 6 samples compute real-time variance

  public static getSessionSamples(): LatencySample[] {
    if (typeof window === "undefined") return []
    try {
      const data = sessionStorage.getItem(this.STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  public static recordSample(latencyMs: number, isError: boolean = false): FatigueStatus {
    const samples = this.getSessionSamples()
    const newSample: LatencySample = {
      timestamp: Date.now(),
      latencyMs: Math.max(80, Math.min(15000, latencyMs)),
      isError,
    }
    samples.push(newSample)

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(samples))
      } catch {
        // Fallback
      }
    }

    return this.evaluate(samples)
  }

  public static resetSession() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(this.STORAGE_KEY)
    }
  }

  public static evaluate(samples: LatencySample[] = this.getSessionSamples()): FatigueStatus {
    if (samples.length < 4) {
      return {
        baselineIIV: 45,
        currentIIV: 45,
        meanLatency: samples.length > 0 ? Math.round(samples.reduce((a, b) => a + b.latencyMs, 0) / samples.length) : 320,
        fatigueRatio: 1.0,
        state: "fresh",
        shouldTerminateEarly: false,
        advisory: "Calibrating baseline attentional vigilance...",
        sampleCount: samples.length,
      }
    }

    // Baseline calculation: first N samples
    const baselineSlice = samples.slice(0, Math.min(this.BASELINE_WINDOW, samples.length))
    const baselineIIV = Math.max(25, this.calculateStandardDeviation(baselineSlice.map((s) => s.latencyMs)))

    // Sliding window: last M samples
    const recentSlice = samples.slice(-Math.min(this.SLIDING_WINDOW, samples.length))
    const currentIIV = this.calculateStandardDeviation(recentSlice.map((s) => s.latencyMs))
    const meanLatency = Math.round(recentSlice.reduce((a, b) => a + b.latencyMs, 0) / recentSlice.length)

    const fatigueRatio = Math.round((currentIIV / baselineIIV) * 100) / 100

    let state: FatigueState = "optimal"
    let shouldTerminateEarly = false
    let advisory = "Neural vigilance stable. Executive control network fully primed."

    if (fatigueRatio < 1.15) {
      state = "fresh"
      advisory = "Pristine attentional stability. Near-zero attentional lapses detected."
    } else if (fatigueRatio < 1.45) {
      state = "optimal"
      advisory = "Working within optimal neuroplastic challenge window."
    } else if (fatigueRatio < 1.65) {
      state = "attenuating"
      advisory = "Mild attentional jitter detected. Micro-lapses increasing. Maintain focus."
    } else {
      state = "exhausted"
      shouldTerminateEarly = true
      advisory =
        "CRITICAL: Intra-individual variability exceeded 1.65x baseline. Neural fatigue threshold reached. Terminate session now to prevent consolidating noisy motor/cognitive pathways."
    }

    return {
      baselineIIV: Math.round(baselineIIV),
      currentIIV: Math.round(currentIIV),
      meanLatency,
      fatigueRatio,
      state,
      shouldTerminateEarly,
      advisory,
      sampleCount: samples.length,
    }
  }

  private static calculateStandardDeviation(values: number[]): number {
    if (values.length < 2) return 30
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1)
    return Math.sqrt(variance)
  }
}
