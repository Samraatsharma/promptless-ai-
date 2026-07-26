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
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

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

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.4,
      },
    });

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
