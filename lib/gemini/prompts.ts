import {
  ExtractedPageContext,
  IntentDetectionResult,
  AIActionType,
  AIExecutionResponse,
} from "@/types";

/**
 * Builds system prompt for Intent Classification and Action Card generation.
 */
export function buildIntentDetectionPrompt(
  context: ExtractedPageContext
): string {
  return `
You are Promptless AI, an autonomous browser intelligence agent.
Your goal is to inspect the extracted webpage context and determine the user's intent.
Do not ask for a prompt. Return JSON with this schema:
{
  "platform": "${context.platform}",
  "intentLabel": "string (e.g., Applying for Job OR Learning)",
  "confidenceScore": number between 0 and 100,
  "summary": "1-2 sentence concise explanation of what this page is about",
  "actions": [
    {
      "id": "cover_letter | resume_tailoring | company_research | smart_notes | smart_summary | quiz",
      "title": "Action Title",
      "description": "Short explanation of what will be generated",
      "iconName": "Briefcase | FileText | BookOpen | Award",
      "confidence": number between 80 and 99,
      "badgeText": "High Signal | Instant | ATS Fit"
    }
  ]
}

Extracted Page Data:
${JSON.stringify(context.data, null, 2)}
`;
}

/**
 * Builds system prompt for generating executive structured Markdown for a chosen Action Card.
 */
export function buildActionExecutionPrompt(
  actionType: AIActionType,
  context: ExtractedPageContext,
  customInstructions?: string,
  tone: string = "professional"
): string {
  return `
You are an executive AI assistant generating production-ready structured Markdown for a zero-click browser action.
Action Requested: ${actionType}
Tone Style: ${tone}
${
  customInstructions
    ? `User Background & Custom Instructions: ${customInstructions}`
    : ""
}

Context Data:
${JSON.stringify(context.data, null, 2)}

Instructions:
- Write clean, beautifully formatted Markdown with headers, bold text, bullet points, and high signal-to-noise ratio.
- Do NOT include markdown fences around the entire output if possible, just return pure markdown.
- For cover letters: Write an assertive, executive cover letter tailored to the job description.
- For resume tailoring: Suggest 5 optimized bullet points and ATS keywords to include.
- For smart notes: Organize timestamps, core definitions, and key takeaways hierarchically.
`;
}

/**
 * Deterministic high-fidelity mock response for intent detection when API key is not present.
 */
export function getMockIntentResult(
  context: ExtractedPageContext
): IntentDetectionResult {
  if (context.platform === "linkedin") {
    const job = context.data;
    return {
      platform: "linkedin",
      intentLabel: "Applying for Job",
      confidenceScore: 98,
      summary: `You are viewing the ${job.jobTitle} position at ${job.companyName} in ${job.location}.`,
      actions: [
        {
          id: "cover_letter",
          title: "Generate Cover Letter",
          description: `Handcraft cover letter for ${job.jobTitle} at ${job.companyName}.`,
          iconName: "FileText",
          confidence: 98,
          badgeText: "High Signal",
        },
        {
          id: "resume_tailoring",
          title: "Tailor Resume Bullet Points",
          description:
            "Align skills and keywords with extracted job requirements.",
          iconName: "Briefcase",
          confidence: 96,
          badgeText: "ATS Fit",
        },
        {
          id: "company_research",
          title: "Company Research Brief",
          description: `Summarize mission, culture, and recent news for ${job.companyName}.`,
          iconName: "Search",
          confidence: 92,
          badgeText: "Executive",
        },
      ],
    };
  } else {
    const video = context.data;
    return {
      platform: "youtube",
      intentLabel: "Learning",
      confidenceScore: 96,
      summary: `You are watching "${video.videoTitle}" by ${video.channelName}.`,
      actions: [
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
          iconName: "FileSpreadsheet",
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
      ],
    };
  }
}

/**
 * Deterministic high-fidelity mock response for action execution when API key is not present.
 */
export function getMockActionExecution(
  actionType: AIActionType,
  context: ExtractedPageContext
): AIExecutionResponse {
  if (context.platform === "linkedin") {
    const job = context.data;
    if (actionType === "cover_letter") {
      return {
        success: true,
        actionType,
        title: `Cover Letter — ${job.jobTitle} (${job.companyName})`,
        markdownContent: `## Executive Cover Letter — ${job.jobTitle}

**To:** Hiring Manager at **${job.companyName}**  
**Role:** ${job.jobTitle} (${job.location})

Dear Hiring Team at ${job.companyName},

I am writing to express my enthusiasm for the **${job.jobTitle}** role. Having reviewed your engineering requirements for low-latency web architecture and agentic user interfaces, I am confident that my background in production-grade React, TypeScript, and autonomous AI systems aligns directly with your roadmap.

### Key Value Additions for ${job.companyName}:
* **Predictive Zero-Click UI:** Extensive experience removing chatbot textboxes in favor of contextual DOM comprehension and browser side panels.
* **Performance & Reliability:** Specialized in 60 FPS Framer Motion micro-interactions and secure Manifest V3 architectures.
* **Architectural Rigor:** Committed to writing maintainable, scalable code with full test coverage and clear technical documentation.

I welcome the opportunity to discuss how I can contribute immediately to ${job.companyName}'s engineering goals.

Warm regards,  
**Samraat Sharma**`,
        metadata: {
          company: job.companyName,
          location: job.location,
          url: job.url,
        },
      };
    } else {
      return {
        success: true,
        actionType,
        title: `Tailored Resume — ${job.jobTitle} (${job.companyName})`,
        markdownContent: `## ATS-Optimized Resume Bullet Points — ${job.jobTitle}

* Architected zero-latency web applications using **Next.js 15 App Router** and **TypeScript**, improving page responsiveness by **95%**.
* Designed and deployed Chrome Extension Manifest V3 Side Panels that inspect DOM nodes and surface predictive AI actions.
* Integrated **Google Gemini 2.5 Flash** for real-time intent classification, achieving a **98% confidence score** across production workloads.
* Implemented strict Supabase **Row Level Security (RLS)** triggers to guarantee zero-log data privacy and multi-tenant isolation.`,
        metadata: {
          company: job.companyName,
          location: job.location,
          url: job.url,
        },
      };
    }
  } else {
    const video = context.data;
    if (actionType === "smart_notes") {
      return {
        success: true,
        actionType,
        title: `Smart Notes — ${video.videoTitle}`,
        markdownContent: `## Hierarchical Study Notes — "${video.videoTitle}"

**Channel:** ${video.channelName}  
**Platform:** YouTube Education  

---

### 1. Core Architectural Thesis
* **The Death of the Chatbox:** Asking users to copy web text, switch tabs, and type prompt instructions introduces high friction (~3 minutes/task).
* **Predictive Page Understanding:** By reading the DOM directly, software can determine whether the user is job hunting or learning without an explicit prompt.

### 2. Implementation Strategy
* **Zero-Click Action Cards:** Present no more than 3 tailored suggestions in the Chrome Side Panel.
* **60 FPS Motion Aesthetics:** Use Framer Motion and glassmorphic styling to create an Apple/Linear-inspired user experience.

### 3. Key Takeaway
> "When the browser itself becomes intelligent, AI transforms from an external chatbot into an invisible, collaborative pair engineer."`,
        metadata: {
          channel: video.channelName,
          url: video.url,
        },
      };
    } else {
      return {
        success: true,
        actionType,
        title: `Executive Summary — ${video.videoTitle}`,
        markdownContent: `## 2-Minute Executive Summary — "${video.videoTitle}"

1. **Problem Statement:** Chatbot interfaces are inefficient for repetitive daily web workflows on LinkedIn and YouTube.
2. **Solution:** Promptless AI uses Manifest V3 Side Panels to read DOM context automatically and surface predictive zero-click actions.
3. **Outcome:** Reduces task completion time from 3 minutes to under 3 seconds while maintaining SOC-2 compliant zero-log privacy.`,
        metadata: {
          channel: video.channelName,
          url: video.url,
        },
      };
    }
  }
}
