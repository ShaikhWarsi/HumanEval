"use client"

import React from "react"

interface RadarChartProps {
  scores: Record<string, number> // { Speed: 80, Memory: 65, Motor: 92, Language: 70, Vision: 85 }
  size?: number
}

export default function CognitiveRadarChart({ scores, size = 300 }: RadarChartProps) {
  const categories = [
    { key: "Speed", label: "Speed ⚡" },
    { key: "Memory", label: "Memory 🧠" },
    { key: "Motor", label: "Motor 🎯" },
    { key: "Language", label: "Language 📖" },
    { key: "Vision", label: "Vision 👁️" },
  ]

  const center = size / 2
  const radius = size * 0.38
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
    // Normalize percentile 1-100 to ratio 0.15 - 1.0
    const ratio = Math.max(0.15, Math.min(1.0, raw / 100))
    return getCoordinates(i, ratio)
  })

  const dataPath = dataPoints.reduce((acc, pt, i) => {
    return `${acc} ${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`
  }, "") + " Z"

  return (
    <div className="relative flex flex-col items-center justify-center">
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
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
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
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
            />
          )
        })}

        {/* User Data Polygon */}
        <path
          d={dataPath}
          fill="rgba(0, 240, 255, 0.22)"
          stroke="#00F0FF"
          strokeWidth="2.5"
          className="transition-all duration-500"
        />

        {/* Data Vertices */}
        {dataPoints.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={4}
            fill="#00F0FF"
            stroke="#0b0f19"
            strokeWidth="1.5"
          />
        ))}

        {/* Axis Labels */}
        {categories.map((cat, i) => {
          const labelPt = getCoordinates(i, 1.22)
          const val = scores[cat.key] ?? 50
          return (
            <g key={cat.key}>
              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#94a3b8"
                fontSize="11"
                fontFamily="monospace"
                className="font-medium"
              >
                {cat.label}
              </text>
              <text
                x={labelPt.x}
                y={labelPt.y + 13}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#00F0FF"
                fontSize="10"
                fontFamily="monospace"
                className="font-bold"
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
