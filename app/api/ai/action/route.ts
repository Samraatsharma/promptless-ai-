import { NextRequest, NextResponse } from "next/server";
import { executeAIAction } from "@/lib/gemini/client";
import { AIActionType } from "@/types";
import { createClient } from "@/lib/supabase/server";
import {
  checkRateLimit,
  buildRateLimitResponse,
  attachRateLimitHeaders,
} from "@/lib/security/rate-limiter";
import { sanitizePageContext, sanitizeDOMText } from "@/lib/security/sanitize";
import { ActionRequestSchema } from "@/lib/security/schemas";

export async function POST(req: NextRequest) {
  try {
    // 0. Enforce token-bucket rate limiting (20 action executions/min per IP or User)
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "anonymous-ip";
    const rateLimit = await checkRateLimit(`action-${clientIp}`, 20);
    if (!rateLimit.success) {
      return buildRateLimitResponse(rateLimit);
    }

    const body = await req.json();

    // 1. Validate payload structure using Zod schema
    const parsedPayload = ActionRequestSchema.safeParse(body);
    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            problem: "Invalid Action Execution payload schema.",
            reason: parsedPayload.error.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join("; "),
            fix: "Ensure Chrome Extension Side Panel sends the selected card ID and page context conforming to Zod schema.",
            verification: "Inspect payload in Network panel.",
          },
        },
        { status: 400 }
      );
    }

    const actionType: AIActionType =
      (body.actionType as AIActionType) ||
      (parsedPayload.data.actionId as AIActionType) ||
      "cover_letter";
    const rawContext = parsedPayload.data.context;
    const rawCustomInstructions: string | undefined = body.customInstructions;
    const tone: string = body.tone || "professional";

    // 2. Sanitize input against prompt injection and control Unicode attacks
    const context = sanitizePageContext(rawContext);
    const customInstructions = rawCustomInstructions
      ? sanitizeDOMText(rawCustomInstructions, 1000)
      : undefined;

    // 3. Generate structured executive Markdown via Google Gemini 2.5 Flash
    const result = await executeAIAction(
      actionType,
      context,
      customInstructions,
      tone
    );

    // 4. Persist to generated_content and activity_history if user is authenticated
    try {
      const supabase = await createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Save generated markdown
        await supabase.from("generated_content").insert({
          user_id: session.user.id,
          platform: context.platform,
          action_type: actionType,
          source_url:
            context.platform === "linkedin"
              ? context.data.url
              : context.data.url,
          title: result.title,
          content_markdown: result.markdownContent,
          metadata_json: result.metadata || {},
          is_saved: false,
        });

        // Record activity
        await supabase.from("activity_history").insert({
          user_id: session.user.id,
          platform: context.platform,
          action_type: actionType,
          source_title: result.title,
          confidence_score: 98,
        });
      }
    } catch (dbErr) {
      console.warn("Database persistence skipped:", dbErr);
    }

    const response = NextResponse.json(
      {
        success: true,
        result,
        metadata: {
          processedAt: new Date().toISOString(),
          rateLimitSource: rateLimit.source,
        },
      },
      { status: 200 }
    );

    return attachRateLimitHeaders(response, rateLimit);
  } catch (err: unknown) {
    console.error("API /api/ai/action Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          problem: "Action execution request failed.",
          reason:
            err instanceof Error
              ? err.message
              : "Server error executing action.",
          fix: "Verify Google Gemini API connection and model availability.",
          verification: "Retry clicking action card in Chrome Extension.",
        },
      },
      { status: 500 }
    );
  }
}
