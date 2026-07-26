import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Terminal, ShieldCheck, AlertTriangle } from "lucide-react";

interface AnalyzerProps {
  platform: "linkedin" | "youtube" | "unsupported" | "unknown";
  intentLabel: string;
  confidenceScore: number;
  confidenceScores?: {
    website: number;
    page: number;
    intent: number;
  };
  summary: string;
  onAnalysisComplete: () => void;
}

export function Analyzer({
  platform,
  intentLabel,
  confidenceScore,
  confidenceScores,
  summary,
  onAnalysisComplete,
}: AnalyzerProps) {
  const [isReady, setIsReady] = useState(false);
  // Hidden Developer Mode — End users never see internal AI reasoning or confidence matrices by default
  const [showDevMode, setShowDevMode] = useState(false);

  useEffect(() => {
    setIsReady(false);
    const timer = setTimeout(() => {
      setIsReady(true);
      onAnalysisComplete();
    }, 350);

    return () => clearTimeout(timer);
  }, [summary, onAnalysisComplete]);

  const isConfident = (confidenceScores?.intent ?? confidenceScore) >= 80;

  const getHeroTitle = () => {
    if (platform === "linkedin") return "LinkedIn Intelligence";
    if (platform === "youtube") return "YouTube Video Assistant";
    return "Web Page Intelligence";
  };

  return (
    <div className="relative p-5 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 overflow-hidden shadow-2xl">
      {/* Subtle Shimmering Background Light */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Hero Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#4F8DFF] to-[#8B5CF6] flex items-center justify-center shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide">
              {getHeroTitle()}
            </h3>
            <p className="text-[11px] text-zinc-400">
              {isConfident
                ? "Zero-click consumer actions ready below"
                : "General-purpose actions active"}
            </p>
          </div>
        </div>

        {/* Hidden Developer Mode Toggle */}
        <button
          onClick={() => setShowDevMode(!showDevMode)}
          title="Toggle Developer Diagnostics"
          className={`p-1.5 rounded-lg border transition-all ${
            showDevMode
              ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
              : "bg-white/[0.03] border-white/5 text-zinc-600 hover:text-zinc-400"
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Clean Consumer Summary Badge */}
      <div className="mt-3.5 flex items-center justify-between py-2 px-3 rounded-xl bg-white/[0.03] border border-white/5">
        <span className="text-xs font-medium text-zinc-300 truncate max-w-[280px]">
          {summary}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full border border-[#10B981]/20">
          Ready
        </span>
      </div>

      {/* Hidden Developer Diagnostics (Only shown when Dev toggle clicked) */}
      <AnimatePresence>
        {showDevMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-white/10 space-y-2 text-[11px] font-mono text-zinc-400 overflow-hidden"
          >
            <div className="flex items-center justify-between text-zinc-300 font-bold">
              <span>DEVELOPER DIAGNOSTICS</span>
              <span className="text-[10px] text-blue-400">DEV MODE ON</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <div className="p-1.5 rounded bg-black/40 border border-white/5 text-center">
                <span className="text-[9px] text-zinc-500 block">WEBSITE</span>
                <span className="text-white font-semibold">
                  {confidenceScores?.website ?? 100}%
                </span>
              </div>
              <div className="p-1.5 rounded bg-black/40 border border-white/5 text-center">
                <span className="text-[9px] text-zinc-500 block">PAGE TYPE</span>
                <span className="text-white font-semibold">
                  {confidenceScores?.page ?? 96}%
                </span>
              </div>
              <div className="p-1.5 rounded bg-black/40 border border-white/5 text-center">
                <span className="text-[9px] text-zinc-500 block">INTENT</span>
                <span className="text-white font-semibold">
                  {confidenceScores?.intent ?? confidenceScore}%
                </span>
              </div>
            </div>
            <div className="text-[10px] text-zinc-500">
              Pipeline: 6-Step Hierarchical Context Engine | Activity:{" "}
              {intentLabel}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
