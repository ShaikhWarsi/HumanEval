"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Brain, LayoutDashboard, User, Volume2, VolumeX, Sparkles, HelpCircle, Cpu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { sound } from "@/lib/audio"
import { useScore } from "@/lib/score-context"

export default function Navbar() {
  const pathname = usePathname()
  const { userStats } = useScore()
  const [isMuted, setIsMuted] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsMuted(sound.isMuted())
  }, [])

  const toggleSound = () => {
    const muted = sound.toggleMute()
    setIsMuted(muted)
    if (!muted) sound.playClick()
  }

  const navItems = [
    { label: "Tests", href: "/", icon: Sparkles },
    { label: "Facility", href: "/facility", icon: Cpu, badge: "OS 2.0" },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Profile", href: "/profile", icon: User },
    { label: "About", href: "/about", icon: HelpCircle },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:border-cyan-500/40 transition-all shadow-sm">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold tracking-tight text-foreground text-sm sm:text-base">
                HUMAN<span className="text-cyan-400">EVAL</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-mono hidden sm:block">Cognitive Benchmark Suite</p>
          </div>
        </Link>

        {/* Center Nav items */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="hidden lg:inline-block text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right side utilities */}
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          {mounted && (
            <button
              onClick={toggleSound}
              title={isMuted ? "Unmute SFX" : "Mute SFX"}
              className="p-2 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
          )}

          {/* CGI badge */}
          {mounted && userStats.totalGamesPlayed > 0 && (
            <Link
              href="/dashboard"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono text-xs"
            >
              <span className="text-[10px] text-muted-foreground uppercase">CGI</span>
              <span className="font-bold tabular">{userStats.cgi}</span>
            </Link>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
