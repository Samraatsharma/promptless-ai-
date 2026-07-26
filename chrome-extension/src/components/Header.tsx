import React from "react";
import { Sparkles } from "lucide-react";

interface HeaderProps {
  platform: "linkedin" | "youtube" | "unknown";
  isConnected: boolean;
}

export function Header({ platform, isConnected }: HeaderProps) {
  const getBadgeText = () => {
    switch (platform) {
      case "linkedin":
        return "LinkedIn Job Detected";
      case "youtube":
        return "YouTube Video Detected";
      default:
        return "Waiting for Page...";
    }
  };

  const getBadgeColor = () => {
    switch (platform) {
      case "linkedin":
        return "bg-[#4F8DFF]/20 border-[#4F8DFF]/40 text-[#4F8DFF]";
      case "youtube":
        return "bg-[#8B5CF6]/20 border-[#8B5CF6]/40 text-[#8B5CF6]";
      default:
        return "bg-white/10 border-white/20 text-[#71717a]";
    }
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[#09090b]/90 backdrop-blur-xl px-5 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Logo & Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4F8DFF] to-[#8B5CF6] p-0.5 shadow-[0_0_15px_rgba(79,141,255,0.3)]">
          <div className="w-full h-full bg-[#09090b] rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#4F8DFF]" />
          </div>
        </div>
        <div>
          <span className="font-bold text-sm tracking-tight text-white block">
            Promptless<span className="text-[#4F8DFF]">AI</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[#71717a] block">
            Manifest V3 Side Panel
          </span>
        </div>
      </div>

      {/* Domain Badge & Status */}
      <div className="flex items-center gap-2">
        <div
          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 ${getBadgeColor()}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isConnected ? "bg-[#10B981] animate-pulse" : "bg-[#71717a]"
            }`}
          />
          <span>{getBadgeText()}</span>
        </div>
      </div>
    </header>
  );
}
