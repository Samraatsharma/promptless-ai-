import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, AlertTriangle, ShieldCheck, Zap } from "lucide-react";

export type AICoreState =
  | "idle"
  | "scanning"
  | "thinking"
  | "generating"
  | "success"
  | "error";

export interface AICoreProps {
  state: AICoreState;
  size?: number;
  progress?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

/**
 * Promptless AI — JARVIS & Vision Pro Inspired Futuristic AI Core
 * Interactive holographic sphere with orbital rings, scan lines, and reactive HUD telemetry.
 */
export const AICore: React.FC<AICoreProps> = ({
  state = "idle",
  size = 80,
  progress = 0,
  label,
  sublabel,
  className = "",
}) => {
  const [scanStep, setScanStep] = useState(0);

  // Cinematic Context Scanning Steps
  const scanSteps = [
    { text: "Scanning website...", blocks: "■■□□□□□□□□", percent: 20 },
    { text: "Reading page structure...", blocks: "■■■■□□□□□□", percent: 40 },
    {
      text: "Finding important information...",
      blocks: "■■■■■■□□□□",
      percent: 60,
    },
    {
      text: "Understanding your context...",
      blocks: "■■■■■■■■□□",
      percent: 80,
    },
    { text: "Preparing AI tools...", blocks: "■■■■■■■■■■", percent: 100 },
  ];

  useEffect(() => {
    if (state === "scanning") {
      const interval = setInterval(() => {
        setScanStep((prev) => (prev + 1) % scanSteps.length);
      }, 350);
      return () => clearInterval(interval);
    } else {
      setScanStep(0);
    }
  }, [state]);

  // Color theme by state
  const getCoreColor = () => {
    switch (state) {
      case "scanning":
        return {
          primary: "#06b6d4",
          secondary: "#3b82f6",
          glow: "rgba(6,182,212,0.4)",
        };
      case "thinking":
        return {
          primary: "#8b5cf6",
          secondary: "#ec4899",
          glow: "rgba(139,92,246,0.45)",
        };
      case "generating":
        return {
          primary: "#38bdf8",
          secondary: "#10b981",
          glow: "rgba(56,189,248,0.5)",
        };
      case "success":
        return {
          primary: "#10b981",
          secondary: "#06b6d4",
          glow: "rgba(16,185,129,0.5)",
        };
      case "error":
        return {
          primary: "#ef4444",
          secondary: "#f97316",
          glow: "rgba(239,68,68,0.5)",
        };
      default:
        // Idle futuristic cyan -> purple
        return {
          primary: "#38bdf8",
          secondary: "#8b5cf6",
          glow: "rgba(56,189,248,0.25)",
        };
    }
  };

  const theme = getCoreColor();
  const currentScan = scanSteps[scanStep];

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* 1. Holographic Orb / Orbital Ring Visualizer */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Ambient Holographic Glow Blob */}
        <motion.div
          className="absolute rounded-full blur-xl pointer-events-none"
          style={{
            width: size * 1.3,
            height: size * 1.3,
            backgroundColor: theme.primary,
          }}
          animate={{
            scale:
              state === "thinking" || state === "generating"
                ? [1, 1.25, 1]
                : [1, 1.08, 1],
            opacity:
              state === "idle" ? 0.2 : state === "success" ? [0.4, 0.7, 0.3] : 0.45,
          }}
          transition={{
            duration: state === "scanning" ? 1.2 : 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Outer Orbital HUD Ring 1 (Rotating Clockwise) */}
        <motion.div
          className="absolute inset-0 rounded-full border border-dashed border-white/20"
          style={{ borderColor: `${theme.primary}50` }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration:
              state === "scanning" || state === "generating" ? 4 : 14,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Outer Orbital HUD Ring 2 (Counter-Clockwise) */}
        <motion.div
          className="absolute rounded-full border border-dotted border-white/30"
          style={{
            width: size * 0.75,
            height: size * 0.75,
            borderColor: `${theme.secondary}60`,
          }}
          animate={{
            rotate: -360,
            scale:
              state === "thinking"
                ? [1, 1.08, 1]
                : state === "scanning"
                ? [0.95, 1.05, 0.95]
                : 1,
          }}
          transition={{
            rotate: {
              duration: state === "scanning" ? 3 : 10,
              repeat: Infinity,
              ease: "linear",
            },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* Inner JARVIS Energy Nucleus */}
        <motion.div
          className="relative rounded-full flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-md"
          style={{
            width: size * 0.45,
            height: size * 0.45,
            background: `radial-gradient(circle, ${theme.primary} 0%, ${theme.secondary} 100%)`,
            boxShadow: `0 0 20px ${theme.glow}`,
          }}
          animate={{
            scale:
              state === "generating" || state === "success"
                ? [1, 1.15, 1]
                : [1, 1.05, 1],
          }}
          transition={{
            duration: state === "generating" ? 0.8 : 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Reactive Center Icon */}
          <AnimatePresence mode="wait">
            {state === "success" ? (
              <motion.div
                key="success"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
              >
                <Check className="w-5 h-5 text-white stroke-[2.5]" />
              </motion.div>
            ) : state === "error" ? (
              <motion.div
                key="error"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <AlertTriangle className="w-5 h-5 text-white" />
              </motion.div>
            ) : state === "scanning" ? (
              <motion.div
                key="scanning"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-5 h-5 text-white fill-current" />
              </motion.div>
            ) : (
              <motion.div
                key="default"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 2. JARVIS HUD Telemetry Text & Progress Bar */}
      <div className="mt-3 text-center space-y-1.5 w-full px-4">
        {state === "scanning" ? (
          <motion.div
            key={currentScan.text}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            <div className="text-xs font-mono font-bold text-cyan-400 tracking-wide">
              {currentScan.text}
            </div>
            <div className="text-[10px] font-mono text-zinc-500 tracking-widest">
              {currentScan.blocks}
            </div>
          </motion.div>
        ) : (
          <>
            {label && (
              <div className="text-xs font-bold text-white tracking-wide font-sans">
                {label}
              </div>
            )}
            {sublabel && (
              <div className="text-[11px] text-zinc-400 font-sans">
                {sublabel}
              </div>
            )}
          </>
        )}

        {/* Optional Scanning / Generation Progress Bar */}
        {(state === "scanning" || state === "generating") && (
          <div className="w-36 h-1 mx-auto bg-white/10 rounded-full overflow-hidden mt-2 border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{
                width:
                  state === "scanning"
                    ? `${currentScan.percent}%`
                    : `${progress || 100}%`,
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
