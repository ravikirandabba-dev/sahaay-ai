export interface PublicServiceResponse {
  query: string;
  detectedLanguage: 'English' | 'Telugu' | 'Hindi';
  languageCode: 'en-IN' | 'te-IN' | 'hi-IN';
  serviceCategory: 'Birth Certificate' | 'Aadhaar Services' | 'Student Scholarships' | 'General Public Information';
  title: string;
  officialPortalName: string;
  officialPortalUrl: string;
  lastVerifiedDate: string;
  explanation: string;
  stepByStepGuide: string[];
  requiredDocuments: string[];
  importantNotes: string[];
  disclaimer: string;
}

function detectLanguage(text: string): { name: 'English' | 'Telugu' | 'Hindi'; code: 'en-IN' | 'te-IN' | 'hi-IN' } {
  if (/[\u0C00-\u0C7F]/.test(text)) {
    return { name: 'Telugu', code: 'te-IN' };
  }
  if (/[\u0900-\u097F]/.test(text)) {
    return { name: 'Hindi', code: 'hi-IN' };
  }
  return { name: 'English', code: 'en-IN' };
}

export function processPublicServicesQuery(queryText: string): PublicServiceResponse {
  const clean = queryText.toLowerCase().trim();
  const lang = detectLanguage(queryText);

  // Check 1: Birth Certificate
  const isBirthCert = /birth|certificate|janma|జనన|పుట్టిన|ధ్రువీకరణ|जन्म|प्रमाणपत्र/.test(clean);

  // Check 2: Aadhaar Services
  const isAadhaar = /aadhaar|aadhar|uidai|ఆధార్|आधार|card/.test(clean) && !isBirthCert;

  // Check 3: Student Scholarships
  const isScholarship = /scholarship|scholarships|nsp|fellowship|financial aid|స్కాలర్‌షిప్|విద్యార్థి|छात्रवृत्ति|स्कॉलरशिप/.test(clean);

  // ==========================================
  // CATEGORY 1: BIRTH CERTIFICATE GUIDANCE
  // ==========================================
  if (isBirthCert) {
    if (lang.name === 'Telugu') {
      return {
        query: queryText,
        detectedLanguage: 'Telugu',
        languageCode: 'te-IN',
        serviceCategory: 'Birth Certificate',
        title: 'జనన ధ్రువీకరణ పత్రం (Birth Certificate) దరఖాస్తు మార్గదర్శకాలు',
        officialPortalName: 'Civil Registration System (CRS) & State Citizen Portals (Meeseva)',
        officialPortalUrl: 'https://crsorgi.gov.in',
        lastVerifiedDate: 'November 2026',
        explanation: 'భారతదేశంలో జనన ధ్రువీకరణ పత్రం రిజిస్ట్రార్ జనరల్ ఆఫ్ ఇండియా (CRS) నిబంధనల ప్రకారం జారీ చేయబడుతుంది. జననం జరిగిన 21 రోజులలోపు నమోదు చేసుకోవడం ఉచితం. 21 రోజుల తర్వాత ఆలస్య రుసుముతో మరియు తహశీల్దార్ లేదా రెవెన్యూ డివిజనల్ ఆఫీసర్ (RDO) అనుమతితో నమోదు చేయవచ్చు.',
        stepByStepGuide: [
          'దశ 1: ఆసుపత్రి డిశ్చార్జ్ సారాంశం లేదా సంస్థాగత జనన నివేదిక (Form 1) సేకరించండి.',
          'దశ 2: కేంద్ర CRS పోర్టల్ (crsorgi.gov.in) లేదా రాష్ట్ర మీసేవా (Meeseva) కేంద్రం ద్వారా దరఖాస్తు సమర్పించండి.',
          'దశ 3: తల్లిదండ్రుల ఆధార్ కార్డులు, వివాహ ధ్రువీకరణ పత్రం మరియు నివాస ధ్రువీకరణ పత్రాలు సమర్పించండి.',
          'దశ 4: రిజిస్ట్రార్ ధృవీకరణ పూర్తయిన తర్వాత డిజిటల్ సంతకంతో కూడిన పత్రాన్ని ఆన్‌లైన్‌లో డౌన్‌లోడ్ చేసుకోండి.'
        ],
        requiredDocuments: [
          'ఆసుపత్రి ఇచ్చిన జనన ధ్రువీకరణ రసీదు / Form 1',
          'తల్లి మరియు తండ్రి ఆధార్ కార్డులు',
          'తల్లిదండ్రుల వివాహ ధ్రువీకరణ పత్రం (వర్తిస్తే)',
          'చిరునామా ధ్రువీకరణ పత్రం (కరెంట్ బిల్లు / రేషన్ కార్డు)'
        ],
        importantNotes: [
          '21 రోజులలోపు నమోదు ఉచితం.',
          '21 నుండి 30 రోజుల మధ్య నమోదుకు నామమాత్రపు లేట్ ఫీజు వర్తిస్తుంది.',
          '1 సంవత్సరం పైబడిన జననాలకు సబ్-డివిజనల్ మేజిస్ట్రేట్ (SDM) నుండి ఆర్డర్ అవసరం.'
        ],
        disclaimer: 'గమనిక: ఇది సమాచార మార్గదర్శకత్వం మాత్రమే. అధికారిక దరఖాస్తును సంబంధిత మున్సిపల్ కార్యాలయం, గ్రామ పంచాయతీ లేదా అధికారిక CRS/మీసేవా పోర్టల్‌లో నేరుగా సమర్పించాలి.'
      };
    }

    if (lang.name === 'Hindi') {
      return {
        query: queryText,
        detectedLanguage: 'Hindi',
        languageCode: 'hi-IN',
        serviceCategory: 'Birth Certificate',
        title: 'जन्म प्रमाण पत्र (Birth Certificate) आवेदन प्रक्रिया एवं दिशा-निर्देश',
        officialPortalName: 'Civil Registration System (CRS - crsorgi.gov.in) एवं राज्य ई-डिस्ट्रिक्ट पोर्टल',
        officialPortalUrl: 'https://crsorgi.gov.in',
        lastVerifiedDate: 'November 2026',
        explanation: 'भारत में जन्म प्रमाण पत्र जन्म एवं मृत्यु पंजीकरण अधिनियम के तहत जारी किया जाता है। जन्म के 21 दिनों के भीतर पंजीकरण कराना अनिवार्य और निःशुल्क है। 21 दिनों के उपरांत विलंब शुल्क तथा सक्षम अधिकारी (तहसीलदार या एसडीएम) की अनुमति से पंजीकरण होता है।',
        stepByStepGuide: [
          'चरण 1: अस्पताल से डिस्चार्ज स्लिप या जन्म रिपोर्ट (प्रपत्र 1) प्राप्त करें।',
          'चरण 2: आधिकारिक सीआरएस पोर्टल (crsorgi.gov.in) या राज्य ई-डिस्ट्रिक्ट पोर्टल पर लॉगिन करें।',
          'चरण 3: माता-पिता के आधार कार्ड और निवास प्रमाण पत्र अपलोड करें।',
          'चरण 4: स्थानीय रजिस्ट्रार (नगर निगम या ग्राम पंचायत) द्वारा सत्यापन के बाद डिजिटल जन्म प्रमाण पत्र डाउनलोड करें।'
        ],
        requiredDocuments: [
          'अस्पताल द्वारा जारी जन्म रिपोर्ट या डिस्चार्ज समरी',
          'माता एवं पिता दोनों के आधार कार्ड की प्रति',
          'माता-पिता का विवाह प्रमाण पत्र (यदि उपलब्ध हो)',
          'वर्तमान पते का प्रमाण (राशन कार्ड/बिजली बिल/वोटर आईडी)'
        ],
        importantNotes: [
          'जन्म के 21 दिनों तक पंजीकरण पूरी तरह निःशुल्क है।',
          '21 से 30 दिनों के बीच मामूली विलंब शुल्क लगता है।',
          '1 वर्ष से अधिक की देरी होने पर उप-विभागीय मजिस्ट्रेट (SDM) का आदेश आवश्यक होता है।'
        ],
        disclaimer: 'महत्वपूर्ण सूचना: यह केवल आधिकारिक दिशा-निर्देशों की सहायता है। वास्तविक आवेदन संबंधित नगर पालिका, ब्लॉक कार्यालय या crsorgi.gov.in पर ही दर्ज करें।'
      };
    }

    // Default English
    return {
      query: queryText,
      detectedLanguage: 'English',
      languageCode: 'en-IN',
      serviceCategory: 'Birth Certificate',
      title: 'Birth Certificate Application Procedure & Guidelines (India)',
      officialPortalName: 'Civil Registration System (Office of the Registrar General of India)',
      officialPortalUrl: 'https://crsorgi.gov.in',
      lastVerifiedDate: 'November 2026',
      explanation: 'Under the Registration of Births and Deaths Act, every birth in India must be registered with the local registrar within 21 days of occurrence. Institutional births are reported directly by hospitals, while domiciliary births must be declared by the head of the household via the central CRS portal or state citizen centres.',
      stepByStepGuide: [
        'Step 1: Obtain Form 1 (Birth Report) from the hospital or registered medical officer.',
        'Step 2: Access the official CRS portal (crsorgi.gov.in) or your state e-District portal (e.g. Meeseva, Seva Sindhu, e-District).',
        'Step 3: Upload the child birth details along with identity documents of both parents.',
        'Step 4: After municipal/panchayat verification, download the digitally signed QR-coded certificate.'
      ],
      requiredDocuments: [
        'Hospital Birth Notification Slip / Discharge Summary (Form 1)',
        'Aadhaar Cards of both Mother and Father',
        'Parent Marriage Certificate (if available)',
        'Proof of Address of Parents (Voter ID / Utility Bill / Passport)'
      ],
      importantNotes: [
        'Registration is completely FREE if completed within 21 days of birth.',
        'Between 21 and 30 days: Requires payment of nominal late fee to the Registrar.',
        'Beyond 1 year: Requires delayed registration order from the Sub-Divisional Magistrate (SDM).'
      ],
      disclaimer: 'Disclaimer: This platform provides verified administrative guidance. Sahaay AI does not process or file government applications directly. Please submit your application on crsorgi.gov.in or your state citizen service portal.'
    };
  }

  // ==========================================
  // CATEGORY 2: AADHAAR SERVICES GUIDANCE
  // ==========================================
  if (isAadhaar) {
    if (lang.name === 'Telugu') {
      return {
        query: queryText,
        detectedLanguage: 'Telugu',
        languageCode: 'te-IN',
        serviceCategory: 'Aadhaar Services',
        title: 'ఆధార్ సేవల మార్గదర్శకాలు (UIDAI మార్గదర్శకాలు)',
        officialPortalName: 'Unique Identification Authority of India (UIDAI - myaadhaar.uidai.gov.in)',
        officialPortalUrl: 'https://myaadhaar.uidai.gov.in',
        lastVerifiedDate: 'November 2026',
        explanation: 'యూఐడీఏఐ (UIDAI) ద్వారా ఆధార్ వివరాలను అప్‌డేట్ చేసుకోవడానికి ఆన్‌లైన్ మరియు ఆఫ్‌లైన్ మార్గాలు ఉన్నాయి. చిరునామా అప్‌డేట్ మరియు పీవీసీ కార్డు ఆర్డర్ ఆన్‌లైన్‌లో చేయవచ్చు. మొబైల్ నంబర్ లింక్ మరియు బయోమెట్రిక్ నవీకరణ కోసం ఆధార్ నమోదు కేంద్రానికి స్వయంగా వెళ్లాలి.',
        stepByStepGuide: [
          'చిరునామా మార్పు: myaadhaar.uidai.gov.in లో ఓటీపీ ద్వారా లాగిన్ అయి అడ్రస్ ప్రూఫ్ అప్‌లోడ్ చేయండి.',
          'మొబైల్ నంబర్ లింక్: సమీపంలోని ఆధార్ సేవా కేంద్రానికి వెళ్లి బయోమెట్రిక్ ప్రామాణీకరణతో లింక్ చేయించుకోండి.',
          'పీవీసీ కార్డు: ఆన్‌లైన్‌లో ₹50 చెల్లించి స్పేస్-గ్రేడ్ పీవీసీ ఆధార్ కార్డును స్పీడ్ పోస్ట్ ద్వారా పొందవచ్చు.',
          'పిల్లల బయోమెట్రిక్స్: 5 సంవత్సరాలు మరియు 15 సంవత్సరాల వయస్సులో తప్పనిసరి ఉచిత బయోమెట్రిక్ అప్‌డేట్ చేయించాలి.'
        ],
        requiredDocuments: [
          'చిరునామా మార్పు కోసం: పాస్‌పోర్ట్, బ్యాంక్ పాస్‌బుక్, లేదా కరెంట్ బిల్లు',
          'మొబైల్ నంబర్ మార్పుకు ఎలాంటి పత్రాలు అవసరం లేదు (కేవలం వేలిముద్ర ధృవీకరణ చాలు)',
          'పిల్లల ఆధార్ కోసం: జనన ధ్రువీకరణ పత్రం మరియు తల్లిదండ్రుల ఆధార్'
        ],
        importantNotes: [
          'మొబైల్ నంబర్ మార్పు ఆన్‌లైన్‌లో సాధ్యం కాదు — ఆధార్ కేంద్రానికి స్వయంగా వెళ్లాలి.',
          'పిల్లల తప్పనిసరి బయోమెట్రిక్ నవీకరణ (వయస్సు 5 మరియు 15) పూర్తిగా ఉచితం.',
          'మీ బయోమెట్రిక్స్ దుర్వినియోగం కాకుండా ఉండటానికి myAadhaar పోర్టల్ లో బయోమెట్రిక్ లాక్ ఫీచర్ ఉపయోగించండి.'
        ],
        disclaimer: 'గమనిక: సహాయ్ ఏఐ మీకు అధికారిక మార్గదర్శకాలు మాత్రమే తెలియజేస్తుంది. ఎలాంటి మార్పులకైనా అధికారిక uidai.gov.in పోర్టల్ లేదా నమోదు కేంద్రాలను మాత్రమే సంప్రదించండి.'
      };
    }

    if (lang.name === 'Hindi') {
      return {
        query: queryText,
        detectedLanguage: 'Hindi',
        languageCode: 'hi-IN',
        serviceCategory: 'Aadhaar Services',
        title: 'आधार सेवाएं एवं अपडेट दिशा-निर्देश (UIDAI)',
        officialPortalName: 'भारतीय विशिष्ट पहचान प्राधिकरण (UIDAI - myaadhaar.uidai.gov.in)',
        officialPortalUrl: 'https://myaadhaar.uidai.gov.in',
        lastVerifiedDate: 'November 2026',
        explanation: 'यूआईडीएआई (UIDAI) के तहत आधार कार्ड में नाम, पता, जन्मतिथि या मोबाइल नंबर अपडेट करने के नियम निर्धारित हैं। पते का संशोधन ऑनलाइन myAadhaar पोर्टल से हो सकता है, जबकि मोबाइल नंबर अपडेट और बायोमेट्रिक्स के लिए आधार सेवा केंद्र जाना अनिवार्य है।',
        stepByStepGuide: [
          'पता अपडेट: myaadhaar.uidai.gov.in पर जाएं, ओटीपी से लॉगिन करें और मान्य पते का प्रमाण अपलोड करें।',
          'मोबाइल नंबर अपडेट: नजदीकी आधार सेवा केंद्र पर जाएं और बायोमेट्रिक सत्यापन द्वारा नंबर जुड़वाएं (कोई दस्तावेज जरूरी नहीं)।',
          'पीवीसी कार्ड ऑर्डर: ₹50 के शुल्क पर आधिकारिक क्यूआर कोड युक्त प्लास्टिक पीवीसी कार्ड डाक से मंगवाएं।',
          'बच्चों का बायोमेट्रिक अपडेट: 5 वर्ष और 15 वर्ष की आयु में बायोमेट्रिक अपडेट कराना अनिवार्य एवं निःशुल्क है।'
        ],
        requiredDocuments: [
          'पते के प्रमाण के लिए: बिजली बिल, बैंक पासबुक, राशन कार्ड या वोटर आईडी कार्ड',
          'मोबाइल नंबर लिंक कराने हेतु किसी दस्तावेज़ की आवश्यकता नहीं है',
          'पहचान प्रमाण (PoI) एवं पता प्रमाण (PoA) की वैध मूल प्रतियां'
        ],
        importantNotes: [
          'मोबाइल नंबर कभी भी केवल ऑनलाइन अपडेट नहीं हो सकता, इसके लिए सेंटर जाना आवश्यक है।',
          'सुरक्षा के लिए आप myAadhaar पोर्टल पर अपने बायोमेट्रिक्स को लॉक या अनलॉक कर सकते हैं।',
          'ई-आधार (e-Aadhaar) की वैधता भौतिक मूल कार्ड के समान ही आधिकारिक मानी जाती है।'
        ],
        disclaimer: 'महत्वपूर्ण सूचना: यह सहायता केवल आधिकारिक नियमों की स्पष्ट जानकारी प्रदान करती है। आधार में किसी भी बदलाव के लिए सीधे myaadhaar.uidai.gov.in या अधिकृत आधार सेवा केंद्र का उपयोग करें।'
      };
    }

    // Default English
    return {
      query: queryText,
      detectedLanguage: 'English',
      languageCode: 'en-IN',
      serviceCategory: 'Aadhaar Services',
      title: 'Aadhaar Card Update & Support Guidelines (UIDAI)',
      officialPortalName: 'Unique Identification Authority of India (UIDAI - myaadhaar.uidai.gov.in)',
      officialPortalUrl: 'https://myaadhaar.uidai.gov.in',
      lastVerifiedDate: 'November 2026',
      explanation: 'The Unique Identification Authority of India (UIDAI) governs all citizen identity services. While residential address corrections and PVC card orders can be processed completely online via the myAadhaar self-service portal, biometric data and mobile number linking strictly require in-person verification at an authorized Aadhaar Seva Kendra (ASK).',
      stepByStepGuide: [
        'Online Address Update: Log in to myaadhaar.uidai.gov.in using your Aadhaar number and OTP, then upload a valid address proof.',
        'Mobile Number Linking: Visit any authorized Aadhaar Seva Kendra or post office branch with biometric authentication (no physical documents needed).',
        'Order Aadhaar PVC Card: Request an official wallet-sized PVC card with secure hologram for a statutory fee of ₹50 delivered via Speed Post.',
        'Mandatory Child Biometrics (MBU): Must be updated when the child reaches age 5 and age 15 (this mandatory update is completely free of charge).'
      ],
      requiredDocuments: [
        'For Address Update: Valid Passport / Bank Statement or Passbook / Electricity Bill / Ration Card',
        'For Mobile Number Linking: No documents required (only fingerprint / iris biometric verification)',
        'For Child Enrollment: Birth Certificate and Parent Aadhaar'
      ],
      importantNotes: [
        'Mobile number cannot be updated purely online; physical biometric verification is legally mandatory.',
        'Use the Biometric Lock feature in the mAadhaar app to protect your identity from unauthorized authentication.',
        'Digitally downloaded e-Aadhaar with a valid digital signature is legally equivalent to the original printed card under the Aadhaar Act.'
      ],
      disclaimer: 'Disclaimer: Sahaay AI provides procedural guidance based on UIDAI regulations. To submit official modifications, access myaadhaar.uidai.gov.in or visit a government-authorized Aadhaar Seva Kendra.'
    };
  }

  // ==========================================
  // CATEGORY 3: STUDENT SCHOLARSHIPS GUIDANCE
  // ==========================================
  if (isScholarship) {
    if (lang.name === 'Telugu') {
      return {
        query: queryText,
        detectedLanguage: 'Telugu',
        languageCode: 'te-IN',
        serviceCategory: 'Student Scholarships',
        title: 'జాతీయ స్కాలర్‌షిప్ పోర్టల్ (NSP) దరఖాస్తు మార్గదర్శకాలు',
        officialPortalName: 'National Scholarship Portal (NSP - scholarships.gov.in)',
        officialPortalUrl: 'https://scholarships.gov.in',
        lastVerifiedDate: 'November 2026',
        explanation: 'భారత ప్రభుత్వ జాతీయ స్కాలర్‌షిప్ పోర్టల్ (NSP) ద్వారా పాఠశాల మరియు కళాశాల విద్యార్థులకు సెంట్రల్ సెక్టార్ స్కాలర్‌షిప్‌లు, పోస్ట్-మెట్రిక్ మరియు ప్రీ-మెట్రిక్ ఉపకార వేతనాలు అందించబడతాయి. నిధులు నేరుగా విద్యార్థి ఆధార్-లింక్డ్ బ్యాంక్ ఖాతాలో జమ (DBT) అవుతాయి.',
        stepByStepGuide: [
          'దశ 1: scholarships.gov.in పోర్టల్‌లో ఆధార్ ద్వారా వన్-టైమ్ రిజిస్ట్రేషన్ (OTR) పూర్తి చేయండి.',
          'దశ 2: మీ విద్యార్హతలు, కళాశాల వివరాలు, మరియు కుల/ఆదాయ ధ్రువీకరణ వివరాలను నమోదు చేయండి.',
          'దశ 3: విద్యా సంస్థ (స్కూల్/కాలేజీ) నోడల్ అధికారి ద్వారా మీ దరఖాస్తును ధృవీకరించండి.',
          'దశ 4: మీ బ్యాంక్ ఖాతా NPCI మ్యాపర్‌తో ఆధార్-సీడ్ అయిందో లేదో చూసుకోండి, తద్వారా నిధులు DBT ద్వారా నేరుగా అందుతాయి.'
        ],
        requiredDocuments: [
          'విద్యార్థి ఆధార్ కార్డు మరియు మొబైల్ నంబర్',
          'గత విద్యా సంవత్సరం మార్కుల జాబితా (Marks Sheet)',
          'ప్రస్తుత సంవత్సరం ఆదాయ ధ్రువీకరణ పత్రం (Income Certificate)',
          'కుల ధ్రువీకరణ పత్రం (SC/ST/OBC/మైనారిటీ వర్గాలకు)',
          'ఆధార్ సీడ్ చేయబడిన బ్యాంక్ ఖాతా వివరాలు'
        ],
        importantNotes: [
          'ఒక విద్యా సంవత్సరంలో ఒక విద్యార్థి కేవలం ఒక ప్రభుత్వ స్కాలర్‌షిప్‌ను మాత్రమే స్వీకరించగలరు.',
          'బ్యాంక్ ఖాతా తప్పనిసరిగా ఆధార్‌తో NPCI సర్వర్‌లో సీడ్ అయి ఉండాలి (కేవలం బ్యాంక్ బ్రాంచ్‌లో ఆధార్ ఇవ్వడం చాలదు).',
          'దరఖాస్తు గడువు ముగిసేలోగా కళాశాల నోడల్ అధికారి ధ్రువీకరణ పూర్తి చేయాలి.'
        ],
        disclaimer: 'గమనిక: సహాయ్ ఏఐ మీకు అధికారిక నిబంధనలను వివరిస్తుంది. దరఖాస్తులను నేరుగా అధికారిక scholarships.gov.in లో సమర్పించాలి.'
      };
    }

    if (lang.name === 'Hindi') {
      return {
        query: queryText,
        detectedLanguage: 'Hindi',
        languageCode: 'hi-IN',
        serviceCategory: 'Student Scholarships',
        title: 'राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) आवेदन एवं मार्गदर्शन',
        officialPortalName: 'National Scholarship Portal (NSP - scholarships.gov.in)',
        officialPortalUrl: 'https://scholarships.gov.in',
        lastVerifiedDate: 'November 2026',
        explanation: 'नेशनल स्कॉलरशिप पोर्टल (NSP) भारत सरकार का साझा प्लेटफॉर्म है, जिसके जरिए केंद्रीय क्षेत्र छात्रवृत्ति, पोस्ट-मैट्रिक, प्री-मैट्रिक और पीएम यशस्वी योजनाएं संचालित होती हैं। स्कॉलरशिप की राशि सीधे छात्र के आधार-लिंक्ड बैंक खाते में प्रत्यक्ष लाभ अंतरण (DBT) के माध्यम से भेजी जाती है।',
        stepByStepGuide: [
          'चरण 1: scholarships.gov.in पर जाकर वन-टाइम रजिस्ट्रेशन (OTR) पूरा करें (आधार अनिवार्य)।',
          'चरण 2: उपयुक्त छात्रवृत्ति योजना चुनें और शैक्षणिक योग्यता तथा संस्थान विवरण भरें।',
          'चरण 3: अपने विद्यालय/महाविद्यालय के नोडल अधिकारी (INO) से आवेदन का ऑनलाइन सत्यापन करवाएं।',
          'चरण 4: सुनिश्चित करें कि आपका बैंक खाता NPCI मैपर पर आधार से सक्रिय रूप से सीडेड (Seeded) है।'
        ],
        requiredDocuments: [
          'छात्र का आधार कार्ड और पंजीकृत मोबाइल नंबर',
          'पिछली कक्षा की अंकतालिका (Marksheet)',
          'सक्षम प्राधिकारी (तहसीलदार/एसडीएम) द्वारा जारी आय प्रमाण पत्र',
          'जाति प्रमाण पत्र (आरक्षित श्रेणियों हेतु)',
          'संस्थान में वर्तमान नामांकन का प्रमाण (Bonafide Certificate)'
        ],
        importantNotes: [
          'एक छात्र एक शैक्षणिक सत्र में केवल एक ही सरकारी छात्रवृत्ति का लाभ ले सकता है।',
          'बैंक खाता केवल आधार-लिंक्ड नहीं, बल्कि NPCI सर्वर पर डीबीटी (DBT) इनेबल्ड होना अनिवार्य है।',
          'आवेदन की अंतिम तिथि से पूर्व संस्थान सत्यापन कराना छात्र की जिम्मेदारी है।'
        ],
        disclaimer: 'महत्वपूर्ण सूचना: यह जानकारी छात्रों की सहायता के लिए है। आवेदन केवल आधिकारिक scholarships.gov.in पोर्टल पर ही दर्ज करें।'
      };
    }

    // Default English
    return {
      query: queryText,
      detectedLanguage: 'English',
      languageCode: 'en-IN',
      serviceCategory: 'Student Scholarships',
      title: 'National Scholarship Portal (NSP) Application & Eligibility Guidance',
      officialPortalName: 'National Scholarship Portal (Ministry of Electronics & IT, Govt. of India)',
      officialPortalUrl: 'https://scholarships.gov.in',
      lastVerifiedDate: 'November 2026',
      explanation: 'The National Scholarship Portal (NSP) is the Government of India’s unified digital infrastructure for central, state, and UGC/AICTE scholarship schemes. It covers Central Sector Schemes for College Students, Post-Matric and Pre-Matric Schemes for SC/ST/OBC/Minority students, and PM-YASASVI. Approved disbursals are executed strictly through Direct Benefit Transfer (DBT) to the student’s Aadhaar-seeded bank account.',
      stepByStepGuide: [
        'Step 1: Complete Aadhaar-based One-Time Registration (OTR) on scholarships.gov.in.',
        'Step 2: Select the eligible scholarship scheme according to your course level, family income, and category.',
        'Step 3: Upload academic transcripts, verified income certificate, and bonafide student certificate.',
        'Step 4: Ensure your Institute Nodal Officer (INO) and District Nodal Officer (DNO) digitally verify your application.',
        'Step 5: Verify that your bank account is mapped on the NPCI Aadhaar Mapper for seamless DBT credit.'
      ],
      requiredDocuments: [
        'Student Aadhaar Card and linked mobile number',
        'Academic Marksheet / Transcript of previous qualifying examination',
        'Competent Authority-issued Family Income Certificate (valid for current financial year)',
        'Caste / Category Certificate (for reserved categories)',
        'Institute Bonafide Certificate and Fee Receipt'
      ],
      importantNotes: [
        'Dual benefit rule: A student cannot receive multiple government scholarships for the same academic session.',
        'Aadhaar Seeding: Your bank account must be actively seeded on the NPCI mapper, not just linked at the branch.',
        'Timelines: Track application verification through your NSP login dashboard before state closing dates.'
      ],
      disclaimer: 'Disclaimer: Sahaay AI provides procedural guidance. Sahaay AI is not an authorized filing agency. Always register and apply directly on the official portal: scholarships.gov.in.'
    };
  }

  // ==========================================
  // GENERAL PUBLIC SERVICES FALLBACK
  // ==========================================
  if (lang.name === 'Telugu') {
    return {
      query: queryText,
      detectedLanguage: 'Telugu',
      languageCode: 'te-IN',
      serviceCategory: 'General Public Information',
      title: 'భారత ప్రభుత్వ ప్రజా సేవల సహాయం',
      officialPortalName: 'National Government Services Portal (services.india.gov.in)',
      officialPortalUrl: 'https://services.india.gov.in',
      lastVerifiedDate: 'November 2026',
      explanation: `మీరు అడిగిన ప్రశ్న "${queryText}" పరిశీలించబడింది. సహాయ్ ఏఐ ప్రజా సేవల అసిస్టెంట్ ముఖ్యంగా మూడు వర్గాలకు సంబంధించిన అధికారిక నియమాలు మరియు దరఖాస్తు విధానాలను వివరిస్తుంది: (1) జనన ధ్రువీకరణ పత్రాలు (crsorgi.gov.in), (2) ఆధార్ కార్డు సేవలు (uidai.gov.in), మరియు (3) విద్యార్థుల స్కాలర్‌షిప్‌లు (scholarships.gov.in).`,
      stepByStepGuide: [
        'మీకు కావాల్సిన సేవ గురించి స్పష్టంగా అడగండి (ఉదాహరణకు: "జనన ధ్రువీకరణ పత్రం ఎలా పొందాలి?", "ఆధార్‌లో అడ్రస్ ఎలా మార్చాలి?", "స్కాలర్‌షిప్ ఎలా దరఖాస్తు చేయాలి?").',
        'సహాయ్ ఏఐ అధికారిక పోర్టల్ లింకులు మరియు అవసరమైన డాక్యుమెంట్ల జాబితాను అందిస్తుంది.'
      ],
      requiredDocuments: ['సంబంధిత ప్రభుత్వ సేవ ఆధారంగా ధ్రువీకరణ పత్రాలు అవసరమవుతాయి.'],
      importantNotes: ['అన్ని సేవలకు అధికారిక ప్రభుత్వ పోర్టల్స్ మాత్రమే ఉపయోగించండి.'],
      disclaimer: 'గమనిక: సహాయ్ ఏఐ కేవలం మార్గదర్శకత్వం మాత్రమే అందిస్తుంది, ప్రభుత్వ దరఖాస్తులను నేరుగా సమర్పించదు.'
    };
  }

  if (lang.name === 'Hindi') {
    return {
      query: queryText,
      detectedLanguage: 'Hindi',
      languageCode: 'hi-IN',
      serviceCategory: 'General Public Information',
      title: 'भारत सरकार नागरिक लोक सेवा मार्गदर्शन',
      officialPortalName: 'National Government Services Portal (services.india.gov.in)',
      officialPortalUrl: 'https://services.india.gov.in',
      lastVerifiedDate: 'November 2026',
      explanation: `आपका प्रश्न "${queryText}" प्राप्त हुआ। सहाय एआई लोक सेवा सहायक प्रमुख सरकारी प्रक्रियाओं पर सत्यापित दिशा-निर्देश प्रदान करता है: (1) जन्म प्रमाण पत्र (crsorgi.gov.in), (2) आधार कार्ड सेवाएं व अपडेट (uidai.gov.in), और (3) राष्ट्रीय छात्रवृत्ति पोर्टल (scholarships.gov.in)।`,
      stepByStepGuide: [
        'विशिष्ट सेवा के बारे में पूछें (जैसे: "जन्म प्रमाण पत्र कैसे बनवाएं?", "आधार में पता कैसे बदलें?", "स्कॉलरशिप के लिए क्या चाहिए?")।',
        'सहाय एआई आपको आधिकारिक पोर्टल लिंक, आवश्यक दस्तावेज और चरणबद्ध प्रक्रिया बताएगा।'
      ],
      requiredDocuments: ['संबंधित सरकारी सेवा के अनुसार आवश्यक दस्तावेज संलग्न करें।'],
      importantNotes: ['केवल आधिकारिक सरकारी पोर्टलों (.gov.in) का ही उपयोग करें।'],
      disclaimer: 'महत्वपूर्ण सूचना: यह मंच केवल आधिकारिक दिशा-निर्देशों की सहायता देता है। वास्तविक आवेदन संबंधित सरकारी पोर्टल पर ही करें।'
    };
  }

  return {
    query: queryText,
    detectedLanguage: 'English',
    languageCode: 'en-IN',
    serviceCategory: 'General Public Information',
    title: 'Indian Citizen Public Services Guidance',
    officialPortalName: 'National Government Services Portal (services.india.gov.in)',
    officialPortalUrl: 'https://services.india.gov.in',
    lastVerifiedDate: 'November 2026',
    explanation: `Your inquiry "${queryText}" was analyzed. Sahaay AI Public Services Assistant provides verified step-by-step guidance for three core citizen services in India: (1) Birth Certificate Registration (crsorgi.gov.in), (2) Aadhaar Services & Updates (uidai.gov.in), and (3) National Student Scholarships (scholarships.gov.in).`,
    stepByStepGuide: [
      'Ask specific questions such as: "How do I apply for a birth certificate?", "How do I update my Aadhaar address?", or "What are the rules for NSP scholarships?".',
      'Receive official step-by-step instructions, official .gov.in portal links, document checklists, and statutory deadlines.'
    ],
    requiredDocuments: ['Varies depending on the specific government department and service.'],
    importantNotes: ['Always refer to official .gov.in websites for filing statutory applications.'],
    disclaimer: 'Disclaimer: Sahaay AI provides administrative informational guidance. It does not file applications directly to government databases.'
  };
}
