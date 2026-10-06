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
      title: "Procedural Training Engine",
      badge: "Core Engine",
      badgeColor: "bg-amber-400 text-black",
      description:
        "Unified catalog of 10 validated experimental paradigms (Stroop, Flanker, N-Back with lures, OSPAN, Task Switch, WCST, Raven Matrices, Bayesian, Choice RT). Procedural generation with IRT difficulty vectors.",
      metric: "10 Seeded Paradigms",
      href: "/engine",
      icon: Brain,
    },
    {
      title: "Relational Integration Gym",
      badge: "Gf Engine",
      badgeColor: "bg-cyan-400 text-black",
      description:
        "Multi-premise relational binding (Wang et al., 2025). Coordinate 2 to 4+ simultaneous premises across numerical, causal, and verbal modalities.",
      metric: "Adaptive Depth R1 → R4+",
      href: "/facility/relational",
      icon: Layers,
    },
    {
      title: "Reconstructive Retrieval",
      badge: "Retention",
      badgeColor: "bg-emerald-400 text-black",
      description:
        "Desirable difficulties engine. Learn dense technical concepts, survive cognitive distraction, and execute cold reconstruction under exponential decay.",
      metric: "Stability Half-Life S (Days)",
      href: "/facility/retrieval",
      icon: Repeat,
    },
    {
      title: "Metacognitive Calibration",
      badge: "Tetlock Brier",
      badgeColor: "bg-amber-400 text-black",
      description:
        "Assess subjective probability on continuous 0%–100% slider. Predict failure modes before feedback. Minimize quadratic Brier Score penalty.",
      metric: "Target Brier < 0.150",
      href: "/facility/calibration",
      icon: Compass,
    },
    {
      title: "Transfer Verification Audit",
      badge: "Scientific Audit",
      badgeColor: "bg-purple-400 text-black",
      description:
        "Audit true cross-domain generalization. Calculate mathematical Transfer Index τ = (0.6·Near + 0.4·Far) / Trained to eliminate task-specialization illusions.",
      metric: "Transfer Index τ ≥ 0.40",
      href: "/facility/transfer",
      icon: Sparkles,
    },
    {
      title: "Feynman Epistemic Arena",
      badge: "v2.0 Synthesis",
      badgeColor: "bg-blue-400 text-black",
      description:
        "Deconstruct complex scientific concepts into zero-jargon definitions, analogies, boundary condition stress-tests, and counter-intuitive edge cases.",
      metric: "Epistemic Rigor Score",
      href: "/facility/feynman",
      icon: Zap,
    },
    {
      title: "Calibration Lab (Baseline 9)",
      badge: "Benchmark",
      badgeColor: "bg-secondary text-foreground",
      description:
        "Our original 9-test psychometric battery: Reaction Time, Simon Span, Ayumu Chimp Test, Visual Memory, Aim Trainer, Typing, and Reading.",
      metric: "Composite CGI Rating",
      href: "/",
      icon: Brain,
    },
  ]

  const abilityDomains = [
    { name: "Fluid Reasoning (Gf)", score: "θ +1.42", tier: "Advanced", pct: 76, color: "bg-amber-400 dark:bg-cyan-400" },
    { name: "Working Memory Updating", score: "θ +1.10", tier: "Proficient", pct: 70, color: "bg-blue-400" },
    { name: "Executive Inhibitory Control", score: "θ +1.85", tier: "Superior", pct: 84, color: "bg-emerald-400" },
    { name: "Processing Speed (Inspection)", score: "θ +0.95", tier: "Nominal", pct: 64, color: "bg-amber-400" },
    { name: "Quantitative Logic", score: "θ +1.35", tier: "Advanced", pct: 74, color: "bg-purple-400" },
    { name: "Linguistic & Causal Parsing", score: "θ +1.20", tier: "Advanced", pct: 71, color: "bg-rose-400" },
    { name: "Metacognitive Calibration", score: "BS 0.128", tier: "Calibrated", pct: 88, color: "bg-emerald-400" },
  ]

  return (
    <div className="min-h-screen pb-20 dot-grid">
      <FacilityNav />

      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-10">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black dark:border-slate-700 bg-amber-400 dark:bg-sky-400 text-slate-950 font-mono text-xs font-black uppercase shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>EMPIRICAL COGNITIVE OPERATING SYSTEM // V2.0</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-foreground uppercase">
                COGNITIVE <span className="text-amber-500 dark:text-sky-400">FACILITY</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mt-2 font-sans leading-relaxed">
                Systematic cognitive training grounded in 2020–2026 neuroscience: Relational Integration,
                Desirable Difficulties, Continuous Calibration, and Empirical Transfer Auditing.
              </p>
            </div>

            {/* Quick action badges */}
            <div className="flex items-center gap-3">
              <Link
                href="/facility/relational"
                onClick={() => sound.playClick()}
                className="px-5 py-2.5 border-2 border-black dark:border-slate-700 bg-amber-400 dark:bg-sky-400 text-slate-950 font-sans font-black text-sm shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 uppercase"
              >
                <span>Launch Daily Gym</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Telemetry & Fatigue Control Bar */}
        <div className="brutal-card p-6 space-y-4 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black dark:border-slate-700 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-black dark:border-slate-700 bg-amber-400 dark:bg-sky-400 text-slate-950 flex items-center justify-center shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-display font-black uppercase text-foreground text-sm sm:text-base">
                  Intra-Individual Response Time Variability (IIV) Vigilance Monitor
                </h3>
                <p className="text-xs text-muted-foreground font-sans">
                  Tracks micro-lapses in prefrontal executive control to abort training before neural exhaustion.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrimingPing}
                className="px-3.5 py-1.5 border-2 border-black dark:border-slate-700 bg-card text-foreground font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Tap Priming Ping ({primingPingCount})</span>
              </button>
              <button
                onClick={handleResetFatigue}
                title="Reset session telemetry"
                className="p-1.5 border-2 border-black dark:border-slate-700 bg-card text-foreground font-mono shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-3 border-2 border-black dark:border-white bg-card shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
              <span className="text-muted-foreground block text-[10px] font-bold uppercase">BASELINE VARIABILITY (IIV₀)</span>
              <span className="text-lg font-black text-foreground tabular">{fatigue?.baselineIIV ?? 45} ms</span>
            </div>
            <div className="p-3 border-2 border-black dark:border-white bg-card shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
              <span className="text-muted-foreground block text-[10px] font-bold uppercase">SLIDING VARIABILITY (IIVₖ)</span>
              <span className="text-lg font-black text-amber-500 dark:text-cyan-400 tabular">{fatigue?.currentIIV ?? 45} ms</span>
            </div>
            <div className="p-3 border-2 border-black dark:border-white bg-card shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
              <span className="text-muted-foreground block text-[10px] font-bold uppercase">FATIGUE DRIFT RATIO</span>
              <span
                className={`text-lg font-black tabular ${
                  (fatigue?.fatigueRatio ?? 1) >= 1.65
                    ? "text-red-500"
                    : (fatigue?.fatigueRatio ?? 1) >= 1.3
                    ? "text-amber-500"
                    : "text-emerald-500"
                }`}
              >
                {fatigue?.fatigueRatio ?? 1.0}x
              </span>
            </div>
            <div className="p-3 border-2 border-black dark:border-white bg-card shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
              <span className="text-muted-foreground block text-[10px] font-bold uppercase">NEURAL ADVISORY</span>
              <span className="text-xs font-mono font-bold text-foreground line-clamp-2">
                {fatigue?.advisory ?? "Executive vigilance calibrated."}
              </span>
            </div>
          </div>

          {fatigue?.shouldTerminateEarly && (
            <div className="p-3 border-2 border-black dark:border-white bg-red-500 text-white font-mono text-xs flex items-center gap-2 shadow-[2px_2px_0px_0px_#0A0A0A]">
              <AlertTriangle className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <span>
                <strong>CRITICAL FATIGUE WARNING:</strong> Your intra-individual latency variability exceeded 1.65x
                baseline. Stop training now to avoid reinforcing sloppy synaptic noise.
              </span>
            </div>
          )}
        </div>

        {/* 45-Minute Daily Cognitive Protocol Roadmap */}
        {/* 45-Minute Daily Cognitive Protocol Roadmap */}
        <div className="brutal-card p-6 space-y-4 font-sans">
          <div className="flex items-center justify-between border-b-2 border-black dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 stroke-[2.5] text-amber-500 dark:text-sky-400" />
              <h2 className="text-base font-display font-black uppercase text-foreground">Recommended 45-Minute Daily Training Protocol</h2>
            </div>
            <span className="text-xs font-mono uppercase text-muted-foreground font-bold">Modular Neuroplasticity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="p-3.5 border-2 border-black dark:border-slate-700 bg-card space-y-1 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono font-bold">
                <span>PHASE 1 (5m)</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 dark:text-sky-400" />
              </div>
              <div className="font-display font-black text-sm uppercase text-foreground">Priming & IIV</div>
              <p className="text-xs font-sans text-muted-foreground leading-relaxed">
                Rapid motor inspection to calibrate today&apos;s baseline latency variance.
              </p>
            </div>

            <div className="p-3.5 border-2 border-black dark:border-slate-700 bg-amber-400/10 dark:bg-sky-400/10 space-y-1 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
              <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-sky-400 font-mono">
                <span>PHASE 2 (15m)</span>
                <span className="text-[10px] px-1 border border-black dark:border-slate-700 bg-amber-400 dark:bg-sky-400 text-slate-950 font-black">CORE</span>
              </div>
              <div className="font-display font-black text-sm uppercase text-foreground">Relational Gym</div>
              <p className="text-xs font-sans text-muted-foreground leading-relaxed">
                Multi-premise relational integration (R1 to R4+) to exercise frontoparietal binding.
              </p>
            </div>

            <div className="p-3.5 border-2 border-black dark:border-slate-700 bg-emerald-400/10 space-y-1 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                <span>PHASE 3 (10m)</span>
                <span className="text-[10px] px-1 border border-black dark:border-slate-700 bg-emerald-400 text-slate-950 font-black">RECALL</span>
              </div>
              <div className="font-display font-black text-sm uppercase text-foreground">Spaced Retrieval</div>
              <p className="text-xs font-sans text-muted-foreground leading-relaxed">
                Cold reconstructive recall under interference. Synaptic consolidation.
              </p>
            </div>

            <div className="p-3.5 border-2 border-black dark:border-slate-700 bg-amber-400/10 space-y-1 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
              <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                <span>PHASE 4 (10m)</span>
                <span className="text-[10px] px-1 border border-black dark:border-slate-700 bg-amber-400 text-slate-950 font-black">BRIER</span>
              </div>
              <div className="font-display font-black text-sm uppercase text-foreground">Calibration</div>
              <p className="text-xs font-sans text-muted-foreground leading-relaxed">
                Continuous probability credences (0%–100%) and pre-feedback error hypothesis.
              </p>
            </div>

            <div className="p-3.5 border-2 border-black dark:border-slate-700 bg-purple-400/10 space-y-1 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
              <div className="flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">
                <span>PHASE 5 (5m)</span>
                <span className="text-[10px] px-1 border border-black dark:border-slate-700 bg-purple-400 text-slate-950 font-black">AUDIT</span>
              </div>
              <div className="font-display font-black text-sm uppercase text-foreground">Transfer Audit</div>
              <p className="text-xs font-sans text-muted-foreground leading-relaxed">
                Audit Transfer Index τ to prove genuine generalized cognitive gains.
              </p>
            </div>
          </div>
        </div>

        {/* 7-Domain Latent Ability Spectrum */}
        <div className="brutal-card p-6 space-y-4 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black dark:border-slate-700 pb-3">
            <div>
              <h2 className="text-base font-display font-black uppercase text-foreground">
                7-Domain Latent Ability Profile (IRT Ability Parameter θ)
              </h2>
              <p className="text-xs text-muted-foreground font-sans">
                Separated psychometric constructs preventing the &ldquo;single brain score&rdquo; fallacy.
              </p>
            </div>
            <span className="text-xs font-mono font-black text-slate-950 px-2 py-0.5 border border-black dark:border-slate-700 bg-amber-400 dark:bg-sky-400 shadow-[1.5px_1.5px_0px_0px_#0A0A0A] dark:shadow-[1.5px_1.5px_0px_0px_#000000] self-start sm:self-auto">
              IRT Scaled [-3.0 to +3.0]
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {abilityDomains.map((dom) => (
              <div key={dom.name} className="p-3.5 border-2 border-black dark:border-slate-700 bg-card shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-foreground truncate font-sans">{dom.name}</span>
                  <span className="text-amber-500 dark:text-sky-400 font-mono font-black">{dom.score}</span>
                </div>
                <div className="w-full h-2 border border-black dark:border-slate-700 bg-secondary overflow-hidden">
                  <div className={`h-full ${dom.color}`} style={{ width: `${dom.pct}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase font-mono font-bold">
                  <span>Tier: {dom.tier}</span>
                  <span>~{dom.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arenas Grid */}
        <div className="space-y-4 font-sans">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-black uppercase text-foreground">[ COGNITIVE TRAINING ARENAS ]</h2>
            <span className="text-xs text-muted-foreground font-mono uppercase font-bold">Select Arena to Enter</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {arenas.map((arena) => {
              const Icon = arena.icon
              return (
                <Link
                  key={arena.title}
                  href={arena.href}
                  onClick={() => sound.playClick()}
                  className="brutal-card p-6 flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 border-2 border-black dark:border-slate-700 bg-amber-400 dark:bg-sky-400 text-slate-950 flex items-center justify-center shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000] group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] transition-transform">
                        <Icon className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 border border-black dark:border-slate-700 font-black uppercase shadow-[1.5px_1.5px_0px_0px_#0A0A0A] dark:shadow-[1.5px_1.5px_0px_0px_#000000] ${arena.badgeColor}`}>
                        {arena.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-black uppercase text-base text-foreground group-hover:text-amber-500 dark:group-hover:text-sky-400 transition-colors">
                        {arena.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-sans">
                        {arena.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-5 border-t-2 border-black dark:border-slate-700 flex items-center justify-between font-mono text-xs">
                    <span className="text-foreground font-bold">{arena.metric}</span>
                    <div className="flex items-center gap-1 font-sans font-black uppercase text-foreground group-hover:text-amber-500 dark:group-hover:text-sky-400 transition-colors">
                      <span>ENTER</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Scientific Integrity Charter */}
        <div className="p-6 border-2 border-black dark:border-slate-700 bg-card shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#000000] text-sm font-sans space-y-2 text-foreground">
          <div className="flex items-center gap-2 text-foreground font-display font-black uppercase">
            <ShieldCheck className="w-4 h-4 text-amber-500 dark:text-sky-400 stroke-[2.5]" />
            <span>SCIENTIFIC INTEGRITY & ANTI-OVERCLAIM MANDATE</span>
          </div>
          <p className="leading-relaxed text-muted-foreground text-sm">
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
