import { NextRequest, NextResponse } from "next/server";
import { analyzeCustomerVoiceText } from "@/lib/supportIntelligence";
import { processUnifiedAssistance, AssistanceMode } from "@/lib/unifiedIntelligence";

export async function POST(req: NextRequest) {
  try {
    const { text, mode, explicitMode } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { success: false, error: "Query text is required." },
        { status: 400 }
      );
    }

    const requestedMode: AssistanceMode = mode === "assistant" || mode === "services" ? mode : "support";
    const unified = processUnifiedAssistance(text, requestedMode, explicitMode !== false);
    const analysis = unified.supportAnalysis || analyzeCustomerVoiceText(text);

    return NextResponse.json({
      success: true,
      query: text,
      mode: unified.mode,
      suggestedMode: unified.suggestedMode,
      analysis,
      unified,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
