import Link from "next/link"
import { Brain, Sparkles, Shield, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur-md py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono tracking-tight text-foreground">
              HUMAN<span className="text-cyan-400">EVAL</span> OS
            </h3>
            <p className="text-xs text-muted-foreground">Neural Cognitive Diagnostics & Benchmarks</p>
          </div>
        </div>

        <nav className="flex flex-wrap justify-center items-center gap-6 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            All Tests
          </Link>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link href="/profile" className="hover:text-foreground transition-colors">
            Performance Matrix
          </Link>
          <Link href="/about" className="hover:text-foreground transition-colors">
            About & Methodology
          </Link>
          <Link href="/feedback" className="hover:text-foreground transition-colors">
            Feedback
          </Link>
        </nav>

        <div className="text-xs text-muted-foreground text-center md:text-right font-mono">
          <p>© {new Date().getFullYear()} HumanEval. Built for peak cognitive telemetry.</p>
        </div>
      </div>
    </footer>
  )
}