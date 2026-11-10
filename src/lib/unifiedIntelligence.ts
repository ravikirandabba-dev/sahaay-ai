import { analyzeCustomerVoiceText, IntelligenceAnalysis } from './supportIntelligence';
import { processPersonalAIQuery, PersonalAIResponse } from './personalAssistantIntelligence';
import { processPublicServicesQuery, PublicServiceResponse } from './publicServicesIntelligence';

export type AssistanceMode = 'support' | 'assistant' | 'services';

export interface UnifiedAssistanceResult {
  mode: AssistanceMode;
  suggestedMode: AssistanceMode;
  isModeSwitched: boolean;
  detectedLanguage: 'English' | 'Telugu' | 'Hindi' | 'Code-Mixed';
  languageCode: 'en-IN' | 'te-IN' | 'hi-IN';
  spokenResponseText: string;
  recommendedVoice: 'Kalpana' | 'Shivani' | 'Avinash';
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

  // Personal AI / tech / study / concepts keywords
  if (
    /explain|what is|how does|artificial intelligence|\bai\b|machine learning|\bml\b|cloud computing|study tip|interview|deep learning|కృత్రిమ మేధస్సు|చదువుకోవడానికి|వివరించండి|आर्टिफिशियल|मशीन लर्निंग|पढ़ाई/.test(
      clean
    )
  ) {
    return 'assistant';
  }

  // Default to customer support (logistics, delivery, refunds, orders)
  return 'support';
}

export function processUnifiedAssistance(
  text: string,
  selectedMode: AssistanceMode = 'support',
  explicitModeChosen: boolean = true
): UnifiedAssistanceResult {
  const suggestedMode = suggestAssistanceMode(text);

  // If explicit mode was NOT locked by the user, adopt the conservative auto-suggestion
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
    supportAnalysis: supportResult
  };
}
