import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export interface AuroraCanvasProps {
  platform: "linkedin" | "youtube" | "unsupported" | "unknown";
  className?: string;
}

/**
 * Promptless AI — Futuristic Background Experience
 * Aurora blobs + scanning horizontal sweep line + neural starfield + HUD grid
 */
export const AuroraCanvas: React.FC<AuroraCanvasProps> = ({
  platform,
  className = "",
}) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const getTheme = () => {
    switch (platform) {
      case "linkedin":
        return {
          blob1: "from-blue-600/25 via-cyan-600/15 to-transparent",
          blob2: "from-indigo-600/20 via-blue-600/10 to-transparent",
          sweep: "rgba(6, 182, 212, 0.35)",
          scanLine: "#06b6d4",
          stars: ["bg-cyan-400/50", "bg-blue-400/40", "bg-indigo-400/50"],
        };
      case "youtube":
        return {
          blob1: "from-red-600/20 via-purple-600/15 to-transparent",
          blob2: "from-purple-600/15 via-pink-600/12 to-transparent",
          sweep: "rgba(236, 72, 153, 0.3)",
          scanLine: "#ec4899",
          stars: ["bg-pink-400/50", "bg-purple-400/40", "bg-rose-400/50"],
        };
      default:
        return {
          blob1: "from-cyan-600/20 via-emerald-600/12 to-transparent",
          blob2: "from-purple-600/18 via-blue-600/10 to-transparent",
          sweep: "rgba(16, 185, 129, 0.25)",
          scanLine: "#10b981",
          stars: ["bg-cyan-400/40", "bg-purple-400/40", "bg-emerald-400/40"],
        };
    }
  };

  const theme = getTheme();

  // Neural particle stars
  const STARS = [
    { top: "18%", left: "22%", delay: 0, duration: 4.2, cls: theme.stars[0] },
    { top: "67%", right: "18%", delay: 1.5, duration: 5.0, cls: theme.stars[1] },
    { top: "42%", left: "70%", delay: 2.8, duration: 3.8, cls: theme.stars[0] },
    { top: "80%", left: "35%", delay: 0.7, duration: 6.1, cls: theme.stars[2] },
    { top: "30%", right: "30%", delay: 3.4, duration: 4.5, cls: theme.stars[1] },
    { top: "55%", left: "12%", delay: 1.1, duration: 5.5, cls: theme.stars[2] },
    { top: "12%", right: "15%", delay: 2.2, duration: 4.0, cls: theme.stars[0] },
    { top: "90%", right: "40%", delay: 0.4, duration: 5.8, cls: theme.stars[1] },
  ];

  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      {/* 1. Fine HUD dot-grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* 2. Subtle coordinate grid lines */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "112px 112px",
        }}
      />

      {/* 3. Primary aurora blob — top-left */}
      <motion.div
        className={`absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-gradient-to-br ${theme.blob1} blur-3xl`}
        animate={
          reducedMotion
            ? undefined
            : { x: [0, 22, -12, 0], y: [0, -18, 14, 0], scale: [1, 1.1, 0.96, 1] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 4. Secondary aurora blob — bottom-right */}
      <motion.div
        className={`absolute -bottom-40 -right-40 w-[420px] h-[420px] rounded-full bg-gradient-to-tl ${theme.blob2} blur-3xl`}
        animate={
          reducedMotion
            ? undefined
            : { x: [0, -28, 16, 0], y: [0, 22, -12, 0], scale: [1, 1.07, 1] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 5. Horizontal scanner sweep line — the cinematographic effect */}
      {!reducedMotion && (
        <motion.div
          className="absolute left-0 right-0 h-[1px] pointer-events-none"
          style={{
            background: `linear-gradient(to right, transparent 0%, ${theme.sweep} 20%, ${theme.scanLine} 50%, ${theme.sweep} 80%, transparent 100%)`,
            boxShadow: `0 0 12px 2px ${theme.sweep}`,
          }}
          animate={{ top: ["-2%", "102%"] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2.5,
          }}
        />
      )}

      {/* 6. Short vertical scan-flash lines (edge HUD markers) */}
      {!reducedMotion && (
        <>
          <motion.div
            className="absolute top-0 bottom-0 w-[1px] left-8 opacity-30"
            style={{
              background: `linear-gradient(to bottom, transparent 0%, ${theme.scanLine}60 50%, transparent 100%)`,
            }}
            animate={{ opacity: [0.1, 0.3, 0.1], scaleY: [0.6, 1, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute top-0 bottom-0 w-[1px] right-8 opacity-30"
            style={{
              background: `linear-gradient(to bottom, transparent 0%, ${theme.scanLine}60 50%, transparent 100%)`,
            }}
            animate={{ opacity: [0.1, 0.25, 0.1], scaleY: [0.5, 0.9, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3.5 }}
          />
        </>
      )}

      {/* 7. Neural particle star field */}
      {!reducedMotion && (
        <div className="absolute inset-0">
          {STARS.map((s, i) => (
            <motion.div
              key={i}
              className={`absolute w-[3px] h-[3px] rounded-full ${s.cls} blur-[0.5px]`}
              style={{
                top: s.top,
                left: (s as any).left,
                right: (s as any).right,
              }}
              animate={{
                opacity: [0.15, 0.8, 0.15],
                scale: [0.8, 1.6, 0.8],
              }}
              transition={{
                duration: s.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: s.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* 8. Corner HUD bracket markers */}
      {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map(
        (pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-4 h-4 opacity-20`}
            style={{
              borderTop: i < 2 ? `1px solid ${theme.scanLine}` : "none",
              borderBottom: i >= 2 ? `1px solid ${theme.scanLine}` : "none",
              borderLeft: i % 2 === 0 ? `1px solid ${theme.scanLine}` : "none",
              borderRight: i % 2 === 1 ? `1px solid ${theme.scanLine}` : "none",
            }}
          />
        )
      )}
    </div>
  );
};
