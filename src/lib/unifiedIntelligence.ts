import { analyzeCustomerVoiceText, IntelligenceAnalysis } from './supportIntelligence';
import { processPersonalAIQuery, PersonalAIResponse } from './personalAssistantIntelligence';
import { processPublicServicesQuery, PublicServiceResponse } from './publicServicesIntelligence';
import { askGeminiAssistant, isGeminiConfigured, ChatMessage, GeminiResponse } from './geminiService';

export type AssistanceMode = 'support' | 'assistant' | 'services';

export interface UnifiedAssistanceResult {
  mode: AssistanceMode;
  suggestedMode: AssistanceMode;
  isModeSwitched: boolean;
  detectedLanguage: 'English' | 'Telugu' | 'Hindi' | 'Code-Mixed';
  languageCode: 'en-IN' | 'te-IN' | 'hi-IN';
  spokenResponseText: string;
  recommendedVoice: 'Kalpana' | 'Shivani' | 'Avinash';
  providerLabel?: string;
  isGeminiPowered?: boolean;
  supportAnalysis?: IntelligenceAnalysis;
  personalAIResponse?: PersonalAIResponse;
  publicServiceResponse?: PublicServiceResponse;
}

/**
 * Conservative automatic mode suggestion based on user query
 */
export function suggestAssistanceMode(text: string): AssistanceMode {
  const clean = text.toLowerCase();

  // Public services keywords
  if (
    /birth certificate|aadhaar|aadhar|scholarship|uidai|crsorgi|janma|పౌర సేవలు|జనన|ఆధార్|స్కాలర్‌షిప్|जन्म प्रमाण|छात्रवृत्ति/.test(
      clean
    )
  ) {
    return 'services';
  }

  // Support / logistics keywords
  if (
    /order|ord-|delivery|delayed|shipment|refund|cancel|track|package|courier|రాలేదు|ఆర్డర్|డెలివరీ|रिफंड|पार्सल|ऑर्डर/.test(
      clean
    )
  ) {
    return 'support';
  }

  // Personal AI / tech / study / general world knowledge keywords
  return 'assistant';
}

/**
 * Synchronous unified processing (uses verified local knowledge engines)
 */
export function processUnifiedAssistance(
  text: string,
  selectedMode: AssistanceMode = 'support',
  explicitModeChosen: boolean = true
): UnifiedAssistanceResult {
  const suggestedMode = suggestAssistanceMode(text);
  const activeMode: AssistanceMode = explicitModeChosen ? selectedMode : suggestedMode;
  const isModeSwitched = activeMode !== selectedMode;

  if (activeMode === 'assistant') {
    const aiResult = processPersonalAIQuery(text);
    const voice =
      aiResult.languageCode === 'te-IN'
        ? 'Kalpana'
        : aiResult.languageCode === 'hi-IN'
        ? 'Shivani'
        : 'Avinash';

    return {
      mode: 'assistant',
      suggestedMode,
      isModeSwitched,
      detectedLanguage: aiResult.detectedLanguage,
      languageCode: aiResult.languageCode,
      spokenResponseText: aiResult.answerText,
      recommendedVoice: voice,
      providerLabel: aiResult.providerLabel,
      isGeminiPowered: false,
      personalAIResponse: aiResult
    };
  }

  if (activeMode === 'services') {
    const srvResult = processPublicServicesQuery(text);
    const voice =
      srvResult.languageCode === 'te-IN'
        ? 'Kalpana'
        : srvResult.languageCode === 'hi-IN'
        ? 'Shivani'
        : 'Avinash';

    return {
      mode: 'services',
      suggestedMode,
      isModeSwitched,
      detectedLanguage: srvResult.detectedLanguage,
      languageCode: srvResult.languageCode,
      spokenResponseText: srvResult.explanation,
      recommendedVoice: voice,
      providerLabel: 'Verified Government Regulations (crsorgi / uidai / scholarships)',
      isGeminiPowered: false,
      publicServiceResponse: srvResult
    };
  }

  // Default: Customer Support
  const supportResult = analyzeCustomerVoiceText(text);
  const langCode =
    supportResult.detectedLanguage === 'Telugu'
      ? 'te-IN'
      : supportResult.detectedLanguage === 'Hindi'
      ? 'hi-IN'
      : 'en-IN';
  const voice =
    langCode === 'te-IN' ? 'Kalpana' : langCode === 'hi-IN' ? 'Shivani' : 'Avinash';

  return {
    mode: 'support',
    suggestedMode,
    isModeSwitched,
    detectedLanguage: supportResult.detectedLanguage,
    languageCode: langCode,
    spokenResponseText: supportResult.customerResponseText,
    recommendedVoice: voice,
    providerLabel: 'Sahaay Logistics Intelligence Engine',
    isGeminiPowered: false,
    supportAnalysis: supportResult
  };
}

/**
 * Asynchronous unified processing with live Google Gemini LLM integration
 */
export async function processUnifiedAssistanceAsync(
  text: string,
  selectedMode: AssistanceMode = 'support',
  explicitModeChosen: boolean = true,
  history: ChatMessage[] = []
): Promise<UnifiedAssistanceResult> {
  const suggestedMode = suggestAssistanceMode(text);
  const activeMode: AssistanceMode = explicitModeChosen ? selectedMode : suggestedMode;
  const isModeSwitched = activeMode !== selectedMode;

  // If Gemini is configured, invoke live Gemini
  if (isGeminiConfigured()) {
    try {
      const geminiRes: GeminiResponse = await askGeminiAssistant(text, history, activeMode);

      if (geminiRes.success && geminiRes.text) {
        if (activeMode === 'support') {
          const supportResult = analyzeCustomerVoiceText(text);
          return {
            mode: 'support',
            suggestedMode,
            isModeSwitched,
            detectedLanguage: geminiRes.detectedLanguage,
            languageCode: geminiRes.languageCode,
            spokenResponseText: geminiRes.text,
            recommendedVoice: geminiRes.recommendedVoice,
            providerLabel: geminiRes.provider,
            isGeminiPowered: true,
            supportAnalysis: {
              ...supportResult,
              customerResponseText: geminiRes.text
            }
          };
        }

        if (activeMode === 'services') {
          const srvResult = processPublicServicesQuery(text);
          return {
            mode: 'services',
            suggestedMode,
            isModeSwitched,
            detectedLanguage: geminiRes.detectedLanguage,
            languageCode: geminiRes.languageCode,
            spokenResponseText: geminiRes.text,
            recommendedVoice: geminiRes.recommendedVoice,
            providerLabel: geminiRes.provider,
            isGeminiPowered: true,
            publicServiceResponse: {
              ...srvResult,
              explanation: geminiRes.text
            }
          };
        }

        // Personal AI with live Gemini
        return {
          mode: 'assistant',
          suggestedMode,
          isModeSwitched,
          detectedLanguage: geminiRes.detectedLanguage,
          languageCode: geminiRes.languageCode,
          spokenResponseText: geminiRes.text,
          recommendedVoice: geminiRes.recommendedVoice,
          providerLabel: geminiRes.provider,
          isGeminiPowered: true,
          personalAIResponse: {
            query: text,
            detectedLanguage: geminiRes.detectedLanguage,
            languageCode: geminiRes.languageCode,
            category: 'Live Conversational AI',
            answerText: geminiRes.text,
            keyPoints: [
              `Generated live by ${geminiRes.provider}.`,
              'Conversational context retained for follow-up questions.'
            ],
            suggestedFollowUps: [
              'Ask a follow-up question',
              'Explain in Telugu (తెలుగులో చెప్పండి)',
              'Explain in Hindi (हिंदी में समझाएं)'
            ],
            providerLabel: geminiRes.provider
          }
        };
      }
    } catch (err) {
      console.warn('Gemini live call error, falling back to local engine:', err);
    }
  }

  // Fallback to local verified engine
  return processUnifiedAssistance(text, selectedMode, explicitModeChosen);
}
