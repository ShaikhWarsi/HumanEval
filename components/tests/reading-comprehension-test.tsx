"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useScore } from "@/lib/score-context"
import { BookOpen, Clock, CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface Question {
  question: string
  options: string[]
  correct: number
}

interface Passage {
  title: string
  text: string
  wordCount: number
  questions: Question[]
}

const passages: Passage[] = [
  {
    title: "The Science of Memory",
    text: `Memory is one of the most fascinating aspects of human cognition. Our brains constantly encode, store, and retrieve information from our experiences. The process begins with encoding, where sensory information is transformed into a format that can be stored in the brain. This information then moves through different stages of memory storage.

Short-term memory, also known as working memory, can hold a limited amount of information for a brief period, typically 15-30 seconds. However, through rehearsal and attention, some of this information can be transferred to long-term memory, where it can be stored indefinitely. Long-term memory has virtually unlimited capacity and can retain information for years or even decades. The strength and durability of memories depend on factors such as emotional significance, repetition, and the connections formed with existing knowledge.`,
    wordCount: 134,
    questions: [
      {
        question: "How long can short-term memory typically hold information?",
        options: ["A few seconds to a minute", "Around 15-30 seconds", "Several minutes to an hour", "Indefinitely, with effort"],
        correct: 1,
      },
      {
        question: "What is another name for short-term memory?",
        options: ["Temporary storage unit", "Active processing space", "Working memory", "Brief recall center"],
        correct: 2,
      },
      {
        question: "What factors affect the strength and durability of memories?",
        options: [
          "Mainly repetition and rote learning",
          "Primarily emotional intensity",
          "Emotional significance, repetition, and integration with existing knowledge",
          "Only the novelty of the information",
        ],
        correct: 2,
      },
      {
        question: "What is the capacity of long-term memory?",
        options: ["Limited to what can be consciously recalled", "Varies greatly among individuals", "Virtually unlimited", "Dependent on brain size"],
        correct: 2,
      },
    ],
  },
  {
    title: "The Digital Revolution",
    text: `The digital revolution has fundamentally transformed how we communicate, work, and live. Beginning in the late 20th century, the widespread adoption of computers, the internet, and mobile devices has created unprecedented opportunities for global connectivity and information sharing. This technological shift has democratized access to knowledge, allowing people from all corners of the world to learn, collaborate, and innovate together.

However, this digital transformation has also brought new challenges. Issues such as digital privacy, cybersecurity, and the digital divide have become increasingly important. The rapid pace of technological change means that individuals and organizations must constantly adapt to new tools and platforms. Despite these challenges, the digital revolution continues to drive innovation across industries, from healthcare and education to entertainment and commerce, reshaping our society in profound ways.`,
    wordCount: 142,
    questions: [
      {
        question: "When did the digital revolution begin?",
        options: ["Early 1900s", "Mid-20th century", "Late 20th century", "Early 21st century"],
        correct: 2,
      },
      {
        question: "What has the digital revolution democratized?",
        options: ["Access to information and learning", "Access to physical resources", "Access to political power", "Access to social status"],
        correct: 0,
      },
      {
        question: "Which of these is NOT mentioned as a challenge of digital transformation?",
        options: ["Data security concerns", "Environmental impact of technology", "Cybersecurity threats", "Disparities in access to technology"],
        correct: 1,
      },
      {
        question:
          "According to the passage, what must individuals and organizations do due to rapid technological change?",
        options: [
          "Resist technological advancements",
          "Continuously adjust to new tools and platforms",
          "Rely solely on established technologies",
          "Avoid engaging with digital platforms",
        ],
        correct: 1,
      },
    ],
  },
  {
    title: "The Importance of Sleep",
    text: `Sleep is a fundamental human need, as important to our health and well-being as food, water, and exercise. During sleep, our bodies and minds can repair themselves, consolidate memories, and release hormones essential for growth and appetite regulation. The recommended amount of sleep for adults is typically 7-9 hours per night, though individual needs can vary.

Lack of adequate sleep can have significant negative impacts on our physical and mental health. It can impair cognitive functions such as attention, concentration, and problem-solving, leading to decreased productivity and increased risk of accidents. Chronic sleep deprivation is also linked to a higher risk of developing serious health conditions, including heart disease, diabetes, and obesity. Prioritizing sleep is crucial for maintaining optimal health and performance in all aspects of life.`,
    wordCount: 140,
    questions: [
      {
        question: "What is the recommended amount of sleep for adults?",
        options: ["5-6 hours for optimal performance", "Approximately 7-9 hours per night", "10-12 hours for full recovery", "As much as your body naturally allows"],
        correct: 1,
      },
      {
        question: "What can chronic sleep deprivation lead to?",
        options: ["Enhanced cognitive abilities", "Increased work efficiency", "Higher susceptibility to health issues", "Improved mood and well-being"],
        correct: 2,
      },
      {
        question: "What happens to memories during sleep?",
        options: ["They are temporarily suppressed", "They undergo a process of consolidation", "They become less accessible", "They are actively forgotten"],
        correct: 1,
      },
      {
        question: "Besides food, water, and exercise, what is sleep compared to in importance?",
        options: ["Financial stability", "Career success", "A basic human requirement", "Leisure activities"],
        correct: 2,
      },
    ],
  },
  {
    title: "The Wonders of the Ocean",
    text: `The ocean covers over 70% of our planet's surface and is home to an incredible diversity of life, from microscopic plankton to the largest animal on Earth, the blue whale. It plays a crucial role in regulating Earth's climate by absorbing heat and carbon dioxide, and its currents distribute warmth around the globe. The ocean also provides us with food, oxygen, and countless resources.

Despite its vastness, the ocean faces numerous threats, including pollution, overfishing, and climate change. Plastic pollution, in particular, is a growing concern, harming marine life and ecosystems. Rising ocean temperatures and acidification, caused by increased carbon dioxide absorption, threaten coral reefs and other sensitive habitats. Protecting our oceans is vital not only for the health of marine ecosystems but also for the well-being of humanity.`,
    wordCount: 138,
    questions: [
      {
        question: "What percentage of Earth's surface does the ocean cover?",
        options: ["Around half", "More than 60%", "Over 70%", "Nearly 90%"],
        correct: 2,
      },
      {
        question: "What is the largest animal on Earth mentioned in the passage?",
        options: ["Giant squid", "Blue whale", "Colossal octopus", "Sperm whale"],
        correct: 1,
      },
      {
        question: "Which of these is NOT mentioned as a threat to the ocean?",
        options: ["Contamination from waste", "Excessive fishing practices", "Underwater volcanic activity", "Global warming effects"],
        correct: 2,
      },
      {
        question: "How does the ocean help regulate Earth's climate?",
        options: ["By influencing wind patterns", "By absorbing atmospheric heat and CO2", "By reflecting solar radiation", "By generating tidal forces"],
        correct: 1,
      },
    ],
  },
  {
    title: "The Evolution of Artificial Intelligence",
    text: `Artificial Intelligence (AI) has evolved significantly since its inception, transforming from theoretical concepts into practical applications that permeate various aspects of modern life. Early AI research, often dubbed "Good Old-Fashioned AI" (GOFAI), focused on symbolic reasoning and expert systems, attempting to hardcode human knowledge and logic into machines. While these systems achieved some success in narrow domains, they struggled with tasks requiring common sense or adaptability to new situations.

The advent of machine learning, particularly neural networks, marked a pivotal shift. Inspired by the structure of the human brain, neural networks, especially deep learning models, have demonstrated remarkable capabilities in pattern recognition, natural language processing, and computer vision. This breakthrough was fueled by the availability of vast datasets and increased computational power, allowing models to learn complex representations directly from data rather than relying on explicit programming.

Today, AI is a broad field encompassing diverse approaches, from reinforcement learning that enables agents to learn through trial and error, to generative AI that can create realistic images, text, and other media. The ethical implications of AI, including bias in algorithms, job displacement, and autonomous decision-making, are increasingly becoming a focus of research and public discourse. As AI continues to advance, its integration into society will undoubtedly bring both immense opportunities and complex challenges, necessitating careful consideration of its development and deployment to ensure it serves humanity's best interests.`,
    wordCount: 280,
    questions: [
      {
        question: "What was the primary focus of early AI research (GOFAI)?",
        options: ["Developing self-learning algorithms", "Symbolic logic and rule-based systems", "Creating human-like intelligence", "Exploring neural network architectures"],
        correct: 1,
      },
      {
        question: "What fueled the breakthrough in machine learning, especially deep learning models?",
        options: ["Limited data and reduced processing power", "Abundant datasets and enhanced computational capacity", "Emphasis on symbolic reasoning", "Pre-programmed human knowledge"],
        correct: 1,
      },
      {
        question: "Which of these is NOT mentioned as a capability of neural networks?",
        options: ["Recognizing visual patterns", "Understanding human language", "Processing visual information", "Displaying emotional responses"],
        correct: 3,
      },
      {
        question: "What are some ethical implications of AI mentioned in the passage?",
        options: ["Increased employment opportunities and flawless algorithms", "Algorithmic prejudice, job displacement, and independent decision-making", "Reduced computational demands and restricted data access", "Only benefits without any associated difficulties"],
        correct: 1,
      },
    ],
  },
]

export default function ReadingComprehensionTest() {
  const [gameState, setGameState] = useState<"instructions" | "reading" | "questions" | "results">("instructions")
  const [currentPassage, setCurrentPassage] = useState<Passage | null>(null)
  const [startTime, setStartTime] = useState<number>(0)
  const [readingTime, setReadingTime] = useState<number>(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const { addScore } = useScore()
  const router = useRouter()

  const startReading = () => {
    const randomPassage = passages[Math.floor(Math.random() * passages.length)]
    setCurrentPassage(randomPassage)
    setStartTime(Date.now())
    setGameState("reading")
  }

  const finishReading = () => {
    const endTime = Date.now()
    const timeInSeconds = (endTime - startTime) / 1000
    setReadingTime(timeInSeconds)
    setGameState("questions")
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer("")
  }

  const submitAnswer = () => {
    if (selectedAnswer === "") return

    const newAnswers = [...answers, Number.parseInt(selectedAnswer)]
    setAnswers(newAnswers)
    setSelectedAnswer("")

    if (currentQuestion < (currentPassage?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate results
      const correctAnswers = newAnswers.reduce((count, answer, index) => {
        return count + (answer === currentPassage!.questions[index].correct ? 1 : 0)
      }, 0)

      const comprehensionPercentage = Math.round((correctAnswers / newAnswers.length) * 100)
      const wpm = Math.round((currentPassage!.wordCount / readingTime) * 60)

      // Save score (using WPM as primary score, comprehension as detail)
      addScore({
        testId: "reading-comprehension",
        testName: "Reading Comprehension",
        score: wpm,
        unit: "wpm",
        date: new Date(),
        details: {
          comprehension: comprehensionPercentage,
          readingTime: readingTime,
          correctAnswers: correctAnswers,
          totalQuestions: newAnswers.length,
        },
      })

      setGameState("results")
    }
  }

  const restart = () => {
    setGameState("instructions")
    setCurrentPassage(null)
    setStartTime(0)
    setReadingTime(0)
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer("")
  }

  const calculateResults = () => {
    if (!currentPassage) return { wpm: 0, comprehension: 0, correctAnswers: 0 }

    const correctAnswers = answers.reduce((count, answer, index) => {
      return count + (answer === currentPassage.questions[index].correct ? 1 : 0)
    }, 0)

    const comprehensionPercentage = Math.round((correctAnswers / answers.length) * 100)
    const wpm = Math.round((currentPassage.wordCount / readingTime) * 60)

    return { wpm, comprehension: comprehensionPercentage, correctAnswers }
  }

  if (gameState === "instructions") {
    return (
      <div className="max-w-full sm:max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="glass-card">
          <CardHeader className="text-center">
            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-xl sm:text-2xl">Reading Comprehension Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-base sm:text-lg text-muted-foreground">Test your reading speed and comprehension skills</p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold">How it works:</h3>
                <ul className="text-sm text-muted-foreground space-y-1 text-left">
                  <li>• Read a passage at your normal pace</li>
                  <li>• Click "Finished Reading" when done</li>
                  <li>• Answer 4 comprehension questions</li>
                  <li>• Get your WPM speed and comprehension score</li>
                </ul>
              </div>
            </div>
            <Button onClick={startReading} size="lg" className="w-full">
              Start Reading Test
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "reading" && currentPassage) {
    return (
      <div className="max-w-full sm:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl">{currentPassage.title}</CardTitle>
            <p className="text-sm sm:text-base text-muted-foreground">Read at your normal pace, then click "Finished Reading"</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-base sm:prose-lg max-w-none text-foreground">
              <div className="leading-relaxed text-justify">
                {currentPassage.text.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="text-center">
              <Button onClick={finishReading} size="lg">
                Finished Reading
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "questions" && currentPassage) {
    const question = currentPassage.questions[currentQuestion]
    const progress = ((currentQuestion + 1) / currentPassage.questions.length) * 100

    return (
      <div className="max-w-full sm:max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-lg sm:text-xl">Question {currentQuestion + 1} of {currentPassage.questions.length}</CardTitle>
              <Progress value={progress} className="w-1/2 sm:w-2/3" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-base sm:text-lg font-semibold">{question.question}</p>
            <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer}>
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-base sm:text-lg font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button onClick={submitAnswer} className="w-full" disabled={selectedAnswer === ""}>
              {currentQuestion === currentPassage.questions.length - 1 ? "View Results" : "Next Question"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { wpm, comprehension, correctAnswers } = calculateResults()

  return (
    <div className="max-w-full sm:max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="glass-card">
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-2xl">Reading Comprehension Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <div className="text-3xl sm:text-4xl font-bold text-primary">{wpm}</div>
              <div className="text-sm sm:text-base text-muted-foreground">Words Per Minute (WPM)</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-3xl sm:text-4xl font-bold text-primary">{comprehension}%</div>
              <div className="text-sm sm:text-base text-muted-foreground">Comprehension</div>
            </div>
          </div>
          <div className="space-y-2 text-center">
            <p className="text-base sm:text-lg text-muted-foreground">
              You answered {correctAnswers} out of {currentPassage?.questions.length} questions correctly.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              Reading Time: {readingTime.toFixed(1)} seconds
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={restart} size="lg" className="w-full">
              Try Again
            </Button>
            <Button onClick={() => router.push("/")} size="lg" variant="outline" className="w-full">
              Back to Menu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}