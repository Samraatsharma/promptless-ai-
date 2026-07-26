import { NextRequest, NextResponse } from "next/server";
import { analyzePageIntent } from "@/lib/gemini/client";
import { createClient } from "@/lib/supabase/server";
import {
  checkRateLimit,
  buildRateLimitResponse,
  attachRateLimitHeaders,
} from "@/lib/security/rate-limiter";
import { sanitizePageContext } from "@/lib/security/sanitize";
import { IntentRequestSchema } from "@/lib/security/schemas";

export async function POST(req: NextRequest) {
  try {
    // 0. Enforce token-bucket rate limiting (30 intent checks/min per IP or User)
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "anonymous-ip";
    const rateLimit = await checkRateLimit(`intent-${clientIp}`, 30);
    if (!rateLimit.success) {
      return buildRateLimitResponse(rateLimit);
    }

    const body = await req.json();

    // 1. Validate payload structure using Zod schema
    const parsedPayload = IntentRequestSchema.safeParse(body);
    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            problem: "Invalid ExtractedPageContext payload schema.",
            reason: parsedPayload.error.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join("; "),
            fix: "Verify Chrome Extension Content Script is transmitting the correct DOM structure conforming to Zod schema.",
            verification:
              "Inspect network tab in Chrome DevTools for POST payload.",
          },
        },
        { status: 400 }
      );
    }

    const rawContext = parsedPayload.data.context;

    // 2. Sanitize input against prompt injection and control Unicode attacks
    const context = sanitizePageContext(rawContext);

    // 3. Analyze page intent using Google Gemini 2.5 Flash (or high-fidelity mock)
    const result = await analyzePageIntent(context);

    // 4. Optionally log to activity_history if user session is active
    try {
      const supabase = await createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await supabase.from("activity_history").insert({
          user_id: session.user.id,
          platform: context.platform,
          action_type: "intent_detection",
          source_title:
            context.platform === "linkedin"
              ? context.data.jobTitle
              : context.data.videoTitle,
          confidence_score: result.confidenceScore,
        });
      }
    } catch (dbErr) {
      // Non-blocking: don't fail intent classification if activity log fails
      console.warn("Activity history logging skipped:", dbErr);
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
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error ? error.message : "Unknown backend error";
    return NextResponse.json(
      {
        success: false,
        error: {
          problem: "Internal Server Error in /api/ai/intent",
          reason: errMessage,
          fix: "Check backend server logs and verify Google Gemini API key status.",
          verification: "Verify via 'npm run dev' console output.",
        },
      },
      { status: 500 }
    );
  }
}
