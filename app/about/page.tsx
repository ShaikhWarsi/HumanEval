
import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain, Lightbulb, Rocket } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen neural-bg text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="float-animation mb-8">
            <Brain className="w-20 h-20 text-white mx-auto mb-6 brain-pulse" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 font-mono">
            About
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
              HumanEval
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Empowering minds through advanced cognitive assessment and training.
          </p>
          <Button size="lg" className="neural-button px-8 py-4 text-lg font-semibold rounded-full" asChild>
            <Link href="/feedback">Send Suggestions</Link>
          </Button>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="neural-card p-8 rounded-2xl text-center">
            <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-white/80">
              To provide accessible, scientifically-backed cognitive tools that help individuals understand,
              improve, and optimize their mental performance for a sharper, more focused life.
            </p>
          </div>
          <div className="neural-card p-8 rounded-2xl text-center">
            <Rocket className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-lg text-white/80">
              To be the leading platform for cognitive assessment and training, fostering a global community
              committed to lifelong learning and mental well-being.
            </p>
          </div>
        </div>
      </section>

      {/* About Content Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 font-mono">What We Offer</h2>
          <p className="text-lg mb-6 text-white/80">
            HumanEval offers a diverse range of brain-training games and tests, designed by experts to challenge
            and stimulate different aspects of your cognitive function, including memory, reaction time, verbal fluency,
            and problem-solving skills.
          </p>
          <p className="text-lg mb-6 text-white/80">
            We believe in the power of continuous learning and self-improvement. Join our community,
            track your progress, and unlock your full cognitive potential!
          </p>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 font-mono">Meet the Developer</h2>
          <div className="neural-card p-8 rounded-2xl inline-block">
            <p className="text-xl font-semibold mb-4">Shaikh Warsi</p>
            <p className="text-lg mb-6 text-white/80">
              This platform was passionately developed by Shaikh Warsi, dedicated to creating tools that enhance cognitive abilities.
            </p>
            <div className="flex justify-center gap-6">
              <a href="https://www.instagram.com/yamin_shaikh28" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2">
                <img src="/instagram-icon.svg" alt="Instagram" className="w-6 h-6" />
                Instagram
              </a>
              <a href="https://github.com/shaikhwarsi" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2">
                <img src="/github-icon.svg" alt="GitHub" className="w-6 h-6" />
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/shaikh-mohammad-warsi-141532271/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2">
                <img src="/linkedin-icon.svg" alt="LinkedIn" className="w-6 h-6" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
