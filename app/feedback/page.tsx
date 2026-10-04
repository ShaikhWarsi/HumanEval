"use client"

import React, { useState } from "react"
import Link from "next/link"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { MessageSquare, CheckCircle2, ArrowRight } from "lucide-react"

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    type: "suggestion",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-4 pt-12 pb-20 flex-1 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>TRANSMIT FEEDBACK</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-foreground">
            Telemetry & Test Feedback
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Help us refine battery timing, propose new cognitive modalities, or report latency anomalies.
          </p>
        </div>

        <div className="cyber-card rounded-2xl p-8">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold font-mono text-foreground">
                Transmission Received
              </h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Thank you for contributing to HumanEval calibration. Your transmission has been recorded.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Button
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ type: "suggestion", subject: "", message: "" })
                  }}
                  variant="outline"
                  className="font-mono text-xs rounded-xl"
                >
                  Send Another Transmission
                </Button>
                <Button asChild className="bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs rounded-xl">
                  <Link href="/">Back to Benchmarks</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-sm font-mono">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Category</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-secondary/60 border border-border/60 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-cyan-400"
                >
                  <option value="suggestion">Feature Suggestion / New Battery</option>
                  <option value="bug">Latency / Mechanical Bug</option>
                  <option value="calibration">Statistical Calibration Feedback</option>
                  <option value="other">General Transmission</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Aim Trainer refresh frequency on 240Hz"
                  className="w-full bg-secondary/60 border border-border/60 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Message</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Provide technical specifics or details..."
                  className="w-full bg-secondary/60 border border-border/60 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold py-3 rounded-xl transition-all shadow-md"
              >
                {loading ? "Transmitting..." : "Submit Transmission"}
              </Button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
