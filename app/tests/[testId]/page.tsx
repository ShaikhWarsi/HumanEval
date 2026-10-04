import { notFound } from "next/navigation"
import Link from "next/link"
import ReactionTimeTest from "@/components/tests/reaction-time-test"
import SequenceMemoryTest from "@/components/tests/sequence-memory-test"
import AimTrainerTest from "@/components/tests/aim-trainer-test"
import NumberMemoryTest from "@/components/tests/number-memory-test"
import VerbalMemoryTest from "@/components/tests/verbal-memory-test"
import ChimpTest from "@/components/tests/chimp-test"
import ReadingComprehensionTest from "@/components/tests/reading-comprehension-test"
import VisualMemoryTest from "@/components/tests/visual-memory-test"
import TypingTest from "@/components/tests/typing-test"
import Footer from "@/components/footer"
import { BENCHMARKS } from "@/lib/benchmarks"
import { ArrowLeft, Brain, Sparkles, Activity, Info } from "lucide-react"

const testDetails: Record<
  string,
  {
    title: string
    description: string
    component: string
    about: string
    scientificBasis: string
  }
> = {
  "reaction-time": {
    title: "Reaction Time",
    description: "Measure your synaptic visual-to-motor reaction latency.",
    component: "ReactionTimeTest",
    about:
      "This protocol measures visual reaction latency. The human median sits around 270 milliseconds. Latency is influenced by monitor refresh rate, input polling latency, and biological neural transmission speed.",
    scientificBasis: "Simple reaction time tasks evaluate efferent nerve signal conduction and visual cortical processing.",
  },
  "sequence-memory": {
    title: "Sequence Memory",
    description: "Memorize and reproduce progressively expanding spatial button sequences.",
    component: "SequenceMemoryTest",
    about:
      "A classic Simon span protocol. The sequence builds by one additional step per completed level. Replicate the illuminated sequence with zero errors.",
    scientificBasis: "Tests visuospatial working memory and temporal order retention in the prefrontal cortex.",
  },
  "aim-trainer": {
    title: "Aim Trainer",
    description: "Eliminate 30 randomized targets as quickly and accurately as possible.",
    component: "AimTrainerTest",
    about:
      "Targets appear across the spatial arena. Click all 30 targets with maximum velocity and minimal misses. Live tracking calculates average latency per target and true accuracy.",
    scientificBasis: "Measures ballistic motor control, rapid saccadic eye movements, and hand-eye neuromuscular coordination.",
  },
  "number-memory": {
    title: "Number Memory",
    description: "Remember progressively longer sequences of numerical digits.",
    component: "NumberMemoryTest",
    about:
      "The average adult working memory holds 7 ± 2 digits (Miller's Law). After each successful level, an additional digit is appended.",
    scientificBasis: "Assesses phonological loop capacity within working memory without spatial assistance.",
  },
  "verbal-memory": {
    title: "Verbal Memory",
    description: "Differentiate between previously seen words and novel words in real time.",
    component: "VerbalMemoryTest",
    about:
      "Words flash sequentially. If you've seen the word in this session, click SEEN. If it's novel, click NEW. You have 3 lives.",
    scientificBasis: "Tests recognition memory and episodic retrieval versus familiarity heuristics in the hippocampus.",
  },
  "chimp-test": {
    title: "Chimp Test (Ayumu Protocol)",
    description: "Click squares in ascending numerical order after they are instantly masked.",
    component: "ChimpTest",
    about:
      "Based on Kyoto University's famous Ayumu chimpanzee studies. Chimpanzees consistently outperform human working memory by instantly remembering 9 masked digits in under 0.5s.",
    scientificBasis: "Evaluates instantaneous iconic and photographic spatial working memory.",
  },
  "visual-memory": {
    title: "Visual Memory",
    description: "Recall and select flashed matrix coordinates on an expanding grid.",
    component: "VisualMemoryTest",
    about:
      "A matrix of tiles flashes. Memorize the active spatial coordinates and recreate the pattern once tiles reset. Matrix dimensions scale as you progress.",
    scientificBasis: "Measures visuospatial sketchpad capacity in parietal-occipital pathways.",
  },
  typing: {
    title: "Typing Test",
    description: "Evaluate your net typing velocity (WPM), accuracy, and cadence.",
    component: "TypingTest",
    about:
      "Type the provided passage with precision. Standard WPM is calculated as (net characters / 5) per minute. Live accuracy tracks error frequency.",
    scientificBasis: "Measures procedural muscle memory, cognitive anticipation, and fine motor execution.",
  },
  "reading-comprehension": {
    title: "Reading Comprehension",
    description: "Test reading velocity alongside active information synthesis and retention.",
    component: "ReadingComprehensionTest",
    about:
      "Read the passage at your natural pace, then answer detailed comprehension questions. Effective WPM combines reading speed with accuracy.",
    scientificBasis: "Evaluates working memory integration during high-speed linguistic parsing.",
  },
}

export default async function TestPage({ params }: { params: Promise<{ testId: string }> }) {
  const testId = (await params).testId
  const test = testDetails[testId]

  if (!test) {
    notFound()
  }

  const benchmarkMeta = BENCHMARKS[testId]

  const renderTestComponent = () => {
    switch (test.component) {
      case "ReactionTimeTest":
        return <ReactionTimeTest />
      case "SequenceMemoryTest":
        return <SequenceMemoryTest />
      case "AimTrainerTest":
        return <AimTrainerTest />
      case "NumberMemoryTest":
        return <NumberMemoryTest />
      case "VerbalMemoryTest":
        return <VerbalMemoryTest />
      case "ChimpTest":
        return <ChimpTest />
      case "ReadingComprehensionTest":
        return <ReadingComprehensionTest />
      case "VisualMemoryTest":
        return <VisualMemoryTest />
      case "TypingTest":
        return <TypingTest />
      default:
        return <div>Test unavailable</div>
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto w-full px-4 pt-6 pb-16 flex-1">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-cyan-400 transition-colors py-1 px-2.5 rounded-lg border border-border/40 bg-card/40"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ALL BENCHMARKS</span>
          </Link>

          {benchmarkMeta && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-muted-foreground">Human Avg:</span>
              <span className="font-bold text-foreground">
                {benchmarkMeta.median} {benchmarkMeta.unit}
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {benchmarkMeta.category}
              </span>
            </div>
          )}
        </div>

        {/* Test Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-mono">
            {test.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            {test.description}
          </p>
        </div>

        {/* Active Test Arena */}
        <div className="mb-14">{renderTestComponent()}</div>

        {/* Scientific Context & Methodology Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="cyber-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3 text-cyan-400">
              <Info className="w-4 h-4" />
              <h3 className="text-sm font-bold font-mono tracking-wider uppercase text-foreground">
                Benchmark Protocol
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {test.about}
            </p>
          </div>

          <div className="cyber-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3 text-emerald-400">
              <Activity className="w-4 h-4" />
              <h3 className="text-sm font-bold font-mono tracking-wider uppercase text-foreground">
                Cognitive Neuro-Telemetry
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {test.scientificBasis}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
