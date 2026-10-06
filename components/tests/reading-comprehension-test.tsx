// components/tests/reading-comprehension-test.tsx
"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useScore } from "@/lib/score-context"
import { sound } from "@/lib/audio"
import BellCurve from "@/components/bell-curve"
import { BookOpen, RotateCcw, ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { SeededPRNG } from "@/lib/engine/prng"

type GameState = "instructions" | "reading" | "questions" | "results"

export interface GeneratedQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface GeneratedPassage {
  title: string
  domain: string
  text: string
  wordCount: number
  questions: GeneratedQuestion[]
}

/**
 * PROCEDURAL READING DOSSIER GENERATOR
 * Dynamically synthesizes novel technical passages, parametric causal mechanisms,
 * and randomized multiple-choice comprehension questions with shuffled distractors.
 * Eliminates static memorization completely.
 */
function generateProceduralPassage(seed: number): GeneratedPassage {
  const prng = new SeededPRNG(seed)

  const archetypes = [
    {
      domain: "Cognitive Neurobiology",
      titleTemplate: "Cortical Gating and {system} Modulation",
      builder: () => {
        const brainRegion = prng.choice(["Dorsolateral Prefrontal Cortex", "Anterior Cingulate Cortex", "Frontoparietal Network", "Posterior Parietal Lobule"])
        const neuromodulator = prng.choice(["dopaminergic D1 tone", "noradrenergic LC phasic firing", "cholinergic basal forebrain projection", "GABAergic parvalbumin interneuron gating"])
        const cognitiveFaculty = prng.choice(["working memory maintenance", "attentional filter selectivity", "prepotent motor suppression", "cognitive set reconfiguration"])
        const taskDemands = prng.choice(["high distractibility visual streams", "rapidly alternating task rules", "multi-cue relational integration", "delayed response choice deadlines"])
        const failureMode = prng.choice(["perseverative intrusions", "speed-accuracy degradation", "attenuated signal-to-noise ratio", "premature action release"])
        const latencyImpact = prng.int(45, 140)

        const text = `Recent neurophysiological recordings confirm that the ${brainRegion} coordinates ${cognitiveFaculty} through rhythmic ${neuromodulator}. When human subjects navigate ${taskDemands}, microcircuit stability depends on maintaining an optimal neurochemical equilibrium. Attenuation of this regulatory signal causes an immediate breakdown in sensory filter thresholds, precipitating ${failureMode} and producing an average latency penalty of ${latencyImpact}ms. Conversely, targeted cognitive pacing restores local oscillatory synchrony, shielding stored task representations from environmental noise.`
        const wordCount = text.split(/\s+/).length

        const questions: GeneratedQuestion[] = [
          {
            question: `Which anatomical region is identified as governing ${cognitiveFaculty}?`,
            options: prng.shuffle([
              brainRegion,
              "Primary Visual Calcarine Sulcus",
              "Cerebellar Dentate Nucleus",
              "Subthalamic Ventral Tegmentum",
            ]),
            correctIndex: -1, // will resolve after shuffle
            explanation: `The passage explicitly attributes control to the ${brainRegion}.`,
          },
          {
            question: `What specific operational impairment results from regulatory attenuation?`,
            options: prng.shuffle([
              failureMode,
              "Unconditional motor paralysis",
              "Total auditory hearing loss",
              "Irreversible long-term retrograde amnesia",
            ]),
            correctIndex: -1,
            explanation: `The passage notes that attenuation precipitates ${failureMode}.`,
          },
          {
            question: `According to the findings, what latency penalty emerges during filter breakdown?`,
            options: prng.shuffle([
              `${latencyImpact}ms latency penalty`,
              `${latencyImpact * 3}ms latency penalty`,
              `${Math.max(10, Math.round(latencyImpact / 3))}ms latency penalty`,
              "Zero measurable latency change",
            ]),
            correctIndex: -1,
            explanation: `The empirical text documents a ${latencyImpact}ms latency penalty.`,
          },
        ]

        // Resolve correct indices
        questions[0].correctIndex = questions[0].options.indexOf(brainRegion)
        questions[1].correctIndex = questions[1].options.indexOf(failureMode)
        questions[2].correctIndex = questions[2].options.indexOf(`${latencyImpact}ms latency penalty`)

        return {
          title: `Cortical Gating in ${brainRegion}`,
          domain: "Cognitive Neurobiology",
          text,
          wordCount,
          questions,
        }
      },
    },
    {
      domain: "Thermodynamics & Information Theory",
      titleTemplate: "Thermodynamic Entropy in {system} Architectures",
      builder: () => {
        const physicalConstraint = prng.choice(["Landauer Bit Erasure Limit", "Carnot Reversible Cycle Boundary", "Shannon Channel Capacity Ceiling", "Von Neumann Dissipation Ratio"])
        const architectureType = prng.choice(["asynchronous reversible CMOS", "superconducting flux-qubit arrays", "spintronic domain-wall circuits", "optical photonic waveguides"])
        const physicalQuantity = prng.choice(["thermal heat dissipation", "magnetic flux hysteresis", "coherent photon phase jitter", "parasitic capacitive leakage"])
        const efficiencyGain = prng.int(18, 54)
        const temperatureKelvin = prng.choice([4, 77, 293, 310])

        const text = `In physical computation, the ${physicalConstraint} dictates that logical state transitions fundamentally interface with thermodynamic entropy. When executing non-reversible state overwrites at ${temperatureKelvin} Kelvin, systems inevitably emit ${physicalQuantity} into the surrounding substrate. By transitioning to ${architectureType}, research laboratories have demonstrated that preserving logical reversibility mitigates the physical thermal ceiling, delivering a measured ${efficiencyGain}% reduction in energetic degradation without sacrificing algorithmic throughput.`
        const wordCount = text.split(/\s+/).length

        const questions: GeneratedQuestion[] = [
          {
            question: `Which fundamental principle dictates entropy limits during state transitions?`,
            options: prng.shuffle([
              physicalConstraint,
              "Kepler's Law of Orbital Eccentricity",
              "Hooke's Elastic Recovery Principle",
              "Boyle's Ideal Gas Law",
            ]),
            correctIndex: -1,
            explanation: `The passage cites ${physicalConstraint} as establishing the entropy limit.`,
          },
          {
            question: `What architecture is explored to mitigate thermal dissipation?`,
            options: prng.shuffle([
              architectureType,
              "Mechanical vacuum tube relays",
              "Standard incandescent filaments",
              "Unshielded copper busbars",
            ]),
            correctIndex: -1,
            explanation: `The text highlights ${architectureType} as preserving reversibility.`,
          },
          {
            question: `What measured energetic reduction was achieved by preserving logical reversibility?`,
            options: prng.shuffle([
              `${efficiencyGain}% reduction in energetic degradation`,
              `${efficiencyGain + 35}% reduction in energetic degradation`,
              "100% elimination of all electrical resistance",
              "Zero measurable energetic difference",
            ]),
            correctIndex: -1,
            explanation: `The passage reports a ${efficiencyGain}% reduction in degradation.`,
          },
        ]

        questions[0].correctIndex = questions[0].options.indexOf(physicalConstraint)
        questions[1].correctIndex = questions[1].options.indexOf(architectureType)
        questions[2].correctIndex = questions[2].options.indexOf(`${efficiencyGain}% reduction in energetic degradation`)

        return {
          title: `Entropy Bounds in Physical Computation`,
          domain: "Thermodynamics & Information",
          text,
          wordCount,
          questions,
        }
      },
    },
    {
      domain: "Distributed Systems & Algorithms",
      titleTemplate: "Consensus Convergence under {system}",
      builder: () => {
        const protocolName = prng.choice(["Raft Log Replication", "Paxos Quorum Consensus", "Byzantine Fault Tolerant PBFT", "Vector Clock Causal Ordering"])
        const failureMode = prng.choice(["asymmetric network partition", "transient hardware clock drift", "malicious Byzantine packet dropping", "cascading message queue saturation"])
        const performanceMetric = prng.choice(["tail commit latency", "state machine replication throughput", "leader election convergence window", "checkpoint compaction overhead"])
        const percentageDegradation = prng.int(22, 65)

        const text = `In distributed computational clusters, ${protocolName} enforces state consistency across untrusted nodes. When an infrastructure node encounters an unexpected ${failureMode}, heartbeat gossip intervals become desynchronized. Under these boundary conditions, the distributed cluster sacrifices immediate availability to preserve mathematical safety guarantees, inducing an immediate ${percentageDegradation}% degradation in ${performanceMetric}. Formal correctness proofs show that partition tolerance strictly bounds real-time consistency.`
        const wordCount = text.split(/\s+/).length

        const questions: GeneratedQuestion[] = [
          {
            question: `What protocol is evaluated for state consistency enforcement?`,
            options: prng.shuffle([
              protocolName,
              "Simple Mail Transfer Protocol",
              "Unencrypted Telnet Terminal",
              "Single-Threaded File Locking",
            ]),
            correctIndex: -1,
            explanation: `The passage focuses on the mechanics of ${protocolName}.`,
          },
          {
            question: `What system anomaly triggers desynchronized heartbeat intervals?`,
            options: prng.shuffle([
              failureMode,
              "Standard scheduled OS reboots",
              "Manual keyboard unplugging",
              "Monitor screen power saving mode",
            ]),
            correctIndex: -1,
            explanation: `The text specifically notes that ${failureMode} causes heartbeat desynchronization.`,
          },
          {
            question: `What specific operational penalty is incurred to preserve safety guarantees?`,
            options: prng.shuffle([
              `${percentageDegradation}% degradation in ${performanceMetric}`,
              "Permanent hard drive corruption",
              "Complete cluster power shutdown",
              "Instantaneous doubling of network bandwidth",
            ]),
            correctIndex: -1,
            explanation: `The text documents a ${percentageDegradation}% degradation in ${performanceMetric}.`,
          },
        ]

        questions[0].correctIndex = questions[0].options.indexOf(protocolName)
        questions[1].correctIndex = questions[1].options.indexOf(failureMode)
        questions[2].correctIndex = questions[2].options.indexOf(`${percentageDegradation}% degradation in ${performanceMetric}`)

        return {
          title: `Consistency Boundaries in Distributed Systems`,
          domain: "Distributed Systems",
          text,
          wordCount,
          questions,
        }
      },
    },
  ]

  const pickedArchetype = prng.choice(archetypes)
  return pickedArchetype.builder()
}

export default function ReadingComprehensionTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [currentPassage, setCurrentPassage] = useState<GeneratedPassage | null>(null)
  const [readSeconds, setReadSeconds] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [effectiveWpm, setEffectiveWpm] = useState(0)
  const [comprehensionScore, setComprehensionScore] = useState(0)
  const [percentile, setPercentile] = useState(50)

  const startTimeRef = useRef<number>(0)
  const { addScore } = useScore()

  const startReading = () => {
    const randomSeed = Math.floor(Math.random() * 1000000)
    const generated = generateProceduralPassage(randomSeed)
    setCurrentPassage(generated)
    setGameState("reading")
    startTimeRef.current = performance.now()
  }

  const finishReading = () => {
    if (!currentPassage) return
    const elapsedSeconds = Math.max(3, (performance.now() - startTimeRef.current) / 1000)
    setReadSeconds(elapsedSeconds)
    setCurrentQuestion(0)
    setSelectedAnswers([])
    sound.playClick()
    setGameState("questions")
  }

  const handleSelectAnswer = (idx: number) => {
    if (!currentPassage) return
    sound.playClick()
    const updated = [...selectedAnswers, idx]
    setSelectedAnswers(updated)

    if (currentQuestion + 1 < currentPassage.questions.length) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      // Evaluate results
      let correct = 0
      updated.forEach((ans, qIdx) => {
        if (ans === currentPassage.questions[qIdx].correctIndex) correct++
      })

      const accuracy = correct / currentPassage.questions.length
      const rawWpm = Math.round((currentPassage.wordCount / readSeconds) * 60)
      const netWpm = Math.round(rawWpm * accuracy)

      setComprehensionScore(Math.round(accuracy * 100))
      setEffectiveWpm(netWpm)

      const saved = addScore({
        testId: "reading-comprehension",
        testName: "Reading Comprehension",
        score: netWpm,
        unit: "WPM",
        details: { accuracy: Math.round(accuracy * 100), rawWpm, readSeconds },
      })
      setPercentile(saved.percentile)
      setGameState("results")
    }
  }

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto brutal-card p-8 sm:p-12 text-center font-sans">
        <div className="w-16 h-16 border-2 border-border bg-teal-400 text-black flex items-center justify-center mx-auto mb-6 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
          <BookOpen className="w-8 h-8 stroke-[2.5]" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2 font-mono">
          <span className="text-[10px] font-bold px-2 py-0.5 border border-border bg-amber-400 dark:bg-sky-400 text-black uppercase">
            PROCEDURAL DOSSIER ENGINE
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 border border-border bg-secondary uppercase text-foreground">
            ZERO REPETITION
          </span>
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-3 font-display">
          Reading Comprehension & Syntactic Parsing
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto mb-6 font-sans">
          Read a procedurally generated scientific dossier at your natural pace. Passages and causal mechanisms are uniquely synthesized on every attempt.
          Your score is Effective WPM adjusted by comprehension accuracy.
        </p>

        <Button
          onClick={startReading}
          size="lg"
          className="font-sans font-bold uppercase"
        >
          Begin Procedural Reading
        </Button>
      </div>
    )
  }

  if (gameState === "reading" && currentPassage) {
    return (
      <div className="max-w-2xl mx-auto brutal-card p-6 sm:p-10 space-y-6 font-sans">
        <div className="flex items-center justify-between border-b-2 border-border pb-4">
          <div>
            <span className="text-xs font-bold uppercase text-muted-foreground block font-mono">
              Domain: {currentPassage.domain}
            </span>
            <span className="text-base sm:text-lg font-black uppercase text-amber-600 dark:text-sky-400 font-display">
              {currentPassage.title}
            </span>
          </div>
          <span className="text-xs font-bold uppercase text-muted-foreground border border-border px-2.5 py-1 font-mono">
            {currentPassage.wordCount} Words
          </span>
        </div>

        <p className="text-base sm:text-lg leading-relaxed text-foreground select-none font-sans">
          {currentPassage.text}
        </p>

        <div className="flex justify-end pt-4 border-t-2 border-border">
          <Button
            onClick={finishReading}
            className="font-sans font-bold uppercase"
          >
            I Finished Reading <ArrowRight className="w-4 h-4 ml-1.5 stroke-[3]" />
          </Button>
        </div>
      </div>
    )
  }

  if (gameState === "questions" && currentPassage) {
    const q = currentPassage.questions[currentQuestion]
    return (
      <div className="max-w-2xl mx-auto brutal-card p-6 sm:p-10 space-y-6 font-sans">
        <div className="flex items-center justify-between text-xs uppercase font-bold text-muted-foreground border-b-2 border-border pb-3 font-mono">
          <span>Question {currentQuestion + 1} of {currentPassage.questions.length}</span>
          <span className="truncate max-w-[200px]">{currentPassage.title}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug font-sans">
          {q.question}
        </h3>

        <div className="grid grid-cols-1 gap-3 pt-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelectAnswer(i)}
              className="p-4 border-2 border-border bg-card hover:bg-secondary text-left font-sans text-sm sm:text-base text-foreground transition-all flex items-center justify-between shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer group"
            >
              <span className="font-medium text-foreground">{opt}</span>
              <span className="w-7 h-7 border-2 border-border bg-card group-hover:bg-amber-400 dark:group-hover:bg-sky-400 group-hover:text-black flex items-center justify-center text-xs font-black shrink-0 ml-3 font-mono">
                {String.fromCharCode(65 + i)}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Results
  return (
    <div className="max-w-2xl mx-auto brutal-card p-8 text-center font-sans">
      <div className="w-16 h-16 border-2 border-border bg-teal-400 text-black flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
        <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
      </div>
      <h2 className="text-xs uppercase text-muted-foreground tracking-wider mb-1 font-bold">
        Effective Reading Velocity
      </h2>
      <div className="text-6xl font-black text-foreground mb-2 tabular">
        {effectiveWpm}
        <span className="text-2xl text-teal-500 ml-1">WPM</span>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase text-muted-foreground mb-6">
        <span>Comprehension: <strong className="text-foreground">{comprehensionScore}%</strong></span>
        <span>•</span>
        <span>Duration: <strong className="text-foreground">{readSeconds.toFixed(1)}s</strong></span>
      </div>

      <BellCurve
        testId="reading-comprehension"
        score={effectiveWpm}
        unit="WPM"
        percentile={percentile}
      />

      <div className="flex gap-3 justify-center mt-6">
        <Button
          onClick={() => {
            sound.playClick()
            startReading()
          }}
          className="border-2 border-black dark:border-white font-mono font-black uppercase shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Read Another Procedural Passage
        </Button>
      </div>
    </div>
  )
}