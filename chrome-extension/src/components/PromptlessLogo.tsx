import React from "react";
import { motion } from "framer-motion";

export interface PromptlessLogoProps {
  size?: number;
  variant?: "dark" | "light" | "monochrome" | "accent" | "gradient";
  animated?: boolean;
  className?: string;
}

/**
 * Promptless AI — The Context Prism & Neural Spark Brand Mark
 * Represents continuous contextual browser understanding without prompt textboxes.
 * Inspired by Arc Browser, Linear, and Perplexity iconography.
 */
export const PromptlessLogo: React.FC<PromptlessLogoProps> = ({
  size = 28,
  variant = "gradient",
  animated = false,
  className = "",
}) => {
  const gradientId = `promptless-prism-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  const glowId = `promptless-glow-${Math.random().toString(36).slice(2, 8)}`;

  // Colors based on brand variant
  const getStrokeColors = () => {
    switch (variant) {
      case "light":
        return { start: "#09090b", end: "#3f3f46" };
      case "dark":
        return { start: "#ffffff", end: "#a1a1aa" };
      case "monochrome":
        return { start: "currentColor", end: "currentColor" };
      case "accent":
        return { start: "#38bdf8", end: "#818cf8" };
      default:
        // Core Brand Gradient (Cyan -> Violet -> Fuchsia)
        return { start: "#06b6d4", mid: "#8b5cf6", end: "#ec4899" };
    }
  };

  const colors = getStrokeColors();

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background Ambient Aura Glow (When animated or large size) */}
      {size >= 24 && (
        <div
          className={`absolute inset-0 rounded-full blur-md opacity-35 transition-opacity ${
            animated ? "animate-pulse opacity-60" : ""
          }`}
          style={{
            background: `radial-gradient(circle, ${colors.start} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Main SVG Vector Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="10%"
            y1="10%"
            x2="90%"
            y2="90%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.start} />
            {"mid" in colors && (
              <stop offset="50%" stopColor={(colors as any).mid} />
            )}
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>

          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Hexagonal Context Prism Ring */}
        <motion.path
          d="M50 10 L84.64 30 V70 L50 90 L15.36 70 V30 Z"
          stroke={`url(#${gradientId})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={animated ? { rotate: 0 } : undefined}
          animate={
            animated
              ? { rotate: 360, transition: { duration: 18, repeat: Infinity, ease: "linear" } }
              : undefined
          }
          style={{ transformOrigin: "50px 50px" }}
        />

        {/* Inner Contextual Refraction Node (Infinity Spark Flow) */}
        <motion.path
          d="M36 42 C36 34, 64 34, 64 42 C64 54, 36 50, 36 62 C36 70, 64 70, 64 62"
          stroke={`url(#${gradientId})`}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          filter={`url(#${glowId})`}
          initial={animated ? { pathLength: 0.8, opacity: 0.85 } : undefined}
          animate={
            animated
              ? {
                  pathLength: [0.7, 1, 0.7],
                  opacity: [0.75, 1, 0.75],
                  transition: {
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
              : undefined
          }
        />

        {/* Central Intelligence Node Core */}
        <motion.circle
          cx="50"
          cy="50"
          r="5.5"
          fill={`url(#${gradientId})`}
          animate={
            animated
              ? {
                  scale: [1, 1.25, 1],
                  opacity: [0.8, 1, 0.8],
                  transition: {
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
              : undefined
          }
          style={{ transformOrigin: "50px 50px" }}
        />
      </svg>
    </div>
  );
};
