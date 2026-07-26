"use client";

import * as React from "react";
import { cn } from "./glass-card";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "accent" | "success" | "neutral";
  pulse?: boolean;
  children: React.ReactNode;
}

export function Badge({
  className,
  variant = "primary",
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary:
      "bg-[#4F8DFF]/10 text-[#4F8DFF] border border-[#4F8DFF]/30 shadow-[0_0_12px_rgba(79,141,255,0.2)]",
    accent:
      "bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 shadow-[0_0_12px_rgba(139,92,246,0.2)]",
    success:
      "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    neutral:
      "bg-white/5 text-[#f4f4f5]/80 border border-white/10",
  };

  const dotColors = {
    primary: "bg-[#4F8DFF]",
    accent: "bg-[#8B5CF6]",
    success: "bg-[#10B981]",
    neutral: "bg-white/40",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              dotColors[variant]
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              dotColors[variant]
            )}
          />
        </span>
      )}
      {children}
    </div>
  );
}
