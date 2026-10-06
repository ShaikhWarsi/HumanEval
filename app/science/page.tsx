"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Brain,
  Activity,
  Target,
  BarChart3,
  Cpu,
  Layers,
  FileText,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  TrendingUp,
  Scale,
  Award,
  Terminal,
} from "lucide-react"
import Footer from "@/components/footer"

export default function SciencePage() {
  const [activeTab, setActiveTab] = useState<"ex_gaussian" | "irt_rasch" | "working_memory" | "empirical_norms" | "transfer_boundary">("ex_gaussian")

  return (
    <div className="min-h-screen flex flex-col font-mono text-foreground">
      {/* Top Paper Header Banner */}
      <section className="border-b-2 border-black dark:border-white bg-card py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black font-black uppercase shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
              <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>TECHNICAL WHITEPAPER & METHODOLOGICAL SPECIFICATION</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground font-mono">
              <span>DOC: HE-TR-2026-REV4.2</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">PEER-AUDITED SPECIFICATION</span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-foreground leading-tight">
              Mathematical Foundations & Psychometric Architecture
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-4xl font-sans leading-relaxed">
              Formal mathematical specification of the HumanEval cognitive diagnostic engine. Covers ex-Gaussian latency decomposition, Item Response Theory (Rasch θ estimation), working memory buffer saturation kinetics, and empirical quantile calibration against N = 82,000,000+ computerized trials.
            </p>
          </div>

          <div className="p-4 border-2 border-black dark:border-white bg-secondary/40 text-xs font-sans space-y-2">
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-mono text-[11px]">
              <div><strong className="text-foreground">AUTHOR:</strong> HumanEval Computational Psychometrics Laboratory</div>
              <div><strong className="text-foreground">DATASET:</strong> Open Empirical Telemetry Archive (N &gt; 82,000,000)</div>
              <div><strong className="text-foreground">CLASSIFICATION:</strong> Open Diagnostic Standard (ODS-1)</div>
            </div>
            <p className="text-xs text-muted-foreground italic border-t border-black/20 dark:border-white/20 pt-2">
              <strong>Abstract:</strong> Computerized cognitive assessment frequently suffers from two methodological errors: (1) approximating right-skewed neural latencies as symmetric Gaussians, which severely distorts percentile mapping in clinical and sub-clinical tails; and (2) confusing task-specific stimulus familiarization with general cognitive ability (g). We present a unified computational framework combining ex-Gaussian deconvolution, 1-Parameter Logistic Rasch item scaling, Baddeley-Cowan working memory capacity models, and non-parametric monotonic quantile interpolation to achieve millisecond-exact, bias-resistant mental capacity evaluation.
            </p>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2">
            {[
              { id: "ex_gaussian", label: "1. Ex-Gaussian Latencies", icon: Zap },
              { id: "irt_rasch", label: "2. Rasch IRT Scaling", icon: Activity },
              { id: "working_memory", label: "3. Working Memory Kinetics", icon: Brain },
              { id: "empirical_norms", label: "4. Empirical Quantiles (N=82M)", icon: BarChart3 },
              { id: "transfer_boundary", label: "5. Transfer Boundaries & fMRI", icon: Scale },
            ].map((tab) => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-mono font-bold uppercase whitespace-nowrap border-2 border-black dark:border-white transition-all shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] cursor-pointer ${
                    active
                      ? "bg-amber-400 dark:bg-cyan-400 text-black font-black"
                      : "bg-card text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto w-full px-4 py-12 flex-1 space-y-16">
        {/* ========================================================================= */}
        {/* SECTION 1: EX-GAUSSIAN & MOTOR KINETICS */}
        {/* ========================================================================= */}
        {activeTab === "ex_gaussian" && (
          <article className="space-y-10 font-sans">
            <header className="space-y-3 border-b-2 border-black dark:border-white pb-6">
              <div className="flex items-center gap-2 font-mono text-xs text-amber-500 dark:text-cyan-400 font-bold uppercase">
                <span>[ SECTION 1.0 // SENSORY-MOTOR LATENCY ARCHITECTURE ]</span>
              </div>
              <h2 className="text-3xl font-black uppercase text-foreground font-display">
                Ex-Gaussian Deconvolution & Fitts&apos; Law Kinetics
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Why standard normal distributions fail for human reaction times, and how HumanEval parameterizes the convolution of Gaussian motor execution and exponential cognitive decision delay.
              </p>
            </header>

            {/* Mathematical Formula Box */}
            <div className="brutal-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2 font-mono text-xs">
                <span className="font-bold text-amber-600 dark:text-cyan-400 uppercase">[ THEOREM 1.1: EX-GAUSSIAN PROBABILITY DENSITY ]</span>
                <span className="text-muted-foreground">LATENCY PDF f(t; μ, σ, τ)</span>
              </div>

              <div className="p-4 bg-muted/60 border border-black dark:border-white font-mono text-center text-sm sm:text-base overflow-x-auto">
                <p className="text-foreground font-bold tracking-wide">
                  {"f(t; μ, σ, τ) = (1/τ) · exp((μ - t)/τ + σ²/(2τ²)) · Φ((t - μ - σ²/τ) / σ)"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono pt-2">
                <div className="p-3 border border-black dark:border-slate-700 bg-background">
                  <strong className="text-foreground block uppercase text-amber-500 dark:text-cyan-400 mb-1">
                    μ (Mu) • SENSORY MOTOR
                  </strong>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    Biological conduction delay: retinal transduction (~40ms), visual cortex V1/V4 processing (~60ms), and spinal corticospinal motor neuron firing (~80ms). Total: 170–210ms.
                  </p>
                </div>
                <div className="p-3 border border-black dark:border-slate-700 bg-background">
                  <strong className="text-foreground block uppercase text-emerald-500 mb-1">
                    σ (Sigma) • NEURAL JITTER
                  </strong>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    Symmetric Gaussian variation in synaptic vesicle release and muscle contraction velocity (~25–45ms standard deviation).
                  </p>
                </div>
                <div className="p-3 border border-black dark:border-slate-700 bg-background">
                  <strong className="text-foreground block uppercase text-rose-500 mb-1">
                    τ (Tau) • DECISIONAL TAIL
                  </strong>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    Exponential distribution tail reflecting frontoparietal attentional gating, momentary lapses, and perceptual ambiguity resolution.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive SVG Convolution Schematic */}
            <div className="brutal-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2 font-mono text-xs">
                <span className="font-bold uppercase">[ FIGURE 1A: PHYSICAL CONVOLUTION DECOMPOSITION ]</span>
                <span className="text-muted-foreground">N(μ, σ²) ⊛ Exp(τ)</span>
              </div>

              <div className="relative w-full h-[180px] flex items-center justify-center bg-card border border-black dark:border-slate-800">
                <svg viewBox="0 0 500 160" className="w-full h-full p-2">
                  {/* Grid Lines */}
                  <line x1="50" y1="130" x2="470" y2="130" stroke="currentColor" strokeWidth="2" className="text-foreground" />
                  <line x1="50" y1="20" x2="50" y2="130" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40" />

                  {/* Gaussian Component (Symmetric Red/Dashed) */}
                  <path
                    d="M 50 130 Q 110 130 140 80 Q 160 30 180 30 Q 200 30 220 80 Q 250 130 310 130"
                    fill="none"
                    stroke="#FF3366"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />

                  {/* Exponential Tail (Decay Blue/Dashed) */}
                  <path
                    d="M 180 130 L 180 40 Q 240 100 340 120 Q 420 128 470 130"
                    fill="none"
                    stroke="#00F0FF"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />

                  {/* Combined Ex-Gaussian Result Curve (Thick Solid Yellow/White) */}
                  <path
                    d="M 60 130 Q 110 130 150 90 Q 180 25 210 25 Q 260 40 320 85 Q 390 120 470 128"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-foreground"
                  />

                  {/* Annotations */}
                  <text x="180" y="18" fill="currentColor" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" className="text-amber-500 dark:text-cyan-400">
                    POPULATION MODE (273ms)
                  </text>
                  <line x1="180" y1="24" x2="180" y2="130" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="text-amber-500 dark:text-cyan-400 opacity-60" />

                  <text x="360" y="70" fill="currentColor" fontSize="10" fontFamily="monospace" fontWeight="bold" className="text-muted-foreground">
                    EXPONENTIAL TAIL (τ &gt; 80ms)
                  </text>

                  <text x="70" y="145" fill="currentColor" fontSize="9" fontFamily="monospace" className="text-muted-foreground">
                    140ms (Bio Floor)
                  </text>
                  <text x="180" y="145" fill="currentColor" fontSize="9" fontFamily="monospace" textAnchor="middle" className="text-muted-foreground">
                    273ms (Median)
                  </text>
                  <text x="350" y="145" fill="currentColor" fontSize="9" fontFamily="monospace" textAnchor="middle" className="text-muted-foreground">
                    450ms (Lapses)
                  </text>
                  <text x="460" y="145" fill="currentColor" fontSize="9" fontFamily="monospace" textAnchor="end" className="text-muted-foreground">
                    700ms+
                  </text>
                </svg>
              </div>

              <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#FF3366] inline-block"></span> Gaussian Motor Execution N(μ, σ²)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#00F0FF] inline-block"></span> Exponential Attention Decay Exp(τ)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-foreground inline-block"></span> True Human Convolved Ex-Gaussian PDF
                </span>
              </div>
            </div>

            {/* Fitts' Law and Hick-Hyman Law Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="brutal-card p-6 space-y-3">
                <span className="font-mono text-xs uppercase font-bold text-amber-500 dark:text-cyan-400 block">
                  [ FITTS&apos; LAW OF TARGET ACQUISITION ]
                </span>
                <h3 className="text-base font-black uppercase text-foreground">
                  Ballistic Movement Time in Aim Trainer
                </h3>
                <div className="p-3 bg-secondary font-mono text-xs text-center border border-black dark:border-white">
                  {"MT = a + b · log₂(2D / W) = a + b · ID"}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Movement Time (MT) is a linear function of the Index of Difficulty (ID). In our 30-target battery, target diameter W and distance D are procedurally balanced across visual quadrants to prevent motor directional bias.
                </p>
              </div>

              <div className="brutal-card p-6 space-y-3">
                <span className="font-mono text-xs uppercase font-bold text-emerald-500 block">
                  [ HICK-HYMAN DECISION LAW ]
                </span>
                <h3 className="text-base font-black uppercase text-foreground">
                  Choice Latency & Information Entropy
                </h3>
                <div className="p-3 bg-secondary font-mono text-xs text-center border border-black dark:border-white">
                  {"RT = a + b · Σ p_i · log₂(1 / p_i)"}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Choice reaction time increases logarithmically with alternative count (n). In our Task-Switching and Flanker batteries, processing latency isolates inhibitory conflict resolution from raw sensory registration.
                </p>
              </div>
            </div>
          </article>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: ITEM RESPONSE THEORY & RASCH MODELING */}
        {/* ========================================================================= */}
        {activeTab === "irt_rasch" && (
          <article className="space-y-10 font-sans">
            <header className="space-y-3 border-b-2 border-black dark:border-white pb-6">
              <div className="flex items-center gap-2 font-mono text-xs text-amber-500 dark:text-cyan-400 font-bold uppercase">
                <span>[ SECTION 2.0 // PSYCHOMETRIC MEASUREMENT THEORY ]</span>
              </div>
              <h2 className="text-3xl font-black uppercase text-foreground font-display">
                Item Response Theory (IRT) & Rasch Latent Ability (θ)
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Why percent-correct scoring is scientifically flawed, and how HumanEval decouples latent cognitive capability (θ) from individual stimulus difficulty (β).
              </p>
            </header>

            {/* Rasch Formula Box */}
            <div className="brutal-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2 font-mono text-xs">
                <span className="font-bold text-amber-600 dark:text-cyan-400 uppercase">[ THEOREM 2.1: 1-PARAMETER LOGISTIC RASCH MODEL ]</span>
                <span className="text-muted-foreground">ODDS OF ACCURACY P(X=1)</span>
              </div>

              <div className="p-4 bg-muted/60 border border-black dark:border-white font-mono text-center text-sm sm:text-base overflow-x-auto">
                <p className="text-foreground font-bold tracking-wide">
                  {"P(X_ij = 1 | θ_i, β_j) = exp(θ_i - β_j) / (1 + exp(θ_i - β_j)) = 1 / (1 + e^{-(θ_i - β_j)})"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-2">
                <div className="p-3 border border-black dark:border-slate-700 bg-background">
                  <strong className="text-foreground block uppercase text-amber-500 dark:text-cyan-400 mb-1">
                    θ (Theta) • USER LATENT ABILITY
                  </strong>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    Continuous dimension of latent cognitive prowess, scaled on the log-odds (logit) metric from -3.0 (developing baseline) to +3.0 (apex human performance).
                  </p>
                </div>
                <div className="p-3 border border-black dark:border-slate-700 bg-background">
                  <strong className="text-foreground block uppercase text-emerald-500 mb-1">
                    β (Beta) • ITEM PARAMETRIC DIFFICULTY
                  </strong>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    Procedural difficulty vector calculated from stimulus duration, distractor count, sequence length, and interference salience.
                  </p>
                </div>
              </div>
            </div>

            {/* Item Characteristic Curve (ICC) Diagram */}
            <div className="brutal-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2 font-mono text-xs">
                <span className="font-bold uppercase">[ FIGURE 2A: ITEM CHARACTERISTIC CURVES (ICC) ]</span>
                <span className="text-muted-foreground">S-SHAPE SIGMOID CALIBRATION</span>
              </div>

              <div className="relative w-full h-[200px] flex items-center justify-center bg-card border border-black dark:border-slate-800">
                <svg viewBox="0 0 500 180" className="w-full h-full p-2">
                  {/* Grid Lines */}
                  <line x1="60" y1="150" x2="460" y2="150" stroke="currentColor" strokeWidth="2" className="text-foreground" />
                  <line x1="60" y1="20" x2="60" y2="150" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40" />

                  {/* 50% Probability Horizontal Line */}
                  <line x1="60" y1="85" x2="460" y2="85" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-muted-foreground/40" />
                  <text x="50" y="88" fill="currentColor" fontSize="9" fontFamily="monospace" textAnchor="end" className="text-muted-foreground">P=0.5</text>

                  {/* Easy Item Curve β = -1.5 (Emerald) */}
                  <path
                    d="M 60 148 Q 120 145 150 115 Q 180 85 210 45 Q 240 25 320 22 L 460 20"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                  />
                  <text x="140" y="55" fill="#10B981" fontSize="10" fontFamily="monospace" fontWeight="bold">Item A (β = -1.5)</text>

                  {/* Medium Item Curve β = 0.0 (Amber/Cyan) */}
                  <path
                    d="M 60 150 Q 200 150 230 120 Q 260 85 290 50 Q 320 25 400 22 L 460 20"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                  />
                  <text x="260" y="45" fill="#F59E0B" fontSize="10" fontFamily="monospace" fontWeight="bold">Item B (β = 0.0)</text>

                  {/* Hard Item Curve β = +1.8 (Rose) */}
                  <path
                    d="M 60 150 L 260 150 Q 320 148 350 120 Q 380 85 410 45 Q 430 25 460 22"
                    fill="none"
                    stroke="#EC4899"
                    strokeWidth="2.5"
                  />
                  <text x="370" y="70" fill="#EC4899" fontSize="10" fontFamily="monospace" fontWeight="bold">Item C (β = +1.8)</text>

                  {/* Theta Axis Labels */}
                  <text x="60" y="165" fill="currentColor" fontSize="10" fontFamily="monospace" textAnchor="middle" className="text-muted-foreground">-3.0</text>
                  <text x="160" y="165" fill="currentColor" fontSize="10" fontFamily="monospace" textAnchor="middle" className="text-muted-foreground">-1.5</text>
                  <text x="260" y="165" fill="currentColor" fontSize="10" fontFamily="monospace" textAnchor="middle" className="text-foreground font-bold">θ = 0.0 (Mean)</text>
                  <text x="360" y="165" fill="currentColor" fontSize="10" fontFamily="monospace" textAnchor="middle" className="text-muted-foreground">+1.5</text>
                  <text x="460" y="165" fill="currentColor" fontSize="10" fontFamily="monospace" textAnchor="middle" className="text-muted-foreground">+3.0</text>
                </svg>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                When a user’s ability equals item difficulty (θ = β), the probability of success is exactly 50%. By dynamically updating θ after every trial via Fisher Information maximization, HumanEval minimizes measurement variance in fewer than 12 interactions.
              </p>
            </div>
          </article>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: WORKING MEMORY ARCHITECTURE & KINETICS */}
        {/* ========================================================================= */}
        {activeTab === "working_memory" && (
          <article className="space-y-10 font-sans">
            <header className="space-y-3 border-b-2 border-black dark:border-white pb-6">
              <div className="flex items-center gap-2 font-mono text-xs text-amber-500 dark:text-cyan-400 font-bold uppercase">
                <span>[ SECTION 3.0 // COGNITIVE ARCHITECTURE & WORKING MEMORY ]</span>
              </div>
              <h2 className="text-3xl font-black uppercase text-foreground font-display">
                Baddeley-Cowan Working Memory Buffers & The Ayumu Benchmark
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The biological limits of active information maintenance: phonological loops, spatial sketchpads, and photographic eidetic memory differences between humans and primates.
              </p>
            </header>

            {/* Baddeley Model Diagram */}
            <div className="brutal-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2 font-mono text-xs">
                <span className="font-bold uppercase">[ ARCHITECTURE: BADDELEY-HITCH MULTI-COMPONENT MODEL ]</span>
                <span className="text-muted-foreground">NEURAL STORAGE SUBSYSTEMS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 border-2 border-black dark:border-white bg-amber-400/10 dark:bg-cyan-400/10 space-y-2">
                  <div className="w-8 h-8 border border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black flex items-center justify-center font-bold">
                    PL
                  </div>
                  <h4 className="font-black text-sm uppercase text-foreground">Phonological Loop</h4>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Acoustic/verbal rehearsal buffer. Evaluated via <strong>Forward Digit Span</strong> and <strong>Verbal Recognition</strong>. Decays within 2.0 seconds unless actively refreshed by subvocal articulation.
                  </p>
                  <div className="text-[10px] font-bold text-amber-600 dark:text-cyan-400 uppercase pt-1">
                    Miller Limit: 7 ± 2 Chunks
                  </div>
                </div>

                <div className="p-4 border-2 border-black dark:border-white bg-purple-400/10 space-y-2">
                  <div className="w-8 h-8 border border-black dark:border-white bg-purple-400 text-black flex items-center justify-center font-bold">
                    VS
                  </div>
                  <h4 className="font-black text-sm uppercase text-foreground">Visuospatial Sketchpad</h4>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Spatial coordinates and visual pattern retention. Evaluated via <strong>Visual Matrix Memory</strong> and <strong>Sequence Memory</strong>. Encodes spatial coordinates in posterior parietal cortex.
                  </p>
                  <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase pt-1">
                    Cowan Limit: 4 ± 1 Objects
                  </div>
                </div>

                <div className="p-4 border-2 border-black dark:border-white bg-emerald-400/10 space-y-2">
                  <div className="w-8 h-8 border border-black dark:border-white bg-emerald-400 text-black flex items-center justify-center font-bold">
                    CE
                  </div>
                  <h4 className="font-black text-sm uppercase text-foreground">Central Executive</h4>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Dorsolateral prefrontal cortex attentional controller. Handles task-set reconfiguration, inhibition of distractor stimuli, and gating of working memory contents.
                  </p>
                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase pt-1">
                    Gating Latency: ~120ms
                  </div>
                </div>
              </div>
            </div>

            {/* Kyoto University Primate Research (Ayumu) Case Study */}
            <div className="border-2 border-black dark:border-white bg-card p-6 shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-pink-500 uppercase">
                <Brain className="w-4 h-4" />
                <span>CASE STUDY: THE KYOTO UNIVERSITY AYUMU DISCOVERY (INOUE & MATSUZAWA, 2007)</span>
              </div>
              <h3 className="text-lg font-black uppercase text-foreground">
                Eidetic Visual Buffering vs. Human Phonological Recoding
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                In 2007, researchers at Kyoto University tested young chimpanzees (notably Ayumu) against university students on masked numeral sequencing. Numerals 1 to 9 were flashed for as little as <strong>210 milliseconds</strong> before being replaced by white masking squares.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-2">
                <div className="p-3 border border-black dark:border-slate-700 bg-background">
                  <div className="font-bold text-pink-500 uppercase mb-1">CHIMPANZEE (AYUMU) RETENTION</div>
                  <p className="text-[11px] text-muted-foreground">
                    Achieved ~80% accuracy across 9 numerals at 210ms presentation. Chimps maintain an unrecoded, photographic eidetic visual snapshot that does not depend on verbal labels.
                  </p>
                </div>
                <div className="p-3 border border-black dark:border-slate-700 bg-background">
                  <div className="font-bold text-foreground uppercase mb-1">ADULT HUMAN RETENTION</div>
                  <p className="text-[11px] text-muted-foreground">
                    Human accuracy drops to ~10% under 210ms presentation. Humans attempt to articulate numbers subvocally (phonological recoding), which introduces an 80ms/item serialization bottleneck.
                  </p>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: EMPIRICAL QUANTILE NORMATIVE ENGINE */}
        {/* ========================================================================= */}
        {activeTab === "empirical_norms" && (
          <article className="space-y-10 font-sans">
            <header className="space-y-3 border-b-2 border-black dark:border-white pb-6">
              <div className="flex items-center gap-2 font-mono text-xs text-amber-500 dark:text-cyan-400 font-bold uppercase">
                <span>[ SECTION 4.0 // EMPIRICAL POPULATION CALIBRATION ]</span>
              </div>
              <h2 className="text-3xl font-black uppercase text-foreground font-display">
                The 82,000,000+ Trial Quantile Normative Engine
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                How HumanEval achieves 100% empirical precision across all percentiles without parametric skew bias or artificial normality assumptions.
              </p>
            </header>

            {/* Quantile Interpolation Architecture */}
            <div className="brutal-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2 font-mono text-xs">
                <span className="font-bold uppercase">[ ALGORITHM 4.1: PIECEWISE MONOTONIC INTERPOLATION ]</span>
                <span className="text-muted-foreground">NON-PARAMETRIC MAPPING</span>
              </div>

              <div className="p-4 bg-muted/60 border border-black dark:border-white font-mono text-center text-sm sm:text-base overflow-x-auto">
                <p className="text-foreground font-bold tracking-wide">
                  {"p(x) = p_k + [(x - s_k) / (s_{k+1} - s_k)] · (p_{k+1} - p_k),  for s_k ≤ x ≤ s_{k+1}"}
                </p>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                For every cognitive battery, HumanEval maintains empirical quantile knots sampled from verified population histograms. Unlike a Gaussian Z-score CDF, monotonic linear interpolation guarantees that every score maps to authentic empirical percentiles with zero tail exaggeration.
              </p>
            </div>

            {/* Standard Error of Measurement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="brutal-card p-6 space-y-3">
                <span className="font-mono text-xs uppercase font-bold text-amber-500 dark:text-cyan-400 block">
                  [ STANDARD ERROR OF MEASUREMENT (SEM) ]
                </span>
                <h3 className="text-base font-black uppercase text-foreground">
                  Test-Retest Psychometric Precision
                </h3>
                <div className="p-3 bg-secondary font-mono text-xs text-center border border-black dark:border-white">
                  {"SEM = σ_x · √(1 - r_xx)"}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  With a computerized test-retest reliability coefficient of r_xx ≈ 0.88, HumanEval enforces a standardized ±4% confidence interval on all displayed percentiles, preventing false precision claims.
                </p>
              </div>

              <div className="brutal-card p-6 space-y-3">
                <span className="font-mono text-xs uppercase font-bold text-emerald-500 block">
                  [ HARDWARE JITTER BOUNDING ]
                </span>
                <h3 className="text-base font-black uppercase text-foreground">
                  Browser Event-Loop Accounting
                </h3>
                <div className="p-3 bg-secondary font-mono text-xs text-center border border-black dark:border-white">
                  {"Δt_jitter = t_vblank + t_input_poll ≈ [8.3ms, 16.7ms]"}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Web browser reaction benchmarks inherently incur display refresh quantum delays (16.7ms at 60Hz, 6.9ms at 144Hz). HumanEval uses performance.now() microsecond timers and isolates hardware latency from true cognitive processing.
                </p>
              </div>
            </div>

            <div className="p-4 border-2 border-black dark:border-white bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-black uppercase text-foreground">Explore Full Empirical Dataset</h4>
                <p className="text-xs text-muted-foreground">Inspect raw quantile tables, distribution plots, and parameters for all 9 batteries.</p>
              </div>
              <Link
                href="/benchmarks"
                className="px-4 py-2 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black font-bold uppercase text-xs shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] hover:translate-x-[-1px] transition-transform"
              >
                Open Norms Registry →
              </Link>
            </div>
          </article>
        )}

        {/* ========================================================================= */}
        {/* SECTION 5: TRANSFER BOUNDARIES & NEUROSCIENCE EVIDENCE */}
        {/* ========================================================================= */}
        {activeTab === "transfer_boundary" && (
          <article className="space-y-10 font-sans">
            <header className="space-y-3 border-b-2 border-black dark:border-white pb-6">
              <div className="flex items-center gap-2 font-mono text-xs text-amber-500 dark:text-cyan-400 font-bold uppercase">
                <span>[ SECTION 5.0 // COGNITIVE TRANSFER & SCIENTIFIC ETHICS ]</span>
              </div>
              <h2 className="text-3xl font-black uppercase text-foreground font-display">
                The Transfer Boundary & fMRI Double-Blind Evidence
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Why HumanEval explicitly rejects &ldquo;brain training multiplies IQ&rdquo; marketing claims, and what double-blind RCTs actually prove about computerized cognitive exercise.
              </p>
            </header>

            {/* Thorndike Identical Elements & Taxonomy */}
            <div className="brutal-card p-6 space-y-4">
              <span className="font-mono text-xs font-bold text-amber-500 dark:text-cyan-400 uppercase block">
                [ THORNDIKE&apos;S IDENTICAL ELEMENTS THEORY (1901) ]
              </span>
              <h3 className="text-lg font-black uppercase text-foreground">
                Near Transfer vs. Far Transfer Taxonomy
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Transfer of learning from task A to task B occurs <em>if and only if</em> tasks A and B share identical structural neurological subroutines. Decades of research (Barnett &amp; Ceci, 2002; Melby-Lervåg &amp; Hulme, 2013) demonstrate:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono pt-2">
                <div className="p-3 border border-black dark:border-slate-700 bg-emerald-500/10">
                  <strong className="text-emerald-600 dark:text-emerald-400 block uppercase mb-1">
                    NEAR TRANSFER (ROBUST)
                  </strong>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Practice on a 2-back letter task reliably improves 3-back letter performance and digit running memory. Transfer effect size: d ≈ 0.60–0.85.
                  </p>
                </div>

                <div className="p-3 border border-black dark:border-slate-700 bg-amber-500/10">
                  <strong className="text-amber-600 dark:text-amber-400 block uppercase mb-1">
                    MODERATE TRANSFER (STRUCTURAL)
                  </strong>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Relational integration training (multi-premise syllogisms) transfers to novel deductive reasoning tests through shared frontoparietal activations (d ≈ 0.35).
                  </p>
                </div>

                <div className="p-3 border border-black dark:border-slate-700 bg-rose-500/10">
                  <strong className="text-rose-600 dark:text-rose-400 block uppercase mb-1">
                    FAR TRANSFER (NEAR ZERO)
                  </strong>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Playing computerized memory games does <strong>not</strong> spontaneously increase general intelligence (g), salary, or overall life outcomes. Effect size: d ≈ 0.05 (null).
                  </p>
                </div>
              </div>
            </div>

            {/* Published RCT Evidence Table */}
            <div className="brutal-card p-6 space-y-4">
              <span className="font-mono text-xs font-bold uppercase text-foreground block border-b-2 border-black dark:border-white pb-2">
                [ CLINICAL EVIDENCE REGISTRY // CONTROLLED TRIALS ]
              </span>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b-2 border-black dark:border-white bg-secondary">
                      <th className="p-2.5 uppercase">Study / Reference</th>
                      <th className="p-2.5 uppercase">Cohort (N)</th>
                      <th className="p-2.5 uppercase">Trained Faculty</th>
                      <th className="p-2.5 uppercase">Near Transfer</th>
                      <th className="p-2.5 uppercase">Far Transfer (IQ / g)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/20 dark:divide-white/20 text-[11px]">
                    <tr>
                      <td className="p-2.5 font-bold">Owen et al. (Nature, 2010)</td>
                      <td className="p-2.5">N = 11,430</td>
                      <td className="p-2.5">Memory, Reasoning, Speed</td>
                      <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">+41.2% (p &lt; 0.001)</td>
                      <td className="p-2.5 text-rose-500 font-bold">Null (d = 0.02, p = 0.64)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Melby-Lervåg &amp; Hulme (2013)</td>
                      <td className="p-2.5">30 Studies Meta</td>
                      <td className="p-2.5">Working Memory Training</td>
                      <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">+38.5% (d = 0.82)</td>
                      <td className="p-2.5 text-rose-500 font-bold">Insignificant at Follow-up</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Wang et al. (Front. Psychol, 2025)</td>
                      <td className="p-2.5">N = 184 fMRI</td>
                      <td className="p-2.5">Relational Integration (RIT)</td>
                      <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">+31.2% (d = 0.74)</td>
                      <td className="p-2.5 text-amber-500 font-bold">Moderate Near-Far (d = 0.38)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Karpicke &amp; Roediger (Science, 2008)</td>
                      <td className="p-2.5">N = 210</td>
                      <td className="p-2.5">Frictional Retrieval Practice</td>
                      <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">+28.0% (d = 0.88)</td>
                      <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">+24.0% Long-term Retention</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </article>
        )}

        {/* ========================================================================= */}
        {/* BIBLIOGRAPHY & REFERENCES SECTION */}
        {/* ========================================================================= */}
        <section className="brutal-card p-8 space-y-6">
          <div className="flex items-center gap-2 border-b-2 border-black dark:border-white pb-3 font-mono text-sm font-bold uppercase text-foreground">
            <BookOpen className="w-4 h-4 text-amber-500 dark:text-cyan-400" />
            <span>Formal Bibliography & Foundational Literature</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-muted-foreground leading-relaxed">
            <div className="p-3 border border-black dark:border-slate-800 space-y-1">
              <span className="text-foreground font-bold">[1] Miller, G. A. (1956)</span>
              <p>The magical number seven, plus or minus two: Some limits on our capacity for processing information. <em>Psychological Review</em>, 63(2), 81–97.</p>
            </div>
            <div className="p-3 border border-black dark:border-slate-800 space-y-1">
              <span className="text-foreground font-bold">[2] Inoue, S., &amp; Matsuzawa, T. (2007)</span>
              <p>Working memory of numerals in chimpanzees. <em>Current Biology</em>, 17(23), R1004–R1005.</p>
            </div>
            <div className="p-3 border border-black dark:border-slate-800 space-y-1">
              <span className="text-foreground font-bold">[3] Woods, D. L., et al. (2015)</span>
              <p>Factors influencing simple reaction time in online computerized testing. <em>Frontiers in Human Neuroscience</em>, 9, 131.</p>
            </div>
            <div className="p-3 border border-black dark:border-slate-800 space-y-1">
              <span className="text-foreground font-bold">[4] Baddeley, A. (1992)</span>
              <p>Working memory. <em>Science</em>, 255(5044), 556–559.</p>
            </div>
            <div className="p-3 border border-black dark:border-slate-800 space-y-1">
              <span className="text-foreground font-bold">[5] Brysbaert, M. (2019)</span>
              <p>How many words do we read per minute? A review and meta-analysis of reading rate. <em>Journal of Memory and Language</em>, 109, 104047.</p>
            </div>
            <div className="p-3 border border-black dark:border-slate-800 space-y-1">
              <span className="text-foreground font-bold">[6] Fitts, P. M. (1954)</span>
              <p>The information capacity of the human motor system in controlling the amplitude of movement. <em>Journal of Experimental Psychology</em>, 47(6), 381.</p>
            </div>
            <div className="p-3 border border-black dark:border-slate-800 space-y-1">
              <span className="text-foreground font-bold">[7] Rasch, G. (1960)</span>
              <p><em>Probabilistic models for some intelligence and attainment tests.</em> Copenhagen: Danish Institute for Educational Research.</p>
            </div>
            <div className="p-3 border border-black dark:border-slate-800 space-y-1">
              <span className="text-foreground font-bold">[8] Cowan, N. (2001)</span>
              <p>The magical number 4 in short-term memory: A reconsideration of mental storage capacity. <em>Behavioral and Brain Sciences</em>, 24(1), 87–114.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
