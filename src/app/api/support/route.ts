import { NextRequest, NextResponse } from "next/server";
import { analyzeCustomerVoiceText } from "@/lib/supportIntelligence";
import { processUnifiedAssistanceAsync, AssistanceMode } from "@/lib/unifiedIntelligence";
import { isGeminiConfigured } from "@/lib/geminiService";

export const maxDuration = 30;

// Rate limiting for support queries (40 req/min)
const supportIpCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  if (supportIpCounts.size > 2000) {
    for (const [key, val] of supportIpCounts.entries()) {
      if (now > val.resetTime) supportIpCounts.delete(key);
    }
  }

  const record = supportIpCounts.get(ip);
  if (!record || now > record.resetTime) {
    supportIpCounts.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  if (record.count >= 40) {
    return false;
  }
  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const rawIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "local_client";
    const clientIp = rawIp.split(",")[0].trim();
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please wait a moment before sending another query." },
        { status: 429 }
      );
    }

    const { text, mode, explicitMode, history } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { success: false, error: "Query text is required." },
        { status: 400 }
      );
    }

    if (text.length > 4000) {
      return NextResponse.json(
        { success: false, error: "Query text exceeds maximum allowed length of 4000 characters." },
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
