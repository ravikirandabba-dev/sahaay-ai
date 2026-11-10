import { NextRequest, NextResponse } from "next/server";
import { analyzeCustomerVoiceText } from "@/lib/supportIntelligence";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { success: false, error: "Query text is required." },
        { status: 400 }
      );
    }

    const analysis = analyzeCustomerVoiceText(text);

    return NextResponse.json({
      success: true,
      query: text,
      analysis,
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
