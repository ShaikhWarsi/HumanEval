"use client";

import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, Lightbulb } from "lucide-react";
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    type: 'suggestion',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Feedback Submitted!",
          description: "Thank you for your feedback. We'll review it shortly.",
        });
        setFormData({
          type: 'suggestion',
          subject: '',
          message: '',
        });
        setSubmitted(true); // Set submitted to true on success
      } else {
        const errorData = await response.json();
        toast({
          title: "Submission Failed",
          description: errorData.message || "There was an error submitting your feedback.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen neural-bg text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="float-animation mb-8">
            <MessageSquare className="w-20 h-20 text-white mx-auto mb-6 brain-pulse" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 font-mono">
            Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              Suggestions
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            We value your opinion! Please help us improve by providing your feedback.
          </p>
          <Button size="lg" className="neural-button px-8 py-4 text-lg font-semibold rounded-full" asChild>
            <Link href="/about">Contact Us</Link>
          </Button>
        </div>
      </section>

      {/* Feedback Form Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto neural-card p-8 rounded-2xl">
          {submitted ? (
            <div className="text-center">
              <Lightbulb className="w-20 h-20 text-green-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-4 text-center font-mono">Thank You for Your Feedback!</h2>
              <p className="text-xl text-white/90">We appreciate you taking the time to help us improve.</p>
              <Button size="lg" className="mt-8 neural-button px-8 py-4 text-lg font-semibold rounded-full" onClick={() => setSubmitted(false)}>
                Submit More Feedback
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-4xl font-bold mb-8 text-center font-mono">Submit Your Feedback</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="type" className="block text-lg font-medium text-white/90 mb-2">Feedback Type</label>
                  <select
                    id="type"
                    name="type"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="suggestion">Suggestion</option>
                    <option value="bug">Bug Report</option>
                    <option value="compliment">Compliment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-lg font-medium text-white/90 mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="Subject of your feedback..."
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-lg font-medium text-white/90 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="Your detailed feedback..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <Button type="submit" size="lg" className="w-full neural-button px-8 py-4 text-lg font-semibold rounded-full">
                  Submit Feedback
                </Button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default FeedbackPage;
