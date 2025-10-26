import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ReactionTimeTest from "@/components/tests/reaction-time-test"
import SequenceMemoryTest from "@/components/tests/sequence-memory-test"
import AimTrainerTest from "@/components/tests/aim-trainer-test"
import NumberMemoryTest from "@/components/tests/number-memory-test"
import VerbalMemoryTest from "@/components/tests/verbal-memory-test"
import ChimpTest from "@/components/tests/chimp-test"
import ReadingComprehensionTest from "@/components/tests/reading-comprehension-test"
import VisualMemoryTest from "@/components/tests/visual-memory-test"
import TypingTest from "@/components/tests/typing-test"


import { Volume2 } from "lucide-react"

const tests = {
  "reaction-time": {
    title: "Reaction Time Test",
    description: "Test your visual reflexes.",
    component: "ReactionTimeTest",
    about:
      "This is a simple tool to measure your reaction time. The average (median) reaction time is 273 milliseconds, according to the data collected so far. In addition to measuring your reaction time, this test is affected by the latency of your computer and monitor. Using a fast computer and low latency / high framerate monitor will improve your score.",
  },
  "sequence-memory": {
    title: "Sequence Memory Test",
    description: "Memorize the pattern.",
    component: "SequenceMemoryTest",
    about:
      "Memorize the sequence of buttons that light up, then press them in order. Every time you finish the pattern, it gets longer. Make a mistake, and the test is over.",
  },
  "aim-trainer": {
    title: "Aim Trainer",
    description: "Hit 30 targets as quickly as you can. Click the target above to begin.",
    component: "AimTrainerTest",
    about:
      "Click the targets as quickly and accurately as you can. This tests reflexes and hand-eye coordination. Once you've clicked 30 targets, your score and average time per target will be displayed.",
  },
  "number-memory": {
    title: "Number Memory Test",
    description: "Remember the longest number you can.",
    component: "NumberMemoryTest",
    about: "The average person can remember 7 numbers at once. Can you do more?",
  },
  "verbal-memory": {
    title: "Verbal Memory Test",
    description: "Keep as many words in short term memory as possible.",
    component: "VerbalMemoryTest",
    about:
      "You will be shown words, one at a time. If you've seen the word during this test, click SEEN. Otherwise, click NEW.",
  },
  "chimp-test": {
    title: "Are You Smarter Than a Chimpanzee?",
    description: "Click the squares in order according to their numbers. The test will get progressively harder.",
    component: "ChimpTest",
    about:
      "This is a test of working memory, made famous by a study that found that chimpanzees consistently outperform humans on this task. In the study, the chimps consistently outperformed humans, and some chimps were able to remember 9 digits over 90% of the time.",
  },
  "visual-memory": {
    title: "Visual Memory Test",
    description: "Remember an increasingly large board of squares.",
    component: "VisualMemoryTest",
    about:
      "Every level, a number of tiles will flash white. Memorize them, and pick them again after the tiles are reset! Levels get progressively more difficult, to challenge your skills.",
  },
  typing: {
    title: "Typing Test",
    description: "How many words per minute can you type?",
    component: "TypingTest",
    about:
      "This is a simple test of typing speed, measuring words per minute, or WPM. The standard measure of WPM is (number of characters / 5) / (time taken). By that measurement, 'quick brown fox' is 15 characters, including spaces.",
  },
  "reading-comprehension": {
    title: "Reading Comprehension Test",
    description: "Test your reading speed and comprehension skills.",
    component: "ReadingComprehensionTest",
    about:
      "This test measures both your reading speed (words per minute) and comprehension ability. You\'ll read a passage and then answer questions about it. The average adult reads at 200-250 WPM with 60-70% comprehension.",
  },

export default async function TestPage({ params }: { params: Promise<{ testId: string }> }) {
  const testId = (await params).testId
  const test = tests[testId as keyof typeof tests]

  if (!test) {
    notFound()
  }

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
        return (
          <Card className="bg-white/95 backdrop-blur p-8">
            <CardContent className="text-center">
              <p className="text-lg text-gray-700 mb-8">{test.description}</p>
              <div className="text-gray-500">This test is coming soon...</div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600">
      {/* Navigation Header */}
      <header className="flex items-center justify-between p-4 text-white">
        <Link href="/" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
          <div className="text-2xl">🧠</div>
          <span className="text-lg font-semibold">HUMAN EVAL</span>
        </Link>
        <Link href="/dashboard" className="text-white hover:text-blue-200 transition-colors">
          DASHBOARD
        </Link>
      </header>

      {/* Test Content */}
      <div className="py-16 px-4">
        <div className="text-center mb-8">
          <div className="text-6xl mb-6 text-white">🧠</div>
          <h1 className="text-4xl font-bold text-white mb-4">{test.title}</h1>
        </div>

        {renderTestComponent()}
      </div>

      {/* Statistics and About sections */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <p>Statistics will be displayed here after completing tests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">About the test</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">{test.about}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 px-4 text-blue-100 text-sm">
        <div className="flex justify-center items-center gap-4 mb-4">
          <Volume2 className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
        </div>
        <div className="space-y-1">
          <p>Copyright 2007-2025 Human Eval</p>
          <div className="flex justify-center gap-4">
            <Link href="/contact" className="hover:text-white transition-colors">
              contact@humanbenchmark.com
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/licensing" className="hover:text-white transition-colors">
              Licensing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
