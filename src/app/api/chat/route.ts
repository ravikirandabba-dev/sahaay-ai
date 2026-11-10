import { NextRequest, NextResponse } from "next/server";
import { askGeminiAssistant, ChatMessage, isGeminiConfigured } from "@/lib/geminiService";

// In-memory rate limiting: 30 requests per minute per IP
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }

  if (record.count >= 30) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local-client";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded (30 requests/minute). Please wait a moment before sending another query.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { message, text, history, mode = "assistant" } = body;

    const queryText = (message || text || "").trim();

    if (!queryText) {
      return NextResponse.json(
        { success: false, error: "Query message is required." },
        { status: 400 }
      );
    }

    if (queryText.length > 4000) {
      return NextResponse.json(
        { success: false, error: "Query text exceeds maximum allowed length of 4000 characters." },
        { status: 400 }
      );
    }

    const cleanHistory: ChatMessage[] = Array.isArray(history)
      ? history
          .filter((h) => h && (h.role === "user" || h.role === "model") && typeof h.text === "string")
          .map((h) => ({ role: h.role, text: h.text.slice(0, 4000) }))
          .slice(-10)
      : [];

    const geminiResult = await askGeminiAssistant(queryText, cleanHistory, mode);

    return NextResponse.json({
      ...geminiResult,
      isConfigured: isGeminiConfigured(),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("API /api/chat error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error while processing chat.",
      },
      { status: 500 }
    );
  }
}
