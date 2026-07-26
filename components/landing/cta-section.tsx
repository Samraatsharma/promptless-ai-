"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChromeIcon } from "@/components/ui/chrome-icon";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative rounded-[32px] overflow-hidden p-8 sm:p-14 md:p-20 text-center border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Ambient Glows */}
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#4F8DFF]/25 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#8B5CF6]/25 blur-[120px] pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#4F8DFF]" />
              <span>Experience Autonomous Browsing</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Ready to eliminate chatbot textboxes forever?
            </h2>

            <p className="text-base sm:text-lg text-[#71717a] leading-relaxed">
              Install the Promptless AI Manifest V3 Side Panel and let Google
              Gemini detect whether you are applying for jobs on LinkedIn or
              studying on YouTube. Zero prompts required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a href="#demo" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto text-base shadow-[0_0_35px_rgba(79,141,255,0.4)]"
                  leftIcon={<ChromeIcon className="w-5 h-5" />}
                >
                  Add to Chrome — Free
                </Button>
              </a>
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  variant="glass"
                  size="lg"
                  className="w-full sm:w-auto text-base"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Access SaaS Dashboard
                </Button>
              </Link>
            </div>

            <div className="pt-4 flex items-center justify-center gap-2 text-xs text-[#71717a]">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>
                Zero log privacy · Local storage execution · Instant uninstall
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { CTASection as CtaSection };
