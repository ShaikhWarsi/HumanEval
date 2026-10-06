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
    { label: "Engine", href: "/engine", icon: Brain, badge: "NEW" },
    { label: "Facility", href: "/facility", icon: Cpu, badge: "OS 2.0" },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Profile", href: "/profile", icon: User },
    { label: "About", href: "/about", icon: HelpCircle },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-black dark:border-white bg-background">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black flex items-center justify-center shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] transition-transform">
            <Brain className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black tracking-tight text-foreground text-base sm:text-lg uppercase">
                HUMAN<span className="text-amber-500 dark:text-sky-400">EVAL</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 border border-black dark:border-slate-700 bg-black text-white dark:bg-white dark:text-black font-black uppercase">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-sans hidden sm:block">
              Cognitive Benchmark Suite
            </p>
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
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-sans tracking-tight transition-all border-2 ${
                  isActive
                    ? "bg-amber-400 dark:bg-sky-400 text-slate-950 border-black dark:border-slate-700 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000] font-black"
                    : "text-foreground border-transparent hover:border-black dark:hover:border-slate-700 hover:bg-secondary font-bold"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`hidden lg:inline-block text-[9px] font-mono px-1 font-black border ${
                    isActive
                      ? "border-black bg-black text-white dark:border-black dark:bg-black dark:text-white"
                      : "border-black dark:border-slate-700 bg-black text-white dark:bg-white dark:text-black"
                  }`}>
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
              className="p-2 border-2 border-black dark:border-white bg-card text-foreground shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}

          {/* CGI badge */}
          {mounted && userStats.totalGamesPlayed > 0 && (
            <Link
              href="/dashboard"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 border-2 border-black dark:border-white bg-card text-foreground shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] font-mono text-xs font-bold hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform"
            >
              <span className="text-[10px] text-muted-foreground uppercase">CGI</span>
              <span className="font-black tabular text-amber-500 dark:text-cyan-400">{userStats.cgi}</span>
            </Link>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
