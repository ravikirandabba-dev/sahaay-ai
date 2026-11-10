export interface PersonalAIResponse {
  query: string;
  detectedLanguage: 'English' | 'Telugu' | 'Hindi';
  languageCode: 'en-IN' | 'te-IN' | 'hi-IN';
  category: string;
  answerText: string;
  keyPoints: string[];
  suggestedFollowUps: string[];
  providerLabel: string;
}

interface KnowledgeTopic {
  id: string;
  keywords: string[];
  category: string;
  english: {
    answer: string;
    keyPoints: string[];
    followUps: string[];
  };
  telugu: {
    answer: string;
    keyPoints: string[];
    followUps: string[];
  };
  hindi: {
    answer: string;
    keyPoints: string[];
    followUps: string[];
  };
}

const KNOWLEDGE_BASE: KnowledgeTopic[] = [
  {
    id: 'artificial-intelligence',
    category: 'Artificial Intelligence & Modern Tech',
    keywords: [
      'artificial intelligence', 'ai', 'what is ai', 'explain ai',
      'కృత్రిమ మేధస్సు', 'ఏఐ', 'ఆర్టిఫిషియల్ ఇంటెలిజెన్స్',
      'आर्टिफिशियल इंटेलिजेंस', 'एआई', 'कृत्रिम बुद्धिमत्ता'
    ],
    english: {
      answer: 'Artificial Intelligence (AI) is the science of building computing systems that perform tasks requiring human-like cognitive abilities — such as recognizing speech, understanding natural language, visual perception, decision-making, and continuous learning. Modern AI is predominantly powered by deep learning and neural networks that discover patterns across massive datasets to generate predictions, synthesize content, and automate complex workflows.',
      keyPoints: [
        'Cognitive simulation: Perception, reasoning, planning, and contextual decision-making.',
        'Core pillars: Machine Learning, Deep Neural Networks, Natural Language Processing, and Computer Vision.',
        'Modern impact: Multilingual voice assistants, automated diagnostics, intelligent logistics, and code synthesis.'
      ],
      followUps: [
        'How does Machine Learning differ from traditional programming?',
        'What are the safety and ethics considerations in AI development?'
      ]
    },
    telugu: {
      answer: 'కృత్రిమ మేధస్సు (Artificial Intelligence లేదా AI) అనేది మానవుల మాదిరిగా ఆలోచించడం, భాషను అర్థం చేసుకోవడం, సమస్యలను పరిష్కరించడం మరియు నిర్ణయాలు తీసుకోవడం చేయగలిగే కంప్యూటర్ వ్యవస్థల రూపకల్పన శాస్త్రం. నేటి ఆధునిక ఏఐ డేటా నుండి నిరంతరం నేర్చుకుంటూ, వాయిస్ అసిస్టెంట్లు, ఆటోమేటిక్ అనువాదాలు మరియు వైద్య నిర్ధారణలలో విప్లవాత్మక మార్పులు తెస్తోంది.',
      keyPoints: [
        'మానవ ఆలోచనా విధానాన్ని కంప్యూటర్లలో అనుకరించడం.',
        'ముఖ్య రంగాలు: మెషిన్ లెర్నింగ్, న్యూరల్ నెట్‌వర్క్‌లు, సహజ భాషా ప్రాసెసింగ్ (NLP).',
        'నిజజీవిత ఉపయోగాలు: బహుభాషా వాయిస్ సహాయకులు, లాజిస్టిక్స్ మరియు ఆటోమేషన్.'
      ],
      followUps: [
        'మెషిన్ లెర్నింగ్ అంటే ఏమిటి?',
        'ఏఐ నేర్చుకోవడానికి ఏ ప్రోగ్రామింగ్ భాషలు ఉత్తమం?'
      ]
    },
    hindi: {
      answer: 'आर्टिफिशियल इंटेलिजेंस (AI या कृत्रिम बुद्धिमत्ता) कंप्यूटर विज्ञान की वह शाखा है जो मशीनों को इंसानों की तरह सोचने, सीखने, भाषा समझने और समस्याओं को हल करने में सक्षम बनाती है। आधुनिक एआई न्यूरल नेटवर्क और डीप लर्निंग के जरिए विशाल डेटा का विश्लेषण करके स्वचालित निर्णय और बहुभाषी संवाद को संभव बनाता है।',
      keyPoints: [
        'मानव बुद्धिमत्ता का अनुकरण: भाषा समझना, निर्णय लेना और निरंतर सीखना।',
        'प्रमुख तकनीकें: मशीन लर्निंग (ML), डीप लर्निंग, और नेचुरल लैंग्वेज प्रोसेसिंग (NLP)।',
        'व्यावहारिक उपयोग: वॉयस हेल्पडेस्क, चिकित्सा विश्लेषण और स्मार्ट ऑटोमेशन।'
      ],
      followUps: [
        'मशीन लर्निंग और पारंपरिक प्रोग्रामिंग में क्या अंतर है?',
        'एआई सीखने के लिए कौन सी स्किल्स आवश्यक हैं?'
      ]
    }
  },
  {
    id: 'machine-learning',
    category: 'Data Science & Machine Learning',
    keywords: [
      'machine learning', 'ml', 'what is ml', 'supervised learning',
      'మెషిన్ లెర్నింగ్', 'ఎంఎల్',
      'मशीन लर्निंग', 'एमएल'
    ],
    english: {
      answer: 'Machine Learning (ML) is a subset of AI where mathematical algorithms learn statistical patterns directly from historical data rather than following static, hardcoded rules. It is divided into Supervised Learning (learning from labeled input-output pairs), Unsupervised Learning (discovering hidden clusters without labels), and Reinforcement Learning (optimizing rewards through trial-and-error environmental feedback).',
      keyPoints: [
        'Data-driven learning: Replaces manual rules with self-adjusting statistical models.',
        'Three paradigms: Supervised (classification/regression), Unsupervised (clustering), Reinforcement Learning (agents).',
        'Practical applications: Spam filtering, recommendation engines, fraud detection, and predictive analytics.'
      ],
      followUps: [
        'What is Deep Learning and how does it extend ML?',
        'How do we evaluate the accuracy of a machine learning model?'
      ]
    },
    telugu: {
      answer: 'మెషిన్ లెర్నింగ్ (ML) అనేది ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ లో ఒక ముఖ్య భాగం. కంప్యూటర్లకు స్పష్టమైన రూల్స్ రాయకుండా, గత డేటా ఆధారంగా నమూనాలను (patterns) గుర్తించి సొంతంగా అంచనాలు వేయడాన్ని మెషిన్ లెర్నింగ్ అంటారు. ఇందులో సూపర్‌వైజ్డ్ లెర్నింగ్, అన్‌సూపర్‌వైజ్డ్ లెర్నింగ్ మరియు రీఇన్‌ఫోర్స్‌మెంట్ లెర్నింగ్ అనే మూడు ప్రధాన రకాలు ఉంటాయి.',
      keyPoints: [
        'డేటా ఆధారిత మోడలింగ్: సూత్రాలు రాయకుండా డేటా ద్వారా అభ్యసనం.',
        'ప్రధాన రకాలు: సూపర్‌వైజ్డ్, అన్‌సూపర్‌వైజ్డ్, రీఇన్‌ఫోర్స్‌మెంట్ లెర్నింగ్.',
        'ఉపయోగాలు: సిఫార్సు ఇంజిన్లు, మోసాల గుర్తింపు, ఆటోమేటిక్ ప్రిడిక్షన్లు.'
      ],
      followUps: [
        'డీప్ లెర్నింగ్ మరియు మెషిన్ లెర్నింగ్ మధ్య తేడా ఏమిటి?',
        'డేటా సైంటిస్ట్ కావడానికి ఏ కోర్సులు చదవాలి?'
      ]
    },
    hindi: {
      answer: 'मशीन लर्निंग (ML) आर्टिफिशियल इंटेलिजेंस का वह उपक्षेत्र है जहां एल्गोरिदम पुराने डेटा से पैटर्न सीखकर भविष्यवाणियां करते हैं, बिना किसी हार्डकोडेड नियमों के। इसके प्रमुख प्रकारों में सुपरवाइज्ड लर्निंग (लेबल किए गए डेटा से सीखना), अनसुपरवाइज्ड लर्निंग (बिना लेबल के क्लस्टर खोजना) और रीइन्फोर्समेंट लर्निंग (रिवॉर्ड-आधारित निर्णय) शामिल हैं।',
      keyPoints: [
        'डेटा-संचालित मॉडल: कोड नियमों के बजाय डेटा पैटर्न से सीखना।',
        'तीन मुख्य रूप: सुपरवाइज्ड, अनसुपरवाइज्ड, और रीइन्फोर्समेंट लर्निंग।',
        'वास्तविक उदाहरण: यूट्यूब सिफारिशें, यूपीआई फ्रॉड डिटेक्शन, और प्रेडिक्टिव सर्च।'
      ],
      followUps: [
        'डीप लर्निंग और न्यूरल नेटवर्क क्या होते हैं?',
        'मशीन लर्निंग प्रोजेक्ट शुरू करने के स्टेप्स क्या हैं?'
      ]
    }
  },
  {
    id: 'study-tips',
    category: 'Productivity & Learning Techniques',
    keywords: [
      'study tips', 'how to study', 'exam preparation', 'focus', 'concentration', 'memory',
      'చదువుకోవడానికి చిట్కాలు', 'పరీక్షలు', 'మెమరీ పెంచుకోవడం',
      'पढ़ाई के टिप्स', 'परीक्षा की तैयारी', 'एकाग्रता', 'याददाश्त'
    ],
    english: {
      answer: 'High-efficiency studying relies on proven cognitive science methodologies rather than passive re-reading. Top recommended strategies include: (1) Active Recall — testing your memory without looking at notes; (2) Spaced Repetition — reviewing material at exponentially expanding intervals to cement long-term memory; and (3) The Feynman Technique — explaining complex concepts in plain language to instantly expose knowledge gaps.',
      keyPoints: [
        'Active Recall: Test yourself with flashcards or practice questions instead of passive highlighting.',
        'Spaced Repetition: Review after 1 day, 3 days, 7 days, and 21 days for permanent retention.',
        'Pomodoro Technique: Work in focused 25-minute sprints with 5-minute cognitive breaks to avoid mental fatigue.'
      ],
      followUps: [
        'How can I organize a daily study timetable for competitive exams?',
        'What are the best digital tools for spaced repetition?'
      ]
    },
    telugu: {
      answer: 'సమర్థవంతమైన అభ్యసనానికి సైంటిఫిక్ పద్ధతులు చాలా కీలకం. ముఖ్యమైన 3 చిట్కాలు: (1) యాక్టివ్ రీకాల్ — కేవలం పుస్తకం చదవడం కాకుండా, పుస్తకం మూసివేసి గుర్తుచేసుకోవడం; (2) స్పేస్డ్ రిపీటీషన్ — నేర్చుకున్న విషయాలను 1 రోజు, 3 రోజులు మరియు వారం రోజుల వ్యవధిలో పునశ్చరణ చేయడం; (3) ఫేన్‌మ్యాన్ టెక్నిక్ — కష్టమైన అంశాలను వేరొకరికి సులభమైన మాటల్లో బోధించడం.',
      keyPoints: [
        'యాక్టివ్ రీకాల్: సొంతంగా ప్రశ్నలు వేసుకుని సమాధానాలు చెప్పడం.',
        'స్పేస్డ్ రిపీటీషన్: నిర్ణీత వ్యవధులలో రివిజన్ చేసి జ్ఞాపకశక్తిని పెంచుకోవడం.',
        'పోమోడోరో పద్ధతి: 25 నిమిషాల ఏకాగ్రతతో కూడిన చదువు, 5 నిమిషాల విరామం.'
      ],
      followUps: [
        'పరీక్షల భయాన్ని ఎలా అధిగమించాలి?',
        'రోజువారీ టైమ్‌టేబుల్ ఎలా రూపొందించుకోవాలి?'
      ]
    },
    hindi: {
      answer: 'प्रभावी पढ़ाई के लिए वैज्ञानिक तरीके सबसे ज्यादा असरदार होते हैं: (1) एक्टिव रिकॉल — सिर्फ पढ़ने के बजाय बिना देखे खुद का टेस्ट लें; (2) स्पेस्ड रिपीटिशन — किसी भी विषय को 1 दिन, 3 दिन और 7 दिन के अंतराल पर दोहराएं ताकि वह स्थायी स्मृति में बदल सके; और (3) फेनमैन तकनीक — जटिल विषयों को एक छोटे बच्चे की तरह सरल भाषा में समझाएं।',
      keyPoints: [
        'एक्टिव रिकॉल: खुद से सवाल पूछें और शॉर्ट नोट्स खुद लिखें।',
        'स्पेस्ड रिपीटिशन: व्यवस्थित समय अंतराल पर रिवीजन करना।',
        'पोमोडोरो तकनीक: 25 मिनट बिना रुकावट पढ़ाई, फिर 5 मिनट का ब्रेक।'
      ],
      followUps: [
        'प्रतियोगी परीक्षाओं के लिए समय प्रबंधन कैसे करें?',
        'पढ़ाई के दौरान ध्यान भटकने से कैसे बचें?'
      ]
    }
  },
  {
    id: 'cloud-computing',
    category: 'Cloud & Infrastructure Engineering',
    keywords: [
      'cloud computing', 'cloud', 'aws', 'azure', 'serverless', 'iaas', 'paas',
      'క్లౌడ్ కంప్యూటింగ్', 'క్లౌడ్',
      'क्लाउड कंप्यूटिंग', 'क्लाउड'
    ],
    english: {
      answer: 'Cloud Computing is the on-demand delivery of IT resources — including compute power, storage, databases, and networking — over the internet with pay-as-you-go pricing. Instead of buying and maintaining physical servers, organizations rent infrastructure from hyperscalers like AWS, Microsoft Azure, and Google Cloud, achieving global scalability, high availability, and rapid deployment.',
      keyPoints: [
        'Service tiers: IaaS (virtual machines/storage), PaaS (managed runtimes), SaaS (end-user applications).',
        'Key benefits: Elastic scalability, 99.99% fault tolerance, zero capital expenditure for hardware.',
        'Modern trends: Serverless architectures, containerization (Docker/Kubernetes), and multi-cloud strategies.'
      ],
      followUps: [
        'What is the difference between Containers and Virtual Machines?',
        'How can a beginner earn their first AWS or Azure cloud certification?'
      ]
    },
    telugu: {
      answer: 'క్లౌడ్ కంప్యూటింగ్ అంటే భౌతిక సర్వర్లను స్వయంగా కొనుగోలు చేయకుండా, ఇంటర్నెట్ ద్వారా అవసరమైన సర్వర్లు, స్టోరేజ్, డేటాబేస్ మరియు నెట్‌వర్కింగ్ వనరులను అవసరమైనప్పుడు అద్దెకు తీసుకోవడం. AWS, Azure, Google Cloud వంటి సంస్థలు ఈ సేవలను అందిస్తాయి. ఇది సాఫ్ట్‌వేర్ సంస్థలకు ఖర్చులను తగ్గించి, గ్లోబల్ స్కేలబిలిటీని సులభతరం చేస్తుంది.',
      keyPoints: [
        'సేవా వర్గాలు: IaaS (ఇన్‌ఫ్రాస్ట్రక్చర్), PaaS (ప్లాట్‌ఫామ్), SaaS (సాఫ్ట్‌వేర్).',
        'ముఖ్య ప్రయోజనాలు: అపరిమిత స్కేలింగ్, సున్నా హార్డ్‌వేర్ ఖర్చు, ఉన్నత భద్రత.',
        'ఆధునిక ధోరణులు: డాకర్ కంటైనర్లు, కుబెర్‌నెటీస్ మరియు సర్వర్‌లెస్ కంప్యూటింగ్.'
      ],
      followUps: [
        'క్లౌడ్ ఇంజనీర్ కావడానికి ఏ కోర్సులు నేర్చుకోవాలి?',
        'సర్వర్‌లెస్ ఆర్కిటెక్చర్ అంటే ఏమిటి?'
      ]
    },
    hindi: {
      answer: 'क्लाउड कंप्यूटिंग इंटरनेट के माध्यम से कंप्यूटिंग सेवाएं — जैसे सर्वर, स्टोरेज, डेटाबेस, नेटवर्किंग और सॉफ्टवेयर — ऑन-डिमांड उपलब्ध कराने की तकनीक है। अपने खुद के डेटा सेंटर या फिजिकल सर्वर खरीदने के बजाय कंपनियां AWS, Microsoft Azure और Google Cloud जैसी कंपनियों से जरूरत के अनुसार संसाधन किराए पर लेती हैं।',
      keyPoints: [
        'सेवा मॉडल: IaaS (इन्फ्रास्ट्रक्चर), PaaS (प्लेटफॉर्म), SaaS (सॉफ्टवेयर)।',
        'फायदे: वैश्विक स्केलेबिलिटी, कम लागत, 99.99% उपलब्धता और तेज डिप्लॉयमेंट।',
        'आधुनिक रुझान: डोकर/कुबरनेट्स कंटेनराइजेशन और सर्वरलेस आर्किटेक्चर।'
      ],
      followUps: [
        'कंटेनर और वर्चुअल मशीन में क्या अंतर है?',
        'क्लाउड सर्टिफिकेशन की शुरुआत कैसे करें?'
      ]
    }
  },
  {
    id: 'interview-prep',
    category: 'Career & Technical Interview Strategies',
    keywords: [
      'interview', 'interview preparation', 'job interview', 'mock interview', 'star method', 'resume',
      'ఇంటర్వ్యూ', 'ఇంటర్వ్యూ ప్రిపరేషన్', 'ఉద్యోగం',
      'इंटरव्यू', 'साक्षात्कार', 'नौकरी की तैयारी', 'रिज्यूमे'
    ],
    english: {
      answer: 'Excelling in technical and behavioral interviews requires structured preparation across three tracks: (1) Core Competence — mastering Data Structures, Algorithms, and System Design; (2) Behavioral Precision — using the STAR Method (Situation, Task, Action, Result) with quantified business impacts; and (3) Strategic Inquisitiveness — asking insightful questions about team architecture and development velocity at the conclusion of the interview.',
      keyPoints: [
        'STAR Method: Clearly describe the Situation, Task, your specific Action, and measurable Result.',
        'Technical mastery: Practice speaking aloud while solving coding problems on a whiteboard or online editor.',
        'Post-interview impact: Prepare 2-3 thoughtful architectural questions for the interviewers.'
      ],
      followUps: [
        'How should I explain a past technical failure in an interview?',
        'What are the key system design patterns asked in senior tech interviews?'
      ]
    },
    telugu: {
      answer: 'సాఫ్ట్‌వేర్ మరియు జాబ్ ఇంటర్వ్యూలలో విజయం సాధించడానికి మూడు దశల ప్రణాళిక అవసరం: (1) టెక్నికల్ బలాలు — డేటా స్ట్రక్చర్స్, అల్గారిథమ్స్ మరియు ప్రాజెక్ట్ ఆర్కిటెక్చర్ పై పట్టు సాధించడం; (2) బిహేవియరల్ ప్రశ్నలకు STAR పద్ధతి (Situation, Task, Action, Result) ద్వారా సంక్షిప్తంగా సమాధానం చెప్పడం; (3) చివర్లో కంపెనీ మరియు ప్రాజెక్ట్ సంబంధించి స్పష్టమైన ప్రశ్నలు అడగడం.',
      keyPoints: [
        'STAR పద్ధతి: పరిస్థితి, బాధ్యత, మీరు చేసిన పని మరియు సాధించిన ఫలితం చెప్పడం.',
        'లైవ్ కోడింగ్: కోడ్ రాసేటప్పుడు మీ ఆలోచనా విధానాన్ని ఇంటర్వ్యూయర్‌కు వివరించడం.',
        'ఆత్మవిశ్వాసం: మీ రెజ్యూమ్‌లో రాసిన ప్రతి ప్రాజెక్ట్ పై స్పష్టమైన పరిజ్ఞానం ఉండాలి.'
      ],
      followUps: [
        'ఫ్రెషర్స్ కోసం రెజ్యూమ్ ఎలా తయారు చేయాలి?',
        'టెక్నికల్ ఇంటర్వ్యూలో కోడింగ్ సమస్యలను ఎలా అప్రోచ్ కావాలి?'
      ]
    },
    hindi: {
      answer: 'तकनीकी और व्यवहारिक (Behavioral) साक्षात्कारों में सफलता के लिए तीन स्तंभ जरूरी हैं: (1) तकनीकी दक्षता — डेटा स्ट्रक्चर्स, एल्गोरिदम और सिस्टम डिजाइन की ठोस समझ; (2) स्टार (STAR) पद्धति — सिचुएशन, टास्क, एक्शन और रिजल्ट के जरिए अपने पिछले प्रोजेक्ट्स के प्रभाव को बताना; (3) आत्मविश्वास और संवाद — कोडिंग करते समय अपने विचारों को स्पष्ट रूप से बोलकर समझाना।',
      keyPoints: [
        'STAR फॉर्मूला: समस्या क्या थी, आपकी भूमिका क्या थी, आपने क्या किया, और क्या नतीजा निकला।',
        'थिंक-अलाउड: कोडिंग राउंड में सोचने की प्रक्रिया को इंटरव्यूअर के सामने व्यक्त करें।',
        'इंटरव्यूअर से सवाल: अंत में कंपनी की इंजीनियरिंग संस्कृति और चुनौतियों पर समझदारी भरे सवाल पूछें।'
      ],
      followUps: [
        'एचआर राउंड में सामान्य प्रश्नों के प्रभावशाली उत्तर कैसे दें?',
        'सिस्टम डिजाइन इंटरव्यू की तैयारी कैसे शुरू करें?'
      ]
    }
  }
];

function detectLanguage(text: string): { name: 'English' | 'Telugu' | 'Hindi'; code: 'en-IN' | 'te-IN' | 'hi-IN' } {
  // Telugu Unicode range: 0C00-0C7F
  if (/[\u0C00-\u0C7F]/.test(text)) {
    return { name: 'Telugu', code: 'te-IN' };
  }
  // Devanagari (Hindi) Unicode range: 0900-097F
  if (/[\u0900-\u097F]/.test(text)) {
    return { name: 'Hindi', code: 'hi-IN' };
  }
  return { name: 'English', code: 'en-IN' };
}

export function processPersonalAIQuery(queryText: string): PersonalAIResponse {
  const clean = queryText.toLowerCase().trim();
  const lang = detectLanguage(queryText);

  // Match topic by keyword
  let matchedTopic: KnowledgeTopic | null = null;
  let maxScore = 0;

  for (const topic of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (clean.includes(kw.toLowerCase())) {
        score += kw.length;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      matchedTopic = topic;
    }
  }

  // If a topic matched
  if (matchedTopic && maxScore > 0) {
    const localized = lang.name === 'Telugu'
      ? matchedTopic.telugu
      : lang.name === 'Hindi'
      ? matchedTopic.hindi
      : matchedTopic.english;

    return {
      query: queryText,
      detectedLanguage: lang.name,
      languageCode: lang.code,
      category: matchedTopic.category,
      answerText: localized.answer,
      keyPoints: localized.keyPoints,
      suggestedFollowUps: localized.followUps,
      providerLabel: 'Verified Multilingual Knowledge Engine (Educational & Concepts)'
    };
  }

  // Graceful fallback for general knowledge queries
  if (lang.name === 'Telugu') {
    return {
      query: queryText,
      detectedLanguage: 'Telugu',
      languageCode: 'te-IN',
      category: 'General Multilingual Assistant',
      answerText: `మీ ప్రశ్న "${queryText}" పరిశీలించబడింది. సహాయ్ ఏఐ పర్సనల్ అసిస్టెంట్ కృత్రిమ మేధస్సు (AI), మెషిన్ లెర్నింగ్, చదువుకునే చిట్కాలు, క్లౌడ్ కంప్యూటింగ్ మరియు ఇంటర్వ్యూ ప్రిపరేషన్ అంశాలపై సమగ్ర వివరణలు ఇవ్వగలదు. దయచేసి ఈ విషయాలలో ఏదైనా అడగండి.`,
      keyPoints: [
        'సహాయ్ ఏఐ వ్యక్తిగత సహాయకుడు తెలుగు, హిందీ, ఇంగ్లీష్ భాషలలో పని చేస్తుంది.',
        'ఆధారిత రంగాలు: ఆర్టిఫిషియల్ ఇంటెలిజెన్స్, మెషిన్ లెర్నింగ్, ఎడ్యుకేషన్, కెరీర్ గైడెన్స్.'
      ],
      suggestedFollowUps: [
        'కృత్రిమ మేధస్సు (AI) గురించి వివరించండి.',
        'చదువుకోవడానికి మంచి చిట్కాలు ఏమిటి?'
      ],
      providerLabel: 'Verified Multilingual Knowledge Engine (Educational & Concepts)'
    };
  }

  if (lang.name === 'Hindi') {
    return {
      query: queryText,
      detectedLanguage: 'Hindi',
      languageCode: 'hi-IN',
      category: 'General Multilingual Assistant',
      answerText: `आपका प्रश्न "${queryText}" प्राप्त हुआ। सहाय एआई पर्सनल असिस्टेंट आर्टिफिशियल इंटेलिजेंस, मशीन लर्निंग, पढ़ाई की रणनीतियों, क्लाउड तकनीक और करियर इंटरव्यू की तैयारी पर सत्यापित मार्गदर्शन प्रदान करता है। कृपया इन विषयों पर प्रश्न पूछें।`,
      keyPoints: [
        'सहाय एआई हिंदी, तेलुगु और अंग्रेजी में सीखने और मार्गदर्शन के लिए सुसज्जित है।',
        'मुख्य क्षेत्र: एआई एवं तकनीक, डेटा साइंस, अध्ययन तकनीकें, एवं साक्षात्कार तैयारी।'
      ],
      suggestedFollowUps: [
        'आर्टिफिशियल इंटेलिजेंस क्या है?',
        'इंटरव्यू की तैयारी कैसे करें?'
      ],
      providerLabel: 'Verified Multilingual Knowledge Engine (Educational & Concepts)'
    };
  }

  // Default English fallback
  return {
    query: queryText,
    detectedLanguage: 'English',
    languageCode: 'en-IN',
    category: 'General Multilingual Assistant',
    answerText: `Thank you for your question: "${queryText}". Sahaay AI's Personal Assistant is specialized in explaining key technical and educational domains, including Artificial Intelligence, Machine Learning paradigms, high-efficiency study methodologies, Cloud Infrastructure, and Technical Interview strategies. Feel free to explore any of these topics in English, Telugu, or Hindi!`,
    keyPoints: [
      'Multilingual concept explanations: AI & ML fundamentals, Cloud Engineering, Productivity, and Interviews.',
      'Voice synthesis ready: Full native pronunciation via Gnani Timbre TTS.',
      'Interactive guidance: Explore sample queries or ask in your native Indian language.'
    ],
    suggestedFollowUps: [
      'Explain artificial intelligence in simple terms.',
      'Give me three effective study tips for competitive exams.',
      'What are the key differences between Machine Learning and Deep Learning?'
    ],
    providerLabel: 'Verified Multilingual Knowledge Engine (Educational & Concepts)'
  };
}
