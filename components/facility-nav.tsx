// components/facility-nav.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  ShieldAlert,
  Cpu,
  Repeat,
  Compass,
  Layers,
  Sparkles,
  Activity,
  Zap,
} from "lucide-react"
import { FatigueMonitor, type FatigueStatus } from "@/lib/fatigue-engine"
import { sound } from "@/lib/audio"

export function FacilityNav() {
  const pathname = usePathname()
  const [fatigue, setFatigue] = useState<FatigueStatus | null>(null)

  useEffect(() => {
    setFatigue(FatigueMonitor.evaluate())
    const interval = setInterval(() => {
      setFatigue(FatigueMonitor.evaluate())
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const navItems = [
    { href: "/facility", label: "Command Hub", icon: Cpu },
    { href: "/facility/relational", label: "Relational Gym", icon: Layers, badge: "Gf" },
    { href: "/facility/retrieval", label: "Retrieval", icon: Repeat, badge: "Recall" },
    { href: "/facility/calibration", label: "Calibration", icon: Compass, badge: "Brier" },
    { href: "/facility/transfer", label: "Transfer Audit", icon: Sparkles, badge: "τ" },
    { href: "/facility/feynman", label: "Feynman Arena", icon: Zap, badge: "v2.0" },
  ]

  const getFatigueBadge = () => {
    if (!fatigue) return null
    if (fatigue.state === "exhausted") {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 border-2 border-black dark:border-slate-700 bg-red-500 text-white text-xs font-mono font-black shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000] animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>IIV HIGH ({fatigue.fatigueRatio}x) — REST REQUIRED</span>
        </div>
      )
    }
    if (fatigue.state === "attenuating") {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 border-2 border-black dark:border-slate-700 bg-amber-400 text-slate-950 text-xs font-mono font-black shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
          <Activity className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>IIV DRIFT ({fatigue.fatigueRatio}x)</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 border-2 border-black dark:border-slate-700 bg-emerald-400 text-slate-950 text-xs font-mono font-black shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
        <Activity className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>VIGILANCE NOMINAL ({fatigue.fatigueRatio}x)</span>
      </div>
    )
  }

  return (
    <div className="w-full border-b-2 border-black dark:border-slate-700 bg-background sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Navigation tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-1 scrollbar-none font-sans text-xs">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => sound.playClick()}
                className={`flex items-center gap-2 px-3 py-1.5 uppercase transition-all border-2 border-black dark:border-slate-700 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none whitespace-nowrap ${
                  isActive
                    ? "bg-amber-400 dark:bg-sky-400 text-slate-950 font-black"
                    : "bg-card text-foreground hover:bg-secondary font-bold"
                }`}
              >
                <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono font-bold px-1 py-0.2 border ${
                      isActive
                        ? "border-black bg-black text-white"
                        : "border-black dark:border-slate-700 bg-black text-white dark:bg-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Real-time telemetry status */}
        <div className="hidden lg:flex items-center gap-3 self-end md:self-auto">
          {getFatigueBadge()}
        </div>
      </div>
    </div>
  )
}
