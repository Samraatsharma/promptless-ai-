export type PlatformType = "linkedin" | "youtube";

export type LinkedInActionType =
  | "tailor_resume"
  | "resume_tailoring"
  | "cover_letter"
  | "company_research"
  | "interview_questions"
  | "ats_suggestions";

export type YouTubeActionType =
  | "smart_notes"
  | "smart_summary"
  | "flashcards"
  | "quiz"
  | "key_takeaways";

export type AIActionType = LinkedInActionType | YouTubeActionType;

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  user_id: string;
  default_tone: "professional" | "enthusiastic" | "concise" | "academic";
  auto_copy_results: boolean;
  theme: "dark" | "glass";
  updated_at: string;
}

export interface GeneratedContent {
  id: string;
  user_id: string;
  platform: PlatformType;
  action_type: AIActionType;
  source_url: string;
  title: string;
  content_markdown: string;
  metadata_json: Record<string, unknown>;
  is_saved: boolean;
  created_at: string;
}

export type GeneratedContentItem = GeneratedContent;

export interface ActivityHistoryItem {
  id: string;
  user_id: string;
  platform: PlatformType;
  action_type: AIActionType;
  source_title: string;
  confidence_score: number;
  created_at: string;
}

/* Chrome Extension Content Extraction & Intent Interfaces */
export interface LinkedInJobContext {
  jobTitle: string;
  companyName: string;
  location: string;
  jobDescription: string;
  url: string;
}

export interface YouTubeVideoContext {
  videoTitle: string;
  channelName: string;
  description: string;
  transcript: string;
  url: string;
}

export type ExtractedPageContext =
  | { platform: "linkedin"; data: LinkedInJobContext }
  | { platform: "youtube"; data: YouTubeVideoContext };

export interface ActionCardItem {
  id: AIActionType;
  title: string;
  description: string;
  iconName: string;
  confidence: number;
  badgeText: string;
}

export interface IntentDetectionResult {
  platform: PlatformType;
  intentLabel: string;
  confidenceScore: number;
  summary: string;
  actions: ActionCardItem[];
}

export interface AIExecutionResponse {
  success: boolean;
  actionType: AIActionType;
  title: string;
  markdownContent: string;
  metadata?: Record<string, unknown>;
  error?: {
    problem: string;
    reason: string;
    fix: string;
    verification: string;
  };
}
