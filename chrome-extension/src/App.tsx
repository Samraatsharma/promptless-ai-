import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import {
  Header,
  Analyzer,
  ActionCards,
  OutputScreen,
  UnsupportedScreen,
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

export function App() {
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
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [actions, setActions] = useState<ActionCardItem[]>([]);

  const [selectedAction, setSelectedAction] = useState<{
    id: string;
    title: string;
    badgeText: string;
    markdownContent: string;
    sourceUrl: string;
  } | null>(null);

  const [isExecuting, setIsExecuting] = useState(false);

  // Helper to run hierarchical Context Engine & reset state
  const evaluateUrlContext = (url: string, title?: string) => {
    setCurrentUrl(url);
    if (title) setPageTitle(title);

    // STATE MANAGEMENT: Immediately reset analysis & active modals on URL/SPA navigation
    setIsAnalyzed(false);
    setSelectedAction(null);

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
  };

  useEffect(() => {
    // 1. Check active tab URL on initial load
    if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0]?.url || "";
        const title = tabs[0]?.title || "";
        evaluateUrlContext(url, title);
      });

      // 2. Listen for SPA Navigation & tab updates from content script / background worker
      const handleMessage = (message: any) => {
        if (
          message.type === "PAGE_CONTEXT_UPDATED" ||
          message.type === "URL_CHANGED"
        ) {
          if (message.url && message.url !== currentUrl) {
            const title =
              message.context?.data?.jobTitle ||
              message.context?.data?.videoTitle ||
              pageTitle;
            evaluateUrlContext(message.url, title);
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
      // Localhost / Web testing environment fallback
      const url = window.location.href;
      evaluateUrlContext(url, document.title);
    }
  }, [currentUrl]);

  const generateContentForAction = async (
    actionId: string,
    tone: "Professional" | "Casual" | "Executive" | "Direct" = "Professional",
    length: "Concise" | "Detailed" | "In-Depth" = "Detailed"
  ) => {
    setIsExecuting(true);
    const chosen = actions.find((a) => a.id === actionId);

    // Simulate realistic 60 FPS Apple-grade generating steps
    await new Promise((res) => setTimeout(res, 900));

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
      <Header
        platform={
          platform === "unsupported" && isDemoMode ? "linkedin" : platform
        }
        isConnected={isConnected}
      />

      {/* Explicit Demo Mode Banner */}
      {platform === "unsupported" && isDemoMode && (
        <div className="bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-blue-500/20 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-[11px] text-amber-300 font-medium shrink-0">
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

      <main className="flex-1 p-5 space-y-5 overflow-y-auto pb-12">
        {platform === "unsupported" && !isDemoMode ? (
          <UnsupportedScreen
            currentUrl={currentUrl}
            onEnableDemoMode={() => setIsDemoMode(true)}
          />
        ) : (
          <>
            {/* Consumer Hero Banner (Internal AI Reasoning Hidden by Default) */}
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
              onAnalysisComplete={() => setIsAnalyzed(true)}
            />

            {/* Linear/Raycast Action Cards */}
            {isAnalyzed && (
              <ActionCards
                actions={actions}
                onSelectAction={handleSelectAction}
                isExecuting={isExecuting}
              />
            )}
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
