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

export function App() {
  const [platform, setPlatform] = useState<
    "linkedin" | "youtube" | "unsupported"
  >("unsupported");
  const [currentUrl, setCurrentUrl] = useState("");
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
  const evaluateUrlContext = (url: string, pageTitle?: string) => {
    setCurrentUrl(url);
    // STATE MANAGEMENT: Immediately reset analysis & active modals on URL/SPA navigation
    setIsAnalyzed(false);
    setSelectedAction(null);

    const result = analyzeContextEngine(url, pageTitle);
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
            evaluateUrlContext(
              message.url,
              message.context?.data?.jobTitle ||
                message.context?.data?.videoTitle
            );
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

  const handleSelectAction = async (actionId: string) => {
    setIsExecuting(true);
    const chosen = actions.find((a) => a.id === actionId);

    // Simulate short Gemini execution delay
    await new Promise((res) => setTimeout(res, 850));

    let mockMarkdown = "";
    let title = chosen?.title || "AI Output";

    if (actionId.includes("cover_letter")) {
      title = `Cover Letter — ${engineResult?.pageType || "Job Application"}`;
      mockMarkdown = `## Executive Cover Letter — Tailored Application

**To:** Hiring Manager / Talent Team  
**Role:** ${engineResult?.summaryText || "Target Engineering Position"}

Dear Hiring Team,

I am writing to express my enthusiastic interest in this opportunity. With experience architecting zero-click browser side panels and high-performance serverless AI applications using **React 19**, **Next.js 16**, and **Google Gemini 2.5 Flash**, my background aligns directly with your technical objectives.

### Core Technical Highlights:
* **Contextual AI Engineering:** Built hierarchical Context Engines that infer intent from live DOM activity with >95% accuracy.
* **Low-Latency Glassmorphic UI:** Engineered Apple/Arc-inspired 60 FPS interfaces.
* **Manifest V3 Side Panels:** Experienced building secure browser extensions with SPA MutationObservers.

I look forward to discussing how my skills can contribute immediately.

Warm regards,  
**Samraat Sharma**`;
    } else if (actionId.includes("resume_tailoring")) {
      title = "ATS-Optimized Resume Keywords & Bullets";
      mockMarkdown = `## ATS-Optimized Resume Alignment

* Engineered a zero-click browser side panel using **Next.js 16 App Router** and **Manifest V3**, reducing developer workflow friction by **98%**.
* Architected a hierarchical Context Engine with **Google Gemini 2.5 Flash**, achieving **97% intent accuracy** across LinkedIn and YouTube DOMs.
* Implemented strict Supabase **Row Level Security (RLS)** triggers to ensure zero-log session privacy and multi-tenant isolation.`;
    } else if (actionId.includes("smart_notes") || actionId.includes("notes")) {
      title = `Smart Notes — ${engineResult?.activity || "YouTube Video"}`;
      mockMarkdown = `## Hierarchical Study Notes — ${engineResult?.summaryText || "Technical Lecture"}

**Source:** YouTube Education / Technical Channel  
**Intent:** ${engineResult?.intent || "Learning"}  

---

### 1. Key Concepts Covered
* **Hierarchical Context Engines:** Why domain-only detection fails and how page-type + activity parsing solves intent accuracy.
* **SPA Navigation Support:** Using MutationObservers to detect URL changes without full page reloads.

### 2. Implementation Checklist
* **3-Tier Confidence System:** Separate scores for Website, Page Type, and User Intent.
* **80% Confidence Guard:** Preventing guessing or hallucinated actions when confidence is below 80%.`;
    } else {
      title = `${chosen?.title || "Executive Summary"} — Promptless AI`;
      mockMarkdown = `## ${chosen?.title || "AI Output Analysis"}

1. **Active Website:** \`${engineResult?.website || "Platform"}\`
2. **Detected Page Type:** \`${engineResult?.pageType || "Page"}\`
3. **User Activity:** \`${engineResult?.activity || "Browsing"}\`
4. **Inferred Intent:** \`${engineResult?.intent || "Content Discovery"}\`
5. **Confidence Matrix:**
   - Website: **${engineResult?.confidence.website || 100}%**
   - Page Type: **${engineResult?.confidence.page || 96}%**
   - User Intent: **${engineResult?.confidence.intent || 92}%**`;
    }

    setSelectedAction({
      id: actionId,
      title,
      badgeText: chosen?.badgeText || "Instant",
      markdownContent: mockMarkdown,
      sourceUrl: currentUrl || "https://promptless-ai.vercel.app",
    });

    setIsExecuting(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col relative w-[420px] overflow-x-hidden">
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

      <main className="flex-1 p-5 space-y-6 overflow-y-auto pb-12">
        {platform === "unsupported" && !isDemoMode ? (
          <UnsupportedScreen
            currentUrl={currentUrl}
            onEnableDemoMode={() => setIsDemoMode(true)}
          />
        ) : (
          <>
            {/* Hierarchical Context Engine Analyzer */}
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
                "Analyzing active page hierarchy and DOM context..."
              }
              onAnalysisComplete={() => setIsAnalyzed(true)}
            />

            {/* Action Cards Section */}
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

      {/* Slide-over Output Screen */}
      <AnimatePresence>
        {selectedAction && (
          <OutputScreen
            title={selectedAction.title}
            actionBadge={selectedAction.badgeText}
            markdownContent={selectedAction.markdownContent}
            sourceUrl={selectedAction.sourceUrl}
            onBack={() => setSelectedAction(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
