// lib/engine/prng.ts
/**
 * Deterministic Pseudo-Random Number Generator (PRNG) for HumanEval.
 * Ensures 100% reproducible cognitive trials, session replay, and scientific verification.
 */

export class SeededPRNG {
  private state: number

  constructor(seed?: number) {
    this.state = seed !== undefined ? (seed >>> 0) : Math.floor(Math.random() * 2147483647)
  }

  /**
   * Mulberry32 algorithm: 32-bit state generator with excellent statistical distribution.
   */
  next(): number {
    let t = (this.state += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  getSeed(): number {
    return this.state
  }

  setSeed(seed: number): void {
    this.state = seed >>> 0
  }

  /** Float in [min, max) */
  range(min: number, max: number): number {
    return min + this.next() * (max - min)
  }

  /** Integer in [min, max] inclusive */
  int(min: number, max: number): number {
    const low = Math.ceil(min)
    const high = Math.floor(max)
    return Math.floor(this.next() * (high - low + 1)) + low
  }

  /** Integer alias in [min, max] inclusive */
  integer(min: number, max: number): number {
    return this.int(min, max)
  }

  /** Pick one random element from an array */
  choice<T>(items: readonly T[]): T {
    if (items.length === 0) throw new Error("Cannot pick from empty array")
    return items[Math.floor(this.next() * items.length)]
  }

  /** Sample k items without replacement */
  sample<T>(items: readonly T[], k: number): T[] {
    const copy = [...items]
    const result: T[] = []
    const count = Math.min(k, copy.length)
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(this.next() * copy.length)
      result.push(copy[idx])
      copy.splice(idx, 1)
    }
    return result
  }

  /** Fisher-Yates array shuffle */
  shuffle<T>(array: readonly T[]): T[] {
    const copy = [...array]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
  }

  /** Boolean with probability p of true (default 0.5) */
  boolean(p: number = 0.5): boolean {
    return this.next() < p
  }
}

/** Global convenience PRNG instance */
export const defaultPRNG = new SeededPRNG()
