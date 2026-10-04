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
    { href: "/facility/relational", label: "Relational Gym (RIT)", icon: Layers, badge: "Gf" },
    { href: "/facility/retrieval", label: "Reconstructive Retrieval", icon: Repeat, badge: "Recall" },
    { href: "/facility/calibration", label: "Metacognitive Calibration", icon: Compass, badge: "Brier" },
    { href: "/facility/transfer", label: "Transfer Verification", icon: Sparkles, badge: "Audits" },
    { href: "/facility/feynman", label: "Feynman Arena", icon: Zap, badge: "v2.0" },
  ]

  const getFatigueBadge = () => {
    if (!fatigue) return null
    if (fatigue.state === "exhausted") {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>IIV HIGH ({fatigue.fatigueRatio}x) — REST REQUIRED</span>
        </div>
      )
    }
    if (fatigue.state === "attenuating") {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
          <Activity className="w-3.5 h-3.5" />
          <span>IIV DRIFT ({fatigue.fatigueRatio}x)</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
        <Activity className="w-3.5 h-3.5" />
        <span>VIGILANCE NOMINAL ({fatigue.fatigueRatio}x)</span>
      </div>
    )
  }

  return (
    <div className="w-full border-b border-border/50 bg-background/60 backdrop-blur-md sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Navigation tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => sound.playClick()}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-bold"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/40"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1 rounded font-semibold ${
                      isActive ? "bg-cyan-400/20 text-cyan-300" : "bg-muted text-muted-foreground"
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
