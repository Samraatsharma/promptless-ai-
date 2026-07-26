import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";

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

const STEPS = [
  { id: 1, text: "1. Detecting website & domain..." },
  { id: 2, text: "2. Identifying page hierarchy..." },
  { id: 3, text: "3. Extracting live DOM context..." },
  { id: 4, text: "4. Determining user activity..." },
  { id: 5, text: "5. Inferring intent & actions..." },
];

export function Analyzer({
  platform,
  intentLabel,
  confidenceScore,
  confidenceScores,
  summary,
  onAnalysisComplete,
}: AnalyzerProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    // Reset steps when platform or summary changes
    setCurrentStep(1);
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length) {
          return prev + 1;
        } else {
          clearInterval(timer);
          onAnalysisComplete();
          return prev;
        }
      });
    }, 400);

    return () => clearInterval(timer);
  }, [summary, onAnalysisComplete]);

  const isDone = currentStep === STEPS.length;
  const isConfident = (confidenceScores?.intent ?? confidenceScore) >= 80;

  return (
    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
      {/* Title Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isDone ? (
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          ) : (
            <Loader2 className="w-4 h-4 text-[#4F8DFF] animate-spin" />
          )}
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {isDone ? "Context Engine Complete" : "Hierarchical Context Engine"}
          </span>
        </div>

        <span className="text-xs font-mono text-[#4F8DFF]">
          {Math.min(currentStep * 20, 100)}%
        </span>
      </div>

      {/* Step Indicators */}
      <div className="space-y-1.5">
        {STEPS.map((step) => {
          const isPassed = step.id <= currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div
              key={step.id}
              className={`flex items-center justify-between text-xs transition-all py-1 px-2.5 rounded-lg ${
                isCurrent
                  ? "bg-[#4F8DFF]/15 text-white font-semibold border border-[#4F8DFF]/30"
                  : isPassed
                  ? "text-[#10B981] opacity-90"
                  : "text-[#71717a] opacity-40"
              }`}
            >
              <span className="flex items-center gap-2">
                {isPassed && step.id !== 5 ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                ) : null}
                {step.text}
              </span>
              {isPassed && <CheckCircle2 className="w-3 h-3 text-[#10B981]" />}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#4F8DFF] to-[#8B5CF6]"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(currentStep * 20, 100)}%` }}
          transition={{ duration: 0.25 }}
        />
      </div>

      {/* Detected Intent & Separate Confidence System */}
      <AnimatePresence>
        {isDone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-3 border-t border-white/10 space-y-3"
          >
            {/* 3-Tier Confidence Badges */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                <span className="text-[9px] uppercase tracking-wider text-[#71717a] block">
                  Website
                </span>
                <span className="text-xs font-bold text-white">
                  {confidenceScores?.website ?? 100}%
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                <span className="text-[9px] uppercase tracking-wider text-[#71717a] block">
                  Page Type
                </span>
                <span className="text-xs font-bold text-white">
                  {confidenceScores?.page ?? 96}%
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                <span className="text-[9px] uppercase tracking-wider text-[#71717a] block">
                  Intent
                </span>
                <span
                  className={`text-xs font-bold ${
                    isConfident ? "text-[#10B981]" : "text-amber-400"
                  }`}
                >
                  {confidenceScores?.intent ?? confidenceScore}%
                </span>
              </div>
            </div>

            {/* Main Detected Intent Badge */}
            <div
              className={`flex items-center justify-between p-3 rounded-xl border ${
                isConfident
                  ? "bg-gradient-to-r from-[#4F8DFF]/10 to-[#8B5CF6]/10 border-white/10"
                  : "bg-amber-500/10 border-amber-500/30"
              }`}
            >
              <div className="flex items-center gap-2">
                {isConfident ? (
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#71717a] block">
                    Detected Intent
                  </span>
                  <span className="text-sm font-bold text-white">
                    {intentLabel}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#71717a] block">
                  Status
                </span>
                <span
                  className={`text-xs font-bold ${
                    isConfident ? "text-[#10B981]" : "text-amber-400"
                  }`}
                >
                  {isConfident ? "High Confidence" : "Low Confidence (<80%)"}
                </span>
              </div>
            </div>

            {/* Low Confidence Warning Box */}
            {!isConfident && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-0.5">
                    We're not yet confident about what you're trying to do.
                  </div>
                  <div className="text-[11px] text-amber-300/80">
                    Offering only general-purpose actions to prevent guessing or inaccurate suggestions.
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-[#71717a] leading-relaxed italic bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
              {summary}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
