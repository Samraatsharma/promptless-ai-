/**
 * Promptless AI — Premium AI Scanning Experience
 * Shows after the splash screen while the extension analyzes the current page.
 * Replaces generic loading with an intelligent, contextual AI wake-up sequence.
 */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PromptlessLogo } from "./PromptlessLogo";

type Platform = "linkedin" | "youtube" | "unsupported" | "unknown";

interface ScanningScreenProps {
  platform: Platform;
  pageTitle?: string;
  domain?: string;
  /** Called when the scanning animation naturally completes */
  onComplete?: () => void;
  /** How long to spend on each step (ms) */
  stepDuration?: number;
}

// ─── Contextual scanning steps by platform ────────────────────────────────────

const PLATFORM_STEPS: Record<Platform, { icon: string; text: string }[]> = {
  linkedin: [
    { icon: "◈", text: "Connecting to LinkedIn..." },
    { icon: "◉", text: "Detecting professional context..." },
    { icon: "◎", text: "Reading your network signals..." },
    { icon: "◈", text: "Preparing writing tools..." },
    { icon: "✦", text: "AI suite ready." },
  ],
  youtube: [
    { icon: "◈", text: "Detecting video content..." },
    { icon: "◉", text: "Reading chapter markers..." },
    { icon: "◎", text: "Extracting key topics..." },
    { icon: "◈", text: "Preparing study tools..." },
    { icon: "✦", text: "AI suite ready." },
  ],
  unsupported: [
    { icon: "◈", text: "Scanning current page..." },
    { icon: "◉", text: "Reading page structure..." },
    { icon: "◎", text: "Checking supported platforms..." },
    { icon: "✦", text: "Analysis complete." },
  ],
  unknown: [
    { icon: "◈", text: "Detecting page..." },
    { icon: "◉", text: "Analyzing context..." },
    { icon: "✦", text: "AI suite ready." },
  ],
};

// ─── Radar sweep SVG ──────────────────────────────────────────────────────────

const RadarSweep: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <motion.div
    className="absolute inset-0 rounded-full overflow-hidden"
    animate={{ rotate: 360 }}
    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
  >
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="sweep" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="80%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path
        d={`M ${size / 2} ${size / 2} L ${size} ${size / 2} A ${size / 2} ${size / 2} 0 0 0 ${size / 2} 0 Z`}
        fill="url(#sweep)"
      />
    </svg>
  </motion.div>
);

// ─── Pulsing concentric rings ─────────────────────────────────────────────────

const PulseRings: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border pointer-events-none"
        style={{
          width: size * (0.5 + i * 0.18),
          height: size * (0.5 + i * 0.18),
          borderColor: `${color}${i === 0 ? "60" : i === 1 ? "35" : "18"}`,
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.45,
        }}
      />
    ))}
  </>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const ScanningScreen: React.FC<ScanningScreenProps> = ({
  platform,
  pageTitle,
  domain,
  onComplete,
  stepDuration = 420,
}) => {
  const steps = PLATFORM_STEPS[platform] ?? PLATFORM_STEPS.unknown;
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);

  const primaryColor =
    platform === "linkedin"
      ? "#06b6d4"
      : platform === "youtube"
      ? "#8b5cf6"
      : "#10b981";

  // Advance steps on a timer
  useEffect(() => {
    if (stepIndex >= steps.length - 1) {
      // All steps done — brief hold then complete
      const t = setTimeout(() => {
        setDone(true);
        onComplete?.();
      }, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStepIndex((s) => s + 1), stepDuration);
    return () => clearTimeout(t);
  }, [stepIndex, steps.length, stepDuration, onComplete]);

  const ORBTOP = 96; // orb size px

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          `radial-gradient(ellipse at 40% 30%, ${primaryColor}18 0%, transparent 55%), ` +
          "radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.12) 0%, transparent 50%), " +
          "#09090b",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
      transition={{ duration: 0.35 }}
    >
      {/* ── Subtle dot grid ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── Central orb with radar sweep ── */}
      <div
        className="relative flex items-center justify-center mb-8"
        style={{ width: ORBTOP, height: ORBTOP }}
      >
        {/* Pulse rings */}
        <PulseRings color={primaryColor} size={ORBTOP} />

        {/* Radar sweep */}
        <RadarSweep color={primaryColor} size={ORBTOP} />

        {/* Outer ring rotating */}
        <motion.div
          className="absolute inset-0 rounded-full border border-dashed"
          style={{ borderColor: `${primaryColor}45` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner ring counter-rotating */}
        <motion.div
          className="absolute rounded-full border border-dotted"
          style={{
            width: ORBTOP * 0.65,
            height: ORBTOP * 0.65,
            borderColor: `${primaryColor}60`,
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />

        {/* Tick marks at 0°, 90°, 180°, 270° */}
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${deg}deg)` }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 rounded-full"
              style={{ backgroundColor: `${primaryColor}80` }}
            />
          </div>
        ))}

        {/* Center nucleus */}
        <motion.div
          className="relative rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md z-10"
          style={{
            width: ORBTOP * 0.42,
            height: ORBTOP * 0.42,
            background: `radial-gradient(circle at 35% 35%, ${primaryColor} 0%, rgba(139,92,246,0.8) 100%)`,
            boxShadow: `0 0 24px ${primaryColor}80, inset 0 0 12px rgba(255,255,255,0.1)`,
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          >
            <PromptlessLogo size={22} variant="white" animated={false} />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Context header ── */}
      <motion.div
        className="text-center mb-7 space-y-1.5 px-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-base font-bold text-white tracking-tight">
          {platform === "linkedin"
            ? "Analyzing LinkedIn"
            : platform === "youtube"
            ? "Analyzing YouTube"
            : "Analyzing Page"}
        </h2>
        {(domain || pageTitle) && (
          <p className="text-[11px] text-zinc-500 font-mono truncate max-w-[280px]">
            {domain}
            {pageTitle ? ` · ${pageTitle.slice(0, 32)}${pageTitle.length > 32 ? "…" : ""}` : ""}
          </p>
        )}
      </motion.div>

      {/* ── Step list: cascades in, each step glows when active ── */}
      <div className="flex flex-col items-start gap-2.5 w-full px-10">
        {steps.map((step, i) => {
          const isActive = i === stepIndex;
          const isDone = i < stepIndex;

          return (
            <AnimatePresence key={i}>
              {i <= stepIndex && (
                <motion.div
                  className="flex items-center gap-3 w-full"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Icon */}
                  <motion.span
                    className="text-[13px] shrink-0 w-4 text-center"
                    style={{
                      color: isDone ? "#52525b" : primaryColor,
                    }}
                    animate={
                      isActive
                        ? { opacity: [0.7, 1, 0.7] }
                        : { opacity: 1 }
                    }
                    transition={
                      isActive
                        ? { duration: 0.7, repeat: Infinity }
                        : {}
                    }
                  >
                    {isDone ? "✓" : step.icon}
                  </motion.span>

                  {/* Step text */}
                  <span
                    className={`text-xs font-mono tracking-wide transition-colors duration-300 ${
                      isDone
                        ? "text-zinc-600"
                        : isActive
                        ? "text-white font-semibold"
                        : "text-zinc-500"
                    }`}
                  >
                    {step.text}
                  </span>

                  {/* Active typing cursor */}
                  {isActive && (
                    <motion.span
                      className="text-xs font-mono ml-0.5"
                      style={{ color: primaryColor }}
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.7, repeat: Infinity }}
                    >
                      ▍
                    </motion.span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      {/* ── Progress bar ── */}
      <div className="mt-8 w-48 h-[2px] bg-white/[0.06] rounded-full overflow-hidden border border-white/5">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(to right, ${primaryColor}, rgba(139,92,246,0.9))`,
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* ── Progress label ── */}
      <motion.p
        className="mt-2.5 text-[9px] font-mono uppercase tracking-[0.18em] text-zinc-600"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {done ? "READY" : "SCANNING"} · {Math.round(((stepIndex + 1) / steps.length) * 100)}%
      </motion.p>
    </motion.div>
  );
};
