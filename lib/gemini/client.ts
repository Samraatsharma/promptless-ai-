import { GoogleGenAI } from "@google/genai";
import {
  ExtractedPageContext,
  IntentDetectionResult,
  AIActionType,
  AIExecutionResponse,
} from "@/types";
import {
  buildIntentDetectionPrompt,
  buildActionExecutionPrompt,
  getMockIntentResult,
  getMockActionExecution,
} from "./prompts";

const apiKey = process.env.GEMINI_API_KEY;

// Initialize SDK if key exists
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const MODEL_NAME = "gemini-2.5-flash";

/**
 * Helper utility to execute an async operation with exponential backoff and jitter.
 * Handles HTTP 429 (Resource Exhausted) and transient 5xx errors from Google AI endpoints.
 */
async function withExponentialBackoff<T>(
  fn: () => Promise<T>,
  retries: number = 2,
  delayMs: number = 500
): Promise<T> {
  try {
    return await fn();
  } catch (err: unknown) {
    if (retries <= 0) {
      throw err;
    }
    const isRateLimitOr5xx =
      err instanceof Error &&
      (err.message.includes("429") ||
        err.message.includes("503") ||
        err.message.includes("ResourceExhausted") ||
        err.message.includes("Overloaded"));

    if (isRateLimitOr5xx) {
      const jitter = Math.random() * 200;
      await new Promise((res) => setTimeout(res, delayMs + jitter));
      return withExponentialBackoff(fn, retries - 1, delayMs * 2);
    }
    throw err;
  }
}

/**
 * Classifies DOM context from LinkedIn or YouTube into an intent label,
 * confidence score, and 3-4 high-signal Action Cards.
 */
export async function analyzePageIntent(
  context: ExtractedPageContext
): Promise<IntentDetectionResult> {
  // Use high-fidelity mock if GEMINI_API_KEY is unset
  if (!ai) {
    return getMockIntentResult(context);
  }

  try {
    const prompt = buildIntentDetectionPrompt(context);
    const response = await withExponentialBackoff(() =>
      ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      })
    );

    const text = response.text || "";
    const parsed = JSON.parse(text) as IntentDetectionResult;
    return parsed;
  } catch (err: unknown) {
    console.error("Gemini Intent Detection Error, falling back to mock:", err);
    return getMockIntentResult(context);
  }
}

/**
 * Executes a specific zero-click action card on the provided page context
 * and returns executive-level structured Markdown.
 */
export async function executeAIAction(
  actionType: AIActionType,
  context: ExtractedPageContext,
  customInstructions?: string,
  tone: string = "professional"
): Promise<AIExecutionResponse> {
  // Use high-fidelity mock if GEMINI_API_KEY is unset
  if (!ai) {
    return getMockActionExecution(actionType, context);
  }

  try {
    const prompt = buildActionExecutionPrompt(
      actionType,
      context,
      customInstructions,
      tone
    );

    const response = await withExponentialBackoff(() =>
      ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          temperature: 0.4,
        },
      })
    );

    const markdownContent = response.text || "";
    const title =
      actionType === "cover_letter"
        ? `Cover Letter — ${
            context.platform === "linkedin"
              ? context.data.jobTitle
              : "Job Application"
          }`
        : actionType === "resume_tailoring"
        ? `Tailored Resume — ${
            context.platform === "linkedin"
              ? context.data.jobTitle
              : "Role Target"
          }`
        : actionType === "smart_notes"
        ? `Smart Notes — ${
            context.platform === "youtube" ? context.data.videoTitle : "Video"
          }`
        : `AI Summary — ${
            context.platform === "youtube" ? context.data.videoTitle : "Content"
          }`;

    return {
      success: true,
      actionType,
      title,
      markdownContent,
      metadata: {
        platform: context.platform,
        url:
          context.platform === "linkedin"
            ? context.data.url
            : context.data.url,
      },
    };
  } catch (err: unknown) {
    console.error("Gemini Action Execution Error, falling back to mock:", err);
    return getMockActionExecution(actionType, context);
  }
}
