"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Globe, Code, Share2 } from "lucide-react";
import { ChromeIcon } from "@/components/ui/chrome-icon";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#09090b] py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Description */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4F8DFF] to-[#8B5CF6] p-0.5">
              <div className="w-full h-full bg-[#09090b] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#4F8DFF]" />
              </div>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Promptless<span className="text-[#4F8DFF]">AI</span>
            </span>
          </Link>

          <p className="text-xs text-[#71717a] leading-relaxed">
            AI that understands your intent before you ask. Zero-click actions
            for LinkedIn and YouTube powered by Google Gemini 2.5 Flash.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://github.com/google-gemini/promptless-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#71717a] hover:text-white hover:border-white/30 transition-colors"
              title="GitHub Repository"
            >
              <Code className="w-4 h-4" />
            </a>
            <a
              href="#demo"
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#71717a] hover:text-[#4F8DFF] hover:border-[#4F8DFF]/40 transition-colors"
              title="Chrome Extension"
            >
              <ChromeIcon className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#71717a] hover:text-[#8B5CF6] hover:border-[#8B5CF6]/40 transition-colors"
              title="Social Updates"
            >
              <Share2 className="w-4 h-4" />
            </a>
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#71717a] hover:text-[#10B981] hover:border-[#10B981]/40 transition-colors"
              title="Global Network"
            >
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Product Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Product & Extension
          </h4>
          <ul className="space-y-2 text-xs text-[#71717a]">
            <li>
              <a href="#features" className="hover:text-white transition-colors">
                Zero-Click Architecture
              </a>
            </li>
            <li>
              <a href="#demo" className="hover:text-white transition-colors">
                Interactive Side Panel
              </a>
            </li>
            <li>
              <a href="#workflow" className="hover:text-white transition-colors">
                LinkedIn Cover Letters
              </a>
            </li>
            <li>
              <a href="#workflow" className="hover:text-white transition-colors">
                YouTube Smart Notes
              </a>
            </li>
          </ul>
        </div>

        {/* Security Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Trust & Security
          </h4>
          <ul className="space-y-2 text-xs text-[#71717a]">
            <li>
              <a href="#security" className="hover:text-white transition-colors">
                SOC-2 Type II Privacy
              </a>
            </li>
            <li>
              <a href="#security" className="hover:text-white transition-colors">
                Local DOM Analysis
              </a>
            </li>
            <li>
              <a href="#security" className="hover:text-white transition-colors">
                No Cloud Scraping Logs
              </a>
            </li>
            <li>
              <a href="#security" className="hover:text-white transition-colors">
                Manifest V3 Compliant
              </a>
            </li>
          </ul>
        </div>

        {/* Dashboard & Account */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            SaaS Workspace
          </h4>
          <ul className="space-y-2 text-xs text-[#71717a]">
            <li>
              <Link href="/login" className="hover:text-white transition-colors">
                Sign In to Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="hover:text-white transition-colors"
              >
                Saved AI Results
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="hover:text-white transition-colors"
              >
                Usage Analytics
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="hover:text-white transition-colors"
              >
                AI Tone Preferences
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717a]">
        <span>
          © {new Date().getFullYear()} Promptless AI, Inc. Built for speed,
          beauty, and privacy.
        </span>
        <div className="flex items-center gap-6 mt-4 sm:mt-0">
          <a href="#security" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#security" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#security" className="hover:text-white transition-colors">
            Security Overview
          </a>
        </div>
      </div>
    </footer>
  );
}
