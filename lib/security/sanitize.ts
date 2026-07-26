import { ExtractedPageContext } from "@/types";

/**
 * Sanitizes untrusted DOM text strings from external websites (LinkedIn, YouTube).
 * Removes HTML tags, control Unicode chars, neutralizes prompt injection patterns,
 * and enforces safe character length bounds to prevent token exhaustion.
 */
export function sanitizeDOMText(input: string, maxLength: number = 12000): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  // 1. Strip residual HTML tags or script fragments
  let cleaned = input.replace(/<[^>]*>?/gm, " ");

  // 2. Strip non-printable control characters and zero-width spaces (often used for obfuscated attacks)
  cleaned = cleaned.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, "");

  // 3. Neutralize classic adversarial prompt injection prefixes
  const injectionPatterns = [
    /ignore (all )?previous instructions/gi,
    /system override/gi,
    /print system prompt/gi,
    /reveal (your )?api key/gi,
    /you are now in developer mode/gi,
  ];

  for (const pattern of injectionPatterns) {
    cleaned = cleaned.replace(pattern, "[sanitized-adversarial-instruction]");
  }

  // 4. Collapse excessive whitespace
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // 5. Enforce strict character bounds
  if (cleaned.length > maxLength) {
    return cleaned.slice(0, maxLength) + " [truncated for security and context window limits]";
  }

  return cleaned;
}

/**
 * Recursively sanitizes all text attributes of an ExtractedPageContext payload
 * prior to Gemini intent classification or action execution.
 */
export function sanitizePageContext(context: ExtractedPageContext): ExtractedPageContext {
  if (context.platform === "linkedin") {
    return {
      platform: "linkedin",
      data: {
        jobTitle: sanitizeDOMText(context.data.jobTitle, 150),
        companyName: sanitizeDOMText(context.data.companyName, 150),
        location: sanitizeDOMText(context.data.location, 150),
        jobDescription: sanitizeDOMText(context.data.jobDescription, 12000),
        url: sanitizeDOMText(context.data.url, 500),
      },
    };
  }

  if (context.platform === "youtube") {
    return {
      platform: "youtube",
      data: {
        videoTitle: sanitizeDOMText(context.data.videoTitle, 200),
        channelName: sanitizeDOMText(context.data.channelName, 150),
        description: sanitizeDOMText(context.data.description, 3000),
        transcript: sanitizeDOMText(context.data.transcript, 15000),
        url: sanitizeDOMText(context.data.url, 500),
      },
    };
  }

  return context;
}
