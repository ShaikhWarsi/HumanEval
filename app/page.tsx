import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Zap,
  Target,
  Eye,
  Keyboard,
  BookOpen,
  Split,
  Music,
  Grid3X3,
  Hash,
  MessageSquare,
  User,
  TrendingUp,
  Award,
  Activity,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import TestCard from "@/components/TestCard";
import Footer from "@/components/footer";

const tests = [
  {
    id: "reaction-time",
    title: "Reaction Time",
    description: "Measure your synaptic reaction speed and neural processing time.",
    icon: "Zap",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    isNew: false,
    category: "Speed",
  },
  {
    id: "sequence-memory",
    title: "Sequence Memory",
    description: "Test your sequential memory encoding and pattern recognition abilities.",
    icon: "Grid3X3",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    isNew: false,
    category: "Memory",
  },
  {
    id: "aim-trainer",
    title: "Aim Trainer",
    description: "Evaluate hand-eye coordination and spatial accuracy under pressure.",
    icon: "Target",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    isNew: false,
    category: "Motor",
  },
  {
    id: "number-memory",
    title: "Number Memory",
    description: "Assess working memory capacity through numerical sequence retention.",
    icon: "Hash",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    isNew: false,
    category: "Memory",
  },
  {
    id: "verbal-memory",
    title: "Verbal Memory",
    description: "Evaluate verbal working memory and word recognition patterns.",
    icon: "MessageSquare",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    isNew: false,
    category: "Language",
  },
  {
    id: "chimp-test",
    title: "Chimp Test",
    description: "Challenge your visuospatial working memory like our primate cousins.",
    icon: "Brain",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    isNew: false,
    category: "Intelligence",
  },
  {
    id: "visual-memory",
    title: "Visual Memory",
    description: "Test spatial memory encoding through progressive visual patterns.",
    icon: "Eye",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    isNew: false,
    category: "Memory",
  },
  {
    id: "typing",
    title: "Typing Speed",
    description: "Measure typing speed, accuracy, and motor learning efficiency.",
    icon: "Keyboard",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    isNew: false,
    category: "Motor",
  },
  {
    id: "reading-comprehension",
    title: "Reading Comprehension",
    description: "Evaluate reading speed, comprehension, and information processing.",
    icon: "BookOpen",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    isNew: true,
    category: "Language",
  },

];

const categories = ["All", "Speed", "Memory", "Motor", "Language", "Intelligence", "Attention", "Auditory"];

export default function HomePage() {
  return (
    <div className="min-h-screen neural-bg">
      <header className="glass sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain className="w-8 h-8 text-white brain-pulse" />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white font-mono">HUMAN EVALUATION</h1>
                <p className="text-xs text-white/70">Cognitive Assessment Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Profile</span>
              </Link>
            <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="float-animation mb-8">
            <Brain className="w-20 h-20 text-white mx-auto mb-6 brain-pulse" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 font-mono">
            Human
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
              Evaluation
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Advanced cognitive assessment platform featuring neural-based testing protocols and comprehensive brain
            performance analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="neural-button px-8 py-4 text-lg font-semibold rounded-full" asChild>
              <Link href="#assessment-battery">
                <Activity className="w-5 h-5 mr-2" />
                Begin Assessment
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20"
              asChild
            >
              <Link href="/profile">
                <TrendingUp className="w-5 h-5 mr-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="neural-card p-8 rounded-2xl">
                <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-foreground mb-2">11</h3>
                <p className="text-muted-foreground">Cognitive Assessments</p>
              </div>
            </div>
            <div className="text-center">
              <div className="neural-card p-8 rounded-2xl">
                <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-foreground mb-2">7</h3>
                <p className="text-muted-foreground">Neural Categories</p>
              </div>
            </div>
            <div className="text-center">
              <div className="neural-card p-8 rounded-2xl">
                <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-foreground mb-2">∞</h3>
                <p className="text-muted-foreground">Performance Insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4" id="assessment-battery">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4 font-mono">Assessment Battery</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Comprehensive cognitive evaluation across multiple neural domains
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tests.map((test) => (
              <TestCard key={test.id} {...test} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
