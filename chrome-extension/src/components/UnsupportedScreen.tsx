import React from "react";
import { Globe, ExternalLink, Play, AlertCircle, Sparkles } from "lucide-react";
import { AICore } from "./AICore";

interface UnsupportedScreenProps {
  currentUrl: string;
  onEnableDemoMode: () => void;
}

export function UnsupportedScreen({
  currentUrl,
  onEnableDemoMode,
}: UnsupportedScreenProps) {
  const openUrl = (url: string) => {
    if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, "_blank");
    }
  };

  const domainDisplay = () => {
    try {
      if (!currentUrl || currentUrl === "") return "Unknown Page";
      if (currentUrl.startsWith("chrome://")) return currentUrl;
      const parsed = new URL(currentUrl);
      return parsed.hostname + parsed.pathname;
    } catch {
      return currentUrl || "Current Web Page";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 space-y-6 animate-in fade-in duration-300">
      {/* JARVIS & Vision Pro Holographic AI Core Visualizer */}
      <AICore
        state="idle"
        size={76}
        label="Standby Mode Active"
        sublabel="Awaiting supported website context"
      />

      <div className="space-y-1.5">
        <h2 className="text-lg font-bold tracking-tight text-white">
          Unsupported Website
        </h2>
        <p className="text-xs text-zinc-400 max-w-[280px] leading-relaxed">
          Promptless AI zero-click intelligence activates automatically on supported domain pipelines.
        </p>
      </div>

      {/* Current Website Badge */}
      <div className="w-full bg-[#121216] border border-zinc-800/80 rounded-xl p-3.5 text-left space-y-1">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-zinc-400" />
          <span>Current Website</span>
        </div>
        <div className="text-xs font-mono text-zinc-200 truncate font-medium">
          {domainDisplay()}
        </div>
      </div>

      {/* Supported Websites Section */}
      <div className="w-full space-y-2.5 text-left">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-1">
          Supported Platforms
        </div>

        {/* LinkedIn Card */}
        <div className="p-3.5 rounded-xl bg-[#121216]/80 border border-zinc-800/80 hover:border-blue-500/50 transition-all flex items-center justify-between group">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
              <span>LinkedIn Jobs</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">
                Active
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">
              Cover letters, tech stack parsing, hiring managers
            </div>
          </div>
          <button
            onClick={() => openUrl("https://www.linkedin.com/jobs")}
            className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors flex items-center gap-1 text-xs font-medium shrink-0"
            title="Open LinkedIn Jobs in new tab"
          >
            <span>Open</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* YouTube Card */}
        <div className="p-3.5 rounded-xl bg-[#121216]/80 border border-zinc-800/80 hover:border-purple-500/50 transition-all flex items-center justify-between group">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
              <span>YouTube Lectures</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-medium">
                Active
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">
              Smart notes, 2-min executive summaries, quizzes
            </div>
          </div>
          <button
            onClick={() => openUrl("https://www.youtube.com")}
            className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-colors flex items-center gap-1 text-xs font-medium shrink-0"
            title="Open YouTube in new tab"
          >
            <span>Open</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Explicit Demo Mode Button */}
      <div className="w-full pt-2 border-t border-zinc-800/60">
        <button
          onClick={onEnableDemoMode}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/30 hover:border-purple-500/60 text-purple-300 hover:text-white transition-all text-xs font-medium flex items-center justify-center gap-2 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Preview in synthetic Demo Mode</span>
        </button>
      </div>
    </div>
  );
}
