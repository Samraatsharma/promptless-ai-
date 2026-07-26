"use client";

import * as React from "react";
import {
  Clock,
  Briefcase,
  BookOpen,
  Sparkles,
  Zap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

export function UsageStats() {
  const stats = [
    {
      label: "Zero-Click Actions Executed",
      value: "28",
      sub: "+14 this week",
      icon: <Zap className="w-5 h-5 text-[#4F8DFF]" />,
      badgeText: "98% Faster",
      color: "primary" as const,
    },
    {
      label: "Estimated Hours Saved",
      value: "4.8 hrs",
      sub: "~3 min saved per action",
      icon: <Clock className="w-5 h-5 text-[#10B981]" />,
      badgeText: "High Impact",
      color: "neutral" as const,
    },
    {
      label: "Avg Intent Confidence",
      value: "97.4%",
      sub: "Google Gemini 2.5 Flash",
      icon: <Sparkles className="w-5 h-5 text-[#8B5CF6]" />,
      badgeText: "High Precision",
      color: "accent" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((st) => (
          <GlassCard key={st.label} glowColor={st.color} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                {st.icon}
              </div>
              <Badge variant={st.color}>{st.badgeText}</Badge>
            </div>
            <span className="text-xs text-[#71717a] block">{st.label}</span>
            <span className="text-3xl font-black text-white tracking-tight block mt-1">
              {st.value}
            </span>
            <span className="text-xs text-[#10B981] font-medium block mt-2">
              {st.sub}
            </span>
          </GlassCard>
        ))}
      </div>

      {/* Platform Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard glowColor="primary" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#4F8DFF]" />
              <h3 className="font-bold text-white">LinkedIn Job Hunting</h3>
            </div>
            <Badge variant="primary">16 Actions</Badge>
          </div>

          <p className="text-xs text-[#71717a]">
            Breakdown of your automated career actions on LinkedIn:
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#f4f4f5]/90">Tailor Resume</span>
              <span className="text-white font-mono">8 executions (50%)</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="w-[50%] h-full bg-[#4F8DFF]" />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#f4f4f5]/90">Generate Cover Letter</span>
              <span className="text-white font-mono">6 executions (38%)</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="w-[38%] h-full bg-[#4F8DFF]" />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#f4f4f5]/90">Company Research</span>
              <span className="text-white font-mono">2 executions (12%)</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="w-[12%] h-full bg-[#4F8DFF]" />
            </div>
          </div>
        </GlassCard>

        <GlassCard glowColor="accent" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#8B5CF6]" />
              <h3 className="font-bold text-white">YouTube Learning</h3>
            </div>
            <Badge variant="accent">12 Actions</Badge>
          </div>

          <p className="text-xs text-[#71717a]">
            Breakdown of your automated video study sessions:
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#f4f4f5]/90">Smart Notes</span>
              <span className="text-white font-mono">7 executions (58%)</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="w-[58%] h-full bg-[#8B5CF6]" />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#f4f4f5]/90">Smart Summary</span>
              <span className="text-white font-mono">3 executions (25%)</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="w-[25%] h-full bg-[#8B5CF6]" />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#f4f4f5]/90">Interactive Quiz</span>
              <span className="text-white font-mono">2 executions (17%)</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="w-[17%] h-full bg-[#8B5CF6]" />
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
