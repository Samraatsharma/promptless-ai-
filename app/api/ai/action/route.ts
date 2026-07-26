import { NextRequest, NextResponse } from "next/server";
import { executeAIAction } from "@/lib/gemini/client";
import { ExtractedPageContext, AIActionType } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const actionType: AIActionType = body.actionType;
    const context: ExtractedPageContext = body.context;
    const customInstructions: string | undefined = body.customInstructions;
    const tone: string = body.tone || "professional";

    if (!actionType || !context || !context.platform || !context.data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            problem: "Invalid Action Execution payload.",
            reason:
              "Request body must include 'actionType' and a valid 'context' object.",
            fix: "Ensure Chrome Extension Side Panel sends the selected card ID and page context.",
            verification: "Inspect payload in Network panel.",
          },
        },
        { status: 400 }
      );
    }

    // 1. Generate structured executive Markdown via Google Gemini 2.5 Flash
    const result = await executeAIAction(
      actionType,
      context,
      customInstructions,
      tone
    );

    // 2. Persist to generated_content and activity_history if user is authenticated
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

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: unknown) {
    console.error("API /api/ai/action Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          problem: "Action execution request failed.",
          reason:
            err instanceof Error ? err.message : "Server error executing action.",
          fix: "Verify Google Gemini API connection and model availability.",
          verification: "Retry clicking action card in Chrome Extension.",
        },
      },
      { status: 500 }
    );
  }
}
