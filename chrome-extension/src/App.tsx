/**
 * Promptless AI — App.tsx
 * Premium AI Launch Experience Orchestrator
 *
 * Launch state machine:
 *   SPLASH → SCANNING → READY (or UNSUPPORTED)
 *
 * All existing AI/backend logic is untouched.
 * Only the visual launch experience and presentation layer is redesigned.
 */
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Globe } from "lucide-react";
import {
  Header,
  Analyzer,
  ActionCards,
  OutputScreen,
  UnsupportedScreen,
  AskPromptless,
  PromptlessLogo,
  AICore,
  AuroraCanvas,
  SplashScreen,
  ScanningScreen,
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
import { playSuccessSound } from "./lib/utils/sound-effects";

// ─── Launch State Machine ─────────────────────────────────────────────────────
// SPLASH    → 1.8s premium welcome screen
// SCANNING  → contextual AI analysis animation (2–3s)
// READY     → main workspace
// UNSUPPORTED → unsupported page screen

type LaunchPhase = "SPLASH" | "SCANNING" | "READY" | "UNSUPPORTED" | "RESCANNING";

type PageLifecycleState =
  | "EMPTY"
  | "ANALYZING"
  | "READY"
  | "PAGE_CHANGED"
  | "ANALYZING_AGAIN";

// ─── App ──────────────────────────────────────────────────────────────────────

export function App() {
  // ── Launch phase (controls the opening experience) ──
  const [launchPhase, setLaunchPhase] = useState<LaunchPhase>("SPLASH");

  // ── Page context ──
  const [lifecycleState, setLifecycleState] =
    useState<PageLifecycleState>("ANALYZING");

  const [platform, setPlatform] = useState<
    "linkedin" | "youtube" | "unsupported" | "unknown"
  >("unknown");
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

  // ─── Domain display helper ───────────────────────────────────────────────────

  const getDomainDisplay = (url: string) => {
    try {
      if (!url) return "New Tab";
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return "Web Page";
    }
  };

  // ─── Context engine orchestrator ─────────────────────────────────────────────

  const evaluateUrlContext = useCallback((url: string, title?: string) => {
    // Cancel running AI tasks & clear stale state
    setIsExecuting(false);
    setSelectedAction(null);
    setEngineResult(null);
    setActions([]);

    // Lifecycle transition
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
    }, 320);
  }, []);

  // ─── Chrome runtime listener ─────────────────────────────────────────────────

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0]?.url || "";
        const title = tabs[0]?.title || "";
        evaluateUrlContext(url, title);
      });

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
            // Trigger re-scan experience on tab switch
            setLaunchPhase("RESCANNING");
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
      evaluateUrlContext(window.location.href, document.title);
    }
  }, [currentUrl]);

  // ─── When scanning animation completes → advance to ready/unsupported ────────

  const handleScanComplete = useCallback(() => {
    const nextPhase =
      platform === "unsupported" && !isDemoMode ? "UNSUPPORTED" : "READY";
    setLaunchPhase(nextPhase);
    if (nextPhase === "READY") playSuccessSound();
  }, [platform, isDemoMode]);

  // If platform resolves to unsupported while in READY, switch to UNSUPPORTED
  useEffect(() => {
    if (
      launchPhase === "READY" &&
      platform === "unsupported" &&
      !isDemoMode
    ) {
      setLaunchPhase("UNSUPPORTED");
    }
    if (
      (launchPhase === "UNSUPPORTED" || launchPhase === "READY") &&
      platform !== "unsupported"
    ) {
      // Supported page loaded
    }
  }, [platform, isDemoMode]);

  // ─── AI content generation ───────────────────────────────────────────────────

  const generateContentForAction = async (
    actionId: string,
    tone: "Professional" | "Casual" | "Executive" | "Direct" = "Professional",
    length: "Concise" | "Detailed" | "In-Depth" = "Detailed"
  ) => {
    setIsExecuting(true);
    const chosen = actions.find((a) => a.id === actionId);

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

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col relative w-[420px] overflow-x-hidden font-sans select-none">
      {/* ── Always-on cinematic aurora background ── */}
      <AuroraCanvas platform={platform === "unknown" ? "unsupported" : platform} />

      {/* ═══════════════════════════════════════════════════════
          LAUNCH PHASE 1 — SPLASH SCREEN
          1.8s premium welcome; overlays everything
      ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {launchPhase === "SPLASH" && (
          <SplashScreen
            duration={1700}
            onComplete={() => setLaunchPhase("SCANNING")}
          />
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
          LAUNCH PHASE 2 — CONTEXTUAL AI SCANNING SCREEN
          Shows contextual messages while the engine runs
      ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {(launchPhase === "SCANNING" || launchPhase === "RESCANNING") && (
          <ScanningScreen
            platform={platform}
            domain={getDomainDisplay(currentUrl)}
            pageTitle={pageTitle}
            stepDuration={380}
            onComplete={handleScanComplete}
          />
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
          LAUNCH PHASE 3 — MAIN WORKSPACE
          Only visible once scanning is complete
      ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {(launchPhase === "READY" ||
          launchPhase === "UNSUPPORTED" ||
          isDemoMode) && (
          <motion.div
            key="main-workspace"
            className="flex flex-col min-h-screen"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top Header */}
            <Header
              platform={
                platform === "unsupported" && isDemoMode
                  ? "linkedin"
                  : (platform as any)
              }
              isConnected={isConnected}
            />

            {/* Demo Mode Banner */}
            {platform === "unsupported" && isDemoMode && (
              <div className="bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-blue-500/20 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-[11px] text-amber-300 font-medium shrink-0 z-10">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>⚠️ DEMO MODE — SYNTHETIC PREVIEW DATA</span>
                </div>
                <button
                  onClick={() => {
                    setIsDemoMode(false);
                    setLaunchPhase("UNSUPPORTED");
                  }}
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-[10px] underline"
                >
                  <span>Exit Demo</span>
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Main Home Screen Workspace */}
            <main className="flex-1 p-4 space-y-4 overflow-y-auto pb-14 z-10">

              {/* ── Live sync badge ── */}
              <motion.div
                className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-xl"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
              >
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
              </motion.div>

              {/* ── UNSUPPORTED PAGE ── */}
              {launchPhase === "UNSUPPORTED" && !isDemoMode ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <UnsupportedScreen
                    currentUrl={currentUrl}
                    onEnableDemoMode={() => {
                      setIsDemoMode(true);
                      setLaunchPhase("READY");
                    }}
                  />
                </motion.div>
              ) : (
                /* ── SUPPORTED / DEMO WORKSPACE ── */
                <>
                  {/* 0. Holographic AI Core (compact, in workspace) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                  >
                    <AICore
                      state={isExecuting ? "generating" : "idle"}
                      size={60}
                      label={
                        isExecuting
                          ? "Generating Action Output..."
                          : "AI Operating System Online"
                      }
                      sublabel={
                        isExecuting
                          ? "Synthesizing verified high-signal response"
                          : "Zero-click context intelligence ready"
                      }
                      className="py-1"
                    />
                  </motion.div>

                  {/* 1. Context Analyzer Hero Banner */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.4 }}
                  >
                    <Analyzer
                      platform={
                        platform === "unsupported" && isDemoMode
                          ? "linkedin"
                          : (platform as any)
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
                  </motion.div>

                  {/* 2. Zero-Click Action Cards */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <ActionCards
                      actions={actions}
                      onSelectAction={handleSelectAction}
                      isExecuting={isExecuting}
                    />
                  </motion.div>

                  {/* 3. Ask Promptless AI Chat */}
                  <motion.div
                    className="pt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38, duration: 0.4 }}
                  >
                    <AskPromptless
                      platform={
                        platform === "unsupported" && isDemoMode
                          ? "linkedin"
                          : (platform as any)
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
                  </motion.div>
                </>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
          OUTPUT SCREEN — Apple-Grade slide-over panel
          Available regardless of launch phase
      ═══════════════════════════════════════════════════════ */}
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
