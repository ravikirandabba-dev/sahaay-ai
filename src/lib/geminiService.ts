import { GoogleGenAI } from "@google/genai";
import { DEMO_ORDERS, DemoOrder } from "./demoOrders";

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface GeminiResponse {
  success: boolean;
  text: string;
  detectedLanguage: "Telugu" | "Hindi" | "English";
  languageCode: "te-IN" | "hi-IN" | "en-IN";
  recommendedVoice: "Kalpana" | "Shivani" | "Avinash";
  modelUsed?: string;
  provider: string;
  error?: string;
  isFallback?: boolean;
}

// Helper to detect language from script
export function detectLanguageFromText(text: string): {
  detectedLanguage: "Telugu" | "Hindi" | "English";
  languageCode: "te-IN" | "hi-IN" | "en-IN";
  recommendedVoice: "Kalpana" | "Shivani" | "Avinash";
} {
  if (/[\u0C00-\u0C7F]/.test(text)) {
    return { detectedLanguage: "Telugu", languageCode: "te-IN", recommendedVoice: "Kalpana" };
  }
  if (/[\u0900-\u097F]/.test(text)) {
    return { detectedLanguage: "Hindi", languageCode: "hi-IN", recommendedVoice: "Shivani" };
  }
  return { detectedLanguage: "English", languageCode: "en-IN", recommendedVoice: "Avinash" };
}

// Bounded conversation history (last 10 turns max)
export function sanitizeHistory(history?: ChatMessage[]): ChatMessage[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter((m) => m && (m.role === "user" || m.role === "model") && typeof m.text === "string")
    .slice(-10);
}

function getGeminiApiKey(): string | null {
  const rawKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
  const key = rawKey.replace(/['"\r\n]/g, "").trim();
  return key.length > 0 ? key : null;
}

export function isGeminiConfigured(): boolean {
  return getGeminiApiKey() !== null;
}

export async function askGeminiAssistant(
  prompt: string,
  history: ChatMessage[] = [],
  mode: "assistant" | "support" | "services" = "assistant"
): Promise<GeminiResponse> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    const langInfo = detectLanguageFromText(prompt);
    return {
      success: false,
      text:
        langInfo.detectedLanguage === "Telugu"
          ? "క్షమించండి, Gemini API Key ఇంకా కాన్ఫిగర్ చేయబడలేదు. దయచేసి .env.local ఫైల్‌లో GEMINI_API_KEY ని నమోదు చేయండి."
          : langInfo.detectedLanguage === "Hindi"
          ? "क्षमा करें, Gemini API Key अभी कॉन्फ़िगर नहीं की गई है। कृपया .env.local फ़ाइल में GEMINI_API_KEY दर्ज करें।"
          : "Gemini API Key is not configured. Please add your GEMINI_API_KEY into the .env.local file to enable full conversational intelligence.",
      ...langInfo,
      provider: "Configuration Required",
      isFallback: true,
      error: "MISSING_GEMINI_API_KEY: Please add GEMINI_API_KEY to your .env.local file.",
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  // System instruction based on mode
  let systemInstruction = "";

  if (mode === "support") {
    systemInstruction = `You are Sahaay AI, a polite, empathetic Indian Customer Support Agent for an e-commerce and logistics helpdesk.
CRITICAL LOGISTICS RULES:
1. We have a SYNTHETIC DEMO LOGISTICS DATABASE containing:
   - ORD-7821: Srinivas Rao, Smart LED TV, BlueDart Express, Status: In Transit at Hyderabad Hub (Delayed due to festive volume, ETA: Tomorrow 2:00 PM).
   - ORD-9104: Priya Sharma, Running Shoes, Delhivery, Status: Out for delivery today in Bengaluru South (Delivery OTP: 4921, Rider: Ramesh Kumar 98765-43210).
   - ORD-5532: Kavitha Reddy, Ergonomic Office Chair, Ecom Express, Status: Returned to Seller, Refund of ₹2,499 processed (Ref: UPI-984102981).
   - ORD-3319: Rajesh Verma, Mechanical Keyboard, Shadowfax, Status: Delayed at Mumbai Fulfillment Centre (Interstate transit scan pending).
2. If the user mentions an Order ID that is NOT in this database (e.g. ORD-9999), explain clearly that no matching order was found in the demo records, and invite them to test with ORD-7821, ORD-9104, ORD-5532, or ORD-3319.
3. NEVER fabricate live courier GPS coordinates or fake tracking numbers.
4. If the user asks a general support question without an Order ID, explain how you can help and ask for their Order ID.
5. Match the language of the user: reply in Telugu if the user writes/speaks in Telugu; in Hindi if in Hindi; in English if in English.
6. Keep responses clear, concise, and natural for voice readout (under 80 words).`;
  } else if (mode === "services") {
    systemInstruction = `You are Sahaay AI Public Services Assistant, an authoritative, helpful civic guide for Indian citizens.
VERIFIED OFFICIAL PROCEDURES:
1. Birth Certificates: Registration is regulated under the Registration of Births and Deaths Act via the Civil Registration System (crsorgi.gov.in) and state portals (e.g. Meeseva in AP/TS, e-District in UP/Delhi). Free within 21 days; nominal late fee from 21-30 days; requires SDM order after 1 year. Documents: hospital Form 1 birth report, parents' Aadhaar cards, marriage certificate, address proof.
2. Aadhaar Services: Regulated by UIDAI (uidai.gov.in, myaadhaar.uidai.gov.in). Address update and ₹50 PVC card orders can be done online. Mobile number linking and biometrics strictly require an in-person visit to an Aadhaar Seva Kendra. Mandatory child biometric update at ages 5 and 15 is free.
3. Student Scholarships: Regulated by the National Scholarship Portal (scholarships.gov.in). Requires Aadhaar-based One-Time Registration (OTR), institute nodal officer verification, and an active Aadhaar-seeded bank account via NPCI mapper for Direct Benefit Transfer (DBT).
RULES:
1. Always cite the verified official portal URL (crsorgi.gov.in, uidai.gov.in, or scholarships.gov.in).
2. Clearly state that Sahaay AI provides procedural guidance and does NOT submit statutory applications directly.
3. Match the language of the user (Telugu, Hindi, or English).
4. Keep answers concise, step-by-step, and pleasant for voice readout.`;
  } else {
    // Personal AI Mode: UNRESTRICTED GENERAL INTELLIGENCE
    systemInstruction = `You are Sahaay AI Personal Assistant — a highly capable, friendly, multilingual conversational AI companion for India.
CAPABILITIES:
- You answer open-ended questions across ALL topics: Geography, World Knowledge, Science, Math, History, Technology, Education, Coding, Languages, Career, and everyday life.
- You understand and speak fluent Indian English, Telugu (తెలుగు), and Hindi (हिन्दी).
- If the user asks a question in Telugu, respond naturally in pure, grammatically correct Telugu.
- If the user asks a question in Hindi, respond naturally in clear Hindi.
- If the user asks in English, respond in articulate, friendly English.
- If asked about location (e.g. "Where can I find India in world map?"), give an intuitive, geographically accurate explanation (e.g., "India is located in South Asia, bordered by the Indian Ocean to the south, the Arabian Sea to the west, the Bay of Bengal to the east, and countries like Pakistan, China, Nepal, Bhutan, Bangladesh, and Myanmar to the north").
- If asked for code, provide clean, idiomatic code with brief explanations.
- If asked for math, calculate accurately.
- Keep responses concise, direct, and conversational (1 to 3 short paragraphs max), perfectly suited for voice synthesis by text-to-speech.
- Maintain context from the previous messages in the conversation.`;
  }

  // Format messages for @google/genai
  // Convert history into contents structure
  const cleanHistory = sanitizeHistory(history);
  const contents: any[] = [];

  for (const msg of cleanHistory) {
    contents.push({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    });
  }

  // Add the current prompt
  contents.push({
    role: "user",
    parts: [{ text: prompt }],
  });

  // Candidate models in order of speed, stability and capability
  const candidateModels = [
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-3.7-flash",
    "gemini-3.8-flash",
  ];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });

      const responseText = response.text || "";
      if (responseText.trim().length > 0) {
        const langInfo = detectLanguageFromText(responseText || prompt);
        return {
          success: true,
          text: responseText.trim(),
          ...langInfo,
          modelUsed: model,
          provider: `Google Gemini (${model})`,
        };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Gemini model ${model} attempt failed:`, err?.message || err);
      // If 404 (model retired) or 503 (temporary spike), fall through to next candidate model
      if (
        err?.status === 404 ||
        err?.status === 503 ||
        err?.message?.includes("not found") ||
        err?.message?.includes("high demand")
      ) {
        continue;
      }
      // If quota or auth failure, stop cycling
      if (err?.status === 400 || err?.status === 401 || err?.status === 403) {
        break;
      }
    }
  }

  // If all models failed or threw error
  const langInfo = detectLanguageFromText(prompt);
  return {
    success: false,
    text: `I encountered an issue generating a live answer via Gemini: ${lastError?.message || "Model request error"}. Please check your API quota or network connection.`,
    ...langInfo,
    provider: "Google Gemini (Error)",
    error: lastError?.message || "Failed to generate content",
  };
}
