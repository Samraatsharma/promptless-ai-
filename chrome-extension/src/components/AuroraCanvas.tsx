import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export interface AuroraCanvasProps {
  platform: "linkedin" | "youtube" | "unsupported" | "unknown";
  className?: string;
}

/**
 * Promptless AI — Futuristic Background Experience (Aurora + HUD Grid + Neural Starfield)
 * Dynamically shifts ambient color themes by platform while respecting reduced-motion preferences.
 */
export const AuroraCanvas: React.FC<AuroraCanvasProps> = ({
  platform,
  className = "",
}) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Platform ambient color scheme
  const getThemeColors = () => {
    switch (platform) {
      case "linkedin":
        return {
          blob1: "from-blue-600/20 via-cyan-600/15 to-transparent",
          blob2: "from-indigo-600/15 via-blue-600/10 to-transparent",
          accent: "rgba(6, 182, 212, 0.12)",
        };
      case "youtube":
        return {
          blob1: "from-red-600/15 via-purple-600/15 to-transparent",
          blob2: "from-purple-600/15 via-pink-600/10 to-transparent",
          accent: "rgba(236, 72, 153, 0.12)",
        };
      default:
        return {
          blob1: "from-cyan-600/15 via-emerald-600/10 to-transparent",
          blob2: "from-purple-600/15 via-blue-600/10 to-transparent",
          accent: "rgba(16, 185, 129, 0.12)",
        };
    }
  };

  const theme = getThemeColors();

  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      {/* 1. Isometric Digital HUD Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* 2. Primary Shimmering Aurora Field */}
      <motion.div
        className={`absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br ${theme.blob1} blur-3xl`}
        animate={
          reducedMotion
            ? undefined
            : {
                x: [0, 20, -10, 0],
                y: [0, -15, 15, 0],
                scale: [1, 1.1, 0.95, 1],
              }
        }
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 3. Secondary Holographic Nebula Field */}
      <motion.div
        className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-tl ${theme.blob2} blur-3xl`}
        animate={
          reducedMotion
            ? undefined
            : {
                x: [0, -25, 15, 0],
                y: [0, 20, -10, 0],
                scale: [1, 1.08, 1],
              }
        }
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 4. Subtle Neural Particle Stars (Only when motion is allowed) */}
      {!reducedMotion && (
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/3 w-1 h-1 rounded-full bg-cyan-400/40 blur-[0.5px]"
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-2/3 right-1/4 w-1 h-1 rounded-full bg-purple-400/40 blur-[0.5px]"
            animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.4, 1] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          />
          <motion.div
            className="absolute bottom-1/5 left-1/4 w-1 h-1 rounded-full bg-emerald-400/40 blur-[0.5px]"
            animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.3, 1] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          />
        </div>
      )}
    </div>
  );
};
