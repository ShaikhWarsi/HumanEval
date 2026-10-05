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
  category,
  isNew,
}: TestCardProps) {
  const IconComponent = iconMap[icon] || Brain
  const { getBestScore } = useScore()
  const best = getBestScore(id)
  const meta = BENCHMARKS[id]

  return (
    <Link href={`/tests/${id}`} className="block h-full group">
      <div className="brutal-card p-6 h-full flex flex-col justify-between relative group select-none">
        <div>
          {/* Top row */}
          <div className="flex items-center justify-between mb-5">
            <div className="w-12 h-12 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black flex items-center justify-center shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] transition-transform">
              <IconComponent className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="flex items-center gap-1.5 font-mono">
              {isNew && (
                <span className="text-[10px] uppercase px-2 py-0.5 border border-black dark:border-white bg-pink-500 text-white font-black shadow-[1.5px_1.5px_0px_0px_#0A0A0A]">
                  NEW
                </span>
              )}
              <span className="text-[11px] uppercase px-2 py-0.5 border border-black dark:border-white bg-secondary text-foreground font-bold shadow-[1.5px_1.5px_0px_0px_#0A0A0A] dark:shadow-[1.5px_1.5px_0px_0px_#FFFFFF]">
                {category}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-lg font-black tracking-tight text-foreground group-hover:text-amber-500 dark:group-hover:text-cyan-400 uppercase font-mono transition-colors mb-2">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 font-mono">
            {description}
          </p>
        </div>

        {/* Footer Score or Action */}
        <div className="pt-4 mt-5 border-t-2 border-black dark:border-white flex items-center justify-between font-mono">
          {best ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground uppercase font-bold">Best:</span>
              <span className="font-bold text-sm text-foreground tabular">
                {best.score}
                <span className="text-xs text-muted-foreground ml-0.5">{best.unit}</span>
              </span>
              {best.percentile && (
                <span className="text-[10px] font-black px-1.5 py-0.5 border border-black dark:border-white bg-emerald-400 text-black shadow-[1px_1px_0px_0px_#0A0A0A]">
                  Top {Math.max(1, Math.round(100 - best.percentile))}%
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-foreground group-hover:text-amber-500 dark:group-hover:text-cyan-400 transition-colors font-bold uppercase flex items-center gap-1">
              Start Test <ChevronRight className="w-3.5 h-3.5" />
            </span>
          )}

          <div className="w-8 h-8 border-2 border-black dark:border-white bg-card text-foreground group-hover:bg-amber-400 dark:group-hover:bg-cyan-400 group-hover:text-black flex items-center justify-center shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] transition-all">
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </div>
        </div>
      </div>
    </Link>
  )
}
