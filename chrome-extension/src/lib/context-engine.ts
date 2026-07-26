// Hierarchical Context Engine for Promptless AI
// Enforces Website -> Page Type -> Context -> User Activity -> Intent -> Dynamic Actions
// NEVER uses mock fallback job information, NEVER guesses below 80% confidence, NEVER reuses stale state.

export interface ActionCardItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  confidence: number;
  badgeText: string;
}

export interface ConfidenceScores {
  website: number;
  page: number;
  intent: number;
}

export interface ContextEngineResult {
  website: "LinkedIn" | "YouTube" | "GitHub" | "Notion" | "Gmail" | "Google Docs" | "Unsupported";
  pageType: string;
  activity: string;
  intent: string;
  confidence: ConfidenceScores;
  summaryText: string;
  isConfident: boolean; // true if intent confidence >= 80%
  actions: ActionCardItem[];
  unsupportedReason?: string;
}

/**
 * Step 1: Detect Website from URL string
 */
export function detectWebsite(url: string): {
  website: ContextEngineResult["website"];
  confidence: number;
} {
  if (!url) return { website: "Unsupported", confidence: 0 };
  const lower = url.toLowerCase();

  if (lower.includes("linkedin.com")) {
    return { website: "LinkedIn", confidence: 100 };
  }
  if (lower.includes("youtube.com")) {
    return { website: "YouTube", confidence: 100 };
  }
  if (lower.includes("github.com")) {
    return { website: "GitHub", confidence: 95 };
  }
  if (lower.includes("notion.so") || lower.includes("notion.site")) {
    return { website: "Notion", confidence: 95 };
  }
  if (lower.includes("mail.google.com")) {
    return { website: "Gmail", confidence: 95 };
  }
  if (lower.includes("docs.google.com")) {
    return { website: "Google Docs", confidence: 95 };
  }

  return { website: "Unsupported", confidence: 0 };
}

/**
 * Step 2: Detect Page Type based on URL structure and path
 */
export function detectPageType(url: string, website: ContextEngineResult["website"]): {
  pageType: string;
  confidence: number;
} {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();

    if (website === "LinkedIn") {
      if (path.includes("/feed") || path === "/") {
        return { pageType: "Feed", confidence: 96 };
      }
      if (path.includes("/jobs/search") || path.includes("/jobs/collections")) {
        return { pageType: "Jobs Search", confidence: 96 };
      }
      if (path.includes("/jobs/view") || path.includes("/jobs")) {
        return { pageType: "Individual Job", confidence: 98 };
      }
      if (path.includes("/company/")) {
        return { pageType: "Company Page", confidence: 95 };
      }
      if (path.includes("/in/")) {
        return { pageType: "Profile", confidence: 97 };
      }
      if (path.includes("/messaging/")) {
        return { pageType: "Messaging", confidence: 96 };
      }
      if (path.includes("/learning/")) {
        return { pageType: "Learning", confidence: 95 };
      }
      if (path.includes("/notifications/")) {
        return { pageType: "Notifications", confidence: 92 };
      }
      if (path.includes("/search/")) {
        return { pageType: "Search", confidence: 90 };
      }
      if (path.includes("/talent/")) {
        return { pageType: "Recruiter", confidence: 94 };
      }
      return { pageType: "LinkedIn General Page", confidence: 75 };
    }

    if (website === "YouTube") {
      if (path.includes("/watch")) {
        return { pageType: "Watch Page", confidence: 98 };
      }
      if (path.includes("/shorts/")) {
        return { pageType: "Shorts", confidence: 96 };
      }
      if (path.includes("/playlist")) {
        return { pageType: "Playlist", confidence: 95 };
      }
      if (path.includes("/results")) {
        return { pageType: "Search Results", confidence: 94 };
      }
      if (path.includes("/@") || path.includes("/c/") || path.includes("/channel/")) {
        return { pageType: "Channel", confidence: 96 };
      }
      if (path.includes("/feed/subscriptions")) {
        return { pageType: "Subscriptions", confidence: 93 };
      }
      if (path.includes("/feed/history")) {
        return { pageType: "History", confidence: 92 };
      }
      if (path === "/" || path === "") {
        return { pageType: "Home Feed", confidence: 96 };
      }
      return { pageType: "YouTube General Page", confidence: 75 };
    }

    return { pageType: "Unsupported Page Type", confidence: 0 };
  } catch {
    return { pageType: "Unknown Page", confidence: 0 };
  }
}

/**
 * Step 3 & Step 4: Determine User Activity from Website and Page Type
 */
export function determineActivity(website: ContextEngineResult["website"], pageType: string): string {
  if (website === "LinkedIn") {
    switch (pageType) {
      case "Feed": return "Browsing Feed";
      case "Jobs Search": return "Searching Jobs";
      case "Individual Job": return "Reading Job";
      case "Company Page": return "Researching Company";
      case "Profile": return "Editing Profile";
      case "Messaging": return "Messaging Someone";
      case "Learning": return "Learning";
      case "Notifications": return "Checking Notifications";
      case "Search": return "Searching LinkedIn";
      case "Recruiter": return "Sourcing Talent";
      default: return "Browsing LinkedIn";
    }
  }

  if (website === "YouTube") {
    switch (pageType) {
      case "Watch Page": return "Watching Video";
      case "Shorts": return "Watching Shorts";
      case "Playlist": return "Watching Playlist";
      case "Search Results": return "Searching Videos";
      case "Channel": return "Browsing Channel";
      case "Subscriptions": return "Checking Subscriptions";
      case "History": return "Reviewing Watch History";
      case "Home Feed": return "Browsing Video Recommendations";
      default: return "Browsing YouTube";
    }
  }

  return "Browsing Web Page";
}

/**
 * Step 5: Infer User Intent from User Activity
 * Returns intent, confidence score, and whether confidence >= 80%
 */
export function inferIntent(activity: string, pageConfidence: number): {
  intent: string;
  confidence: number;
  isConfident: boolean;
} {
  let baseConfidence = pageConfidence;
  let intent = "Content Discovery";

  switch (activity) {
    case "Reading Job":
      intent = "Applying for Job";
      baseConfidence = 96;
      break;
    case "Searching Jobs":
      intent = "Job Seeking";
      baseConfidence = 94;
      break;
    case "Watching Video":
      intent = "Learning";
      baseConfidence = 97;
      break;
    case "Editing Profile":
      intent = "Career Optimization";
      baseConfidence = 93;
      break;
    case "Researching Company":
      intent = "Company Research";
      baseConfidence = 92;
      break;
    case "Browsing Feed":
      intent = "Content Engagement";
      baseConfidence = 89;
      break;
    case "Messaging Someone":
      intent = "Communication Assistant";
      baseConfidence = 94;
      break;
    case "Watching Playlist":
      intent = "Structured Learning";
      baseConfidence = 92;
      break;
    case "Browsing Channel":
      intent = "Creator Analysis";
      baseConfidence = 88;
      break;
    case "Browsing Video Recommendations":
      intent = "Content Discovery";
      baseConfidence = 86;
      break;
    default:
      intent = "General Browsing";
      baseConfidence = 65; // < 80%, triggers Low Confidence Safety
      break;
  }

  return {
    intent,
    confidence: baseConfidence,
    isConfident: baseConfidence >= 80,
  };
}

/**
 * Step 6: Generate AI Actions
 * NEVER show resume actions unless a job page has actually been detected.
 * NEVER show YouTube actions outside YouTube.
 */
export function generateActions(
  website: ContextEngineResult["website"],
  pageType: string,
  isConfident: boolean
): ActionCardItem[] {
  // Low confidence (< 80%) safety fallback: Offer ONLY general-purpose actions
  if (!isConfident) {
    return [
      {
        id: "general_summarize",
        title: "Summarize Page Content",
        description: "Distill the visible page content into key bullet points.",
        iconName: "FileText",
        confidence: 75,
        badgeText: "General",
      },
      {
        id: "general_extract_keywords",
        title: "Extract Key Terminology",
        description: "Identify and define important terms from the current page.",
        iconName: "Search",
        confidence: 75,
        badgeText: "General",
      },
    ];
  }

  if (website === "LinkedIn") {
    switch (pageType) {
      case "Feed":
        return [
          { id: "feed_viral_post", title: "Create Viral Post", description: "Draft a high-engagement professional LinkedIn post with hook.", iconName: "Edit3", confidence: 96, badgeText: "Viral Hook" },
          { id: "feed_rewrite", title: "Rewrite Post", description: "Transform casual notes into executive communication.", iconName: "FileText", confidence: 94, badgeText: "Executive" },
          { id: "feed_improve", title: "Improve Writing", description: "Enhance grammar, tone, readability, and scannability.", iconName: "Sparkles", confidence: 93, badgeText: "Polished" },
          { id: "feed_carousel", title: "Generate Carousel Idea", description: "Create a 6-slide visual carousel concept with slide copy.", iconName: "Layers", confidence: 92, badgeText: "Carousel" },
          { id: "feed_poll", title: "Create Poll", description: "Generate a high-conversion poll question with 4 options.", iconName: "BarChart2", confidence: 91, badgeText: "Engagement" },
          { id: "feed_comment", title: "Comment Generator", description: "Craft an insightful, high-signal comment reply ready to paste.", iconName: "MessageSquare", confidence: 90, badgeText: "Value Add" },
          { id: "feed_reply", title: "Reply Generator", description: "Generate a thoughtful follow-up response.", iconName: "MessageCircle", confidence: 89, badgeText: "Response" },
          { id: "feed_connection", title: "Connection Request", description: "Craft a personalized 300-char connection note.", iconName: "UserPlus", confidence: 88, badgeText: "Networking" },
          { id: "feed_branding", title: "Personal Branding Ideas", description: "Suggest 3 actionable personal branding content themes.", iconName: "Award", confidence: 87, badgeText: "Strategy" },
        ];

      case "Jobs Search":
        return [
          { id: "search_strategy", title: "Search Strategy", description: "Optimize boolean keywords and target role filters.", iconName: "Search", confidence: 95, badgeText: "Targeted" },
          { id: "resume_review", title: "Resume Review", description: "Evaluate general ATS readiness against market trends.", iconName: "FileCheck", confidence: 93, badgeText: "ATS Ready" },
          { id: "job_comparison", title: "Job Comparison", description: "Compare salary, requirements, and growth potential.", iconName: "BarChart2", confidence: 91, badgeText: "Analytics" },
        ];

      case "Individual Job":
        return [
          { id: "job_tailor_resume", title: "Tailor Resume", description: "Align skills and ATS keywords with this exact role.", iconName: "Briefcase", confidence: 98, badgeText: "ATS Match" },
          { id: "job_cover_letter", title: "Cover Letter", description: "Handcraft executive cover letter tailored to this job.", iconName: "FileText", confidence: 97, badgeText: "High Signal" },
          { id: "job_ats", title: "ATS Optimization", description: "Identify missing keywords and qualification gaps.", iconName: "CheckCircle2", confidence: 96, badgeText: "Optimization" },
          { id: "job_interview_qs", title: "Interview Questions", description: "Predict top 5 technical and behavioral questions.", iconName: "HelpCircle", confidence: 95, badgeText: "Preparation" },
          { id: "job_salary", title: "Salary Negotiation Tips", description: "Salary benchmarks and executive negotiation scripts.", iconName: "TrendingUp", confidence: 94, badgeText: "Compensation" },
          { id: "job_company", title: "Company Research", description: "Summarize company culture, mission, and news.", iconName: "Building2", confidence: 93, badgeText: "Executive" },
          { id: "job_skills_gap", title: "Skills Gap Analysis", description: "Table comparing your skills vs job requirements.", iconName: "CheckSquare", confidence: 92, badgeText: "Market Fit" },
        ];

      case "Profile":
        return [
          { id: "profile_headline", title: "Rewrite Headline", description: "5 high-converting, searchable headline variations.", iconName: "Award", confidence: 97, badgeText: "SEO Brand" },
          { id: "profile_about", title: "Improve About Section", description: "Storytelling About section structured for conversion.", iconName: "FileText", confidence: 96, badgeText: "Storytelling" },
          { id: "profile_experience", title: "Rewrite Experience", description: "Quantify achievements using STAR methodology.", iconName: "TrendingUp", confidence: 94, badgeText: "Impact" },
          { id: "profile_skills", title: "Skills Suggestions", description: "Recommend top industry skills to add to your profile.", iconName: "CheckSquare", confidence: 93, badgeText: "Market Fit" },
          { id: "profile_seo", title: "SEO Optimization", description: "SEO keyword audit and profile optimization checklist.", iconName: "Search", confidence: 92, badgeText: "Visibility" },
        ];

      case "Messaging":
        return [
          { id: "msg_reply", title: "Reply", description: "Draft a concise, professional response message.", iconName: "MessageCircle", confidence: 96, badgeText: "Instant" },
          { id: "msg_cold", title: "Cold Outreach", description: "High-converting cold outreach template.", iconName: "Send", confidence: 95, badgeText: "Conversion" },
          { id: "msg_follow", title: "Follow Up", description: "Generate a polite follow-up checking in on status.", iconName: "Clock", confidence: 93, badgeText: "Tactful" },
          { id: "msg_networking", title: "Networking Message", description: "Personalized coffee-chat networking request.", iconName: "Users", confidence: 92, badgeText: "Networking" },
          { id: "msg_thanks", title: "Thank You Message", description: "Professional post-meeting thank-you note.", iconName: "Heart", confidence: 91, badgeText: "Polished" },
        ];

      case "Company Page":
        return [
          { id: "company_overview", title: "Company Overview", description: "Analyze mission, leadership, and funding stage.", iconName: "Building2", confidence: 94, badgeText: "Insight" },
          { id: "company_culture", title: "Culture & Values Analysis", description: "Evaluate employee culture and public reputation.", iconName: "Users", confidence: 92, badgeText: "Culture" },
          { id: "company_news", title: "Recent News & Developments", description: "Summarize recent press releases and milestones.", iconName: "Newspaper", confidence: 90, badgeText: "Intelligence" },
        ];

      default:
        return [
          { id: "linkedin_summary", title: "Summarize Page", description: "Extract key professional insights from this page.", iconName: "FileText", confidence: 85, badgeText: "LinkedIn" },
        ];
    }
  }

  if (website === "YouTube") {
    switch (pageType) {
      case "Watch Page":
        return [
          { id: "yt_summary", title: "Smart Summary", description: "2-minute executive distillation of core takeaways.", iconName: "FileText", confidence: 98, badgeText: "Instant" },
          { id: "yt_notes", title: "Detailed Notes", description: "Hierarchical study notes with timestamps and terms.", iconName: "BookOpen", confidence: 97, badgeText: "Structured" },
          { id: "yt_flashcards", title: "Flashcards", description: "5 spaced-repetition study flashcard Q&A pairs.", iconName: "Layers", confidence: 95, badgeText: "Memorize" },
          { id: "yt_quiz", title: "Quiz", description: "Interactive multiple-choice quiz with answer key.", iconName: "Award", confidence: 94, badgeText: "Spaced Rep" },
          { id: "yt_takeaways", title: "Key Takeaways", description: "5 high-signal actionable advice takeaways.", iconName: "CheckCircle2", confidence: 93, badgeText: "High Signal" },
          { id: "yt_action_items", title: "Action Items", description: "Checklist of practical action items from the video.", iconName: "CheckSquare", confidence: 92, badgeText: "Checklist" },
          { id: "yt_mindmap", title: "Mind Map", description: "Conceptual architecture diagram of core concepts.", iconName: "Share2", confidence: 91, badgeText: "Visual" },
          { id: "yt_blog", title: "Blog Article", description: "500-word polished blog article adapted from lecture.", iconName: "Edit3", confidence: 90, badgeText: "Article" },
          { id: "yt_twitter", title: "Twitter Thread", description: "7-tweet viral Twitter/X thread summarizing video.", iconName: "Twitter", confidence: 89, badgeText: "Viral" },
        ];

      case "Channel":
        return [
          { id: "channel_analysis", title: "Channel Analysis", description: "Creator niche, audience demographic, and content style.", iconName: "Tv", confidence: 96, badgeText: "Creator" },
          { id: "channel_path", title: "Learning Path", description: "Guided beginner-to-pro viewing sequence.", iconName: "Compass", confidence: 94, badgeText: "Guided" },
          { id: "channel_best", title: "Best Videos", description: "Top recommended foundational videos on this channel.", iconName: "Star", confidence: 93, badgeText: "Top Rated" },
          { id: "channel_similar", title: "Similar Channels", description: "3 similar high-signal technical channels to follow.", iconName: "Users", confidence: 91, badgeText: "Discovery" },
        ];

      case "Playlist":
        return [
          { id: "playlist_summary", title: "Playlist Summary", description: "Comprehensive summary of topics across playlist.", iconName: "List", confidence: 96, badgeText: "Curated" },
          { id: "playlist_notes", title: "Course Notes", description: "Course study guide and module breakdown.", iconName: "BookOpen", confidence: 94, badgeText: "Study Guide" },
          { id: "playlist_roadmap", title: "Learning Roadmap", description: "Step-by-step learning roadmap and timeline.", iconName: "TrendingUp", confidence: 92, badgeText: "Roadmap" },
        ];

      case "Home Feed":
      default:
        return [
          { id: "yt_recommendations", title: "Learning Recommendations", description: "Suggest educational technical topics to explore.", iconName: "Sparkles", confidence: 91, badgeText: "Personalized" },
          { id: "watch_plan", title: "Personalized Watch Plan", description: "Create a 30-minute structured study queue.", iconName: "Clock", confidence: 88, badgeText: "Time Saving" },
        ];
    }
  }

  return [];
}

/**
 * Main Context Engine Orchestrator
 */
export function analyzeContextEngine(url: string, pageTitle?: string): ContextEngineResult {
  const { website, confidence: websiteConfidence } = detectWebsite(url);

  if (website === "Unsupported") {
    return {
      website: "Unsupported",
      pageType: "Unsupported URL",
      activity: "Browsing Unsupported Web Page",
      intent: "No Supported Intent",
      confidence: {
        website: 0,
        page: 0,
        intent: 0,
      },
      summaryText: "Navigate to a supported platform (LinkedIn Jobs or YouTube Videos) to activate zero-click browser intelligence.",
      isConfident: false,
      actions: [],
      unsupportedReason: "This website domain is not in the active support matrix.",
    };
  }

  const { pageType, confidence: pageConfidence } = detectPageType(url, website);
  const activity = determineActivity(website, pageType);
  const { intent, confidence: intentConfidence, isConfident } = inferIntent(activity, pageConfidence);
  const actions = generateActions(website, pageType, isConfident);

  // Generate dynamic contextual summary WITHOUT fabricating data
  let summaryText = "";
  if (pageTitle && pageTitle.trim().length > 0) {
    summaryText = `Detected ${pageType} on ${website}: "${pageTitle.trim()}"`;
  } else {
    summaryText = `Active on ${website} — ${pageType} (${activity}).`;
  }

  return {
    website,
    pageType,
    activity,
    intent,
    confidence: {
      website: websiteConfidence,
      page: pageConfidence,
      intent: intentConfidence,
    },
    summaryText,
    isConfident,
    actions,
  };
}
