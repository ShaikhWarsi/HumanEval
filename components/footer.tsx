import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

export default function Footer() {
  return (
    <footer className="glass border-t border-white/20 py-8 px-4 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-white brain-pulse" />
          <div>
            <h3 className="text-xl font-bold text-white font-mono">HUMAN EVALUATION</h3>
            <p className="text-sm text-white/70">Cognitive Assessment Platform</p>
          </div>
        </div>
        <nav className="flex flex-wrap justify-center gap-4">
          <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10" asChild>
            <Link href="/about">About Us</Link>
          </Button>

          <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10" asChild>
            <Link href="/feedback">Suggestions</Link>
          </Button>
        </nav>
        <p className="text-sm text-white/60 text-center md:text-right">
          © {new Date().getFullYear()} Human Evaluation. All rights reserved.
        </p>
      </div>
    </footer>
  );
}