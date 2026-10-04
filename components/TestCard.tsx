"use client"

import Link from "next/link"
import type React from "react"
import {
  Brain,
  Zap,
  Target,
  Eye,
  Keyboard,
  BookOpen,
  Grid3X3,
  Hash,
  MessageSquare,
  Award,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"
import { useScore } from "@/lib/score-context"
import { BENCHMARKS } from "@/lib/benchmarks"

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Grid3X3,
  Target,
  Hash,
  MessageSquare,
  Brain,
  Eye,
  Keyboard,
  BookOpen,
}

interface TestCardProps {
  id: string
  title: string
  description: string
  icon: string
  color: string
  bgColor: string
  category: string
  isNew?: boolean
}

export default function TestCard({
  id,
  title,
  description,
  icon,
  color,
  bgColor,
  category,
  isNew,
}: TestCardProps) {
  const IconComponent = iconMap[icon] || Brain
  const { getBestScore } = useScore()
  const best = getBestScore(id)
  const meta = BENCHMARKS[id]

  return (
    <Link href={`/tests/${id}`} className="block h-full group">
      <div className="cyber-card rounded-2xl p-6 h-full flex flex-col justify-between relative overflow-hidden transition-all duration-200 group-hover:-translate-y-1">
        {/* Glow corner ambient */}
        <div
          className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-10 group-hover:opacity-25 transition-opacity"
          style={{ backgroundColor: meta?.color || "#00F0FF" }}
        />

        <div>
          {/* Top row badges */}
          <div className="flex items-center justify-between mb-5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 border border-white/10"
              style={{
                backgroundColor: `${meta?.color || "#00F0FF"}15`,
                color: meta?.color || "#00F0FF",
              }}
            >
              <IconComponent className="w-6 h-6" />
            </div>

            <div className="flex items-center gap-1.5">
              {isNew && (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 font-semibold">
                  New
                </span>
              )}
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border/40">
                {category}
              </span>
            </div>
          </div>

          {/* Title & Desc */}
          <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-cyan-400 transition-colors mb-2">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Footer Score or Prompt */}
        <div className="pt-5 mt-5 border-t border-border/40 flex items-center justify-between">
          {best ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground font-mono">Best:</span>
              <span className="font-mono font-bold text-sm text-foreground tabular">
                {best.score}
                <span className="text-xs text-muted-foreground ml-0.5">{best.unit}</span>
              </span>
              {best.percentile && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Top {Math.round(100 - best.percentile)}%
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground group-hover:text-cyan-400 transition-colors font-medium flex items-center gap-1">
              Start Test <ChevronRight className="w-3.5 h-3.5" />
            </span>
          )}

          <div className="w-7 h-7 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  )
}
