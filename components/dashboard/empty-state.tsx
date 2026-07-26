"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, Layers } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChromeIcon } from "@/components/ui/chrome-icon";

interface EmptyStateProps {
  title: string;
  description: string;
  onAction?: () => void;
  actionText?: string;
}

export function DashboardEmptyState({
  title,
  description,
  onAction,
  actionText = "Simulate Extension Activity",
}: EmptyStateProps) {
  return (
    <div className="py-16 px-4">
      <GlassCard
        glowColor="primary"
        className="max-w-2xl mx-auto p-12 text-center space-y-6 relative overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[#4F8DFF]/20 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-[#8B5CF6]/20 blur-[90px] pointer-events-none" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#4F8DFF]/20 to-[#8B5CF6]/20 border border-white/10 flex items-center justify-center mx-auto text-[#4F8DFF] shadow-[0_0_30px_rgba(79,141,255,0.25)]"
        >
          <Layers className="w-8 h-8" />
        </motion.div>

        <div className="space-y-2">
          <Badge variant="primary">Zero-Click Engine Waiting</Badge>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-[#71717a] max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onAction && (
            <Button
              variant="primary"
              size="md"
              onClick={onAction}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              {actionText}
            </Button>
          )}
          <a
            href="#demo"
            className="w-full sm:w-auto"
          >
            <Button
              variant="glass"
              size="md"
              className="w-full sm:w-auto"
              leftIcon={<ChromeIcon className="w-4 h-4 text-[#4F8DFF]" />}
            >
              Open Chrome Side Panel
            </Button>
          </a>
        </div>
      </GlassCard>
    </div>
  );
}
