import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

// Rate limiter with memory cleanup
const ttsIpCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  if (ttsIpCounts.size > 2000) {
    for (const [key, val] of ttsIpCounts.entries()) {
      if (now > val.resetTime) ttsIpCounts.delete(key);
    }
  }

  const record = ttsIpCounts.get(ip);
  if (!record || now > record.resetTime) {
    ttsIpCounts.set(ip, { count: 1, resetTime: now + 60000 });
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
    const rawIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "local_client";
    const clientIp = rawIp.split(",")[0].trim();
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit reached for text-to-speech. Please wait a minute before requesting more audio synthesis.",
          timbreAvailable: false,
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
          timbreAvailable: false,
        },
        { status: 401 }
      );
    }

    const { text, languageCode = "hi-IN", voice } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { success: false, error: "Text parameter is required." },
        { status: 400 }
      );
    }

    // Limit synthesis length to 2000 characters to prevent buffer overflow
    if (text.length > 2000) {
      return NextResponse.json(
        { success: false, error: "Text exceeds maximum synthesis length of 2000 characters." },
        { status: 400 }
      );
    }

    // Supported Timbre v3 voices: Kalpana (Telugu), Shivani (Hindi), Avinash (English/Hinglish)
    let selectedVoice = voice;
    if (!selectedVoice) {
      if (languageCode === "te-IN") {
        selectedVoice = "Kalpana";
      } else if (languageCode === "en-IN") {
        selectedVoice = "Avinash";
      } else {
        selectedVoice = "Shivani";
      }
    }

    const gnaniPayload = {
      text,
      voice: selectedVoice,
      model: "timbre-v3.0",
      language: languageCode,
      speed: 1.0,
      audio_config: {
        encoding: "linear_pcm",
        container: "wav",
        num_channels: 1,
        sample_rate: 24000,
        sample_width: 2,
      },
    };

    const gnaniResponse = await fetch("https://api.vachana.ai/api/v1/tts/inference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key-ID": apiKey,
      },
      body: JSON.stringify(gnaniPayload),
      signal: AbortSignal.timeout(15000), // 15-second timeout for synthesis
    });

    if (!gnaniResponse.ok) {
      const errorText = await gnaniResponse.text();
      return NextResponse.json(
        {
          success: false,
          error: `Gnani Timbre TTS returned HTTP ${gnaniResponse.status}`,
          details: errorText,
          timbreAvailable: false,
          note: "Gnani Timbre returned an error. Client may fall back to browser speech synthesis.",
        },
        { status: gnaniResponse.status }
      );
    }

    // Audio binary stream received from Gnani Timbre
    const audioArrayBuffer = await gnaniResponse.arrayBuffer();
    const contentType = gnaniResponse.headers.get("content-type") || "audio/wav";

    return new NextResponse(audioArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "X-Audio-Provider": "Gnani-Timbre",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process text-to-speech request with Gnani Timbre.",
        details: err.message,
        timbreAvailable: false,
      },
      { status: 500 }
    );
  }
}
