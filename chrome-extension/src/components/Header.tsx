import React, { useState } from "react";
import { Sparkles, Volume2, VolumeX } from "lucide-react";
import { PromptlessLogo } from "./PromptlessLogo";
import {
  isSoundEnabled,
  setSoundEnabled,
  playClickSound,
} from "../lib/utils/sound-effects";

interface HeaderProps {
  platform: "linkedin" | "youtube" | "unsupported" | "unknown";
  isConnected: boolean;
}

export function Header({ platform, isConnected }: HeaderProps) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundEnabled(nextState);
    setSoundOn(nextState);
    if (nextState) {
      playClickSound();
    }
  };

  const getBadgeText = () => {
    switch (platform) {
      case "linkedin":
        return "LinkedIn Page Active";
      case "youtube":
        return "YouTube Page Active";
      case "unsupported":
        return "Unsupported Domain";
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
        <PromptlessLogo size={32} variant="gradient" />
        <div>
          <span className="font-bold text-sm tracking-tight text-white block">
            Promptless<span className="text-[#4F8DFF]">AI</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[#71717a] block">
            Manifest V3 Side Panel
          </span>
        </div>
      </div>

      {/* Domain Badge, Sound Toggle & Status */}
      <div className="flex items-center gap-2">
        {/* Futuristic Audio HUD Toggle */}
        <button
          onClick={handleToggleSound}
          title={soundOn ? "Mute Sci-Fi HUD Audio" : "Enable Sci-Fi HUD Audio"}
          className={`p-1.5 rounded-lg border transition-colors ${
            soundOn
              ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400"
              : "bg-white/5 border-white/10 text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {soundOn ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
        </button>

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
