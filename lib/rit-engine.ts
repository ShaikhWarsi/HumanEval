// lib/rit-engine.ts
// Relational Integration Training (RIT) Engine
// Grounded in Wang et al. (2025) & 2026 Fluid Intelligence (Gf) relational research

export type RelationalModality = "numerical" | "spatial" | "verbal" | "causal" | "scientific"

export interface RelationalPremise {
  id: string
  entityA: string
  entityB: string
  relation: ">" | "<" | "=" | "2x" | "half" | "causes" | "inhibits"
}

export interface RelationalItem {
  id: string
  modality: RelationalModality
  depth: number // R1 to R4+
  interferenceDensity: number // 0.0 to 1.0 (distractor density)
  premises: RelationalPremise[]
  targetEntityA: string
  targetEntityB: string
  correctDeduction: string
  options: string[]
  timeLimitMs: number
  explanation: string
}

export class RelationalEngine {
  /**
   * Generates an adaptive relational integration problem scaled by user ability theta [-3.0 to +3.0]
   */
  public static generateAdaptiveItem(theta: number, modality: RelationalModality): RelationalItem {
    let depth = 2
    if (theta < -0.8) depth = 1
    else if (theta < 0.6) depth = 2
    else if (theta < 1.8) depth = 3
    else depth = 4 // Apex relational integration

    const interference = Math.max(0.1, Math.min(0.85, (theta + 3.0) / 6.0))
    const timeLimitMs = Math.max(7000, Math.round(24000 - theta * 2800))

    return this.buildItem(depth, modality, interference, timeLimitMs)
  }

  private static buildItem(
    depth: number,
    modality: RelationalModality,
    interference: number,
    timeLimitMs: number
  ): RelationalItem {
    const id = `rit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`

    if (modality === "numerical") {
      if (depth === 1) {
        return {
          id,
          modality,
          depth,
          interferenceDensity: interference,
          premises: [
            { id: "p1", entityA: "Voltage X", entityB: "Voltage Y", relation: ">" },
          ],
          targetEntityA: "Voltage X",
          targetEntityB: "Voltage Y",
          correctDeduction: "Voltage X is greater than Voltage Y",
          options: [
            "Voltage X is greater than Voltage Y",
            "Voltage Y is greater than Voltage X",
            "Voltage X equals Voltage Y",
            "Indeterminate relation",
          ],
          timeLimitMs,
          explanation: "Direct relational comparison from single premise.",
        }
      }

      if (depth === 2) {
        return {
          id,
          modality,
          depth,
          interferenceDensity: interference,
          premises: [
            { id: "p1", entityA: "Asset Alpha", entityB: "Asset Beta", relation: ">" },
            { id: "p2", entityA: "Asset Beta", entityB: "Asset Gamma", relation: ">" },
          ],
          targetEntityA: "Asset Alpha",
          targetEntityB: "Asset Gamma",
          correctDeduction: "Asset Alpha > Asset Gamma",
          options: [
            "Asset Alpha > Asset Gamma",
            "Asset Gamma > Asset Alpha",
            "Asset Alpha = Asset Gamma",
            "Indeterminate without Asset Delta",
          ],
          timeLimitMs,
          explanation: "Transitive property: If Alpha > Beta and Beta > Gamma, then Alpha > Gamma.",
        }
      }

      if (depth === 3) {
        return {
          id,
          modality,
          depth,
          interferenceDensity: interference,
          premises: [
            { id: "p1", entityA: "Node X", entityB: "Node Y", relation: "2x" },
            { id: "p2", entityA: "Node Z", entityB: "Node X", relation: "<" },
            { id: "p3", entityA: "Node Y", entityB: "Node W", relation: "=" },
          ],
          targetEntityA: "Node X",
          targetEntityB: "Node W",
          correctDeduction: "Node X = 2·Node W",
          options: [
            "Node X = 2·Node W",
            "Node X = 0.5·Node W",
            "Node W > Node X",
            "Node X = Node W",
          ],
          timeLimitMs,
          explanation: "Substitute Y = W into X = 2Y yielding X = 2W.",
        }
      }

      // Depth R4
      return {
        id,
        modality,
        depth: 4,
        interferenceDensity: interference,
        premises: [
          { id: "p1", entityA: "Matrix A", entityB: "Matrix B", relation: "2x" },
          { id: "p2", entityA: "Matrix C", entityB: "Matrix A", relation: "half" },
          { id: "p3", entityA: "Matrix D", entityB: "Matrix B", relation: "=" },
          { id: "p4", entityA: "Distractor E", entityB: "Matrix C", relation: ">" },
        ],
        targetEntityA: "Matrix C",
        targetEntityB: "Matrix D",
        correctDeduction: "Matrix C = Matrix D",
        options: [
          "Matrix C = Matrix D",
          "Matrix C = 2·Matrix D",
          "Matrix D = 2·Matrix C",
          "Matrix C < Matrix D",
        ],
        timeLimitMs,
        explanation: "C = 0.5·A. Since A = 2·B, C = 0.5·(2·B) = B. Since B = D, C = D.",
      }
    }

    if (modality === "causal") {
      return {
        id,
        modality,
        depth: Math.max(2, depth),
        interferenceDensity: interference,
        premises: [
          { id: "p1", entityA: "Dopamine D1 Binding", entityB: "PKA Signaling", relation: "causes" },
          { id: "p2", entityA: "PKA Signaling", entityB: "AMPAR Exocytosis", relation: "causes" },
          { id: "p3", entityA: "Phosphatase PP1", entityB: "PKA Signaling", relation: "inhibits" },
        ],
        targetEntityA: "D1 Activation",
        targetEntityB: "AMPAR Exocytosis",
        correctDeduction: "D1 Activation promotes AMPAR Exocytosis",
        options: [
          "D1 Activation promotes AMPAR Exocytosis",
          "D1 Activation suppresses AMPAR Exocytosis",
          "D1 Activation is decoupled from AMPAR",
          "PP1 blocks D1 Activation directly",
        ],
        timeLimitMs,
        explanation: "Positive feed-forward cascade from D1 -> PKA -> AMPAR exocytosis.",
      }
    }

    // Verbal Default
    return {
      id,
      modality: "verbal",
      depth: Math.max(2, depth),
      interferenceDensity: interference,
      premises: [
        { id: "p1", entityA: "Theory Alpha", entityB: "Hypothesis Beta", relation: ">" },
        { id: "p2", entityA: "Hypothesis Beta", entityB: "Model Gamma", relation: "=" },
        { id: "p3", entityA: "Paradigm Delta", entityB: "Theory Alpha", relation: "<" },
      ],
      targetEntityA: "Paradigm Delta",
      targetEntityB: "Model Gamma",
      correctDeduction: "Indeterminate without empirical variance",
      options: [
        "Indeterminate without empirical variance",
        "Paradigm Delta > Model Gamma",
        "Paradigm Delta = Model Gamma",
        "Model Gamma > Theory Alpha",
      ],
      timeLimitMs,
      explanation: "Delta < Alpha and Gamma = Beta < Alpha; the relative magnitude between Delta and Gamma is unconstrained.",
    }
  }

  /**
   * Updates latent ability theta via Bayesian IRT EAP step
   */
  public static calculateUpdatedTheta(
    currentTheta: number,
    itemDepth: number,
    isCorrect: boolean,
    latencyMs: number,
    timeLimitMs: number
  ): number {
    const itemDifficulty = itemDepth - 2.0 // Center R2 at 0.0
    const expected = 1 / (1 + Math.exp(-(currentTheta - itemDifficulty)))
    const actual = isCorrect ? 1.0 : 0.0

    // Modulate gain by decision speed ratio
    const speedRatio = Math.max(0.4, Math.min(1.0, 1 - (latencyMs / timeLimitMs) * 0.45))
    const K = 0.28 * speedRatio

    const newTheta = currentTheta + K * (actual - expected)
    return Math.max(-3.0, Math.min(3.0, Math.round(newTheta * 1000) / 1000))
  }
}
