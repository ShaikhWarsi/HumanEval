"use client"

import React from "react"
import { BENCHMARKS, formatPercentileBadge, getEmpiricalDistributionCurve } from "@/lib/benchmarks"

interface BellCurveProps {
  testId: string
  score: number
  unit: string
  percentile: number
}

export default function BellCurve({ testId, score, unit, percentile }: BellCurveProps) {
  const meta = BENCHMARKS[testId]
  if (!meta) return null

  const width = 360
  const height = 120
  const paddingX = 24

  const curveData = getEmpiricalDistributionCurve(testId, score, width, height, paddingX)
  if (!curveData) return null

  const badge = formatPercentileBadge(percentile)

  return (
    <div className="w-full brutal-card p-5 my-5 font-sans text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b-2 border-black dark:border-slate-700 pb-2">
        <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-muted-foreground">
          [ EMPIRICAL QUANTILE DENSITY • {curveData.sampleSize.toUpperCase()} ]
        </span>
        <span className={`text-xs font-mono font-bold px-2 py-0.5 border border-black dark:border-slate-700 w-fit ${badge.badgeClass}`}>
          {badge.label} • {Math.round(percentile)}TH %ILE (±4% SEM)
        </span>
      </div>

      <div className="relative w-full h-[120px] flex items-center justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Shaded Area under empirical curve */}
          <path
            d={`${curveData.pathD} L ${width - paddingX} ${height - 18} L ${paddingX} ${height - 18} Z`}
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
            className="text-foreground"
          />

          {/* Main empirical curve line */}
          <path
            d={curveData.pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
            className="text-foreground"
          />

          {/* Median dotted line */}
          <line
            x1={curveData.medianX}
            y1={24}
            x2={curveData.medianX}
            y2={height - 18}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="text-muted-foreground opacity-60"
          />
          <text
            x={curveData.medianX}
            y={height - 4}
            textAnchor="middle"
            fill="currentColor"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
            className="text-muted-foreground"
          >
            MEDIAN {meta.median}{meta.unit}
          </text>

          {/* User Score Marker */}
          <line
            x1={curveData.userX}
            y1={14}
            x2={curveData.userX}
            y2={height - 18}
            stroke="currentColor"
            strokeWidth="3"
            className="text-amber-500 dark:text-sky-400"
          />
          <rect
            x={curveData.userX - 4}
            y={10}
            width={8}
            height={8}
            className="fill-amber-500 dark:fill-sky-400 stroke-black dark:stroke-slate-900"
            strokeWidth={1.5}
          />
          <text
            x={curveData.userX}
            y={6}
            textAnchor="middle"
            fill="currentColor"
            fontSize="10"
            fontWeight="900"
            fontFamily="monospace"
            className="text-amber-500 dark:text-sky-400"
          >
            YOU ({score}{unit})
          </text>
        </svg>
      </div>

      <div className="mt-3 pt-2.5 border-t-2 border-black dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
        <div>
          {percentile >= 90 ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold font-sans">
              ★ Elite Tier — Top {Math.max(1, Math.round(100 - percentile))}% of empirical samples
            </span>
          ) : percentile >= 60 ? (
            <span className="text-amber-600 dark:text-sky-400 font-bold font-sans">
              Above Population Average — Top {Math.round(100 - percentile)}% bracket
            </span>
          ) : percentile >= 40 ? (
            <span className="text-foreground font-semibold font-sans">
              Population Median Range — Balanced empirical performance
            </span>
          ) : (
            <span className="text-muted-foreground font-medium font-sans">
              Developing Baseline ({Math.round(percentile)}th percentile) — Speed & accuracy accrete with exposure
            </span>
          )}
        </div>
        <div className="text-[10px] font-mono text-muted-foreground sm:text-right">
          Ref: {curveData.sourceCitation}
        </div>
      </div>
    </div>
  )
}
