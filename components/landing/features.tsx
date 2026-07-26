"use client";

import * as React from "react";
import {
  Briefcase,
  FileText,
  Search,
  HelpCircle,
  CheckSquare,
  BookOpen,
  FileSpreadsheet,
  Layers,
  Award,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

export function Features() {
  const linkedinFeatures = [
    {
      title: "Tailor Resume",
      desc: "Instantly aligns your bullet points and skills with the extracted job requirements.",
      icon: <Briefcase className="w-5 h-5 text-[#4F8DFF]" />,
    },
    {
      title: "Generate Cover Letter",
      desc: "Handcrafts an executive-level cover letter highlighting your exact qualifications.",
      icon: <FileText className="w-5 h-5 text-[#4F8DFF]" />,
    },
    {
      title: "Company Research",
      desc: "Summarizes mission, culture, recent funding, and news about the hiring company.",
      icon: <Search className="w-5 h-5 text-[#4F8DFF]" />,
    },
    {
      title: "Interview Questions",
      desc: "Predicts the top 5 technical and behavioral questions likely to be asked for this role.",
      icon: <HelpCircle className="w-5 h-5 text-[#4F8DFF]" />,
    },
    {
      title: "ATS Suggestions",
      desc: "Recommends keyword optimizations to ensure your application passes ATS screening.",
      icon: <CheckSquare className="w-5 h-5 text-[#4F8DFF]" />,
    },
  ];

  const youtubeFeatures = [
    {
      title: "Smart Notes",
      desc: "Generates hierarchical, structured study notes with timestamps from video captions.",
      icon: <BookOpen className="w-5 h-5 text-[#8B5CF6]" />,
    },
    {
      title: "Smart Summary",
      desc: "Condenses 40+ minute educational talks into a crisp 2-minute executive overview.",
      icon: <FileSpreadsheet className="w-5 h-5 text-[#8B5CF6]" />,
    },
    {
      title: "Flashcards",
      desc: "Automatically extracts core definitions and concepts into Q&A flashcards.",
      icon: <Layers className="w-5 h-5 text-[#8B5CF6]" />,
    },
    {
      title: "Interactive Quiz",
      desc: "Tests your retention with instant multiple-choice questions from the video.",
      icon: <Award className="w-5 h-5 text-[#8B5CF6]" />,
    },
    {
      title: "Key Takeaways",
      desc: "High-signal bullet points that distill the presenter's primary thesis.",
      icon: <Sparkles className="w-5 h-5 text-[#8B5CF6]" />,
    },
  ];

  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="primary">Version 1 MVP Platforms</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Built for where you work and learn.
          </h2>
          <p className="text-[#f4f4f5]/70 text-lg">
            No bloated features. Promptless AI is laser-focused on transforming{" "}
            <span className="text-white font-semibold">LinkedIn</span> job
            hunting and <span className="text-white font-semibold">YouTube</span>{" "}
            learning into zero-click workflows.
          </p>
        </div>

        {/* Two Column Platform Showcases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LinkedIn Column */}
          <GlassCard glowColor="primary" className="p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/8 pb-6">
              <div>
                <Badge variant="primary" className="mb-2">
                  Applying for Job (98% Confidence)
                </Badge>
                <h3 className="text-3xl font-bold text-white tracking-tight">
                  LinkedIn Experience
                </h3>
                <p className="text-sm text-[#71717a] mt-1">
                  Automatic job description & company metadata extraction.
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#4F8DFF]/20 border border-[#4F8DFF]/40 flex items-center justify-center text-[#4F8DFF] shadow-[0_0_24px_rgba(79,141,255,0.3)]">
                <Briefcase className="w-7 h-7" />
              </div>
            </div>

            <div className="space-y-3">
              {linkedinFeatures.map((feat, idx) => (
                <div
                  key={feat.title}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#4F8DFF]/40 hover:bg-white/[0.06] transition-all flex items-start justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-[#4F8DFF]/15 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                      {feat.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-base group-hover:text-[#4F8DFF] transition-colors">
                        {feat.title}
                      </h4>
                      <p className="text-sm text-[#71717a] leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#71717a] group-hover:text-white group-hover:border-[#4F8DFF]/50 transition-all shrink-0">
                    ⌘{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* YouTube Column */}
          <GlassCard glowColor="accent" className="p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/8 pb-6">
              <div>
                <Badge variant="accent" className="mb-2">
                  Learning (96% Confidence)
                </Badge>
                <h3 className="text-3xl font-bold text-white tracking-tight">
                  YouTube Experience
                </h3>
                <p className="text-sm text-[#71717a] mt-1">
                  Real-time transcript analysis and structured knowledge extraction.
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] shadow-[0_0_24px_rgba(139,92,246,0.3)]">
                <BookOpen className="w-7 h-7" />
              </div>
            </div>

            <div className="space-y-3">
              {youtubeFeatures.map((feat, idx) => (
                <div
                  key={feat.title}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#8B5CF6]/40 hover:bg-white/[0.06] transition-all flex items-start justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-[#8B5CF6]/15 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                      {feat.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-base group-hover:text-[#8B5CF6] transition-colors">
                        {feat.title}
                      </h4>
                      <p className="text-sm text-[#71717a] leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#71717a] group-hover:text-white group-hover:border-[#8B5CF6]/50 transition-all shrink-0">
                    ⌘{idx + 6}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
