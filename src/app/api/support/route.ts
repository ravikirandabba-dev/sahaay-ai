import { NextRequest, NextResponse } from "next/server";
import { analyzeCustomerVoiceText } from "@/lib/supportIntelligence";
import { processUnifiedAssistanceAsync, AssistanceMode } from "@/lib/unifiedIntelligence";
import { isGeminiConfigured } from "@/lib/geminiService";

export async function POST(req: NextRequest) {
  try {
    const { text, mode, explicitMode, history } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { success: false, error: "Query text is required." },
        { status: 400 }
      );
    }

    const requestedMode: AssistanceMode = mode === "assistant" || mode === "services" ? mode : "support";
    const unified = await processUnifiedAssistanceAsync(
      text,
      requestedMode,
      explicitMode !== false,
      Array.isArray(history) ? history : []
    );
    const analysis = unified.supportAnalysis || analyzeCustomerVoiceText(text);

    return NextResponse.json({
      success: true,
      query: text,
      mode: unified.mode,
      suggestedMode: unified.suggestedMode,
      isGeminiConfigured: isGeminiConfigured(),
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
