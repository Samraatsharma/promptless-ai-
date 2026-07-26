import { z } from "zod";

export const LinkedInJobContextSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required").max(300),
  companyName: z.string().min(1, "Company name is required").max(300),
  location: z.string().max(300).optional().default("Remote / Hybrid"),
  jobDescription: z.string().max(20000, "Job description exceeds maximum length"),
  url: z.string().url("Must be a valid URL"),
});

export const YouTubeVideoContextSchema = z.object({
  videoTitle: z.string().min(1, "Video title is required").max(500),
  channelName: z.string().min(1, "Channel name is required").max(300),
  description: z.string().max(20000, "Description exceeds maximum length"),
  transcript: z.string().max(50000, "Transcript exceeds maximum length").optional().default(""),
  url: z.string().url("Must be a valid URL"),
});

export const ExtractedPageContextSchema = z.discriminatedUnion("platform", [
  z.object({
    platform: z.literal("linkedin"),
    data: LinkedInJobContextSchema,
  }),
  z.object({
    platform: z.literal("youtube"),
    data: YouTubeVideoContextSchema,
  }),
]);

export const IntentRequestSchema = z.object({
  context: ExtractedPageContextSchema,
});

export const ActionRequestSchema = z.object({
  actionId: z.string().min(1, "actionId is required").max(100),
  context: ExtractedPageContextSchema,
});

export type IntentRequestPayload = z.infer<typeof IntentRequestSchema>;
export type ActionRequestPayload = z.infer<typeof ActionRequestSchema>;
