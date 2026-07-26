"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChromeIcon } from "@/components/ui/chrome-icon";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F8DFF] to-[#8B5CF6] p-0.5 shadow-[0_0_20px_rgba(79,141,255,0.4)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] transition-all">
            <div className="w-full h-full bg-[#09090b] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#4F8DFF] group-hover:text-white transition-colors" />
            </div>
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Promptless<span className="text-[#4F8DFF]">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#71717a]">
          <Link
            href="#features"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Architecture</span>
          </Link>
          <Link
            href="#demo"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Interactive Demo</span>
          </Link>
          <Link
            href="#workflow"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Zero-Click Engine</span>
          </Link>
          <Link
            href="#security"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>SOC-2 Privacy</span>
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              SaaS Login
            </Button>
          </Link>
          <a
            href="https://github.com/google-gemini/promptless-ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ChromeIcon className="w-3.5 h-3.5" />}
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Add to Chrome — It&apos;s Free
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
