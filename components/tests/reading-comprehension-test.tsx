"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useScore } from "@/lib/score-context"
import { sound } from "@/lib/audio"
import BellCurve from "@/components/bell-curve"
import { BookOpen, RotateCcw, ArrowRight, CheckCircle2 } from "lucide-react"

type GameState = "instructions" | "reading" | "questions" | "results"

const PASSAGES = [
  {
    title: "Neuroplasticity and Spatial Navigation",
    text: `Neuroplasticity refers to the human nervous system's capacity to modify its structure and functional organization in response to experiential demands. In famous neuroimaging investigations of London taxi drivers, researchers identified substantial structural enlargement in the posterior hippocampus. This anatomical region corresponds critically to spatial memory retrieval and cognitive mapping. The volumetric expansion correlated directly with the time spent navigating the intricate street network of London, providing compelling empirical evidence that intensive cognitive navigation drives structural reorganization in adult human brains.`,
    wordCount: 77,
    questions: [
      {
        question: "Which anatomical structure showed volumetric expansion in taxi drivers?",
        options: ["Prefrontal Cortex", "Posterior Hippocampus", "Amygdala", "Occipital Lobe"],
        correct: 1,
      },
      {
        question: "What did the volumetric expansion correlate directly with?",
        options: [
          "Driver age and genetic markers",
          "Time spent navigating the city streets",
          "Hours of daily sleep",
          "Visual reaction velocity",
        ],
        correct: 1,
      },
      {
        question: "What core cognitive function is localized to this hippocampal region?",
        options: [
          "Spatial memory and cognitive mapping",
          "Motor typing rhythm",
          "Auditory pitch processing",
          "Emotional arousal",
        ],
        correct: 0,
      },
    ],
  },
]

export default function ReadingComprehensionTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [passageIndex, setPassageIndex] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [readSeconds, setReadSeconds] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [effectiveWpm, setEffectiveWpm] = useState(0)
  const [comprehensionScore, setComprehensionScore] = useState(0)
  const [percentile, setPercentile] = useState(50)

  const { addScore } = useScore()
  const passage = PASSAGES[passageIndex]

  const startReading = () => {
    setGameState("reading")
    setStartTime(Date.now())
  }

  const finishReading = () => {
    const elapsed = Math.max(3, (Date.now() - startTime) / 1000)
    setReadSeconds(elapsed)
    setCurrentQuestion(0)
    setSelectedAnswers([])
    sound.playClick()
    setGameState("questions")
  }

  const handleSelectAnswer = (idx: number) => {
    sound.playClick()
    const updated = [...selectedAnswers, idx]
    setSelectedAnswers(updated)

    if (currentQuestion + 1 < passage.questions.length) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      // Evaluate results
      let correct = 0
      updated.forEach((ans, qIdx) => {
        if (ans === passage.questions[qIdx].correct) correct++
      })

      const accuracy = (correct / passage.questions.length)
      const rawWpm = Math.round((passage.wordCount / readSeconds) * 60)
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
      <div className="max-w-2xl mx-auto cyber-card rounded-2xl p-8 sm:p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-mono tracking-tight text-foreground mb-3">
          Reading Comprehension & Velocity
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-6">
          Read the technical passage thoroughly at your natural speed. 
          When finished, click Continue to complete validation questions. 
          Effective score blends raw WPM with factual retention.
        </p>

        <Button
          onClick={startReading}
          size="lg"
          className="bg-teal-500 hover:bg-teal-400 text-black font-mono font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-teal-500/20"
        >
          Begin Passage
        </Button>
      </div>
    )
  }

  if (gameState === "reading") {
    return (
      <div className="max-w-2xl mx-auto cyber-card rounded-2xl p-8 sm:p-12">
        <h3 className="text-lg font-bold font-mono text-teal-400 mb-4">{passage.title}</h3>
        <p className="text-base sm:text-lg leading-relaxed text-foreground font-sans mb-8">
          {passage.text}
        </p>

        <div className="flex justify-end">
          <Button
            onClick={finishReading}
            className="bg-teal-500 hover:bg-teal-400 text-black font-mono font-bold px-6 py-2.5 rounded-xl transition-all"
          >
            Finished Reading <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    )
  }

  if (gameState === "questions") {
    const q = passage.questions[currentQuestion]
    return (
      <div className="max-w-xl mx-auto cyber-card rounded-2xl p-8 sm:p-10">
        <div className="flex items-center justify-between mb-6 text-xs font-mono text-muted-foreground">
          <span>Question {currentQuestion + 1} of {passage.questions.length}</span>
          <span className="text-teal-400">Comprehension Check</span>
        </div>

        <h3 className="text-base sm:text-lg font-mono font-bold text-foreground mb-6">
          {q.question}
        </h3>

        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelectAnswer(i)}
              className="w-full text-left p-4 rounded-xl border border-border/60 bg-secondary/50 hover:bg-teal-500/10 hover:border-teal-500/40 text-sm font-medium transition-all"
            >
              <span className="font-mono text-xs text-muted-foreground mr-3">[{i + 1}]</span>
              {opt}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto cyber-card rounded-2xl p-8 text-center animate-in fade-in">
      <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h2 className="text-xs font-mono uppercase text-muted-foreground tracking-wider mb-1">
        Effective Comprehension Velocity
      </h2>
      <div className="text-5xl font-mono font-black text-foreground mb-2 tabular">
        {effectiveWpm} <span className="text-2xl text-teal-400">WPM</span>
      </div>

      <div className="flex justify-center gap-6 my-4 text-sm font-mono">
        <div className="px-4 py-2 rounded-xl bg-card/60 border border-border/50">
          <span className="text-muted-foreground text-xs block">Accuracy</span>
          <span className="text-lg font-bold text-emerald-400">{comprehensionScore}%</span>
        </div>
        <div className="px-4 py-2 rounded-xl bg-card/60 border border-border/50">
          <span className="text-muted-foreground text-xs block">Read Time</span>
          <span className="text-lg font-bold text-foreground">{Math.round(readSeconds)}s</span>
        </div>
      </div>

      <BellCurve testId="reading-comprehension" score={effectiveWpm} unit="WPM" percentile={percentile} />

      <div className="flex gap-3 justify-center mt-6">
        <Button
          onClick={startReading}
          className="bg-teal-500 hover:bg-teal-400 text-black font-mono font-bold px-6 py-2.5 rounded-xl transition-all"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Try Again
        </Button>
      </div>
    </div>
  )
}