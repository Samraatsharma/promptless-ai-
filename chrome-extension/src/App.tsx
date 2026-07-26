import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Globe,
  Loader2,
  RefreshCw,
  Search,
  CheckCircle2,
} from "lucide-react";
import {
  Header,
  Analyzer,
  ActionCards,
  OutputScreen,
  UnsupportedScreen,
  AskPromptless,
  PromptlessLogo,
  ActionCardItem,
} from "./components";
import {
  analyzeContextEngine,
  ContextEngineResult,
} from "./lib/context-engine";
import {
  generateConsumerContent,
  GenerationParams,
} from "./lib/ai-generator";

type PageLifecycleState =
  | "EMPTY"
  | "ANALYZING"
  | "READY"
  | "PAGE_CHANGED"
  | "ANALYZING_AGAIN";

export function App() {
  // PAGE LIFECYCLE STATE MACHINE (Rule 2 & 12: 0 stale state)
  const [lifecycleState, setLifecycleState] =
    useState<PageLifecycleState>("ANALYZING");

  const [platform, setPlatform] = useState<
    "linkedin" | "youtube" | "unsupported"
  >("unsupported");
  const [currentUrl, setCurrentUrl] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);

  const [engineResult, setEngineResult] = useState<ContextEngineResult | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(true);
  const [actions, setActions] = useState<ActionCardItem[]>([]);

  const [selectedAction, setSelectedAction] = useState<{
    id: string;
    title: string;
    badgeText: string;
    markdownContent: string;
    sourceUrl: string;
  } | null>(null);

  const [isExecuting, setIsExecuting] = useState(false);

  // Helper to get domain display name
  const getDomainDisplay = (url: string) => {
    try {
      if (!url) return "New Tab";
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return "Web Page";
    }
  };

  // 1. LIVE CONTEXT SYNCHRONIZATION ORCHESTRATOR
  const evaluateUrlContext = (url: string, title?: string) => {
    // A. Immediately cancel running AI tasks & clear stale state
    setIsExecuting(false);
    setSelectedAction(null);
    setEngineResult(null);
    setActions([]);

    // B. Transition page lifecycle through ANALYZING -> READY
    setLifecycleState((prev) =>
      prev === "READY" ? "PAGE_CHANGED" : "ANALYZING"
    );
    setCurrentUrl(url);
    if (title) setPageTitle(title);

    setTimeout(() => {
      setLifecycleState("ANALYZING_AGAIN");
      const result = analyzeContextEngine(url, title);
      setEngineResult(result);
      setActions(result.actions);

      if (result.website === "LinkedIn") {
        setPlatform("linkedin");
        setIsDemoMode(false);
      } else if (result.website === "YouTube") {
        setPlatform("youtube");
        setIsDemoMode(false);
      } else {
        setPlatform("unsupported");
      }

      setLifecycleState("READY");
    }, 320); // Responsive <500ms sync
  };

  useEffect(() => {
    // 1. Query active tab on initial open
    if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0]?.url || "";
        const title = tabs[0]?.title || "";
        evaluateUrlContext(url, title);
      });

      // 2. Continuous real-time listener for Active Tab, Window, URL, or SPA History changes
      const handleMessage = (message: any) => {
        if (
          message.type === "PAGE_CONTEXT_UPDATED" ||
          message.type === "URL_CHANGED" ||
          message.type === "ACTIVE_TAB_CHANGED"
        ) {
          const newUrl = message.url || "";
          if (newUrl && (newUrl !== currentUrl || message.reset)) {
            const newTitle =
              message.context?.data?.jobTitle ||
              message.context?.data?.videoTitle ||
              message.title ||
              pageTitle;
            evaluateUrlContext(newUrl, newTitle);
          }
        }
      };

      if (chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener(handleMessage);
      }

      return () => {
        if (chrome.runtime && chrome.runtime.onMessage) {
          chrome.runtime.onMessage.removeListener(handleMessage);
        }
      };
    } else {
      // Localhost web preview fallback
      evaluateUrlContext(window.location.href, document.title);
    }
  }, [currentUrl]);

  const generateContentForAction = async (
    actionId: string,
    tone: "Professional" | "Casual" | "Executive" | "Direct" = "Professional",
    length: "Concise" | "Detailed" | "In-Depth" = "Detailed"
  ) => {
    setIsExecuting(true);
    const chosen = actions.find((a) => a.id === actionId);

    // Realistic 60 FPS animated loading steps
    await new Promise((res) => setTimeout(res, 850));

    const content = generateConsumerContent({
      actionId,
      actionTitle: chosen?.title || "AI Output",
      url: currentUrl,
      pageTitle: pageTitle || engineResult?.summaryText,
      tone,
      length,
    });

    setSelectedAction({
      id: actionId,
      title: chosen?.title || "AI Action Result",
      badgeText: chosen?.badgeText || "Instant",
      markdownContent: content,
      sourceUrl: currentUrl || "https://promptless-ai.vercel.app",
    });

    setIsExecuting(false);
  };

  const handleSelectAction = (actionId: string) => {
    generateContentForAction(actionId, "Professional", "Detailed");
  };

  const handleRegenerate = (
    tone: "Professional" | "Casual" | "Executive" | "Direct",
    length: "Concise" | "Detailed" | "In-Depth"
  ) => {
    if (selectedAction) {
      generateContentForAction(selectedAction.id, tone, length);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col relative w-[420px] overflow-x-hidden font-sans select-none">
      {/* EXTENSION UI 3.0: Animated Aurora Background Light */}
      <div className="fixed -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-blue-600/15 via-purple-600/15 to-pink-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed -bottom-24 -right-24 w-72 h-72 bg-gradient-to-tr from-emerald-600/10 via-blue-600/10 to-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <Header
        platform={
          platform === "unsupported" && isDemoMode ? "linkedin" : platform
        }
        isConnected={isConnected}
      />

      {/* Explicit Demo Mode Banner */}
      {platform === "unsupported" && isDemoMode && (
        <div className="bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-blue-500/20 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-[11px] text-amber-300 font-medium shrink-0 z-10">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>⚠️ DEMO MODE — SYNTHETIC PREVIEW DATA</span>
          </div>
          <button
            onClick={() => setIsDemoMode(false)}
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-[10px] underline"
          >
            <span>Exit Demo</span>
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Home Screen Workspace */}
      <main className="flex-1 p-4 space-y-4 overflow-y-auto pb-14 z-10">
        {/* Current Website Badge & Live Sync Status */}
        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-2 min-w-0">
            <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-xs font-semibold text-white truncate">
              {getDomainDisplay(currentUrl)}
            </span>
            <span className="text-[10px] text-zinc-500 truncate max-w-[140px]">
              {pageTitle ? `• ${pageTitle}` : ""}
            </span>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE SYNC
          </span>
        </div>

        {/* LIFECYCLE GATE: Empty / Analyzing vs Ready */}
        {lifecycleState !== "READY" &&
        lifecycleState !== "EMPTY" &&
        !isDemoMode ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-14 flex flex-col items-center justify-center text-center space-y-3"
          >
            <PromptlessLogo size={56} variant="gradient" animated={true} />
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Analyzing current page...
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Extracting context & synthesizing zero-click actions
              </p>
            </div>
          </motion.div>
        ) : platform === "unsupported" && !isDemoMode ? (
          /* Unsupported Domain Protection */
          <UnsupportedScreen
            currentUrl={currentUrl}
            onEnableDemoMode={() => setIsDemoMode(true)}
          />
        ) : (
          /* SUPPORTED DOMAIN WORKSPACE (Arc / Raycast / Linear aesthetic) */
          <>
            {/* 1. Consumer Hero Banner (Rule 1: Internal reasoning hidden) */}
            <Analyzer
              platform={
                platform === "unsupported" && isDemoMode
                  ? "linkedin"
                  : platform
              }
              intentLabel={
                engineResult?.intent ||
                (platform === "youtube" ? "Learning" : "Applying for Job")
              }
              confidenceScore={engineResult?.confidence.intent || 96}
              confidenceScores={engineResult?.confidence}
              summary={
                engineResult?.summaryText ||
                "Contextual browser intelligence active"
              }
              onAnalysisComplete={() => {}}
            />

            {/* 2. Primary Experience: Zero-Click Action Cards */}
            <ActionCards
              actions={actions}
              onSelectAction={handleSelectAction}
              isExecuting={isExecuting}
            />

            {/* 3. Secondary Experience: Ask Promptless Custom AI Assistant with Voice */}
            <div className="pt-2">
              <AskPromptless
                platform={
                  platform === "unsupported" && isDemoMode
                    ? "linkedin"
                    : platform
                }
                pageTitle={pageTitle || "Current Web Page"}
                url={currentUrl}
                onSelectSuggestedAction={(actionTitle) => {
                  const match = actions.find(
                    (a) =>
                      a.title
                        .toLowerCase()
                        .includes(actionTitle.toLowerCase()) ||
                      actionTitle
                        .toLowerCase()
                        .includes(a.title.toLowerCase())
                  );
                  if (match) {
                    handleSelectAction(match.id);
                  } else if (actions[0]) {
                    handleSelectAction(actions[0].id);
                  }
                }}
              />
            </div>
          </>
        )}
      </main>

      {/* Premium Apple-Grade Slide-over Output Screen */}
      <AnimatePresence>
        {selectedAction && (
          <OutputScreen
            title={selectedAction.title}
            actionBadge={selectedAction.badgeText}
            markdownContent={selectedAction.markdownContent}
            sourceUrl={selectedAction.sourceUrl}
            isGenerating={isExecuting}
            onBack={() => setSelectedAction(null)}
            onRegenerate={handleRegenerate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
