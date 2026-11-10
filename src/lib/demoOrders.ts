export interface DemoOrder {
  orderId: string;
  customerName: string;
  phone: string;
  items: string[];
  orderDate: string;
  expectedDelivery: string;
  status: "Delayed" | "In Transit" | "Delivered" | "Cancelled" | "Refund Processed";
  carrier: string;
  trackingNumber: string;
  currentLocation: string;
  delayReason?: string;
  refundAmount?: string;
  notes: {
    en: string;
    hi: string;
    te: string;
  };
}

export const DEMO_ORDERS: Record<string, DemoOrder> = {
  "ORD-7821": {
    orderId: "ORD-7821",
    customerName: "Srinivas Rao (శ్రీనివాస్ రావు)",
    phone: "+91 98480 12345",
    items: ["Smart LED TV 43-inch", "Wall Mount Bracket"],
    orderDate: "2026-11-06",
    expectedDelivery: "2026-11-09 (Delayed by 2 days)",
    status: "Delayed",
    carrier: "BlueDart Express",
    trackingNumber: "BD992837190IN",
    currentLocation: "Hyderabad Hub — Local Sortation Centre",
    delayReason: "High festive volume dispatch bottleneck at regional hub.",
    notes: {
      en: "Shipment delayed due to heavy holiday logistics in Hyderabad. Expected out for delivery tomorrow by 2:00 PM.",
      hi: "हैदराबाद हब पर अधिक भीड़ के कारण डिलीवरी में देरी हुई है। कल दोपहर 2:00 बजे तक डिलीवरी होने की उम्मीद है।",
      te: "హైదరాబాద్ హబ్ లో రద్దీ కారణంగా డెలివరీ ఆలస్యమైంది. రేపు మధ్యాహ్నం 2:00 గంటల కల్లా డెలివరీ చేయబడుతుంది."
    }
  },
  "ORD-9104": {
    orderId: "ORD-9104",
    customerName: "Priya Sharma (प्रिया शर्मा)",
    phone: "+91 98110 54321",
    items: ["Wireless Noise Cancelling Earbuds", "Protective Silicone Case"],
    orderDate: "2026-11-08",
    expectedDelivery: "2026-11-10 (Today)",
    status: "In Transit",
    carrier: "Delhivery Surface",
    trackingNumber: "DEL778102941",
    currentLocation: "Bengaluru South Distribution Hub",
    notes: {
      en: "Out for delivery with rider Amit Kumar (+91 98765 00123). Delivery OTP: 4921.",
      hi: "डिलीवरी एजेंट अमित कुमार के साथ निकल चुका है। डिलीवरी ओटीपी: 4921 है।",
      te: "డెలివరీ ఏజెంట్ అమిత్ కుమార్ తో రవాణాలో ఉంది. డెలివరీ OTP: 4921."
    }
  },
  "ORD-5532": {
    orderId: "ORD-5532",
    customerName: "Kavitha Reddy (కవిత రెడ్డి)",
    phone: "+91 97010 99887",
    items: ["Cotton Handloom Saree", "Silk Dupatta"],
    orderDate: "2026-11-02",
    expectedDelivery: "2026-11-05",
    status: "Refund Processed",
    carrier: "Shadowfax Logistics",
    trackingNumber: "SFX1029841",
    currentLocation: "Returned to Seller Warehouse",
    refundAmount: "₹2,499.00",
    notes: {
      en: "Refund of ₹2,499.00 credited to original UPI account (Ref: UPI-984102981).",
      hi: "₹2,499.00 का रिफंड मूल यूपीआई खाते में जमा कर दिया गया है (संदर्भ: UPI-984102981)।",
      te: "₹2,499.00 రీఫండ్ మీ UPI ఖాతాకు జమ చేయబడింది (రెఫరెన్స్: UPI-984102981)."
    }
  },
  "ORD-3319": {
    orderId: "ORD-3319",
    customerName: "Rajesh Verma (राजेश वर्मा)",
    phone: "+91 99200 44332",
    items: ["Ergonomic Desk Chair", "Lumbar Cushion"],
    orderDate: "2026-11-09",
    expectedDelivery: "2026-11-13",
    status: "In Transit",
    carrier: "Ekart Logistics",
    trackingNumber: "FMPC99104829",
    currentLocation: "Mumbai Central Fulfillment Centre",
    notes: {
      en: "Package packed and manifests generated. Awaiting interstate transit scan.",
      hi: "सामान पैक हो चुका है। अंतरराज्यीय ट्रांजिट स्कैन की प्रतीक्षा है।",
      te: "ప్యాకేజీ ప్యాక్ చేయబడింది. రవాణా స్కాన్ కోసం వేచి ఉంది."
    }
  }
};

export const SAMPLE_QUERIES = [
  {
    language: "Telugu (తెలుగు)",
    code: "te-IN",
    text: "నా ఆర్డర్ ORD-7821 ఇంకా రాలేదు, డెలివరీ చాలా ఆలస్యం అయింది, ఎప్పుడు వస్తుంది?",
    transcription: "నా ఆర్డర్ ORD-7821 ఇంకా రాలేదు, డెలివరీ చాలా ఆలస్యం అయింది, ఎప్పుడు వస్తుంది?",
    englishMeaning: "My order ORD-7821 hasn't arrived yet, delivery is very delayed, when will it come?",
    intent: "Delivery Delay Complaint",
    orderId: "ORD-7821"
  },
  {
    language: "Hindi (हिन्दी)",
    code: "hi-IN",
    text: "मेरा आर्डर ORD-9104 आज आने वाला था, अभी तक नहीं मिला, स्टेटस क्या है?",
    transcription: "मेरा आर्डर ORD-9104 आज आने वाला था, अभी तक नहीं मिला, स्टेटस क्या है?",
    englishMeaning: "My order ORD-9104 was supposed to arrive today, haven't received it yet, what is the status?",
    intent: "Live Order Tracking",
    orderId: "ORD-9104"
  },
  {
    language: "English",
    code: "en-IN",
    text: "I want to check the refund status for order ORD-5532 that was returned last week.",
    transcription: "I want to check the refund status for order ORD-5532 that was returned last week.",
    englishMeaning: "Check refund status for returned order ORD-5532.",
    intent: "Refund Inquiry",
    orderId: "ORD-5532"
  },
  {
    language: "Telugu (తెలుగు)",
    code: "te-IN",
    text: "నా ఆర్డర్ కాన్సిల్ చేయండి, నాకు ఈ ప్రొడక్ట్ అవసరం లేదు.",
    transcription: "నా ఆర్డర్ కాన్సిల్ చేయండి, నాకు ఈ ప్రొడక్ట్ అవసరం లేదు.",
    englishMeaning: "Please cancel my order, I don't need this product.",
    intent: "Order Cancellation Request",
    orderId: ""
  }
];
