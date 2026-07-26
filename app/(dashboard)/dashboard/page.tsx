"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  DashboardSidebar,
  DashboardHeader,
  DashboardTab,
  RecentOutputs,
  SavedResults,
  UsageStats,
  ProfileSettings,
} from "@/components/dashboard";
import { GeneratedContentItem } from "@/types";
import { useAuth } from "@/hooks/use-auth";

const INITIAL_MOCK_OUTPUTS: GeneratedContentItem[] = [
  {
    id: "item_1",
    user_id: "usr_mock",
    platform: "linkedin",
    action_type: "cover_letter",
    source_url:
      "https://www.linkedin.com/jobs/view/staff-frontend-engineer-ai-agents",
    title: "Cover Letter — Staff Frontend Engineer at Anthropic",
    content_markdown: `## Executive Cover Letter — Staff Frontend Engineer (Anthropic)

Dear Hiring Manager at Anthropic,

I am writing to express my strong enthusiasm for the Staff Frontend Engineer position in San Francisco. With over 8 years of experience building low-latency, agentic web interfaces using **React 19**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**, I am inspired by your mission to develop reliable, interpretable AI systems.

### Why My Background Aligns With Your Product Vision:
1. **Zero-Click Intent Architectures:** Recently designed and built Promptless AI, an autonomous browser agent that replaces chatbot textboxes with predictive DOM understanding.
2. **High-Frequency Motion UI:** Specialized in 60 FPS spring animations and glassmorphic UI components that communicate AI reasoning states clearly to users.
3. **Manifest V3 Side Panel Integration:** Experience building secure, sandboxed browser extensions that communicate with backend AI models.

I look forward to discussing how my product sense and technical execution can contribute to Anthropic's frontend team.

Warm regards,
Samraat Sharma`,
    metadata_json: { company: "Anthropic", location: "San Francisco, CA" },
    is_saved: true,
    created_at: "2026-07-26T10:15:00Z",
  },
  {
    id: "item_2",
    user_id: "usr_mock",
    platform: "youtube",
    action_type: "smart_notes",
    source_url:
      "https://www.youtube.com/watch?v=advanced-agentic-coding-2026",
    title: "Smart Notes — Building Production-Ready AI Agents in 2026",
    content_markdown: `## Hierarchical Study Notes — Agentic Web Apps (2026)

**Source:** Google DeepMind Engineering Channel (42:18 talk)  
**Detected Intent:** Learning (` + "`96% Confidence`" + `)

---

### Core Architectural Principles
* **Remove Chat Textboxes:** Users should not spend 3 minutes copying and pasting text into ChatGPT.
* **Contextual DOM Scraping:** The browser extension reads ` + "`document.body`" + ` and classifies intent automatically.
* **High-Probability Actions:** Surface at most 3 clear, high-signal action cards (e.g., *Generate Cover Letter*, *Smart Notes*, *Interactive Quiz*).

### Technical Implementation Stack
* **Frontend:** Next.js 15 App Router + Vanilla CSS / Tailwind + Framer Motion.
* **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS) triggers.
* **AI Engine:** Google Gemini 2.5 Flash for zero-latency structured Markdown generation.`,
    metadata_json: { channel: "Google DeepMind", views: "48,290" },
    is_saved: true,
    created_at: "2026-07-25T18:40:00Z",
  },
  {
    id: "item_3",
    user_id: "usr_mock",
    platform: "linkedin",
    action_type: "resume_tailoring",
    source_url:
      "https://www.linkedin.com/jobs/view/principal-ai-engineer-openai",
    title: "Tailored Resume Bullet Points — Principal AI Engineer (OpenAI)",
    content_markdown: `## Optimized ATS Resume Bullets — Principal AI Engineer

* Engineered a zero-click browser side panel using **Next.js 15** and **Manifest V3**, reducing developer workflow friction by **98%**.
* Architected a real-time intent classification pipeline with **Google Gemini 2.5 Flash**, achieving **97.4%** intent accuracy across LinkedIn and YouTube DOMs.
* Implemented strict PostgreSQL **Row Level Security (RLS)** in Supabase to ensure zero-log session privacy and SOC-2 compliant data storage.`,
    metadata_json: { company: "OpenAI", location: "San Francisco, CA" },
    is_saved: false,
    created_at: "2026-07-24T14:20:00Z",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = React.useState<DashboardTab>("outputs");
  const [items, setItems] =
    React.useState<GeneratedContentItem[]>(INITIAL_MOCK_OUTPUTS);

  const handleToggleSave = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_saved: !item.is_saved } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRefresh = () => {
    // Re-sync with sample items for demonstration
    setItems(INITIAL_MOCK_OUTPUTS);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="flex-1 flex">
      {/* Sidebar Navigation */}
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen bg-[#09090b]">
        <DashboardHeader
          activeTab={activeTab}
          userEmail={user?.email || "samraat@founder.ai"}
          onRefresh={handleRefresh}
        />

        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === "outputs" && (
            <RecentOutputs
              items={items}
              onToggleSave={handleToggleSave}
              onDelete={handleDelete}
            />
          )}

          {activeTab === "saved" && (
            <SavedResults
              items={items}
              onToggleSave={handleToggleSave}
              onDelete={handleDelete}
            />
          )}

          {activeTab === "usage" && <UsageStats />}

          {activeTab === "profile" && <ProfileSettings />}

          {activeTab === "settings" && <ProfileSettings />}
        </main>
      </div>
    </div>
  );
}
