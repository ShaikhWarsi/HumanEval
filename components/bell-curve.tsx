"use client"

import React from "react"
import { BENCHMARKS } from "@/lib/benchmarks"

interface BellCurveProps {
  testId: string
  score: number
  unit: string
  percentile: number
}

export default function BellCurve({ testId, score, unit, percentile }: BellCurveProps) {
  const meta = BENCHMARKS[testId]
  if (!meta) return null

  // Generate normal distribution curve points
  const points: { x: number; y: number }[] = []
  const width = 360
  const height = 120
  const paddingX = 20

  // 3 standard deviations left and right of median
  const minVal = meta.median - 3 * meta.stdDev
  const maxVal = meta.median + 3 * meta.stdDev

  const gaussian = (v: number) => {
    const exponent = -0.5 * Math.pow((v - meta.median) / meta.stdDev, 2)
    return Math.exp(exponent)
  }

  const steps = 40
  for (let i = 0; i <= steps; i++) {
    const val = minVal + (i / steps) * (maxVal - minVal)
    const prob = gaussian(val)
    const px = paddingX + (i / steps) * (width - 2 * paddingX)
    const py = height - 15 - prob * (height - 35)
    points.push({ x: px, y: py })
  }

  const pathD = points.reduce((acc, pt, idx) => {
    return `${acc} ${idx === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`
  }, "")

  // Calculate user position on the x axis
  const clampedScore = Math.max(minVal, Math.min(maxVal, score))
  const userRatio = (clampedScore - minVal) / (maxVal - minVal)
  const userX = paddingX + userRatio * (width - 2 * paddingX)

  // Median position
  const medianX = paddingX + 0.5 * (width - 2 * paddingX)

  return (
    <div className="w-full bg-card/60 border border-border/50 rounded-xl p-4 my-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          Global Distribution Curve
        </span>
        <span className="text-xs font-mono font-bold text-cyan-400">
          Percentile: {percentile}%
        </span>
      </div>

      <div className="relative w-full h-[120px] flex items-center justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Shaded Area under curve */}
          <path
            d={`${pathD} L ${width - paddingX} ${height - 15} L ${paddingX} ${height - 15} Z`}
            fill="url(#curve-gradient)"
            opacity={0.3}
          />
          {/* Main curve line */}
          <path d={pathD} fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />

          {/* Gradients */}
          <defs>
            <linearGradient id="curve-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Median dotted line */}
          <line
            x1={medianX}
            y1={20}
            x2={medianX}
            y2={height - 15}
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <text
            x={medianX}
            y={height - 2}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="9"
            fontFamily="monospace"
          >
            Avg: {meta.median}{meta.unit}
          </text>

          {/* User Score Marker */}
          <line
            x1={userX}
            y1={10}
            x2={userX}
            y2={height - 15}
            stroke="#00F0FF"
            strokeWidth="2.5"
          />
          <circle cx={userX} cy={12} r={4.5} fill="#00F0FF" />
          <text
            x={userX}
            y={6}
            textAnchor="middle"
            fill="#00F0FF"
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            You ({score}{unit})
          </text>
        </svg>
      </div>

      <div className="mt-2 text-center text-xs text-muted-foreground">
        {percentile >= 90 ? (
          <span className="text-emerald-400 font-semibold font-mono">
            ★ Elite tier: You are in the top {Math.max(1, Math.round(100 - percentile))}% of the population.
          </span>
        ) : percentile >= 50 ? (
          <span className="text-cyan-400 font-medium font-mono">
            Above average performance. Top {Math.round(100 - percentile)}% bracket.
          </span>
        ) : (
          <span className="text-muted-foreground font-mono">
            Within standard distribution. Practice improves neural latency.
          </span>
        )}
      </div>
    </div>
  )
}
