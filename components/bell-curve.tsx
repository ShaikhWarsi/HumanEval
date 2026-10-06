"use client"

import React from "react"
import { BENCHMARKS, formatPercentileBadge } from "@/lib/benchmarks"

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
  const paddingX = 24

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
    const py = height - 18 - prob * (height - 38)
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

  const badge = formatPercentileBadge(percentile)

  return (
    <div className="w-full brutal-card p-5 my-5 font-mono text-left">
      <div className="flex items-center justify-between mb-3 border-b-2 border-black dark:border-white pb-2">
        <span className="text-xs uppercase font-black tracking-wider text-muted-foreground">
          [ EMPIRICAL DISTRIBUTION ]
        </span>
        <span className={`text-xs font-black px-2 py-0.5 border ${badge.badgeClass}`}>
          {badge.label} • {Math.round(percentile)}TH %ILE (±4% SEM)
        </span>
      </div>

      <div className="relative w-full h-[120px] flex items-center justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Shaded Area under curve */}
          <path
            d={`${pathD} L ${width - paddingX} ${height - 18} L ${paddingX} ${height - 18} Z`}
            className="fill-amber-400/20 dark:fill-cyan-400/20"
          />
          {/* Baseline */}
          <line
            x1={paddingX}
            y1={height - 18}
            x2={width - paddingX}
            y2={height - 18}
            stroke="currentColor"
            strokeWidth="2"
          />

          {/* Main curve line */}
          <path d={pathD} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />

          {/* Median dotted line */}
          <line
            x1={medianX}
            y1={24}
            x2={medianX}
            y2={height - 18}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
          />
          <text
            x={medianX}
            y={height - 4}
            textAnchor="middle"
            fill="currentColor"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
            opacity={0.7}
          >
            AVG {meta.median}{meta.unit}
          </text>

          {/* User Score Marker */}
          <line
            x1={userX}
            y1={14}
            x2={userX}
            y2={height - 18}
            stroke="currentColor"
            strokeWidth="3"
            className="text-amber-500 dark:text-cyan-400"
          />
          <rect
            x={userX - 4}
            y={10}
            width={8}
            height={8}
            className="fill-amber-500 dark:fill-cyan-400 stroke-black dark:stroke-white"
            strokeWidth={1.5}
          />
          <text
            x={userX}
            y={6}
            textAnchor="middle"
            fill="currentColor"
            fontSize="10"
            fontWeight="900"
            fontFamily="monospace"
            className="text-amber-500 dark:text-cyan-400"
          >
            YOU ({score}{unit})
          </text>
        </svg>
      </div>

      <div className="mt-3 pt-2 border-t-2 border-black dark:border-white text-center text-xs">
        {percentile >= 90 ? (
          <span className="text-emerald-600 dark:text-emerald-400 font-black uppercase">
            ★ ELITE TIER — TOP {Math.max(1, Math.round(100 - percentile))}% OF EMPIRICAL SAMPLES
          </span>
        ) : percentile >= 60 ? (
          <span className="text-amber-600 dark:text-cyan-400 font-bold uppercase">
            ABOVE POPULATION AVERAGE — TOP {Math.round(100 - percentile)}% BRACKET
          </span>
        ) : percentile >= 40 ? (
          <span className="text-foreground font-bold uppercase">
            POPULATION MEDIAN RANGE — BALANCED EMPIRICAL PERFORMANCE
          </span>
        ) : (
          <span className="text-muted-foreground font-bold uppercase">
            DEVELOPING BASELINE ({Math.round(percentile)}TH %ILE) — SPEED & ACCURACY ACCRETE WITH EXPOSURE
          </span>
        )}
      </div>
    </div>
  )
}
