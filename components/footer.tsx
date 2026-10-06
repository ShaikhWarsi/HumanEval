import Link from "next/link"
import { Brain } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t-2 border-black dark:border-white bg-card py-10 px-4 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-black dark:border-white bg-amber-400 dark:bg-cyan-400 text-black flex items-center justify-center shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
            <Brain className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight text-foreground uppercase">
              HUMAN<span className="text-amber-500 dark:text-cyan-400">EVAL</span> OS
            </h3>
            <p className="text-[11px] text-muted-foreground uppercase">Neural Cognitive Diagnostics & Benchmarks</p>
          </div>
        </div>

        <nav className="flex flex-wrap justify-center items-center gap-6 text-xs text-foreground uppercase font-bold">
          <Link href="/" className="hover:text-amber-500 dark:hover:text-cyan-400 hover:underline transition-colors">
            Batteries
          </Link>
          <Link href="/science" className="hover:text-amber-500 dark:hover:text-cyan-400 hover:underline transition-colors">
            Science & Math
          </Link>
          <Link href="/benchmarks" className="hover:text-amber-500 dark:hover:text-cyan-400 hover:underline transition-colors">
            Empirical Norms (N=82M)
          </Link>
          <Link href="/facility" className="hover:text-amber-500 dark:hover:text-cyan-400 hover:underline transition-colors">
            Facility OS
          </Link>
          <Link href="/dashboard" className="hover:text-amber-500 dark:hover:text-cyan-400 hover:underline transition-colors">
            Dashboard
          </Link>
          <Link href="/about" className="hover:text-amber-500 dark:hover:text-cyan-400 hover:underline transition-colors">
            About
          </Link>
        </nav>

        <div className="text-xs text-muted-foreground text-center md:text-right uppercase">
          <p>© {new Date().getFullYear()} HumanEval. Zero bloat. Peak precision.</p>
        </div>
      </div>
    </footer>
  )
}