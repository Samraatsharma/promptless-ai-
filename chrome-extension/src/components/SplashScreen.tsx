/**
 * Promptless AI — Premium Splash Screen
 * The first thing users see when opening the extension.
 * Feels like an AI waking up, not a popup opening.
 */
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PromptlessLogo } from "./PromptlessLogo";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number; // ms before auto-advancing
}

// Floating particle positions (deterministic, not random, for performance)
const PARTICLES = [
  { x: 12, y: 18, size: 2.5, delay: 0,    dur: 3.8 },
  { x: 78, y: 25, size: 1.5, delay: 0.6,  dur: 4.5 },
  { x: 30, y: 72, size: 2,   delay: 1.2,  dur: 3.2 },
  { x: 88, y: 68, size: 1.8, delay: 0.3,  dur: 5.0 },
  { x: 55, y: 12, size: 1.2, delay: 1.8,  dur: 4.1 },
  { x: 18, y: 55, size: 2.2, delay: 0.9,  dur: 3.6 },
  { x: 72, y: 82, size: 1.5, delay: 2.1,  dur: 4.8 },
  { x: 42, y: 40, size: 1,   delay: 0.4,  dur: 5.2 },
  { x: 65, y: 48, size: 2,   delay: 1.5,  dur: 3.4 },
  { x: 25, y: 90, size: 1.3, delay: 2.4,  dur: 4.3 },
  { x: 93, y: 40, size: 1.8, delay: 0.7,  dur: 3.9 },
  { x: 48, y: 88, size: 1.2, delay: 1.1,  dur: 4.7 },
];

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = 1800,
}) => {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");
  const [dots, setDots] = useState(0);

  useEffect(() => {
    // Phase 1: Enter animation (600ms)
    const holdTimer = setTimeout(() => setPhase("hold"), 600);

    // Phase 2: Start exit animation before calling onComplete
    const exitTimer = setTimeout(() => setPhase("exit"), duration - 400);

    // Phase 3: Actually complete
    const completeTimer = setTimeout(onComplete, duration);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  // Animated "..." dot cycle
  useEffect(() => {
    if (phase !== "hold") return;
    const id = setInterval(() => setDots((d) => (d + 1) % 4), 380);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(56,189,248,0.18) 0%, transparent 55%), " +
              "radial-gradient(ellipse at 75% 80%, rgba(139,92,246,0.22) 0%, transparent 55%), " +
              "radial-gradient(ellipse at 60% 30%, rgba(16,185,129,0.10) 0%, transparent 40%), " +
              "#09090b",
          }}
        >
          {/* ── Floating particles ── */}
          {PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size * 3,
                height: p.size * 3,
                background: `radial-gradient(circle, ${
                  i % 3 === 0
                    ? "rgba(56,189,248,0.8)"
                    : i % 3 === 1
                    ? "rgba(139,92,246,0.8)"
                    : "rgba(16,185,129,0.7)"
                } 0%, transparent 70%)`,
                filter: "blur(0.5px)",
              }}
              animate={{
                y: [0, -14, 6, 0],
                opacity: [0.3, 0.9, 0.5, 0.3],
                scale: [1, 1.4, 0.9, 1],
              }}
              transition={{
                duration: p.dur,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* ── Outer glow ring ── */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 220,
              height: 220,
              background:
                "radial-gradient(circle, rgba(56,189,248,0.08) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)",
              border: "1px solid rgba(56,189,248,0.12)",
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* ── Inner soft glow ── */}
          <motion.div
            className="absolute rounded-full blur-3xl pointer-events-none"
            style={{
              width: 160,
              height: 160,
              background:
                "radial-gradient(circle, rgba(56,189,248,0.18) 0%, rgba(139,92,246,0.12) 60%, transparent 80%)",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* ── Glassmorphic card ── */}
          <motion.div
            className="relative flex flex-col items-center justify-center gap-5 z-10 px-10 py-10 rounded-3xl"
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.09)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow:
                "0 0 60px rgba(56,189,248,0.08), 0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
              width: 260,
            }}
            initial={{ scale: 0.88, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Logo breathing animation */}
            <motion.div
              animate={{
                scale: [1, 1.06, 1],
                filter: [
                  "drop-shadow(0 0 8px rgba(56,189,248,0.5))",
                  "drop-shadow(0 0 20px rgba(56,189,248,0.8))",
                  "drop-shadow(0 0 8px rgba(56,189,248,0.5))",
                ],
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <PromptlessLogo size={72} variant="gradient" animated={false} />
            </motion.div>

            {/* Product name */}
            <div className="text-center space-y-1.5">
              <motion.h1
                className="text-xl font-bold tracking-tight text-white"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
              >
                Promptless<span className="text-[#38bdf8]">AI</span>
              </motion.h1>
              <motion.p
                className="text-[11px] text-zinc-400 font-medium tracking-widest uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Context-Aware Intelligence
              </motion.p>
            </div>

            {/* Status dots */}
            <motion.div
              className="flex items-center gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* ── Footer tagline ── */}
          <motion.p
            className="absolute bottom-7 text-[10px] text-zinc-600 tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            WAKING UP{"."[".".repeat(dots).length - 1] !== undefined ? ".".repeat(dots) : ""}
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
