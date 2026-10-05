"use client"

import React from "react"

interface RadarChartProps {
  scores: Record<string, number> // { Speed: 80, Memory: 65, Motor: 92, Language: 70, Vision: 85 }
  size?: number
}

export default function CognitiveRadarChart({ scores, size = 320 }: RadarChartProps) {
  const categories = [
    { key: "Speed", label: "SPEED ⚡" },
    { key: "Memory", label: "MEMORY 🧠" },
    { key: "Motor", label: "MOTOR 🎯" },
    { key: "Language", label: "LANGUAGE 📖" },
    { key: "Vision", label: "VISION 👁️" },
  ]

  const center = size / 2
  const radius = size * 0.36
  const total = categories.length

  // Calculate coordinates for a category at a given ratio (0 to 1)
  const getCoordinates = (index: number, ratio: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2
    const r = radius * ratio
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  // Polygon web grid levels: 25%, 50%, 75%, 100%
  const levels = [0.25, 0.5, 0.75, 1.0]

  // Compute data polygon path
  const dataPoints = categories.map((cat, i) => {
    const raw = scores[cat.key] ?? 50
    const ratio = Math.max(0.15, Math.min(1.0, raw / 100))
    return getCoordinates(i, ratio)
  })

  const dataPath = dataPoints.reduce((acc, pt, i) => {
    return `${acc} ${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`
  }, "") + " Z"

  return (
    <div className="relative flex flex-col items-center justify-center font-mono">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grids */}
        {levels.map((lvl) => {
          const gridPath = categories.reduce((acc, _, i) => {
            const pt = getCoordinates(i, lvl)
            return `${acc} ${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`
          }, "") + " Z"

          return (
            <path
              key={lvl}
              d={gridPath}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeWidth="1.5"
            />
          )
        })}

        {/* Spoke Axes */}
        {categories.map((_, i) => {
          const pt = getCoordinates(i, 1.0)
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={pt.x}
              y2={pt.y}
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeWidth="1.5"
            />
          )
        })}

        {/* User Data Polygon */}
        <path
          d={dataPath}
          className="fill-amber-400/25 dark:fill-cyan-400/25 stroke-black dark:stroke-white stroke-[2.5]"
        />

        {/* Data Vertices (Square Brutalist Nodes) */}
        {dataPoints.map((pt, i) => (
          <rect
            key={i}
            x={pt.x - 4}
            y={pt.y - 4}
            width={8}
            height={8}
            className="fill-amber-400 dark:fill-cyan-400 stroke-black dark:stroke-white stroke-[1.5]"
          />
        ))}

        {/* Axis Labels */}
        {categories.map((cat, i) => {
          const labelPt = getCoordinates(i, 1.25)
          const val = scores[cat.key] ?? 50
          return (
            <g key={cat.key}>
              <text
                x={labelPt.x}
                y={labelPt.y - 4}
                textAnchor="middle"
                dominantBaseline="central"
                fill="currentColor"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="900"
              >
                {cat.label}
              </text>
              <text
                x={labelPt.x}
                y={labelPt.y + 11}
                textAnchor="middle"
                dominantBaseline="central"
                fill="currentColor"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                className="text-amber-500 dark:text-cyan-400"
              >
                {val}%
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
