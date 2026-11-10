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

  let geminiKey = process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim() || "";
  if (
    (geminiKey.startsWith('"') && geminiKey.endsWith('"')) ||
    (geminiKey.startsWith("'") && geminiKey.endsWith("'"))
  ) {
    geminiKey = geminiKey.substring(1, geminiKey.length - 1).trim();
  }
  const isGeminiConfigured = Boolean(geminiKey && geminiKey.length > 5);

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
      gnaniCredentialStatus: isConfigured ? "Active (Server-Side Protected)" : "Not Configured",
      gnaniApiBaseUrl: "https://api.vachana.ai",
      gnaniApiEndpointSTT: "https://api.vachana.ai/stt/v3",
      gnaniApiEndpointTTS: "https://api.vachana.ai/api/v1/tts/inference",
      gnaniApiReachable,
      connectivityNote,
      sttModel: "prisma-v3.0",
      ttsModel: "timbre-v3.0",
      geminiConfigured: isGeminiConfigured,
      geminiCredentialStatus: isGeminiConfigured ? "Active (Server-Side Protected)" : "Not Configured",
      llmProvider: isGeminiConfigured ? "Google Gemini (gemini-3.5-flash)" : "Verified Multilingual Knowledge Engine",
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
