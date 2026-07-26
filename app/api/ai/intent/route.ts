import { NextRequest, NextResponse } from "next/server";
import { analyzePageIntent } from "@/lib/gemini/client";
import { ExtractedPageContext } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const context: ExtractedPageContext = body.context;

    if (!context || !context.platform || !context.data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            problem: "Invalid ExtractedPageContext payload.",
            reason:
              "Request body must contain 'context' with a valid platform ('linkedin' | 'youtube') and data object.",
            fix: "Verify Chrome Extension Content Script is transmitting the correct DOM structure.",
            verification: "Inspect network tab in Chrome DevTools for POST payload.",
          },
        },
        { status: 400 }
      );
    }

    // 1. Analyze page intent using Google Gemini 2.5 Flash (or high-fidelity mock)
    const result = await analyzePageIntent(context);

    // 2. Optionally log to activity_history if user session is active
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

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: unknown) {
    console.error("API /api/ai/intent Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          problem: "Intent classification request failed.",
          reason:
            err instanceof Error ? err.message : "Unexpected server exception.",
          fix: "Check server logs and verify Google Gemini API key configuration in .env.local.",
          verification: "Retry sending POST request to /api/ai/intent.",
        },
      },
      { status: 500 }
    );
  }
}
