import { DEMO_ORDERS, DemoOrder } from "./demoOrders";

export type CustomerIntentType =
  | "DELIVERY_DELAY"
  | "REFUND_REQUEST"
  | "ORDER_CANCELLATION"
  | "ORDER_STATUS"
  | "GENERAL_INQUIRY";

export type UrgencyLevel = "HIGH" | "MEDIUM" | "LOW";

export interface IntelligenceAnalysis {
  detectedLanguage: "Telugu" | "Hindi" | "English" | "Code-Mixed";
  languageCode: "te-IN" | "hi-IN" | "en-IN";
  intent: CustomerIntentType;
  intentLabel: string;
  urgency: UrgencyLevel;
  confidenceScore: number;
  extractedOrderId: string | null;
  demoOrderRecord: DemoOrder | null;
  needsOrderId: boolean;
  isUnknownOrderId?: boolean;
  suggestedAction: string;
  recommendedWorkflow: string[];
  customerResponseText: string;
  responseLanguage: string;
}

export function analyzeCustomerVoiceText(text: string): IntelligenceAnalysis {
  const clean = text.trim();

  // 1. Detect Script / Language
  const hasTelugu = /[\u0C00-\u0C7F]/.test(clean);
  const hasHindi = /[\u0900-\u097F]/.test(clean);

  let detectedLanguage: "Telugu" | "Hindi" | "English" | "Code-Mixed" = "English";
  let languageCode: "te-IN" | "hi-IN" | "en-IN" = "en-IN";

  if (hasTelugu) {
    detectedLanguage = "Telugu";
    languageCode = "te-IN";
  } else if (hasHindi) {
    detectedLanguage = "Hindi";
    languageCode = "hi-IN";
  } else {
    // Check for Romanized Hindi/Telugu or English
    const lower = clean.toLowerCase();
    if (lower.includes("aaya") || lower.includes("kaha") || lower.includes("chahiye") || lower.includes("paise") || lower.includes("karega") || lower.includes("kya")) {
      detectedLanguage = "Code-Mixed";
      languageCode = "hi-IN";
    } else if (lower.includes("raleedu") || lower.includes("eppudu") || lower.includes("aledhu") || lower.includes("ivvandi") || lower.includes("chestaru")) {
      detectedLanguage = "Code-Mixed";
      languageCode = "te-IN";
    } else {
      detectedLanguage = "English";
      languageCode = "en-IN";
    }
  }

  // 2. Extract Order ID
  const orderIdMatch = clean.match(/ORD[-_\s]?(\d{4,6})/i);
  let extractedOrderId: string | null = null;
  if (orderIdMatch) {
    extractedOrderId = `ORD-${orderIdMatch[1]}`;
  } else {
    // Check if plain 4 digits match any demo order
    const plainNumMatch = clean.match(/\b(7821|9104|5532|3319)\b/);
    if (plainNumMatch) {
      extractedOrderId = `ORD-${plainNumMatch[1]}`;
    }
  }

  const demoOrderRecord = extractedOrderId && DEMO_ORDERS[extractedOrderId] ? DEMO_ORDERS[extractedOrderId] : null;
  const isUnknownOrderId = Boolean(extractedOrderId && !demoOrderRecord);

  // 3. Detect Intent & Urgency
  const lower = clean.toLowerCase();
  let intent: CustomerIntentType = "GENERAL_INQUIRY";
  let intentLabel = "General Customer Inquiry";
  let urgency: UrgencyLevel = "LOW";

  // Intent patterns
  const isDelay =
    /delay|delayed|late|not arrived|haven't received|hasn't arrived|where is my|tracking|రాలేదు|ఆలస్యం|లేట్|ఎప్పుడు వస్తుంది|జాప్యం|लेट|देरी|नहीं आया|कब आएगा|पहुंचा नहीं|डिले/i.test(
      clean
    );
  const isRefund =
    /refund|money back|amount credited|reimbursement|రీఫండ్|డబ్బులు|తిరిగి|వాపస్|रिफंड|पैसे वापस|रुपये वापस|खाते में/i.test(
      clean
    );
  const isCancel =
    /cancel|cancellation|stop order|don't want|కాన్సిల్|రద్దు|వద్దు|ఆపండి|कैंसिल|रद्द|नहीं चाहिए|रोक दें/i.test(
      clean
    );
  const isStatus =
    /status|track|details|package|where is|ఆర్డర్ వివరాలు|ఎక్కడుంది|స్టేటస్|कहाँ है|जानकारी|स्टेटस/i.test(clean);

  // General questions / capability inquiries
  const isGeneralQuestion =
    /what (can|will|you|are|gonna)|who are you|help|hello|hi|how are you|how does|what do you do|tell me about|support|capabilities|ఎవరు|ఏం చేయగలరు|ఏంటి|హలో|నమస్కారం|क्या कर सकते|कौन हो|मदद|सहायता|नमस्ते/i.test(
      clean
    );

  if (isDelay) {
    intent = "DELIVERY_DELAY";
    intentLabel = "Delivery Delay & Logistics Escalation";
    urgency = demoOrderRecord?.status === "Delayed" ? "HIGH" : "MEDIUM";
  } else if (isRefund) {
    intent = "REFUND_REQUEST";
    intentLabel = "Refund Status & Payment Reconciliation";
    urgency = "HIGH";
  } else if (isCancel) {
    intent = "ORDER_CANCELLATION";
    intentLabel = "Order Cancellation Request";
    urgency = "HIGH";
  } else if (isStatus) {
    intent = "ORDER_STATUS";
    intentLabel = "Shipment Tracking & Status";
    urgency = "MEDIUM";
  } else {
    intent = "GENERAL_INQUIRY";
    intentLabel = "General Customer Inquiry";
    urgency = "LOW";
  }

  // 4. Determine Action & Response based on intent and order presence
  let needsOrderId = false;
  let suggestedAction = "";
  const recommendedWorkflow: string[] = [];
  let customerResponseText = "";

  if (demoOrderRecord) {
    // Valid Demo Order Found
    switch (intent) {
      case "DELIVERY_DELAY":
        suggestedAction = `Escalate shipment with ${demoOrderRecord.carrier}. Send dispatch alert for order ${demoOrderRecord.orderId}.`;
        recommendedWorkflow.push(`Identify delay factor: ${demoOrderRecord.delayReason || "Transit congestion"}`);
        recommendedWorkflow.push(`Log formal escalation with ${demoOrderRecord.carrier} (AWB: ${demoOrderRecord.trackingNumber})`);
        recommendedWorkflow.push(`Commit new ETA: ${demoOrderRecord.expectedDelivery}`);
        recommendedWorkflow.push("Send WhatsApp status notification to customer");

        if (languageCode === "te-IN") {
          customerResponseText = `నమస్కారం ${demoOrderRecord.customerName.split(" ")[0]} గారూ, మీ ఆర్డర్ ${demoOrderRecord.orderId} ప్రస్తుతం ${demoOrderRecord.currentLocation} వద్ద ఉంది. ప్రాంతీయ రద్దీ కారణంగా కొద్దిగా ఆలస్యం అయింది. మీ ప్యాకేజీ ${demoOrderRecord.expectedDelivery} కల్లా ఖచ్చితంగా డెలివరీ చేయబడుతుంది. దీనికి సంబంధించి డెలివరీ బృందానికి ఎస్కేలేషన్ పంపబడింది.`;
        } else if (languageCode === "hi-IN") {
          customerResponseText = `नमस्ते ${demoOrderRecord.customerName.split(" ")[0]} जी, आपका ऑर्डर ${demoOrderRecord.orderId} इस समय ${demoOrderRecord.currentLocation} पर है। त्योहारी भीड़ के कारण इसमें थोड़ी देरी हुई है। आपका सामान ${demoOrderRecord.expectedDelivery} तक पहुँचा दिया जाएगा। हमने लॉजिस्टिक्स टीम को प्राथमिकता अलर्ट भेज दिया है।`;
        } else {
          customerResponseText = `Hello ${demoOrderRecord.customerName.split(" ")[0]}, we apologize for the delay on order ${demoOrderRecord.orderId}. Your package is currently at ${demoOrderRecord.currentLocation}. Our logistics partner ${demoOrderRecord.carrier} confirms it will be delivered by ${demoOrderRecord.expectedDelivery}. We have issued an expedited priority ticket on your behalf.`;
        }
        break;

      case "ORDER_STATUS":
        suggestedAction = `Share real-time tracking coordinates and courier details for ${demoOrderRecord.orderId}.`;
        recommendedWorkflow.push(`Retrieve current milestone: ${demoOrderRecord.currentLocation}`);
        recommendedWorkflow.push(`Provide carrier tracking link: ${demoOrderRecord.trackingNumber}`);
        recommendedWorkflow.push(`Expected ETA: ${demoOrderRecord.expectedDelivery}`);

        if (languageCode === "te-IN") {
          customerResponseText = `మీ ఆర్డర్ ${demoOrderRecord.orderId} వివరాలు: ప్రస్తుతం ${demoOrderRecord.currentLocation} లో ఉంది. డెలివరీ స్థితి: ${demoOrderRecord.status}. అంచనా డెలివరీ సమయం: ${demoOrderRecord.expectedDelivery}.`;
        } else if (languageCode === "hi-IN") {
          customerResponseText = `आपके ऑर्डर ${demoOrderRecord.orderId} की स्थिति: पैकेज अभी ${demoOrderRecord.currentLocation} पर है। अनुमानित डिलीवरी: ${demoOrderRecord.expectedDelivery}।`;
        } else {
          customerResponseText = `Your order ${demoOrderRecord.orderId} is currently ${demoOrderRecord.status} at ${demoOrderRecord.currentLocation}. Expected delivery is ${demoOrderRecord.expectedDelivery}.`;
        }
        break;

      case "REFUND_REQUEST":
        suggestedAction = `Review refund transaction details for ${demoOrderRecord.orderId} (${demoOrderRecord.refundAmount || "Pending"}).`;
        recommendedWorkflow.push(`Verify return reception at warehouse`);
        recommendedWorkflow.push(`Confirm bank reference: Ref UPI-984102981`);
        recommendedWorkflow.push(`Send customer formal refund invoice receipt`);

        if (languageCode === "te-IN") {
          customerResponseText = `మీ ఆర్డర్ ${demoOrderRecord.orderId} కు సంబంధించిన రిఫండ్ ${demoOrderRecord.refundAmount || "₹2,499"} మీ మూల బ్యాంక్ లేదా UPI ఖాతాకు విజయవంతంగా జమ చేయబడింది. రిఫరెన్స్ నంబర్: UPI-984102981. మీ బ్యాంక్ స్టేట్మెంట్ తనిఖీ చేయగలరు.`;
        } else if (languageCode === "hi-IN") {
          customerResponseText = `आपके ऑर्डर ${demoOrderRecord.orderId} का रिफंड ${demoOrderRecord.refundAmount || "₹2,499"} आपके बैंक खाते / UPI में जमा कर दिया गया है। संदर्भ आईडी UPI-984102981 है।`;
        } else {
          customerResponseText = `For order ${demoOrderRecord.orderId}, a refund of ${demoOrderRecord.refundAmount || "₹2,499.00"} has been successfully processed to your original payment method with reference ID UPI-984102981.`;
        }
        break;

      case "ORDER_CANCELLATION":
        suggestedAction = `Verify cancellation eligibility for order ${demoOrderRecord.orderId}.`;
        recommendedWorkflow.push(`Check shipment stage (Current: ${demoOrderRecord.status})`);
        recommendedWorkflow.push(`If in-transit, issue return-to-origin command to ${demoOrderRecord.carrier}`);
        recommendedWorkflow.push(`Trigger automatic refund within 24 hours`);

        if (languageCode === "te-IN") {
          customerResponseText = `ఆర్డర్ ${demoOrderRecord.orderId} రద్దు ప్రక్రియ ప్రారంభించబడింది. వస్తువు రవాణాలో ఉన్నందున డెలివరీ ఏజెంట్ కు Return-to-Origin ఆదేశం పంపాము. డెలివరీ వచ్చినప్పుడు ప్యాకేజీ తిరస్కరించండి, మీ రీఫండ్ 24 గంటల్లో జమవుతుంది.`;
        } else if (languageCode === "hi-IN") {
          customerResponseText = `ऑर्डर ${demoOrderRecord.orderId} को रद्द करने का अनुरोध दर्ज कर लिया गया है। कूरियर को वापसी का निर्देश भेज दिया गया है। पार्सल मिलने पर कृपया स्वीकार न करें।`;
        } else {
          customerResponseText = `Your cancellation request for order ${demoOrderRecord.orderId} has been registered. A Return-to-Origin signal has been transmitted to ${demoOrderRecord.carrier}. Please decline the delivery at doorstep, and your refund will be triggered immediately.`;
        }
        break;

      default:
        suggestedAction = `Provide customer assistance for order ${demoOrderRecord.orderId}.`;
        customerResponseText = `We found your order ${demoOrderRecord.orderId} for ${demoOrderRecord.items.join(", ")}. Current status is ${demoOrderRecord.status} at ${demoOrderRecord.currentLocation}. How can we assist you with this shipment today?`;
    }
  } else if (isUnknownOrderId) {
    // User provided an order ID, but it doesn't match any demo record
    needsOrderId = false;
    suggestedAction = `Notify customer that order ${extractedOrderId} was not found in demo records and provide active test IDs.`;
    recommendedWorkflow.push(`Search synthetic database for ${extractedOrderId}`);
    recommendedWorkflow.push("Record not found; prevent hallucination of live tracking");
    recommendedWorkflow.push("Provide active synthetic demo IDs (ORD-7821, ORD-9104, ORD-5532, ORD-3319)");

    if (languageCode === "te-IN") {
      customerResponseText = `క్షమించండి, మా సింథటిక్ డెమో డేటాబేస్ లో ఆర్డర్ ${extractedOrderId} కనుగొనబడలేదు. దయచేసి మీ ఆర్డర్ నంబర్ సరిచూసుకోండి లేదా మా డెమో ఆర్డర్లతో పరీక్షించండి: ORD-7821 (ఆలస్యం), ORD-9104 (రవాణాలో ఉంది), లేదా ORD-5532 (రీఫండ్ పూర్తయింది).`;
    } else if (languageCode === "hi-IN") {
      customerResponseText = `क्षमा करें, हमारे सिंथेटिक डेमो डेटाबेस में ऑर्डर ${extractedOrderId} का कोई रिकॉर्ड नहीं मिला। कृपया अपना ऑर्डर नंबर जांचें या सक्रिय डेमो रिकॉर्ड्स का उपयोग करें: ORD-7821 (देरी), ORD-9104 (रास्ते में), या ORD-5532 (रिफंड हुआ)।`;
    } else {
      customerResponseText = `No matching record was found for order ${extractedOrderId} in our synthetic demonstration database. Please verify your order number, or test with one of our active demo records: ORD-7821 (Delayed), ORD-9104 (In Transit), ORD-5532 (Refund Processed), or ORD-3319 (Packing).`;
    }
  } else if (intent === "GENERAL_INQUIRY") {
    // User asked a general question like "What you gonna do now?" or "What can you do?"
    needsOrderId = false;
    suggestedAction = "Explain Sahaay AI logistics intelligence capabilities in customer language.";
    recommendedWorkflow.push("Acknowledge general greeting / capability inquiry");
    recommendedWorkflow.push("Explain multilingual voice support (Telugu, Hindi, English)");
    recommendedWorkflow.push("Invite specific logistics query or demo order lookup");

    if (languageCode === "te-IN") {
      customerResponseText = "నమస్కారం! నేను సహాయ్ AI, జ్ఞాని ప్రిస్మా మరియు టింబ్రేతో పనిచేసే మీ బహుభాషా వాయిస్ హెల్ప్‌డెస్క్. డెలివరీ ఆలస్యాల విచారణ, కొరియర్ ఎస్కేలేషన్, రీఫండ్ స్టేటస్ మరియు ఆర్డర్ రద్దులకు నేను సహాయం చేయగలను. మీ సమస్యను తెలుగు, హిందీ లేదా ఇంగ్లీషులో మాట్లాడండి లేదా ORD-7821 వంటి డెమో ఆర్డర్ నంబర్ చెప్పండి!";
    } else if (languageCode === "hi-IN") {
      customerResponseText = "नमस्ते! मैं सहाय AI हूँ, आपका बहुभाषी वॉइस हेल्पडेस्क जो ज्ञानी प्रिज़्म और टिम्ब्रे द्वारा संचालित है। मैं पार्सल ट्रैकिंग, डिलीवरी में देरी की शिकायत, रिफंड और ऑर्डर कैंसिलेशन में आपकी सहायता कर सकता हूँ। आप हिंदी, तेलुगु या अंग्रेजी में बोल सकते हैं या ORD-7821 जैसा डेमो ऑर्डर नंबर बता सकते हैं!";
    } else {
      customerResponseText = "Hello! I am Sahaay AI, India's Multilingual Voice Helpdesk powered by Gnani Prisma and Timbre. I can look up live shipment locations, escalate delayed deliveries with our logistics partners (BlueDart, Delhivery), verify refund statuses, and assist with cancellations in Telugu, Hindi, or English. You can speak naturally or test with demo orders like ORD-7821!";
    }
  } else if (intent === "DELIVERY_DELAY" || intent === "ORDER_STATUS") {
    // Delivery or status request without order ID
    needsOrderId = true;
    suggestedAction = "Prompt customer for synthetic Demo Order ID to locate shipment.";
    recommendedWorkflow.push("Detect delivery delay / tracking inquiry");
    recommendedWorkflow.push("Order ID missing from voice transcript");
    recommendedWorkflow.push("Politely request specific Order ID (e.g., ORD-7821, ORD-9104)");

    if (languageCode === "te-IN") {
      customerResponseText = "మీ డెలివరీ ఆలస్యం అయినందుకు విచారం వ్యక్తం చేస్తున్నాము. మీ పార్సిల్ ఎక్కడుందో తనిఖీ చేసి కొరియర్ బృందానికి ఎస్కేలేషన్ పంపడానికి, దయచేసి మీ ఆర్డర్ ఐడీ (ఉదాహరణకు ORD-7821 లేదా ORD-9104) చెప్పండి.";
    } else if (languageCode === "hi-IN") {
      customerResponseText = "डिलीवरी में हुई देरी के लिए हमें खेद है। आपके पार्सल की सटीक स्थिति जानने और कूरियर को प्राथमिकता संदेश भेजने के लिए कृपया अपना ऑर्डर आईडी (जैसे ORD-7821 या ORD-9104) बताएं।";
    } else {
      customerResponseText = "We understand your shipment is delayed. To look up your parcel coordinates and issue an immediate courier escalation, please provide your Order ID (such as ORD-7821 or ORD-9104).";
    }
  } else if (intent === "REFUND_REQUEST") {
    // Refund request without order ID
    needsOrderId = true;
    suggestedAction = "Explain refund policy and request order ID to locate transaction reference.";
    recommendedWorkflow.push("Detect refund inquiry");
    recommendedWorkflow.push("Explain standard 3-5 day refund processing timeline");
    recommendedWorkflow.push("Prompt customer for Order ID (e.g. ORD-5532) for UTR lookup");

    if (languageCode === "te-IN") {
      customerResponseText = "రీఫండ్ విచారణలకు సంబంధించి, ఆమోదించబడిన రిటర్న్ లు 3 నుండి 5 పని దినాలలో మీ అసలు ఖాతాకు జమ చేయబడతాయి. నిర్దిష్ట రీఫండ్ స్టేటస్ లేదా బ్యాంక్ రెఫరెన్స్ కోసం దయచేసి మీ ఆర్డర్ ఐడీ (ఉదాహరణకు ORD-5532) చెప్పండి.";
    } else if (languageCode === "hi-IN") {
      customerResponseText = "रिफंड के संबंध में, स्वीकृत रिटर्न 3 से 5 कार्य दिवसों में मूल खाते में जमा कर दिए जाते हैं। अपने विशिष्ट रिफंड या बैंक संदर्भ की स्थिति जानने के लिए कृपया अपना ऑर्डर आईडी (जैसे ORD-5532) बताएं।";
    } else {
      customerResponseText = "For refund inquiries, approved returns are typically credited back to the original payment method within 3 to 5 business days. To look up a specific transaction or bank reference, please provide your Order ID (such as ORD-5532).";
    }
  } else if (intent === "ORDER_CANCELLATION") {
    // Cancellation request without order ID
    needsOrderId = true;
    suggestedAction = "Explain cancellation policy and request order ID to verify dispatch stage.";
    recommendedWorkflow.push("Detect cancellation intent");
    recommendedWorkflow.push("Check cancellation eligibility requirements");
    recommendedWorkflow.push("Prompt customer for Order ID to initiate Return-to-Origin");

    if (languageCode === "te-IN") {
      customerResponseText = "రవాణా ప్రారంభం కాకముందే ఆర్డర్ రద్దు చేయవచ్చు. ఒకవేళ రవాణాలో ఉంటే డెలివరీ ఏజెంట్ కు Return-to-Origin ఆదేశం పంపబడుతుంది. మీ రద్దును ప్రాసెస్ చేయడానికి దయచేసి మీ ఆర్డర్ ఐడీ చెప్పండి.";
    } else if (languageCode === "hi-IN") {
      customerResponseText = "डिलीवरी निकलने से पहले ऑर्डर तुरंत रद्द किया जा सकता है। रास्ते में होने पर कूरियर को वापसी का निर्देश दिया जाता है। अपने ऑर्डर को रद्द करने के लिए कृपया अपना ऑर्डर आईडी बताएं।";
    } else {
      customerResponseText = "Orders can be cancelled before delivery dispatch. Once in transit, we can transmit a Return-to-Origin command. To verify your shipment status and proceed with cancellation, please provide your Order ID.";
    }
  }

  return {
    detectedLanguage,
    languageCode,
    intent,
    intentLabel,
    urgency,
    confidenceScore: 0.95,
    extractedOrderId,
    demoOrderRecord,
    needsOrderId,
    isUnknownOrderId,
    suggestedAction,
    recommendedWorkflow,
    customerResponseText,
    responseLanguage: detectedLanguage,
  };
}
