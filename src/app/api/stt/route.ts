import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter to protect Gnani API credits from rapid-fire abuse
const requestIpCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestIpCounts.get(ip);
  if (!record || now > record.resetTime) {
    requestIpCounts.set(ip, { count: 1, resetTime: now + 60000 }); // 1-minute window
    return true;
  }
  if (record.count >= 20) {
    return false;
  }
  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get("x-forwarded-for") || "local_client";
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait a moment before sending another voice request to protect API credits.",
        },
        { status: 429 }
      );
    }

    let apiKey = process.env.GNANI_API_KEY?.trim() || "";
    // Clean potential surrounding quotes
    if (
      (apiKey.startsWith('"') && apiKey.endsWith('"')) ||
      (apiKey.startsWith("'") && apiKey.endsWith("'"))
    ) {
      apiKey = apiKey.substring(1, apiKey.length - 1).trim();
    }

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GNANI_API_KEY is not configured.",
          details: "Please insert your valid Gnani AI API Key into .env.local to enable real Prisma v3 speech transcription.",
          configured: false,
        },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio_file") as File | null;
    const requestedLanguage = (formData.get("language_code") as string) || "indic-auto";
    const requestedModel = (formData.get("model") as string) || "prisma-v3.0";
    const requestedFormat = (formData.get("format") as string) || "transcribe";

    if (!audioFile) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing audio_file parameter in request.",
        },
        { status: 400 }
      );
    }

    // Verify audio size (< 15MB)
    if (audioFile.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: "Audio file exceeds maximum allowed REST size (15MB). Keep voice recordings under 30 seconds as per Gnani REST API specifications.",
        },
        { status: 413 }
      );
    }

    // Prepare outbound payload to Gnani Prisma STT v3 REST endpoint
    const gnaniFormData = new FormData();
    gnaniFormData.append("audio_file", audioFile, audioFile.name || "recording.wav");
    gnaniFormData.append("model", "prisma-v3.0"); // Explicitly send model prisma-v3.0 as documented
    gnaniFormData.append("language_code", requestedLanguage);
    gnaniFormData.append("format", requestedFormat);

    const startTime = Date.now();
    const gnaniResponse = await fetch("https://api.vachana.ai/stt/v3", {
      method: "POST",
      headers: {
        "X-API-Key-ID": apiKey,
      },
      body: gnaniFormData,
      signal: AbortSignal.timeout(20000), // 20-second timeout for REST STT
    });

    const elapsedMs = Date.now() - startTime;

    if (!gnaniResponse.ok) {
      const errorText = await gnaniResponse.text();
      let parsedError: Record<string, unknown> | null = null;
      try {
        parsedError = JSON.parse(errorText);
      } catch {
        // Raw text response
      }

      return NextResponse.json(
        {
          success: false,
          error: `Gnani Prisma API returned HTTP ${gnaniResponse.status}`,
          gnaniStatus: gnaniResponse.status,
          gnaniStatusText: gnaniResponse.statusText,
          details: parsedError || errorText,
          endpoint: "https://api.vachana.ai/stt/v3",
          elapsedMs,
        },
        { status: gnaniResponse.status }
      );
    }

    const responseData = await gnaniResponse.json();

    // Check actual returned model from Gnani rather than assuming
    const returnedModel = responseData.model || requestedModel;

    return NextResponse.json({
      success: true,
      request_id: responseData.request_id || null,
      transcript: responseData.transcript || "",
      model: returnedModel,
      detected_language_code: responseData.detected_language_code || requestedLanguage,
      processing_time: responseData.processing_time || null,
      end_to_end_latency: responseData.end_to_end_latency || null,
      serverElapsedMs: elapsedMs,
      audioFileName: audioFile.name,
      audioFileSize: audioFile.size,
      audioFileType: audioFile.type,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        error: "Server error occurred while communicating with Gnani Prisma STT.",
        message: err.message,
      },
      { status: 500 }
    );
  }
}
