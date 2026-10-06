// components/tests/typing-test.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useScore } from "@/lib/score-context"
import { sound } from "@/lib/audio"
import BellCurve from "@/components/bell-curve"
import { Keyboard, RotateCcw, Clock } from "lucide-react"

type GameState = "instructions" | "typing" | "results"

import { SeededPRNG } from "@/lib/engine/prng"

const CLAUSE_SUBJECTS = [
  "Biological neural networks", "Frontoparietal attention networks", "Non-equilibrium thermodynamic systems",
  "Distributed consensus protocols", "Stochastic gradient descent optimizers", "Quantum electrodynamic fields",
  "Executive cognitive architectures", "Information-theoretic compression algorithms", "Dopaminergic reinforcement pathways",
  "Cellular automata lattices", "High-throughput asynchronous event loops", "Metacognitive calibration mechanisms",
  "Synaptic plasticity mechanisms", "Recursive grammatical parsing trees", "Decentralized cryptographic ledgers"
]

const CLAUSE_VERBS = [
  "dynamically regulate incoming sensory bandwidth to prevent",
  "asymptotically converge toward minimum entropy states while minimizing",
  "actively modulate post-synaptic dendritic spikes to counteract",
  "continuously coordinate multi-agent consensus without requiring",
  "adaptively allocate working memory representations while rejecting",
  "synthesize complex relational inferences through orthogonal vectors to suppress",
  "execute low-latency decision boundaries under severe noise without creating",
  "reconfigure internal state representations in real time to neutralize"
]

const CLAUSE_OBJECTS = [
  "task-irrelevant environmental distractors and proactive perceptual interference.",
  "unbounded computational latency across dense distributed network clusters.",
  "exponential metabolic depletion during prolonged high-demand problem solving.",
  "catastrophic representational drift across interleaved neural layers.",
  "stochastic synchronization failures across high-frequency processing cores.",
  "prepotent behavioral reflexes under ambiguous environmental constraints.",
  "systematic subjective confidence biases across empirical probability judgments.",
  "retroactive memory degradation during continuous buffer updating tasks."
]

const CLAUSE_CONNECTORS = [
  "Furthermore, empirical telemetry confirms that",
  "Consequently, rigorous mathematical modeling indicates that",
  "In parallel, neurocomputational experiments demonstrate that",
  "Simultaneously, reproducible laboratory paradigms establish that",
  "Crucially, information-theoretic bounds mandate that",
  "Under these operational constraints, observation shows that"
]

export function generateProceduralTypingPassage(seed: number): string {
  const prng = new SeededPRNG(seed)
  const subj1 = prng.choice(CLAUSE_SUBJECTS)
  const verb1 = prng.choice(CLAUSE_VERBS)
  const obj1 = prng.choice(CLAUSE_OBJECTS)
  
  const conn = prng.choice(CLAUSE_CONNECTORS)
  const subj2 = prng.choice(CLAUSE_SUBJECTS.filter((s) => s !== subj1))
  const verb2 = prng.choice(CLAUSE_VERBS.filter((v) => v !== verb1))
  const obj2 = prng.choice(CLAUSE_OBJECTS.filter((o) => o !== obj1))

  return `${subj1} ${verb1} ${obj1} ${conn} ${subj2.toLowerCase()} ${verb2} ${obj2}`
}

export default function TypingTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [targetText, setTargetText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [errors, setErrors] = useState(0)
  const [finalWpm, setFinalWpm] = useState(0)
  const [finalAccuracy, setFinalAccuracy] = useState(100)
  const [percentile, setPercentile] = useState(50)

  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { addScore } = useScore()

  const startTest = () => {
    // Generate procedural passage using fresh random seed
    const seed = Math.floor(Math.random() * 1000000)
    const passage = generateProceduralTypingPassage(seed)
    setTargetText(passage)
    setUserInput("")
    setStartTime(null)
    setElapsedSeconds(0)
    setErrors(0)
    setGameState("typing")
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (!startTime && val.length > 0) {
      const now = performance.now()
      setStartTime(now)
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((performance.now() - now) / 1000))
      }, 500)
    }

    sound.playClick()

    // Calculate mistakes
    let errCount = 0
    for (let i = 0; i < val.length; i++) {
      if (val[i] !== targetText[i]) errCount++
    }
    setErrors(errCount)
    setUserInput(val)

    // Completed?
    if (val.length >= targetText.length) {
      if (timerRef.current) clearInterval(timerRef.current)
      const totalTimeMinutes = Math.max(0.05, (performance.now() - (startTime || performance.now())) / 60000)
      const wordCount = targetText.length / 5
      const grossWpm = Math.round(wordCount / totalTimeMinutes)
      const acc = Math.max(0, Math.round(((targetText.length - errCount) / targetText.length) * 100))
      const netWpm = Math.max(0, Math.round(grossWpm * (acc / 100)))

      setFinalWpm(netWpm)
      setFinalAccuracy(acc)

      sound.playSuccess()

      const saved = addScore({
        testId: "typing",
        testName: "Typing Speed",
        score: netWpm,
        unit: "WPM",
        details: { accuracy: acc, errors: errCount, rawWpm: grossWpm },
      })
      setPercentile(saved.percentile)
      setGameState("results")
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto brutal-card p-8 sm:p-12 text-center font-sans">
        <div className="w-16 h-16 border-2 border-black dark:border-slate-700 bg-indigo-500 text-white flex items-center justify-center mx-auto mb-6 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
          <Keyboard className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-foreground mb-3">
          Neuromuscular Typing Speed
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto mb-8 font-sans">
          Type the prompt as swiftly and accurately as possible. Timer starts on your first keystroke.
          Score is computed as Net Words Per Minute adjusted by accuracy.
        </p>

        <Button
          onClick={startTest}
          size="lg"
        >
          Start Typing Test
        </Button>
      </div>
    )
  }

  if (gameState === "results") {
    return (
      <div className="max-w-2xl mx-auto brutal-card p-8 text-center font-sans">
        <div className="w-16 h-16 border-2 border-black dark:border-slate-700 bg-indigo-500 text-white flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
          <Keyboard className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-xs uppercase text-muted-foreground tracking-wider mb-1 font-bold font-mono">
          Net Typing Cadence
        </h2>
        <div className="text-6xl font-black text-foreground mb-2 tabular font-mono">
          {finalWpm}
          <span className="text-2xl text-indigo-500 ml-1">WPM</span>
        </div>

        <div className="flex items-center justify-center gap-6 my-4 text-xs font-mono font-bold uppercase">
          <span>
            Accuracy: <strong className="text-foreground">{finalAccuracy}%</strong>
          </span>
          <span>•</span>
          <span>
            Errors: <strong className="text-rose-500">{errors}</strong>
          </span>
          <span>•</span>
          <span>
            Duration: <strong className="text-foreground">{elapsedSeconds}s</strong>
          </span>
        </div>

        <BellCurve testId="typing" score={finalWpm} unit="WPM" percentile={percentile} />

        <div className="flex gap-3 justify-center mt-6">
          <Button
            onClick={startTest}
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Retest Speed
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="max-w-3xl mx-auto brutal-card p-6 sm:p-10 font-sans relative cursor-text select-none"
    >
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        className="opacity-0 absolute inset-0 w-full h-full cursor-text"
        autoFocus
        autoComplete="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {/* Top status bar */}
      <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-muted-foreground mb-6 pb-4 border-b-2 border-black dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500 dark:text-sky-400 stroke-[2.5]" />
          <span>{elapsedSeconds}s elapsed</span>
        </div>
        <div>
          <span>Accuracy: </span>
          <span className="text-foreground font-black tabular">
            {userInput.length > 0
              ? `${Math.max(0, Math.round(((userInput.length - errors) / userInput.length) * 100))}%`
              : "100%"}
          </span>
        </div>
      </div>

      {/* Target text with character coloring */}
      <div className="text-xl sm:text-2xl font-mono leading-relaxed tracking-wide min-h-[160px] p-5 sm:p-6 bg-secondary/30 border-2 border-black dark:border-slate-700">
        {targetText.split("").map((char, index) => {
          let charStyle = "text-slate-500 dark:text-slate-400 font-medium"
          const isCurrent = index === userInput.length

          if (index < userInput.length) {
            charStyle =
              userInput[index] === char
                ? "text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10"
                : "text-rose-600 dark:text-rose-400 underline decoration-2 font-black bg-rose-500/20"
          }

          return (
            <span
              key={index}
              className={`${charStyle} ${isCurrent ? "border-b-2 border-black dark:border-white bg-amber-400 dark:bg-sky-400 text-slate-950 font-black px-0.5" : ""}`}
            >
              {char}
            </span>
          )
        })}
      </div>

      <div className="text-right text-xs font-mono font-bold uppercase text-muted-foreground mt-6 border-t border-black/10 dark:border-slate-800 pt-3">
        Click anywhere to focus keyboard
      </div>
    </div>
  )
}
