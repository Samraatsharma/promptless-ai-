import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playSuccessSound, playClickSound } from "../lib/utils/sound-effects";
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Bookmark,
  RefreshCw,
  Share2,
  Download,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { downloadMarkdownFile } from "../../../lib/utils/download-markdown";

interface OutputScreenProps {
  title: string;
  actionBadge: string;
  markdownContent: string;
  sourceUrl: string;
  isGenerating?: boolean;
  onBack: () => void;
  onRegenerate?: (
    tone: "Professional" | "Casual" | "Executive" | "Direct",
    length: "Concise" | "Detailed" | "In-Depth"
  ) => void;
}

const LOADING_STATES = [
  "Thinking...",
  "Researching...",
  "Reading Context...",
  "Generating...",
  "Finalizing...",
  "Done",
];

export function OutputScreen({
  title,
  actionBadge,
  markdownContent,
  sourceUrl,
  isGenerating = false,
  onBack,
  onRegenerate,
}: OutputScreenProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [shared, setShared] = useState(false);

  // RULE 5: Tone and Length selectors
  const [tone, setTone] = useState<
    "Professional" | "Casual" | "Executive" | "Direct"
  >("Professional");
  const [length, setLength] = useState<"Concise" | "Detailed" | "In-Depth">(
    "Detailed"
  );

  // RULE 6: Animated loading state steps
  const [loadingIndex, setLoadingIndex] = useState(0);

  useEffect(() => {
    if (isGenerating) {
      setLoadingIndex(0);
      const interval = setInterval(() => {
        setLoadingIndex((prev) =>
          prev < LOADING_STATES.length - 2 ? prev + 1 : prev
        );
      }, 350);
      return () => clearInterval(interval);
    } else {
      setLoadingIndex(LOADING_STATES.length - 1);
      playSuccessSound();
    }
  }, [isGenerating]);

  const handleCopy = () => {
    playClickSound();
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = () => {
    playClickSound();
    setBookmarked(!bookmarked);
  };

  const handleShare = () => {
    playClickSound();
    if (navigator.share) {
      navigator.share({
        title,
        text: markdownContent,
        url: sourceUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(sourceUrl);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handleToneChange = (
    newTone: "Professional" | "Casual" | "Executive" | "Direct"
  ) => {
    setTone(newTone);
    if (onRegenerate) onRegenerate(newTone, length);
  };

  const handleLengthChange = (
    newLength: "Concise" | "Detailed" | "In-Depth"
  ) => {
    setLength(newLength);
    if (onRegenerate) onRegenerate(tone, newLength);
  };

  const handleRegenerateClick = () => {
    if (onRegenerate) onRegenerate(tone, length);
  };

  // Basic markdown callout & table rendering helper
  const renderFormattedMarkdown = (raw: string) => {
    const lines = raw.split("\n");
    return lines.map((line, idx) => {
      // GitHub-style Callout Alerts
      if (line.startsWith("> [!TIP]") || line.startsWith("> [!NOTE]") || line.startsWith("> [!IMPORTANT]")) {
        const isTip = line.includes("TIP");
        const isImportant = line.includes("IMPORTANT");
        return (
          <div
            key={idx}
            className={`my-2.5 p-3 rounded-xl border text-xs flex items-start gap-2 ${
              isTip
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                : isImportant
                ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                : "bg-blue-500/10 border-blue-500/30 text-blue-200"
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-medium">{line.replace(/^> \[!.*?\]\s*/, "")}</span>
          </div>
        );
      }
      if (line.startsWith("> ")) {
        return (
          <div
            key={idx}
            className="my-1.5 pl-3 border-l-2 border-blue-500/50 text-xs text-zinc-300 italic"
          >
            {line.replace(/^> \s*/, "")}
          </div>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3
            key={idx}
            className="text-sm font-bold text-white mt-4 mb-2 pb-1 border-b border-white/10"
          >
            {line.replace(/^### \s*/, "")}
          </h3>
        );
      }
      if (line.startsWith("#### ")) {
        return (
          <h4 key={idx} className="text-xs font-bold text-blue-400 mt-3 mb-1">
            {line.replace(/^#### \s*/, "")}
          </h4>
        );
      }
      if (line.startsWith("* ") || line.startsWith("- ")) {
        return (
          <li key={idx} className="ml-4 text-xs text-zinc-300 list-disc my-1">
            {line.replace(/^[\*\-]\s*/, "")}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-4 text-xs text-zinc-300 list-decimal my-1">
            {line.replace(/^\d+\.\s*/, "")}
          </li>
        );
      }
      if (line.startsWith("|") && line.endsWith("|")) {
        return (
          <div
            key={idx}
            className="font-mono text-[11px] text-zinc-300 bg-black/40 px-2 py-1 border-b border-white/5 overflow-x-auto"
          >
            {line}
          </div>
        );
      }
      if (line.trim() === "---") {
        return <hr key={idx} className="my-3 border-white/10" />;
      }
      return (
        <p key={idx} className="text-xs text-zinc-300 my-1.5 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <motion.div
      initial={{ x: 420, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 420, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 bg-[#09090b] z-50 flex flex-col justify-between w-[420px] min-h-screen text-[#f4f4f5]"
    >
      {/* Top Navigation */}
      <div className="h-16 border-b border-white/10 px-4 flex items-center justify-between bg-[#09090b]/90 backdrop-blur-xl shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-[#71717a] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Tone Selector Dropdown/Pill */}
          <select
            value={tone}
            onChange={(e) =>
              handleToneChange(
                e.target.value as
                  | "Professional"
                  | "Casual"
                  | "Executive"
                  | "Direct"
              )
            }
            aria-label="Tone selector"
            title="Select Tone"
            className="bg-white/[0.04] border border-white/10 text-zinc-300 text-[10px] font-semibold rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500"
          >
            <option value="Professional" className="bg-[#09090b]">
              Professional Tone
            </option>
            <option value="Executive" className="bg-[#09090b]">
              Executive Tone
            </option>
            <option value="Casual" className="bg-[#09090b]">
              Casual Tone
            </option>
            <option value="Direct" className="bg-[#09090b]">
              Direct Tone
            </option>
          </select>

          {/* Length Selector Dropdown/Pill */}
          <select
            value={length}
            onChange={(e) =>
              handleLengthChange(
                e.target.value as "Concise" | "Detailed" | "In-Depth"
              )
            }
            aria-label="Length selector"
            title="Select Length"
            className="bg-white/[0.04] border border-white/10 text-zinc-300 text-[10px] font-semibold rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500"
          >
            <option value="Concise" className="bg-[#09090b]">
              Concise
            </option>
            <option value="Detailed" className="bg-[#09090b]">
              Detailed
            </option>
            <option value="In-Depth" className="bg-[#09090b]">
              In-Depth
            </option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {/* Header Block */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight leading-snug">
              {title}
            </h2>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#4F8DFF] hover:underline flex items-center gap-1 mt-0.5 truncate max-w-[280px]"
            >
              <span>{sourceUrl}</span>
              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
            </a>
          </div>

          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#8B5CF6] font-semibold shrink-0">
            {actionBadge}
          </span>
        </div>

        {/* RULE 6: Animated Loading State vs Content */}
        {isGenerating ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
            <div>
              <motion.div
                key={loadingIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-sm font-bold text-white tracking-wide"
              >
                {LOADING_STATES[loadingIndex]}
              </motion.div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Synthesizing contextual intelligence at 60 FPS...
              </p>
            </div>
          </div>
        ) : (
          /* Rendered Premium Consumer Content */
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            {renderFormattedMarkdown(markdownContent)}
          </div>
        )}
      </div>

      {/* RULE 5: Complete Consumer Action Toolbar */}
      <div className="p-4 border-t border-white/10 bg-[#09090b]/90 backdrop-blur-xl shrink-0 space-y-2.5">
        {/* Primary Action Row: Copy & Regenerate */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopy}
            disabled={isGenerating}
            className={`h-9 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md ${
              copied
                ? "bg-[#10B981] text-white shadow-[#10B981]/25"
                : "bg-gradient-to-r from-[#4F8DFF] to-[#8B5CF6] text-white hover:opacity-95 shadow-[#4F8DFF]/25"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Content</span>
              </>
            )}
          </button>

          <button
            onClick={handleRegenerateClick}
            disabled={isGenerating}
            className="h-9 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 font-semibold text-xs text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span>Regenerate</span>
          </button>
        </div>

        {/* Secondary Utility Row: Save, Share, Export MD, Export PDF (Future) */}
        <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-white/5">
          <button
            onClick={handleBookmark}
            title="Save to library"
            className={`py-1.5 rounded-lg border text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${
              bookmarked
                ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                : "bg-white/[0.03] border-white/5 text-zinc-400 hover:text-white"
            }`}
          >
            <Bookmark className="w-3 h-3" />
            <span>{bookmarked ? "Saved" : "Save"}</span>
          </button>

          <button
            onClick={handleShare}
            title="Share content"
            className="py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 text-[11px] font-medium text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-1"
          >
            <Share2 className="w-3 h-3" />
            <span>{shared ? "Copied!" : "Share"}</span>
          </button>

          <button
            onClick={() =>
              downloadMarkdownFile(title, markdownContent)
            }
            title="Export as Markdown (.md)"
            className="py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 text-[11px] font-medium text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-1"
          >
            <Download className="w-3 h-3" />
            <span>.MD</span>
          </button>

          <button
            disabled
            title="PDF Export (Coming in v1.1)"
            className="py-1.5 rounded-lg bg-white/[0.01] border border-white/5 text-[10px] font-medium text-zinc-600 cursor-not-allowed flex items-center justify-center gap-1"
          >
            <FileText className="w-3 h-3" />
            <span>PDF (Soon)</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
