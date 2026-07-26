"use client";

import * as React from "react";
import {
  XCircle,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

export function HowItWorks() {
  const oldSteps = [
    "Copy webpage text manually",
    "Open ChatGPT or Claude in a new tab",
    "Paste context and write prompt instructions",
    "Wait for generic chatbot response",
    "Copy output and paste back into application",
  ];

  const newSteps = [
    {
      title: "1. Zero-Click Context Reading",
      desc: "Promptless AI automatically reads job descriptions or video captions in real-time.",
    },
    {
      title: "2. Intent & Confidence Scoring",
      desc: "Our engine classifies whether you are Applying for a Job or Learning a concept.",
    },
    {
      title: "3. Click Action -> Complete Task",
      desc: "Select Cover Letter or Smart Notes and receive instant, structured Markdown.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="accent">Product Philosophy</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            The browser itself becomes intelligent.
          </h2>
          <p className="text-[#f4f4f5]/70 text-lg">
            Chatbots force you into an inefficient copy-paste loop. Promptless AI
            replaces chat textboxes with zero-latency contextual actions.
          </p>
        </div>

        {/* Workflow Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: The Old Chatbot Workflow (Red/Muted) */}
          <div className="lg:col-span-5 rounded-[24px] bg-white/[0.02] border border-white/8 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#ff5f56]/20 flex items-center justify-center text-[#ff5f56]">
                  <XCircle className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-[#ff5f56] uppercase tracking-wider">
                  The Traditional Chatbot Workflow
                </span>
              </div>

              <div className="space-y-4">
                {oldSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-[#71717a] text-sm"
                  >
                    <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono shrink-0">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-[#71717a]">
              <span>Average Time Spent: ~3 minutes / task</span>
              <span className="text-[#ff5f56] font-semibold">
                High User Friction
              </span>
            </div>
          </div>

          {/* Right: Promptless AI Workflow (Glowing Primary/Accent) */}
          <GlassCard
            glowColor="primary"
            className="lg:col-span-7 p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-[#10B981] uppercase tracking-wider">
                    The Promptless AI Workflow
                  </span>
                </div>
                <Badge variant="primary">98% Faster</Badge>
              </div>

              <div className="space-y-6">
                {newSteps.map((step) => (
                  <div
                    key={step.title}
                    className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#4F8DFF]/40 transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-base">
                        {step.title}
                      </h4>
                      <Zap className="w-4 h-4 text-[#4F8DFF]" />
                    </div>
                    <p className="text-sm text-[#f4f4f5]/75">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[#f4f4f5]/80">
                Average Time Spent:{" "}
                <strong className="text-white">~3 seconds / task</strong>
              </span>
              <span className="text-[#10B981] font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Zero Prompt Engineering
              </span>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
