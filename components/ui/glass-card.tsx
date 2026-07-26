"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glowColor?: "primary" | "accent" | "success" | "neutral" | "none";
  interactive?: boolean;
}

export function GlassCard({
  children,
  className,
  glowColor = "none",
  interactive = true,
  ...props
}: GlassCardProps) {
  const glowStyles = {
    primary: "hover:border-[#4F8DFF]/40 hover:shadow-[0_12px_40px_0_rgba(79,141,255,0.15)]",
    accent: "hover:border-[#8B5CF6]/40 hover:shadow-[0_12px_40px_0_rgba(139,92,246,0.15)]",
    success: "hover:border-[#10B981]/40 hover:shadow-[0_12px_40px_0_rgba(16,185,129,0.15)]",
    neutral: "hover:border-white/20 hover:shadow-[0_12px_40px_0_rgba(255,255,255,0.05)]",
    none: "hover:border-white/15",
  };

  return (
    <motion.div
      whileHover={interactive ? { y: -3, scale: 1.006 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "glass-card rounded-[24px] p-6 text-[#f4f4f5] relative overflow-hidden",
        interactive && glowStyles[glowColor],
        className
      )}
      {...props}
    >
      {/* Subtle top border reflection */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}
