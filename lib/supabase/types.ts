import {
  UserProfile,
  UserPreferences,
  GeneratedContent,
  ActivityHistoryItem,
} from "@/types";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserProfile;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      preferences: {
        Row: UserPreferences;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      generated_content: {
        Row: GeneratedContent;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      activity_history: {
        Row: ActivityHistoryItem;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
