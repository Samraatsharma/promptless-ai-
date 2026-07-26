"use client";

import * as React from "react";
import { Shield, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardTab } from "./sidebar";

interface HeaderProps {
  activeTab: DashboardTab;
  userEmail?: string | null;
  onRefresh: () => void;
}

export function DashboardHeader({
  activeTab,
  userEmail,
  onRefresh,
}: HeaderProps) {
  const getTabTitle = (tab: DashboardTab): { title: string; desc: string } => {
    switch (tab) {
      case "outputs":
        return {
          title: "Recent AI Outputs",
          desc: "Content automatically generated from your LinkedIn and YouTube browsing sessions.",
        };
      case "saved":
        return {
          title: "Saved Results",
          desc: "Bookmarked cover letters, resumes, and study notes.",
        };
      case "usage":
        return {
          title: "Usage & Productivity Impact",
          desc: "Analytics on hours saved, zero-click actions triggered, and confidence scores.",
        };
      case "profile":
        return {
          title: "User Identity & Session",
          desc: "Manage authentication, workspace membership, and privacy settings.",
        };
      case "settings":
        return {
          title: "AI Preferences & Model Settings",
          desc: "Configure Google Gemini tone, custom instructions, and output formatting.",
        };
    }
  };

  const { title, desc } = getTabTitle(activeTab);

  return (
    <header className="h-20 border-b border-white/8 bg-[#09090b]/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-40">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-white tracking-tight">
            {title}
          </h1>
          <Badge variant="primary" pulse>
            Live Sync
          </Badge>
        </div>
        <p className="text-xs text-[#71717a] mt-0.5">{desc}</p>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh
        </Button>

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <div className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-xs font-mono text-[#f4f4f5]/90">
            {userEmail || "samraat@founder.ai"}
          </span>
          <Shield className="w-3.5 h-3.5 text-[#4F8DFF]" />
        </div>
      </div>
    </header>
  );
}
