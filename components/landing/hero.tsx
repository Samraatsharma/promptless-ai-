"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedBrowserDemo } from "./animated-browser-demo";
import { ChromeIcon } from "@/components/ui/chrome-icon";

export function Hero() {
  return (
    <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Announcement Badge */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="#demo"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#4F8DFF]/40 hover:bg-white/10 transition-all text-xs font-medium text-[#f4f4f5]/90 group shadow-[0_0_25px_rgba(79,141,255,0.15)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4F8DFF]" />
              <span>Manifest V3 Extension Built for LinkedIn & YouTube</span>
              <span className="w-1 h-1 rounded-full bg-[#71717a]" />
              <span className="text-[#4F8DFF] group-hover:underline flex items-center gap-1 font-semibold">
                See Live Simulation <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Hero Title & Tagline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]"
          >
            AI that understands your intent{" "}
            <span className="bg-gradient-to-r from-[#4F8DFF] via-[#8B5CF6] to-[#10B981] bg-clip-text text-transparent">
              before you ask.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-[#71717a] max-w-2xl mx-auto leading-relaxed font-normal"
          >
            The chatbot textbox is dead. Promptless AI turns your browser into an
            autonomous agent that reads DOM context, detects whether you are job
            hunting or learning, and surfaces instant executive actions without a
            single prompt.
          </motion.p>

          {/* Call To Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <a href="#demo" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto text-base shadow-[0_0_35px_rgba(79,141,255,0.35)]"
                leftIcon={<ChromeIcon className="w-5 h-5" />}
              >
                Install Extension — Zero Config
              </Button>
            </a>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                variant="glass"
                size="lg"
                className="w-full sm:w-auto text-base"
                rightIcon={<ArrowRight className="w-4 h-4 text-[#71717a]" />}
              >
                Open SaaS Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Trust & Security Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#71717a]"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              Zero-log local DOM analysis
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#4F8DFF]" />
              98% Faster than chatbot copying & pasting
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
              Powered by Google Gemini 2.5 Flash
            </span>
          </motion.div>
        </div>

        {/* Interactive Animated Browser Window Demo */}
        <div className="mt-14 sm:mt-20">
          <AnimatedBrowserDemo />
        </div>
      </div>
    </section>
  );
}
