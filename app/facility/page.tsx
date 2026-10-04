// app/facility/page.tsx
"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Layers,
  Repeat,
  Compass,
  Sparkles,
  Zap,
  Activity,
  ArrowRight,
  ShieldCheck,
  Brain,
  Timer,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react"
import { FacilityNav } from "@/components/facility-nav"
import { FatigueMonitor, type FatigueStatus } from "@/lib/fatigue-engine"
import { sound } from "@/lib/audio"

export default function FacilityPage() {
  const [fatigue, setFatigue] = useState<FatigueStatus | null>(null)
  const [primingPingCount, setPrimingPingCount] = useState(0)
  const [lastPingTime, setLastPingTime] = useState<number | null>(null)

  useEffect(() => {
    setFatigue(FatigueMonitor.evaluate())
  }, [])

  const handlePrimingPing = () => {
    const now = Date.now()
    const simulatedLatency = lastPingTime ? Math.max(120, now - lastPingTime) : 240
    setLastPingTime(now)
    sound.playTargetHit()
    const updated = FatigueMonitor.recordSample(simulatedLatency)
    setFatigue(updated)
    setPrimingPingCount((prev) => prev + 1)
  }

  const handleResetFatigue = () => {
    sound.playClick()
    FatigueMonitor.resetSession()
    setFatigue(FatigueMonitor.evaluate())
    setPrimingPingCount(0)
    setLastPingTime(null)
  }

  const arenas = [
    {
      title: "Relational Integration Gym",
      badge: "Gf Engine",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      description:
        "Multi-premise relational binding (Wang et al., 2025). Coordinate 2 to 4+ simultaneous premises across numerical, causal, and verbal modalities.",
      metric: "Adaptive Depth R1 → R4+",
      href: "/facility/relational",
      icon: Layers,
      accent: "cyan",
    },
    {
      title: "Reconstructive Retrieval",
      badge: "Retention",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      description:
        "Desirable difficulties engine. Learn dense technical concepts, survive cognitive distraction, and execute cold reconstruction under exponential decay.",
      metric: "Stability Half-Life S (Days)",
      href: "/facility/retrieval",
      icon: Repeat,
      accent: "emerald",
    },
    {
      title: "Metacognitive Calibration",
      badge: "Tetlock Brier",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      description:
        "Assess subjective probability on continuous 0%–100% slider. Predict failure modes before feedback. Minimize quadratic Brier Score penalty.",
      metric: "Target Brier < 0.150",
      href: "/facility/calibration",
      icon: Compass,
      accent: "amber",
    },
    {
      title: "Transfer Verification Audit",
      badge: "Scientific Audit",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      description:
        "Audit true cross-domain generalization. Calculate mathematical Transfer Index τ = (0.6·Near + 0.4·Far) / Trained to eliminate task-specialization illusions.",
      metric: "Transfer Index τ ≥ 0.40",
      href: "/facility/transfer",
      icon: Sparkles,
      accent: "purple",
    },
    {
      title: "Feynman Epistemic Arena",
      badge: "v2.0 Synthesis",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      description:
        "Deconstruct complex scientific concepts into zero-jargon definitions, analogies, boundary condition stress-tests, and counter-intuitive edge cases.",
      metric: "Epistemic Rigor Score",
      href: "/facility/feynman",
      icon: Zap,
      accent: "blue",
    },
    {
      title: "Calibration Lab (Baseline 9)",
      badge: "Benchmark",
      badgeColor: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
      description:
        "Our original 9-test psychometric battery: Reaction Time, Simon Span, Ayumu Chimp Test, Visual Memory, Aim Trainer, Typing, and Reading.",
      metric: "Composite CGI Rating",
      href: "/",
      icon: Brain,
      accent: "zinc",
    },
  ]

  const abilityDomains = [
    { name: "Fluid Reasoning (Gf)", score: "θ +1.42", tier: "Advanced", pct: 76, color: "bg-cyan-500" },
    { name: "Working Memory Updating", score: "θ +1.10", tier: "Proficient", pct: 70, color: "bg-blue-500" },
    { name: "Executive Inhibitory Control", score: "θ +1.85", tier: "Superior", pct: 84, color: "bg-emerald-500" },
    { name: "Processing Speed (Inspection)", score: "θ +0.95", tier: "Nominal", pct: 64, color: "bg-amber-500" },
    { name: "Quantitative Logic", score: "θ +1.35", tier: "Advanced", pct: 74, color: "bg-indigo-500" },
    { name: "Linguistic & Causal Parsing", score: "θ +1.20", tier: "Advanced", pct: 71, color: "bg-purple-500" },
    { name: "Metacognitive Calibration", score: "BS 0.128", tier: "Calibrated", pct: 88, color: "bg-teal-500" },
  ]

  return (
    <div className="min-h-screen pb-20 dot-grid mesh-glow">
      <FacilityNav />

      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-10">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>EMPIRICAL COGNITIVE OPERATING SYSTEM // V2.0</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-5xl font-mono font-black tracking-tight text-foreground">
                COGNITIVE <span className="text-cyan-400">FACILITY</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mt-2">
                Systematic cognitive training grounded in 2020–2026 neuroscience: Relational Integration,
                Desirable Difficulties, Continuous Calibration, and Empirical Transfer Auditing.
              </p>
            </div>

            {/* Quick action badges */}
            <div className="flex items-center gap-3">
              <Link
                href="/facility/relational"
                onClick={() => sound.playClick()}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-mono font-bold text-sm hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
              >
                <span>Launch Daily Gym</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Telemetry & Fatigue Control Bar */}
        <div className="cyber-card p-6 rounded-2xl border border-border/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-mono font-bold text-foreground text-sm sm:text-base">
                  Intra-Individual Response Time Variability (IIV) Vigilance Monitor
                </h3>
                <p className="text-xs text-muted-foreground">
                  Tracks micro-lapses in prefrontal executive control to abort training before neural exhaustion.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrimingPing}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs hover:bg-cyan-500/20 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Tap Priming Ping ({primingPingCount})</span>
              </button>
              <button
                onClick={handleResetFatigue}
                title="Reset session telemetry"
                className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
              <span className="text-muted-foreground block text-[11px]">BASELINE VARIABILITY (IIV₀)</span>
              <span className="text-lg font-bold text-foreground tabular">{fatigue?.baselineIIV ?? 45} ms</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
              <span className="text-muted-foreground block text-[11px]">SLIDING VARIABILITY (IIVₖ)</span>
              <span className="text-lg font-bold text-cyan-400 tabular">{fatigue?.currentIIV ?? 45} ms</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
              <span className="text-muted-foreground block text-[11px]">FATIGUE DRIFT RATIO</span>
              <span
                className={`text-lg font-bold tabular ${
                  (fatigue?.fatigueRatio ?? 1) >= 1.65
                    ? "text-red-400"
                    : (fatigue?.fatigueRatio ?? 1) >= 1.3
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                {fatigue?.fatigueRatio ?? 1.0}x
              </span>
            </div>
            <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
              <span className="text-muted-foreground block text-[11px]">NEURAL ADVISORY</span>
              <span className="text-xs font-sans text-foreground/90 line-clamp-2">
                {fatigue?.advisory ?? "Executive vigilance calibrated."}
              </span>
            </div>
          </div>

          {fatigue?.shouldTerminateEarly && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                <strong>CRITICAL FATIGUE WARNING:</strong> Your intra-individual latency variability exceeded 1.65x
                baseline. Stop training now to avoid reinforcing sloppy synaptic noise.
              </span>
            </div>
          )}
        </div>

        {/* 45-Minute Daily Cognitive Protocol Roadmap */}
        <div className="cyber-card p-6 rounded-2xl border border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono">
              <Timer className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-bold text-foreground">Recommended 45-Minute Daily Training Protocol</h2>
            </div>
            <span className="text-xs font-mono text-muted-foreground">Modular High-Intensity Neuroplasticity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono">
            <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>PHASE 1 (5m)</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="font-bold text-sm text-foreground">Priming & IIV</div>
              <p className="text-[11px] font-sans text-muted-foreground">
                Rapid motor inspection to calibrate today&apos;s baseline latency variance.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-500/5 space-y-1">
              <div className="flex items-center justify-between text-xs text-cyan-400">
                <span>PHASE 2 (15m)</span>
                <span className="text-[10px] px-1 rounded bg-cyan-500/20 font-bold">CORE</span>
              </div>
              <div className="font-bold text-sm text-foreground">Relational Gym</div>
              <p className="text-[11px] font-sans text-muted-foreground">
                Multi-premise relational integration (R1 to R4+) to exercise frontoparietal binding.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
              <div className="flex items-center justify-between text-xs text-emerald-400">
                <span>PHASE 3 (10m)</span>
                <span className="text-[10px] px-1 rounded bg-emerald-500/20 font-bold">RECALL</span>
              </div>
              <div className="font-bold text-sm text-foreground">Spaced Retrieval</div>
              <p className="text-[11px] font-sans text-muted-foreground">
                Cold reconstructive recall under interference. Synaptic consolidation.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1">
              <div className="flex items-center justify-between text-xs text-amber-400">
                <span>PHASE 4 (10m)</span>
                <span className="text-[10px] px-1 rounded bg-amber-500/20 font-bold">BRIER</span>
              </div>
              <div className="font-bold text-sm text-foreground">Calibration</div>
              <p className="text-[11px] font-sans text-muted-foreground">
                Continuous probability credences (0%–100%) and pre-feedback error hypothesis.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-1">
              <div className="flex items-center justify-between text-xs text-purple-400">
                <span>PHASE 5 (5m)</span>
                <span className="text-[10px] px-1 rounded bg-purple-500/20 font-bold">AUDIT</span>
              </div>
              <div className="font-bold text-sm text-foreground">Transfer Verification</div>
              <p className="text-[11px] font-sans text-muted-foreground">
                Audit Transfer Index τ to prove genuine generalized cognitive gains.
              </p>
            </div>
          </div>
        </div>

        {/* 7-Domain Latent Ability Spectrum */}
        <div className="cyber-card p-6 rounded-2xl border border-border/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-mono font-bold text-foreground">
                7-Domain Latent Ability Profile (IRT Ability Parameter θ)
              </h2>
              <p className="text-xs text-muted-foreground">
                Separated psychometric constructs preventing the &ldquo;single brain score&rdquo; fallacy.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 self-start sm:self-auto">
              IRT Scaled [-3.0 to +3.0]
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {abilityDomains.map((dom) => (
              <div key={dom.name} className="p-3.5 rounded-xl bg-muted/20 border border-border/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-foreground/90 truncate">{dom.name}</span>
                  <span className="text-cyan-400 font-bold">{dom.score}</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${dom.color} rounded-full`} style={{ width: `${dom.pct}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                  <span>Tier: {dom.tier}</span>
                  <span>Percentile ~{dom.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arenas Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-mono font-bold text-foreground">Cognitive Training Arenas</h2>
            <span className="text-xs text-muted-foreground font-mono">Select Arena to Enter</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {arenas.map((arena) => {
              const Icon = arena.icon
              return (
                <Link
                  key={arena.title}
                  href={arena.href}
                  onClick={() => sound.playClick()}
                  className="cyber-card p-6 rounded-2xl border border-border/80 flex flex-col justify-between group hover:border-cyan-500/40 transition-all hover:scale-[1.01]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${arena.badgeColor}`}>
                        {arena.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-mono font-bold text-base text-foreground group-hover:text-cyan-400 transition-colors">
                        {arena.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {arena.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-border/40 flex items-center justify-between font-mono text-xs">
                    <span className="text-cyan-400/90 font-medium">{arena.metric}</span>
                    <div className="flex items-center gap-1 text-muted-foreground group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all">
                      <span>Enter</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Scientific Integrity Charter */}
        <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-xs font-mono space-y-2 text-zinc-400">
          <div className="flex items-center gap-2 text-zinc-200 font-bold">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>SCIENTIFIC INTEGRITY & ANTI-OVERCLAIM MANDATE</span>
          </div>
          <p className="leading-relaxed">
            HumanEval does not make marketing claims that repetitive brain-game puzzles increase biological IQ. Modern
            preregistered double-blind RCTs (2025) systematically demonstrate that isolated N-Back gains fail to produce
            statistically significant far-transfer. HumanEval conditions core relational binding (Wang et al., 2025),
            frictional reconstructive retrieval (Karpicke & Roediger), and metacognitive calibration (Tetlock), while
            explicitly measuring the mathematical Transfer Index (τ) against untrained tasks.
          </p>
        </div>
      </main>
    </div>
  )
}
