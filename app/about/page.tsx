import Link from "next/link"
import Footer from "@/components/footer"
import { Brain, Target, Award, Terminal, Github, Linkedin } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col font-mono">
      <div className="max-w-4xl mx-auto w-full px-4 pt-12 pb-20 flex-1 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black font-black uppercase text-xs shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
            <Brain className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>NEURO-DIAGNOSTIC PROTOCOL</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-foreground">
            About HumanEval OS
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Standardized, millisecond-precision cognitive benchmarks measuring the apex of human nervous system velocity, working memory, and motor dexterity.
          </p>
        </div>

        {/* Core Methodology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="brutal-card p-6 space-y-3">
            <div className="w-10 h-10 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black flex items-center justify-center shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
              <Target className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-black uppercase text-foreground">Scientific Integrity</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every battery in HumanEval translates established neuropsychological literature—including Miller&apos;s 7±2 Law, simple reaction latency paradigms, and Kyoto University&apos;s Ayumu working memory experiments—into high-framerate web software.
            </p>
          </div>

          <div className="brutal-card p-6 space-y-3">
            <div className="w-10 h-10 border-2 border-black dark:border-white bg-emerald-400 text-black flex items-center justify-center shadow-[2px_2px_0px_0px_#0A0A0A]">
              <Award className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-black uppercase text-foreground">Empirical Quantile Norms</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Raw scores are mapped directly onto empirical population quantile distributions derived from 80M+ benchmark trials and psychometric literature, accounting for the natural ex-Gaussian positive skew of motor and reflex latencies.
            </p>
          </div>
        </div>

        {/* Scientific Grounding & Transfer Disclaimer */}
        <div className="border-2 border-black dark:border-white bg-card p-6 shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF] space-y-3 font-mono">
          <span className="text-xs font-black uppercase text-amber-500 dark:text-cyan-400 block tracking-wider">
            // SCIENTIFIC INTEGRITY & TRANSFER BOUNDARIES
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            HumanEval explicitly differentiates computerized task performance from general intelligence (g). Decades of double-blind RCTs demonstrate that training on computerized paradigms produces strong near-transfer, but rarely general far-transfer. We refuse to make ungrounded marketing claims about &ldquo;multiplying IQ&rdquo; or &ldquo;rewiring your brain.&rdquo; We measure and train specific, isolatable mental faculties: working memory gating, frontoparietal inhibitory control, task-set switching latency, and probabilistic calibration.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/science"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black font-bold uppercase text-xs shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] hover:translate-x-[-1px] transition-transform"
            >
              Read Full Scientific Whitepaper →
            </Link>
            <Link
              href="/benchmarks"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black dark:border-white bg-secondary text-foreground font-bold uppercase text-xs shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] hover:translate-x-[-1px] transition-transform"
            >
              Inspect Empirical Quantiles (N=82M) →
            </Link>
          </div>
        </div>

        {/* Developer Info Card */}
        <div className="brutal-card p-8 text-center space-y-4">
          <div className="w-14 h-14 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black flex items-center justify-center mx-auto shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
            <Terminal className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase text-foreground">Shaikh Mohammad Warsi</h3>
            <p className="text-xs text-amber-500 dark:text-cyan-400 font-bold uppercase mt-0.5">Software Architect & Creator</p>
          </div>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            HumanEval is crafted to deliver the cleanest, lowest-latency cognitive diagnostic experience on the modern web. Built using Next.js 15, Web Audio API, and Tailwind CSS.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <a
              href="https://github.com/shaikhwarsi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1.5 border-2 border-black dark:border-white bg-card shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-secondary transition-all"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/shaikh-mohammad-warsi-141532271/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1.5 border-2 border-black dark:border-white bg-card shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-secondary transition-all"
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
