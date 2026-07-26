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

const DEFAULT_LINKEDIN_ACTIONS: ActionCardItem[] = [
  {
    id: "cover_letter",
    title: "Generate Cover Letter",
    description:
      "Handcraft executive cover letter tailored to this role and company.",
    iconName: "FileText",
    confidence: 98,
    badgeText: "High Signal",
  },
  {
    id: "resume_tailoring",
    title: "Tailor Resume Bullet Points",
    description: "Align skills and ATS keywords with extracted job requirements.",
    iconName: "Briefcase",
    confidence: 96,
    badgeText: "ATS Fit",
  },
  {
    id: "company_research",
    title: "Company Research Brief",
    description: "Summarize mission, culture, and news for this organization.",
    iconName: "Search",
    confidence: 92,
    badgeText: "Executive",
  },
];

const DEFAULT_YOUTUBE_ACTIONS: ActionCardItem[] = [
  {
    id: "smart_notes",
    title: "Generate Smart Notes",
    description:
      "Hierarchical study notes with timestamps and key definitions.",
    iconName: "BookOpen",
    confidence: 97,
    badgeText: "Instant",
  },
  {
    id: "smart_summary",
    title: "2-Minute Executive Summary",
    description: "Distill the presenter's thesis into 5 core takeaways.",
    iconName: "FileText",
    confidence: 94,
    badgeText: "High Signal",
  },
  {
    id: "quiz",
    title: "Interactive Flashcard Quiz",
    description: "Test retention with 5 instant Q&A practice pairs.",
    iconName: "Award",
    confidence: 91,
    badgeText: "Spaced Rep",
  },
];

export function App() {
  const [platform, setPlatform] = useState<
    "linkedin" | "youtube" | "unsupported"
  >("unsupported");
  const [currentUrl, setCurrentUrl] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);

  const [isConnected, setIsConnected] = useState(true);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [actions, setActions] = useState<ActionCardItem[]>(
    DEFAULT_LINKEDIN_ACTIONS
  );

  const [selectedAction, setSelectedAction] = useState<{
    id: string;
    title: string;
    badgeText: string;
    markdownContent: string;
    sourceUrl: string;
  } | null>(null);

  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    // Determine platform from active tab if chrome.tabs is available
    if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0]?.url || "";
        setCurrentUrl(url);
        if (url.includes("linkedin.com")) {
          setPlatform("linkedin");
          setActions(DEFAULT_LINKEDIN_ACTIONS);
          setIsDemoMode(false);
        } else if (url.includes("youtube.com")) {
          setPlatform("youtube");
          setActions(DEFAULT_YOUTUBE_ACTIONS);
          setIsDemoMode(false);
        } else {
          setPlatform("unsupported");
        }
      });
    } else {
      // If outside extension context (e.g. localhost testing), check window.location
      const url = window.location.href;
      setCurrentUrl(url);
      if (url.includes("linkedin.com")) {
        setPlatform("linkedin");
        setActions(DEFAULT_LINKEDIN_ACTIONS);
      } else if (url.includes("youtube.com")) {
        setPlatform("youtube");
        setActions(DEFAULT_YOUTUBE_ACTIONS);
      } else {
        setPlatform("unsupported");
      }
    }
  }, []);

  const handleSelectAction = async (actionId: string) => {
    setIsExecuting(true);
    const chosen = actions.find((a) => a.id === actionId);

    // Simulate short Gemini execution delay
    await new Promise((res) => setTimeout(res, 900));

    let mockMarkdown = "";
    let title = chosen?.title || "AI Output";

    if (actionId === "cover_letter") {
      title = "Cover Letter — Staff Frontend Engineer (Anthropic)";
      mockMarkdown = `## Executive Cover Letter — Staff Frontend Engineer

**To:** Hiring Team at **Anthropic**  
**Role:** Staff Frontend Engineer (San Francisco, CA)

Dear Hiring Manager at Anthropic,

I am writing to express my strong enthusiasm for the Staff Frontend Engineer role. Having engineered low-latency, agentic web interfaces using **React 19**, **TypeScript**, and **Framer Motion**, I am inspired by your mission to build interpretable, high-signal AI systems.

### Key Technical Contributions You Can Expect:
* **Zero-Click Intent Architectures:** Demonstrated expertise replacing chat textboxes with contextual DOM comprehension and browser side panels.
* **60 FPS High-Frequency UI:** Skilled in Apple/Linear-inspired glassmorphism and motion transitions that clearly communicate AI reasoning states.
* **Manifest V3 Side Panels:** Proven track record deploying secure, sandboxed browser extensions.

I welcome the opportunity to discuss how my frontend architecture can contribute to Anthropic immediately.

Warm regards,  
**Samraat Sharma**`;
    } else if (actionId === "resume_tailoring") {
      title = "Tailored ATS Resume — Staff Frontend Engineer";
      mockMarkdown = `## ATS-Optimized Resume Bullet Points

* Engineered a zero-click browser side panel using **Next.js 16 App Router** and **Manifest V3**, reducing developer workflow friction by **98%**.
* Architected a real-time intent classification pipeline with **Google Gemini 2.5 Flash**, achieving **97.4% intent accuracy** across LinkedIn and YouTube DOMs.
* Implemented strict Supabase **Row Level Security (RLS)** triggers to ensure zero-log session privacy and multi-tenant isolation.`;
    } else if (actionId === "smart_notes") {
      title = "Smart Notes — Agentic Web Apps in 2026";
      mockMarkdown = `## Hierarchical Study Notes — "Building Agentic Web Apps in 2026"

**Source:** Google DeepMind Engineering Channel  
**Platform:** YouTube Education  

---

### 1. The End of the Chatbox
* **Problem:** Asking users to copy web text, switch tabs, and type prompt instructions introduces high friction (~3 minutes/task).
* **Solution:** Predictive DOM understanding allows software to determine user intent automatically without text boxes.

### 2. Implementation Principles
* **3-Card Maximum:** Surface no more than 3 clear, high-signal suggestions in the Side Panel.
* **60 FPS Motion:** Use Framer Motion and glassmorphic styling for a premium user experience.`;
    } else {
      title = "Executive Summary — Agentic Web Apps";
      mockMarkdown = `## 2-Minute Executive Summary

1. **Thesis:** Chatbot textboxes are inefficient for repetitive web workflows on LinkedIn and YouTube.
2. **Architecture:** Promptless AI uses Manifest V3 Side Panels to read DOM context automatically and surface predictive zero-click actions.
3. **Impact:** Reduces task completion time from 3 minutes to under 3 seconds while maintaining SOC-2 compliant zero-log privacy.`;
    }

    setSelectedAction({
      id: actionId,
      title,
      badgeText: chosen?.badgeText || "Instant",
      markdownContent: mockMarkdown,
      sourceUrl:
        platform === "youtube"
          ? "https://www.youtube.com/watch?v=agentic-web-2026"
          : "https://www.linkedin.com/jobs/view/staff-frontend-engineer",
    });

    setIsExecuting(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col relative w-[420px] overflow-x-hidden">
      <Header
        platform={platform === "unsupported" && isDemoMode ? "linkedin" : platform}
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
            {/* Intent Analyzer Section */}
            <Analyzer
              platform={
                platform === "unsupported" && isDemoMode
                  ? "linkedin"
                  : platform
              }
              intentLabel={
                platform === "youtube" ? "Learning" : "Applying for Job"
              }
              confidenceScore={platform === "youtube" ? 96 : 98}
              summary={
                platform === "youtube"
                  ? 'You are watching "Building Production-Ready Agentic Web Apps in 2026" by Google DeepMind.'
                  : "You are viewing a Staff Frontend Engineer position at Anthropic in San Francisco, CA."
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
