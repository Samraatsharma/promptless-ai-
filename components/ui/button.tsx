"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "./glass-card";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "primary" | "accent" | "success" | "glass" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-2xl cursor-pointer select-none focus:outline-none disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden";

    const variantStyles = {
      primary:
        "bg-[#4F8DFF] hover:bg-[#3d7eff] text-white shadow-[0_4px_20px_rgba(79,141,255,0.4)] hover:shadow-[0_6px_28px_rgba(79,141,255,0.6)] border border-[#6ea0ff]/30",
      accent:
        "bg-[#8B5CF6] hover:bg-[#7c4def] text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)] hover:shadow-[0_6px_28px_rgba(139,92,246,0.6)] border border-[#a783fa]/30",
      success:
        "bg-[#10B981] hover:bg-[#0da472] text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_28px_rgba(16,185,129,0.6)] border border-[#34d399]/30",
      glass:
        "glass-button text-white shadow-sm hover:shadow-md hover:text-[#4F8DFF]",
      ghost:
        "bg-transparent hover:bg-white/5 text-[#f4f4f5]/80 hover:text-white",
      outline:
        "bg-transparent border border-white/15 hover:border-white/30 text-white hover:bg-white/5",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-2 gap-1.5",
      md: "text-sm px-5 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {/* Subtle top inner highlight */}
        <span className="absolute inset-x-0 top-0 h-[1px] bg-white/25 pointer-events-none" />

        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
