import Link from "next/link"
import Footer from "@/components/footer"
import { HelpCircle, ChevronRight, MessageSquare, ShieldCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const faqs = [
  {
    q: "How does the Composite Cognitive Index (CGI) work?",
    a: "CGI translates your normalized performance across all calibrated tests onto an Elo/IQ-style scale centered at 1000 (standard human median). 1200+ represents Superior, while 1350+ indicates Apex Neuro performance (top 1-2%).",
  },
  {
    q: "Does hardware latency affect my Reaction Time score?",
    a: "Yes. Monitor refresh rates (e.g. 144Hz vs 60Hz), USB mouse polling rates (1000Hz vs 125Hz), and operating system compositor buffers introduce 15–35ms of physical latency. For optimal scores, test on a desktop browser with high-refresh display hardware.",
  },
  {
    q: "Are my scores stored on a remote server?",
    a: "HumanEval stores your cognitive session telemetry locally in your browser's persistent storage by default for zero latency and privacy. You can purge this at any time in your Profile.",
  },
  {
    q: "How does the Sequence Memory scoring scale?",
    a: "Sequence Memory adheres strictly to the classic Simon memory span protocol. Each round appends exactly one new tile to the sequence. The score records the total levels successfully reproduced without error.",
  },
]

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 pt-12 pb-20 flex-1 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>KNOWLEDGE BASE & FAQ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-foreground">
            Help Center & Technical FAQ
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Guidance on test administration, latency calibration, and percentile calculations.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="cyber-card rounded-2xl p-6 space-y-2">
              <h3 className="text-base font-bold font-mono text-foreground flex items-center gap-2">
                <span className="text-cyan-400">Q:</span> {faq.q}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="cyber-card rounded-2xl p-8 text-center space-y-4">
          <h3 className="text-lg font-bold font-mono text-foreground">Have suggestions or bug reports?</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            We are constantly tuning battery parameters and adding new cognitive modalities.
          </p>
          <Button asChild className="bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs rounded-xl">
            <Link href="/feedback">
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Submit Telemetry Feedback
            </Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}