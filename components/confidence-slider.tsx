// components/confidence-slider.tsx
"use client"

import { useId } from "react"
import { sound } from "@/lib/audio"

interface ConfidenceSliderProps {
  value: number // 0.0 to 1.0 (e.g. 0.75 = 75%)
  onChange: (val: number) => void
  disabled?: boolean
}

export function ConfidenceSlider({ value, onChange, disabled = false }: ConfidenceSliderProps) {
  const percent = Math.round(value * 100)
  const sliderId = useId()

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = Math.round(Number(e.target.value)) / 100
    onChange(nextVal)
  }

  const presets = [
    { label: "10%", val: 0.1, desc: "Near certain FALSE" },
    { label: "30%", val: 0.3, desc: "Leaning FALSE" },
    { label: "50%", val: 0.5, desc: "Pure Coin Toss" },
    { label: "75%", val: 0.75, desc: "Strong Hypothesis" },
    { label: "90%", val: 0.9, desc: "High Confidence" },
    { label: "99%", val: 0.99, desc: "Certain TRUE" },
  ]

  // Color semantics based on probability
  const getZoneColor = () => {
    if (percent < 40) return "text-amber-400 border-amber-500/30 bg-amber-500/10"
    if (percent <= 60) return "text-zinc-400 border-zinc-500/30 bg-zinc-500/10"
    if (percent <= 85) return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10"
    return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
  }

  const getZoneInterpretation = () => {
    if (percent <= 15) return "Conviction: Proposition is FALSE (≤15%)"
    if (percent <= 40) return "Skepticism: Likely False (16%–40%)"
    if (percent <= 60) return "Max Uncertainty: 50/50 Coin Toss (41%–60%)"
    if (percent <= 85) return "Belief: Probable True (61%–85%)"
    return "Conviction: Proposition is TRUE (86%–100%)"
  }

  // Pre-calculate Brier Penalties (p - outcome)^2
  const brierIfTrue = Math.round(Math.pow(value - 1.0, 2) * 1000) / 1000
  const brierIfFalse = Math.round(Math.pow(value - 0.0, 2) * 1000) / 1000

  return (
    <div className="w-full space-y-4 font-mono">
      {/* Readout Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-border/60 bg-muted/20">
        <div>
          <label htmlFor={sliderId} className="text-xs uppercase tracking-wider text-muted-foreground block">
            Subjective Credence / Assessed Probability
          </label>
          <span className="text-xs text-foreground/80 font-sans">{getZoneInterpretation()}</span>
        </div>

        <div className={`px-3 py-1.5 rounded-lg border font-bold text-lg tabular flex items-center gap-2 self-start sm:self-auto ${getZoneColor()}`}>
          <span>{percent}%</span>
          <span className="text-[10px] uppercase font-normal opacity-70">
            {value >= 0.5 ? "TRUE" : "FALSE"}
          </span>
        </div>
      </div>

      {/* Main Range Input */}
      <div className="relative pt-2">
        <input
          id={sliderId}
          type="range"
          min="0"
          max="100"
          step="1"
          value={percent}
          disabled={disabled}
          onChange={handleSliderChange}
          className="w-full h-2.5 bg-muted rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {/* Ticks */}
        <div className="flex justify-between text-[10px] text-muted-foreground mt-2 px-1">
          <span>0% (Certain False)</span>
          <span className="text-amber-400/80">50% (Max Entropy)</span>
          <span>100% (Certain True)</span>
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1">
        {presets.map((p) => {
          const isSelected = Math.abs(value - p.val) < 0.03
          return (
            <button
              key={p.val}
              type="button"
              disabled={disabled}
              onClick={() => {
                onChange(p.val)
                sound.playClick()
              }}
              className={`px-2 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                isSelected
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm"
                  : "bg-muted/30 text-muted-foreground border-border/40 hover:text-foreground hover:bg-muted/60"
              } disabled:opacity-40`}
            >
              <div className="font-bold">{p.label}</div>
              <div className="text-[9px] opacity-70 truncate">{p.desc}</div>
            </button>
          )
        })}
      </div>

      {/* Real-time Brier Penalty Preview */}
      <div className="grid grid-cols-2 gap-2 text-[11px] p-2 rounded-lg bg-background/50 border border-border/30">
        <div>
          <span className="text-muted-foreground">If proposition is TRUE: </span>
          <span className={`font-bold tabular ${brierIfTrue <= 0.1 ? "text-emerald-400" : "text-amber-400"}`}>
            Brier Penalty: {brierIfTrue}
          </span>
        </div>
        <div className="text-right">
          <span className="text-muted-foreground">If proposition is FALSE: </span>
          <span className={`font-bold tabular ${brierIfFalse <= 0.1 ? "text-emerald-400" : "text-amber-400"}`}>
            Brier Penalty: {brierIfFalse}
          </span>
        </div>
      </div>
    </div>
  )
}
