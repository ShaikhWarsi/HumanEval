import Link from "next/link"
import Footer from "@/components/footer"
import { Brain, Target, Shield, Award, Terminal, Github, Linkedin, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 pt-12 pb-20 flex-1 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono">
            <Brain className="w-3.5 h-3.5" />
            <span>NEURO-DIAGNOSTIC PROTOCOL</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-foreground">
            About HumanEval OS
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Standardized, millisecond-precision cognitive benchmarks measuring the apex of human nervous system velocity, working memory, and motor dexterity.
          </p>
        </div>

        {/* Core Methodology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cyber-card rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-mono text-foreground">Scientific Integrity</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every battery in HumanEval translates established neuropsychological literature—including Miller's 7±2 Law, simple reaction latency paradigms, and Kyoto University's Ayumu working memory experiments—into high-framerate web software.
            </p>
          </div>

          <div className="cyber-card rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-mono text-foreground">Gaussian Benchmarks</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Raw scores are mapped directly onto standard normal distribution probability curves (P50 human averages to P99 elite percentiles), enabling exact comparative standing across 5 core cognitive axes.
            </p>
          </div>
        </div>

        {/* Developer Info Card */}
        <div className="cyber-card rounded-2xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <Terminal className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-mono text-foreground">Shaikh Mohammad Warsi</h3>
            <p className="text-xs text-cyan-400 font-mono mt-0.5">Software Architect & Creator</p>
          </div>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            HumanEval is crafted to deliver the cleanest, lowest-latency cognitive diagnostic experience on the modern web. Built using Next.js 15, Web Audio API, and Tailwind CSS.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <a
              href="https://github.com/shaikhwarsi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border border-border/60 bg-secondary/50 hover:text-cyan-400 transition-colors"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/shaikh-mohammad-warsi-141532271/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border border-border/60 bg-secondary/50 hover:text-cyan-400 transition-colors"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
