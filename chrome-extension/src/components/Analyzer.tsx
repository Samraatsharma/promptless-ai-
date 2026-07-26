import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

interface AnalyzerProps {
  platform: "linkedin" | "youtube" | "unsupported" | "unknown";
  intentLabel: string;
  confidenceScore: number;
  summary: string;
  onAnalysisComplete: () => void;
}

const STEPS = [
  { id: 1, text: "1. Analyzing page..." },
  { id: 2, text: "2. Reading context..." },
  { id: 3, text: "3. Understanding intent..." },
  { id: 4, text: "4. Preparing suggestions..." },
  { id: 5, text: "Done" },
];

export function Analyzer({
  platform,
  intentLabel,
  confidenceScore,
  summary,
  onAnalysisComplete,
}: AnalyzerProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
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
    }, 700);

    return () => clearInterval(timer);
  }, [onAnalysisComplete]);

  const isDone = currentStep === STEPS.length;

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
            {isDone ? "Intent Analysis Complete" : "Zero-Click Analyzer Active"}
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
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Detected Intent & Confidence Badge */}
      <AnimatePresence>
        {isDone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-3 border-t border-white/10 space-y-2.5"
          >
            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#4F8DFF]/10 to-[#8B5CF6]/10 border border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#71717a] block">
                  Detected Intent
                </span>
                <span className="text-sm font-bold text-white">
                  {intentLabel}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#71717a] block">
                  Confidence
                </span>
                <span className="text-sm font-bold text-[#10B981]">
                  {confidenceScore}%
                </span>
              </div>
            </div>

            <p className="text-xs text-[#71717a] leading-relaxed italic bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
              {summary}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
