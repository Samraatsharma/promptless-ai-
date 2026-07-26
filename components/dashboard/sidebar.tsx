"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  LayoutGrid,
  Bookmark,
  BarChart2,
  User,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { ChromeIcon } from "@/components/ui/chrome-icon";

export type DashboardTab =
  | "outputs"
  | "saved"
  | "usage"
  | "profile"
  | "settings";

interface SidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onSignOut: () => void;
}

export function DashboardSidebar({
  activeTab,
  onTabChange,
  onSignOut,
}: SidebarProps) {
  const navItems: {
    id: DashboardTab;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "outputs",
      label: "Recent Outputs",
      icon: <LayoutGrid className="w-4 h-4" />,
    },
    {
      id: "saved",
      label: "Saved Results",
      icon: <Bookmark className="w-4 h-4" />,
    },
    {
      id: "usage",
      label: "Usage Analytics",
      icon: <BarChart2 className="w-4 h-4" />,
    },
    { id: "profile", label: "User Profile", icon: <User className="w-4 h-4" /> },
    {
      id: "settings",
      label: "AI Preferences",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 border-r border-white/8 bg-[#09090b] flex flex-col justify-between shrink-0 min-h-screen">
      {/* Brand & Nav */}
      <div>
        <div className="h-20 px-6 flex items-center border-b border-white/8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4F8DFF] to-[#8B5CF6] p-0.5 shadow-[0_0_15px_rgba(79,141,255,0.3)]">
              <div className="w-full h-full bg-[#09090b] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#4F8DFF]" />
              </div>
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block">
                Promptless<span className="text-[#4F8DFF]">AI</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#71717a] block">
                SaaS Dashboard
              </span>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#4F8DFF]/15 text-[#4F8DFF] border border-[#4F8DFF]/30 shadow-[0_0_20px_rgba(79,141,255,0.15)]"
                    : "text-[#71717a] hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Extension Banner & Sign Out */}
      <div className="p-4 space-y-3 border-t border-white/8">
        <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#4F8DFF]/10 to-[#8B5CF6]/10 border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ChromeIcon className="w-3.5 h-3.5 text-[#4F8DFF]" />
              Chrome Extension
            </span>
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          </div>
          <p className="text-[11px] text-[#71717a] leading-relaxed">
            Manifest V3 Side Panel active on LinkedIn Jobs & YouTube videos.
          </p>
          <Link
            href="/#demo"
            className="text-xs text-[#4F8DFF] font-semibold hover:underline flex items-center gap-1"
          >
            <span>Test Browser Simulation</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#71717a] hover:text-[#ff5f56] hover:bg-white/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
