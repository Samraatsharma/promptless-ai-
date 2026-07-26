"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Briefcase,
  FileText,
  Play,
  BookOpen,
  CheckCircle2,
  Lock,
  RefreshCw,
  Copy,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type DemoScenario = "linkedin" | "youtube";

interface StepItem {
  id: string;
  label: string;
}

const ANALYZER_STEPS: StepItem[] = [
  { id: "analyze", label: "Analyzing Page..." },
  { id: "read", label: "Reading Context..." },
  { id: "intent", label: "Understanding Intent..." },
  { id: "prepare", label: "Preparing Suggestions..." },
  { id: "done", label: "Done" },
];

export function AnimatedBrowserDemo() {
  const [scenario, setScenario] = React.useState<DemoScenario>("linkedin");
  const [stepIndex, setStepIndex] = React.useState<number>(0);
  const [selectedCard, setSelectedCard] = React.useState<string | null>(null);
  const [isPaused, setIsPaused] = React.useState<boolean>(false);

  // Automatic Step Progress & Scenario Switch Loop
  React.useEffect(() => {
    if (isPaused) return;

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < ANALYZER_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 900);

    const actionTimeout = setTimeout(() => {
      setSelectedCard(scenario === "linkedin" ? "cover_letter" : "smart_notes");
    }, 4500);

    const switchTimeout = setTimeout(() => {
      setScenario((prev) => (prev === "linkedin" ? "youtube" : "linkedin"));
      setStepIndex(0);
      setSelectedCard(null);
    }, 12000);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(actionTimeout);
      clearTimeout(switchTimeout);
    };
  }, [scenario, isPaused]);

  return (
    <div
      id="demo"
      className="w-full max-w-6xl mx-auto my-16 px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Interactive Scenario Controls */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#71717a]">
            Live Browser Demo — Click to Interact
          </span>
          {isPaused && (
            <span className="text-xs text-[#4F8DFF] font-medium animate-pulse">
              (Paused on Hover)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
          <button
            onClick={() => {
              setScenario("linkedin");
              setStepIndex(0);
              setSelectedCard(null);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              scenario === "linkedin"
                ? "bg-[#4F8DFF] text-white shadow-[0_0_12px_rgba(79,141,255,0.4)]"
                : "text-[#71717a] hover:text-white"
            }`}
          >
            LinkedIn Job Application
          </button>
          <button
            onClick={() => {
              setScenario("youtube");
              setStepIndex(0);
              setSelectedCard(null);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              scenario === "youtube"
                ? "bg-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                : "text-[#71717a] hover:text-white"
            }`}
          >
            YouTube Video Learning
          </button>
        </div>
      </div>

      {/* Browser Frame */}
      <div className="rounded-[24px] border border-white/10 bg-[#09090b]/90 shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden relative">
        {/* Browser URL Bar & Window Controls */}
        <div className="h-12 border-b border-white/8 bg-[#121216] px-4 flex items-center justify-between select-none">
          {/* macOS traffic lights */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]/80" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/80" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]/80" />
          </div>

          {/* Animated URL input bar */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="h-8 rounded-full bg-black/40 border border-white/10 px-4 flex items-center gap-2 text-xs text-[#71717a]">
              <Lock className="w-3 h-3 text-[#10B981]" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={scenario}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-white/90 truncate font-mono"
                >
                  {scenario === "linkedin"
                    ? "https://www.linkedin.com/jobs/view/staff-frontend-engineer-ai"
                    : "https://www.youtube.com/watch?v=advanced-agentic-coding"}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Chrome Toolbar Extension Icon */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#4F8DFF]/20 border border-[#4F8DFF]/40 text-[#4F8DFF] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Promptless Active</span>
            </div>
          </div>
        </div>

        {/* Browser Body Area: Split between Website Content and 420px Extension Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Side: Mock Website Page Content */}
          <div className="lg:col-span-7 p-8 border-r border-white/8 bg-[#0c0c0f]">
            <AnimatePresence mode="wait">
              {scenario === "linkedin" ? (
                <motion.div
                  key="linkedin-page"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="primary">LinkedIn Jobs</Badge>
                        <span className="text-xs text-[#71717a]">
                          Posted 2 hours ago
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        Staff Frontend Engineer — Advanced AI Agents
                      </h3>
                      <p className="text-sm text-[#4F8DFF] font-medium mt-1">
                        Anthropic • San Francisco, CA (Hybrid)
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xl text-white">
                      A
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                      <span className="text-xs text-[#71717a] block">
                        Compensation
                      </span>
                      <span className="text-sm font-semibold text-white">
                        $240k – $320k / yr
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                      <span className="text-xs text-[#71717a] block">
                        Workplace
                      </span>
                      <span className="text-sm font-semibold text-white">
                        Hybrid • 3 Days/Wk
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                      <span className="text-xs text-[#71717a] block">
                        Applicants
                      </span>
                      <span className="text-sm font-semibold text-[#10B981]">
                        Over 100+
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#71717a]">
                      Job Description Excerpt
                    </h4>
                    <p className="text-sm text-[#f4f4f5]/80 leading-relaxed">
                      We are seeking an exceptional Staff Frontend Engineer to lead
                      the architecture and design of user-facing agentic interfaces.
                      You will work closely with research scientists to build 60
                      FPS Framer Motion animations, glassmorphic UI cards, and
                      zero-latency browser interactions...
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {[
                        "React 19",
                        "TypeScript",
                        "Tailwind CSS",
                        "Framer Motion",
                        "Manifest V3",
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-xs text-white/90"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="youtube-page"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="accent">YouTube Learning</Badge>
                    <span className="text-xs text-[#71717a]">
                      48,290 views • 1 day ago
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Building Production-Ready Agentic Web Apps in 2026
                  </h3>
                  <p className="text-sm text-[#8B5CF6] font-medium">
                    Google DeepMind Engineering Channel • 1.2M subscribers
                  </p>

                  {/* Mock Video Player */}
                  <div className="w-full aspect-video rounded-2xl bg-black/60 border border-white/10 relative overflow-hidden flex items-center justify-center group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5CF6]/20 via-transparent to-[#4F8DFF]/20" />
                    <div className="w-16 h-16 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.6)] cursor-pointer group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-white ml-1" />
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/80 font-mono">
                      <span>14:20 / 42:18</span>
                      <span>HD • CC ON</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#71717a]">
                      Video Transcript Detected
                    </h4>
                    <p className="text-sm text-[#f4f4f5]/80 leading-relaxed italic">
                      &quot;...in this deep dive, we explore how removing chatbot
                      textboxes and using contextual page understanding allows
                      software to predict user intent before explicit commands are
                      entered...&quot;
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side: 420px Chrome Extension Manifest V3 Side Panel */}
          <div className="lg:col-span-5 bg-[#09090b] border-l border-white/8 p-6 flex flex-col justify-between relative">
            <div>
              {/* Extension Side Panel Header */}
              <div className="flex items-center justify-between border-b border-white/8 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#4F8DFF]/20 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-[#4F8DFF]" />
                  </div>
                  <span className="font-semibold text-sm text-white">
                    Promptless AI
                  </span>
                </div>
                <Badge variant={scenario === "linkedin" ? "primary" : "accent"} pulse>
                  {scenario === "linkedin" ? "Job Detected" : "Video Detected"}
                </Badge>
              </div>

              {/* Step-by-Step Intent Analyzer Progress UI */}
              <div className="mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-white/90">
                    {ANALYZER_STEPS[stepIndex].label}
                  </span>
                  <span className="text-xs font-mono text-[#4F8DFF]">
                    {stepIndex === ANALYZER_STEPS.length - 1 ? "100%" : `${stepIndex * 25}%`}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-4">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#4F8DFF] to-[#8B5CF6]"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        (stepIndex / (ANALYZER_STEPS.length - 1)) * 100
                      }%`,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Step indicators */}
                <div className="grid grid-cols-5 gap-1">
                  {ANALYZER_STEPS.map((step, idx) => {
                    const isDone = idx <= stepIndex;
                    return (
                      <div
                        key={step.id}
                        className={`h-1 rounded-full transition-colors ${
                          isDone ? "bg-[#10B981]" : "bg-white/10"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Intent Detected & Confidence Badge */}
              {stepIndex === ANALYZER_STEPS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#4F8DFF]/10 to-[#8B5CF6]/10 border border-white/10">
                    <div>
                      <span className="text-xs text-[#71717a] block">
                        Detected Intent
                      </span>
                      <span className="text-sm font-bold text-white">
                        {scenario === "linkedin"
                          ? "Applying for Job"
                          : "Learning"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#71717a] block">
                        Confidence
                      </span>
                      <span className="text-sm font-bold text-[#10B981]">
                        {scenario === "linkedin" ? "98%" : "96%"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Zero-Click Action Cards List */}
              {stepIndex === ANALYZER_STEPS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2.5"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#71717a] block mb-1">
                    Ready Actions — Click One
                  </span>

                  {scenario === "linkedin" ? (
                    <>
                      <div
                        onClick={() => setSelectedCard("cover_letter")}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedCard === "cover_letter"
                            ? "bg-[#4F8DFF]/15 border-[#4F8DFF] shadow-[0_0_20px_rgba(79,141,255,0.25)]"
                            : "bg-white/[0.03] border-white/8 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#4F8DFF]/20 flex items-center justify-center text-[#4F8DFF]">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-white block">
                              Generate Cover Letter
                            </span>
                            <span className="text-xs text-[#71717a]">
                              Tailored to Staff AI Engineer role
                            </span>
                          </div>
                        </div>
                        <Badge variant="primary">High Signal</Badge>
                      </div>

                      <div
                        onClick={() => setSelectedCard("resume")}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedCard === "resume"
                            ? "bg-[#4F8DFF]/15 border-[#4F8DFF]"
                            : "bg-white/[0.03] border-white/8 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-white block">
                              Tailor Resume
                            </span>
                            <span className="text-xs text-[#71717a]">
                              Highlight React 19 & agentic skills
                            </span>
                          </div>
                        </div>
                        <Badge variant="neutral">98% Fit</Badge>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={() => setSelectedCard("smart_notes")}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedCard === "smart_notes"
                            ? "bg-[#8B5CF6]/15 border-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                            : "bg-white/[0.03] border-white/8 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-white block">
                              Smart Notes
                            </span>
                            <span className="text-xs text-[#71717a]">
                              Structured hierarchy + timestamps
                            </span>
                          </div>
                        </div>
                        <Badge variant="accent">Instant</Badge>
                      </div>

                      <div
                        onClick={() => setSelectedCard("quiz")}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedCard === "quiz"
                            ? "bg-[#8B5CF6]/15 border-[#8B5CF6]"
                            : "bg-white/[0.03] border-white/8 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white">
                            <Award className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-white block">
                              Generate Flashcards & Quiz
                            </span>
                            <span className="text-xs text-[#71717a]">
                              10 interactive Q&A pairs
                            </span>
                          </div>
                        </div>
                        <Badge variant="neutral">Spaced Rep</Badge>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>

            {/* AI Output Screen Modal overlay inside side panel when card is selected */}
            <AnimatePresence>
              {selectedCard && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  className="absolute inset-0 bg-[#0c0c10]/95 backdrop-blur-xl p-6 flex flex-col justify-between z-20 border-l border-white/10"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          {selectedCard === "cover_letter"
                            ? "Generated Cover Letter"
                            : "Generated Smart Notes"}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedCard(null)}
                        className="text-xs text-[#71717a] hover:text-white"
                      >
                        Close
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8 text-xs text-[#f4f4f5]/90 space-y-2.5 max-h-[380px] overflow-y-auto font-sans leading-relaxed">
                      {selectedCard === "cover_letter" ? (
                        <>
                          <p className="font-semibold text-[#4F8DFF]">
                            Dear Hiring Manager at Anthropic,
                          </p>
                          <p>
                            I am writing to express my strong enthusiasm for the
                            Staff Frontend Engineer position. With extensive
                            experience building low-latency, agentic web interfaces
                            using React 19, TypeScript, and Framer Motion, I am
                            excited by your work in autonomous agent tooling...
                          </p>
                          <p>
                            My recent projects emphasize zero-click UI patterns and
                            manifest V3 browser architectures that align directly
                            with your product roadmap.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-[#8B5CF6]">
                            Key Takeaways — Agentic Web Apps (2026)
                          </p>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>
                              <strong>Intent-First UI:</strong> Modern AI apps drop
                              prompt textboxes in favor of contextual DOM reading.
                            </li>
                            <li>
                              <strong>Zero-Click Actions:</strong> The browser
                              side panel suggests 3 high-probability actions.
                            </li>
                            <li>
                              <strong>60 FPS Micro-Interactions:</strong> Visual
                              hierarchy requires smooth spring animations.
                            </li>
                          </ul>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/8">
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="w-3.5 h-3.5 mr-1" />
                      Regenerate
                    </Button>
                    <Button variant="primary" size="sm">
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      Copy Markdown
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
