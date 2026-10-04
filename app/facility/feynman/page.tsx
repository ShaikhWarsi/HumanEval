// app/facility/feynman/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  BookOpen,
} from "lucide-react"
import { FacilityNav } from "@/components/facility-nav"
import { sound } from "@/lib/audio"

interface FeynmanPrompt {
  id: string
  title: string
  domain: string
  forbiddenJargon: string[]
  boundaryBreakdown: string
  counterIntuitiveFact: string
  goldStandardAnalogy: string
}

const CURATED_FEYNMAN_PROMPTS: FeynmanPrompt[] = [
  {
    id: "feynman-entropy",
    title: "Thermodynamic Entropy & Arrow of Time",
    domain: "Theoretical Physics",
    forbiddenJargon: ["disorder", "chaos", "randomness", "microstates"],
    boundaryBreakdown:
      "Breaks down in closed reversible quantum systems undergoing unitary evolution where information is never destroyed, or at absolute zero (0 Kelvin).",
    counterIntuitiveFact:
      "A shattered glass never spontaneously reassembles not because Newtonian laws forbid it (they are time-reversible), but because the configuration space of shattered glass is exponentially larger than the single intact configuration.",
    goldStandardAnalogy:
      "Imagine a fresh deck of cards ordered by suit. Shuffling it once moves it from 1 known arrangement into 1 of 52! (~8×10^67) arrangements. Every subsequent shuffle maintains the high-probability mess because almost all possible configurations are thoroughly mixed.",
  },
  {
    id: "feynman-attention",
    title: "Transformer Scaled Dot-Product Attention",
    domain: "Machine Learning Architecture",
    forbiddenJargon: ["embeddings", "latent vector", "neural network", "weights"],
    boundaryBreakdown:
      "Quadratic time complexity O(N^2) with sequence length N; completely fails to retain context if sequence length exceeds the context window capacity without sliding attention.",
    counterIntuitiveFact:
      "The model has no inherent sense of word order or time—unless explicit position tags are stamped onto every token, 'dog bites man' and 'man bites dog' produce identical attention affinity scores.",
    goldStandardAnalogy:
      "Imagine a filing cabinet where every file has a label (Key) and contents (Value). You arrive with a search note (Query). Attention calculates how closely your query matches each label, creating a percentage weighting, and returns a blended summary of the most relevant folder contents.",
  },
  {
    id: "feynman-godel",
    title: "Gödel's First Incompleteness Theorem",
    domain: "Mathematical Logic",
    forbiddenJargon: ["meta-mathematics", "axiomatization", "formal system", "isomorphism"],
    boundaryBreakdown:
      "Only applies to consistent deductive rulebooks powerful enough to perform basic whole-number arithmetic. Simpler systems (like Presburger arithmetic) are completely provable and complete.",
    counterIntuitiveFact:
      "There exist mathematical statements that are objectively, unarguably true, yet provably impossible to prove using the rules of arithmetic.",
    goldStandardAnalogy:
      "Imagine a sentence that says: 'This specific sentence cannot be verified as true by any rule in this manual.' If the manual verifies it, the manual lied (inconsistent). If the manual cannot verify it, the sentence spoke the truth, proving the manual has blind spots (incomplete).",
  },
]

export default function FeynmanPage() {
  const [prompts] = useState<FeynmanPrompt[]>(CURATED_FEYNMAN_PROMPTS)
  const [selectedPrompt, setSelectedPrompt] = useState<FeynmanPrompt>(CURATED_FEYNMAN_PROMPTS[0])
  const [step, setStep] = useState<number>(1)
  const [definitionText, setDefinitionText] = useState("")
  const [analogyText, setAnalogyText] = useState("")
  const [boundaryText, setBoundaryText] = useState("")
  const [edgeCaseText, setEdgeCaseText] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)

  const handleNextStep = () => {
    sound.playClick()
    if (step < 4) {
      setStep((prev) => prev + 1)
    } else {
      setIsCompleted(true)
      sound.playSuccess()
    }
  }

  const handleReset = (p: FeynmanPrompt) => {
    sound.playClick()
    setSelectedPrompt(p)
    setStep(1)
    setDefinitionText("")
    setAnalogyText("")
    setBoundaryText("")
    setEdgeCaseText("")
    setIsCompleted(false)
  }

  return (
    <div className="min-h-screen pb-20 dot-grid mesh-glow">
      <FacilityNav />

      <main className="max-w-5xl mx-auto px-4 pt-8 space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
              <Link href="/facility" className="hover:underline">
                Facility
              </Link>
              <span>/</span>
              <span>Feynman Arena</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-foreground flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-400" />
              <span>Feynman Epistemic Deconstruction Arena</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Epistemic synthesis: Plain-English Zero-Jargon → First-Principles Analogy → Boundary Stress-Test → Edge Case.
            </p>
          </div>
        </div>

        {/* Prompt Selector */}
        <div className="cyber-card p-4 rounded-xl border border-border/70 space-y-2 font-mono">
          <span className="text-xs text-muted-foreground uppercase">Target Concept Dossier:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {prompts.map((p) => (
              <button
                key={p.id}
                onClick={() => handleReset(p)}
                className={`p-3 rounded-lg text-left border transition-all ${
                  selectedPrompt.id === p.id
                    ? "bg-blue-500/15 border-blue-500/40 text-blue-300 font-semibold"
                    : "bg-muted/20 border-border/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="text-xs truncate font-bold">{p.title}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{p.domain}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Deconstruction Card */}
        <div className="cyber-card p-6 sm:p-8 rounded-2xl border border-border/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
            <div>
              <span className="text-xs font-mono uppercase text-blue-400 font-bold block">
                Target: {selectedPrompt.title}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Domain: {selectedPrompt.domain}
              </span>
            </div>

            {/* Stepper pills */}
            <div className="flex items-center gap-1.5 font-mono text-xs">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold border ${
                    step === s
                      ? "bg-blue-500 text-black border-blue-400"
                      : step > s
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                      : "bg-muted/30 text-muted-foreground border-border/40"
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* STEP 1: ZERO JARGON DEFINITION */}
          {step === 1 && (
            <div className="space-y-4 font-mono">
              <div className="space-y-1">
                <span className="text-xs uppercase text-blue-400 font-bold">
                  Stage 1 // Zero-Jargon Plain English Definition
                </span>
                <p className="text-xs text-muted-foreground font-sans">
                  Explain the concept as if explaining to a bright 12-year-old. You are strictly FORBIDDEN from using
                  the following buzzwords:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedPrompt.forbiddenJargon.map((word) => (
                    <span
                      key={word}
                      className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold"
                    >
                      BANNED: &ldquo;{word}&rdquo;
                    </span>
                  ))}
                </div>
              </div>

              <textarea
                rows={5}
                value={definitionText}
                onChange={(e) => setDefinitionText(e.target.value)}
                placeholder="Write your zero-jargon explanation here..."
                className="w-full p-4 rounded-xl border border-border/60 bg-muted/20 text-sm font-sans text-foreground focus:outline-none focus:border-blue-500"
              />

              <div className="flex justify-end pt-2">
                <button
                  disabled={!definitionText.trim()}
                  onClick={handleNextStep}
                  className="px-5 py-2 rounded-xl bg-blue-500 text-black font-bold text-xs hover:bg-blue-400 transition-all flex items-center gap-2 disabled:opacity-40"
                >
                  <span>Lock Plain English & Proceed to Analogy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: MECHANICAL ANALOGY */}
          {step === 2 && (
            <div className="space-y-4 font-mono">
              <div className="space-y-1">
                <span className="text-xs uppercase text-blue-400 font-bold">
                  Stage 2 // First-Principles Physical Analogy
                </span>
                <p className="text-xs text-muted-foreground font-sans">
                  Construct a physical, tangible mechanical analogy (pipes, water tanks, filing cabinets, gears)
                  that maps 1-to-1 onto the system&apos;s behavior.
                </p>
              </div>

              <textarea
                rows={5}
                value={analogyText}
                onChange={(e) => setAnalogyText(e.target.value)}
                placeholder="Map the system to a physical mechanical machine..."
                className="w-full p-4 rounded-xl border border-border/60 bg-muted/20 text-sm font-sans text-foreground focus:outline-none focus:border-blue-500"
              />

              <div className="flex justify-end pt-2">
                <button
                  disabled={!analogyText.trim()}
                  onClick={handleNextStep}
                  className="px-5 py-2 rounded-xl bg-blue-500 text-black font-bold text-xs hover:bg-blue-400 transition-all flex items-center gap-2 disabled:opacity-40"
                >
                  <span>Lock Analogy & Proceed to Boundary Test</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: BOUNDARY BREAKDOWN */}
          {step === 3 && (
            <div className="space-y-4 font-mono">
              <div className="space-y-1">
                <span className="text-xs uppercase text-blue-400 font-bold">
                  Stage 3 // Boundary Condition Stress-Test
                </span>
                <p className="text-xs text-muted-foreground font-sans">
                  Where does this theoretical model fail? Under what extreme conditions (near-zero, infinity,
                  extreme scale, noise) does the principle collapse?
                </p>
              </div>

              <textarea
                rows={5}
                value={boundaryText}
                onChange={(e) => setBoundaryText(e.target.value)}
                placeholder="Identify exact failure regimes and boundary breakdowns..."
                className="w-full p-4 rounded-xl border border-border/60 bg-muted/20 text-sm font-sans text-foreground focus:outline-none focus:border-blue-500"
              />

              <div className="flex justify-end pt-2">
                <button
                  disabled={!boundaryText.trim()}
                  onClick={handleNextStep}
                  className="px-5 py-2 rounded-xl bg-blue-500 text-black font-bold text-xs hover:bg-blue-400 transition-all flex items-center gap-2 disabled:opacity-40"
                >
                  <span>Lock Boundary Conditions & Proceed to Edge Case</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: COUNTER-INTUITIVE CONSEQUENCE */}
          {step === 4 && !isCompleted && (
            <div className="space-y-4 font-mono">
              <div className="space-y-1">
                <span className="text-xs uppercase text-blue-400 font-bold">
                  Stage 4 // Counter-Intuitive Edge Case
                </span>
                <p className="text-xs text-muted-foreground font-sans">
                  What consequence of this theorem directly defies naive common-sense human intuition?
                </p>
              </div>

              <textarea
                rows={5}
                value={edgeCaseText}
                onChange={(e) => setEdgeCaseText(e.target.value)}
                placeholder="Describe the counter-intuitive phenomenon..."
                className="w-full p-4 rounded-xl border border-border/60 bg-muted/20 text-sm font-sans text-foreground focus:outline-none focus:border-blue-500"
              />

              <div className="flex justify-end pt-2">
                <button
                  disabled={!edgeCaseText.trim()}
                  onClick={handleNextStep}
                  className="px-5 py-2 rounded-xl bg-blue-500 text-black font-bold text-xs hover:bg-blue-400 transition-all flex items-center gap-2 disabled:opacity-40"
                >
                  <span>Finalize Epistemic Synthesis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* COMPLETED DEBRIEF */}
          {isCompleted && (
            <div className="space-y-6 font-mono text-xs">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>
                  <strong>EPISTEMIC SYNTHESIS VERIFIED:</strong> You completed all 4 stages of the Feynman protocol.
                </span>
              </div>

              {/* Gold standard breakdown comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-2">
                  <span className="font-bold text-foreground uppercase block">
                    Gold-Standard Physical Analogy:
                  </span>
                  <p className="text-muted-foreground font-sans leading-relaxed">
                    {selectedPrompt.goldStandardAnalogy}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-2">
                  <span className="font-bold text-foreground uppercase block">
                    Boundary Regime Collapse:
                  </span>
                  <p className="text-muted-foreground font-sans leading-relaxed">
                    {selectedPrompt.boundaryBreakdown}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-1">
                <span className="font-bold text-blue-400 uppercase block">
                  Naïve Intuition Trap / Counter-Intuitive Truth:
                </span>
                <p className="text-muted-foreground font-sans leading-relaxed">
                  {selectedPrompt.counterIntuitiveFact}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    const nextIdx = (prompts.findIndex((p) => p.id === selectedPrompt.id) + 1) % prompts.length
                    handleReset(prompts[nextIdx])
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-500 text-black font-bold hover:bg-blue-400 transition-all flex items-center gap-2"
                >
                  <span>Deconstruct Next Technical Concept</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
