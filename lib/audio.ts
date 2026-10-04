// Web Audio API Synthesizer - Ultra-low latency, zero external asset dependencies

class SoundEngine {
  private ctx: AudioContext | null = null
  private muted: boolean = false

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("humaneval_audio_muted")
      this.muted = saved === "true"
    }
  }

  private initContext() {
    if (typeof window === "undefined") return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume()
    }
    return this.ctx
  }

  public isMuted(): boolean {
    return this.muted
  }

  public toggleMute(): boolean {
    this.muted = !this.muted
    if (typeof window !== "undefined") {
      localStorage.setItem("humaneval_audio_muted", String(this.muted))
    }
    return this.muted
  }

  public setMute(muted: boolean) {
    this.muted = muted
    if (typeof window !== "undefined") {
      localStorage.setItem("humaneval_audio_muted", String(this.muted))
    }
  }

  // Play a simple frequency beep
  public playTone(frequency: number, type: OscillatorType = "sine", durationMs: number = 100, volume: number = 0.15) {
    if (this.muted) return
    const ctx = this.initContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(frequency, ctx.currentTime)

      gain.gain.setValueAtTime(volume, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + durationMs / 1000)
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Tactile click (aim trainer miss, keypress, button)
  public playClick() {
    this.playTone(320, "triangle", 35, 0.08)
  }

  // High-frequency target pop
  public playTargetHit() {
    if (this.muted) return
    const ctx = this.initContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(700, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.06)

      gain.gain.setValueAtTime(0.2, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.07)
    } catch {
      // Audio policy
    }
  }

  // Musical note for sequence memory (pentatonic scale)
  public playTileNote(index: number) {
    // 9 distinct pleasant frequencies (A minor pentatonic / blues scale)
    const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99]
    const freq = notes[index % notes.length]
    this.playTone(freq, "sine", 280, 0.22)
  }

  // Green reaction trigger / success
  public playSuccess() {
    if (this.muted) return
    const ctx = this.initContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "triangle"
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.setValueAtTime(880, now + 0.08)

      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(now + 0.25)
    } catch {
      // Audio policy
    }
  }

  // Failure buzzer
  public playError() {
    if (this.muted) return
    const ctx = this.initContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sawtooth"
      osc.frequency.setValueAtTime(150, now)
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.2)

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(now + 0.2)
    } catch {
      // Audio policy
    }
  }

  // Typing key click
  public playKeyType() {
    this.playTone(400 + Math.random() * 80, "triangle", 25, 0.04)
  }
}

export const sound = new SoundEngine()
