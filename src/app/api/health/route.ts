import { NextResponse } from "next/server";

export async function GET() {
  let apiKey = process.env.GNANI_API_KEY?.trim() || "";
  if (
    (apiKey.startsWith('"') && apiKey.endsWith('"')) ||
    (apiKey.startsWith("'") && apiKey.endsWith("'"))
  ) {
    apiKey = apiKey.substring(1, apiKey.length - 1).trim();
  }

  const isConfigured = Boolean(apiKey && apiKey.length > 5);

  let gnaniApiReachable = false;
  let connectivityNote = "Network probe not run";

  // Check connectivity to Gnani API base endpoint without sending unneeded load
  try {
    const probe = await fetch("https://api.vachana.ai", {
      method: "GET",
      signal: AbortSignal.timeout(4000),
    });
    gnaniApiReachable = probe.status < 500;
    connectivityNote = `Reachable (HTTP ${probe.status})`;
  } catch (err: unknown) {
    const error = err as Error;
    connectivityNote = `Unreachable or timeout: ${error.message}`;
  }

  return NextResponse.json({
    service: "Sahaay AI Multilingual Voice Helpdesk",
    status: "healthy",
    timestamp: new Date().toISOString(),
    diagnostics: {
      gnaniCredentialsConfigured: isConfigured,
      keyLength: isConfigured ? apiKey.length : 0,
      keyMasked: isConfigured ? `***${apiKey.slice(-4)}` : "Not Configured",
      gnaniApiBaseUrl: "https://api.vachana.ai",
      gnaniApiEndpointSTT: "https://api.vachana.ai/stt/v3",
      gnaniApiEndpointTTS: "https://api.vachana.ai/api/v1/tts/inference",
      gnaniApiReachable,
      connectivityNote,
      sttModel: "prisma-v3.0",
      ttsModel: "timbre-v3.0",
      supportedLanguages: [
        { code: "te-IN", name: "Telugu (తెలుగు)" },
        { code: "hi-IN", name: "Hindi (हिन्दी)" },
        { code: "en-IN", name: "English (Indian English)" },
        { code: "indic-auto", name: "Auto-detect / Code-mixed" },
      ],
    },
    version: "1.0.0",
  });
}
