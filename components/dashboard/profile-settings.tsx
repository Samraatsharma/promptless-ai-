"use client";

import * as React from "react";
import {
  Sparkles,
  ShieldCheck,
  Key,
  Save,
  CheckCircle2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ProfileSettings() {
  const [tone, setTone] = React.useState<string>("professional");
  const [customInstructions, setCustomInstructions] = React.useState<string>(
    "Highlight my 8+ years of frontend experience with React, TypeScript, and low-latency animations."
  );
  const [isSaved, setIsSaved] = React.useState<boolean>(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const tones = [
    {
      id: "professional",
      name: "Executive Professional",
      desc: "Formal, assertive, and metric-oriented language.",
    },
    {
      id: "concise",
      name: "Ultra Concise",
      desc: "Brief bullet points with zero fluff or introductory pleasantries.",
    },
    {
      id: "enthusiastic",
      name: "Enthusiastic & High-Energy",
      desc: "Warm tone emphasizing collaborative leadership and passion.",
    },
    {
      id: "academic",
      name: "Academic & Analytical",
      desc: "Rigorous citations, technical precision, and structured proofs.",
    },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      {/* AI Tone Preferences */}
      <GlassCard glowColor="primary" className="p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/8 pb-6">
          <div>
            <Badge variant="primary" className="mb-2">
              Gemini Generation Tone
            </Badge>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              AI Output Tone & Voice
            </h3>
            <p className="text-xs text-[#71717a] mt-1">
              Controls how Promptless AI handcrafts your cover letters and video
              notes.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#4F8DFF]/20 flex items-center justify-center text-[#4F8DFF]">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tones.map((t) => {
            const isActive = tone === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isActive
                    ? "bg-[#4F8DFF]/15 border-[#4F8DFF] shadow-[0_0_20px_rgba(79,141,255,0.2)]"
                    : "bg-white/[0.03] border-white/8 hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-sm">
                      {t.name}
                    </span>
                    {isActive && (
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    )}
                  </div>
                  <p className="text-xs text-[#71717a] leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Custom Context & Background Instructions */}
      <GlassCard glowColor="neutral" className="p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/8 pb-6">
          <div>
            <Badge variant="neutral" className="mb-2">
              Persistent Profile Memory
            </Badge>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Custom Background Instructions
            </h3>
            <p className="text-xs text-[#71717a] mt-1">
              Provide context about your career background or study goals for all
              zero-click actions.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            rows={4}
            className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-white placeholder:text-[#71717a] focus:border-[#4F8DFF] focus:outline-none transition-colors"
            placeholder="e.g. I am applying for Staff/Principal Engineering roles. Highlight my experience with React 19, TypeScript, and high-performance WebGL/Framer Motion."
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71717a] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              Synced across SaaS dashboard and Manifest V3 extension
            </span>
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {isSaved ? "Saved Preferences!" : "Save Preferences"}
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* API & Security Settings */}
      <GlassCard glowColor="accent" className="p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">
                Google Gemini API Connection
              </h4>
              <span className="text-xs text-[#71717a]">
                Connected to project service role via secure backend API routes.
              </span>
            </div>
          </div>
          <Badge variant="accent">Connected</Badge>
        </div>
      </GlassCard>
    </div>
  );
}
