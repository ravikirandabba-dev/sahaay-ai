# SAHAAY AI (సహాయ్ AI / सहाय AI)
### *India's Multilingual Voice Helpdesk for Instant Logistics Resolution*

**Submission for:** The Great Indian AI Internship Challenge by **Gnani.ai**  
**Brand Tagline:** *"Your language. Your voice. Your solution."*  
**Platform Theme:** 3D Animated Gold & Soft Gold Luxury AI Concierge  
- **Champagne Gold:** `#F4E3B2` (Dominant, radiant ambient canvas)  
- **Soft Gold:** `#FFF0C7` & `#FFF8E7` (Cards, panels, inputs, and workspace containers)  
- **Metallic Gold:** `#D4AF37` (3D rotating orbital rings, glowing accents, metallic bevels)  
- **Soft Beach Sand:** `#F3E7D3` (Secondary surfaces, chips, and subtle highlights)  
- **Dark Red:** `#812637` (Tactile 3D microphone button, primary CTAs, contrast typography)

---

## 🌊 Overview

Sahaay AI bridges the language divide for Indian e-commerce and logistics consumers. Customers can speak naturally in **Telugu (తెలుగు)**, **Hindi (हिन्दी)**, **Indian English**, or **code-mixed speech**. 

Using **Gnani Prisma v3**, customer voice audio is transcribed accurately in real time (~160ms latency). The Sahaay Intelligence Engine identifies customer intent, calculates urgency, deterministically retrieves matching shipment records from a synthetic logistics database, triggers escalation workflows, and delivers an empathetic spoken response back in the customer's native language using **Gnani Timbre v3**.

---

## 🚀 Key Features

1. **3D Motional Interface**:
   - **Floating 3D Golden Intelligence Orb**: Multi-axis rotating metallic rings with golden glow and subtle mouse-responsive parallax.
   - **Tactile 3D Microphone Button**: Spherical gradient depth with metallic gold bevel ring, gentle levitation float when idle, and expanding golden ripple pulses when recording.
   - **Audio-Reactive Waveform**: Metallic gold visualizer bars that respond dynamically during microphone capture.
   - **3D Glassmorphic Cards**: Pure white panels with golden elevation shadows and smooth hover transitions.

2. **Native Multilingual Voice Recognition**:
   - Direct integration with **Gnani Prisma v3** (`POST https://api.vachana.ai/stt/v3`).
   - Browser microphone capture directly encoded into **16-bit PCM WAV (16kHz Mono)** with RIFF header, ensuring 100% format compliance.
   - Upload support for WAV, MP3, M4A, OGG, and FLAC audio files.
   - Language selector: Auto-detect (`indic-auto`), Telugu (`te-IN`), Hindi (`hi-IN`), English (`en-IN`).

3. **Customer Support Intelligence**:
   - Real-time intent detection:
     - `DELIVERY_DELAY` (Delivery delays, logistics bottlenecks, transit congestion)
     - `ORDER_STATUS` (Live tracking, out-for-delivery OTP, courier rider coordinates)
     - `REFUND_REQUEST` (Refund tracking, payment ARN/UTR verification)
     - `ORDER_CANCELLATION` (Immediate return-to-origin dispatch)
   - Dynamic urgency scoring (`HIGH`, `MEDIUM`, `LOW`).
   - Automatic Order ID extraction (e.g. `ORD-7821`, `ORD-9104`).
   - Grounded resolution requirement: requires a valid Order ID rather than hallucinating live status.

4. **Deterministic Synthetic Logistics Database**:
   - Clearly labeled demo database with active customer tracking:
     - `ORD-7821`: Srinivas Rao (Hyderabad Hub — High festive delay, BlueDart Express)
     - `ORD-9104`: Priya Sharma (Bengaluru South — Out for delivery today, Delhivery)
     - `ORD-5532`: Kavitha Reddy (Returned to seller — Refund of ₹2,499 processed)
     - `ORD-3319`: Rajesh Verma (Mumbai Fulfillment Centre — Awaiting interstate scan)

5. **Voiceback Synthesis (Gnani Timbre v3)**:
   - Primary route proxies directly to **Gnani Timbre v3** (`POST https://api.vachana.ai/api/v1/tts/inference`) with official models and voices (`Shivani` for Hindi, `Kalpana` for Telugu, `Avinash` for English).
   - Seamless browser speech synthesis fallback if network latency or quotas require it.

6. **Enterprise Security & Diagnostics**:
   - Zero API key leakage: `GNANI_API_KEY` is strictly managed server-side.
   - `/api/health` diagnostic endpoint reports credentials configuration status and network connectivity to Gnani Vachana servers without exposing credentials.

---

## ⚡ 60-Second Demo Walkthrough

1. **Launch the Application**:
   - Open [http://localhost:3000](http://localhost:3000) in your browser.
   - Observe the 3D rotating Golden Intelligence Orb and the "Gnani API Active" badge in the navigation bar.

2. **Run the Synthetic Customer Story (Telugu Delivery Delay)**:
   - Click the **Telugu (Delivery)** quick test button in the Demo Records section (or click the 3D Mic button and speak: *"నా ఆర్డర్ ORD-7821 ఇంకా రాలేదు, డెలివరీ చాలా ఆలస్యం అయింది, ఎప్పుడు వస్తుంది?"*).
   - **Gnani Prisma STT** transcribes the speech to text.
   - **Sahaay Intelligence** detects:
     - Intent: `Delivery Delay & Logistics Escalation`
     - Urgency: `HIGH`
     - Extracted Order ID: `ORD-7821`
   - **Database Match**: Identifies Srinivas Rao's Smart LED TV stuck at Hyderabad Hub due to festive dispatch volume.
   - **Automated Next Action**: Dispatches an expedited ticket to BlueDart Express and commits a delivery window of tomorrow 2:00 PM.
   - **Spoken Voiceback**: Click **"Speak Response"** to hear the spoken update synthesized live by **Gnani Timbre TTS** in natural Telugu:
     > *"నమస్కారం Srinivas గారూ, మీ ఆర్డర్ ORD-7821 ప్రస్తుతం Hyderabad Hub వద్ద ఉంది..."*

3. **Test Other Scenarios**:
   - Click **Hindi (Live Tracking)** for `ORD-9104` to see OTP & courier details for Priya Sharma.
   - Click **English (Refund)** for `ORD-5532` to verify refund transaction reference `UPI-984102981`.

---

## 🧪 Comprehensive Verification Matrix (100% Pass)

All core scenarios have been verified against the live Gnani AI API and local Next.js intelligence engine:

| # | Test Scenario | Input / Query | Expected Output | Status |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **General Inquiry** | *"What you gonna do now?"* | Explains helpdesk capabilities without demanding an Order ID (`needsOrderId: false`) | **PASS** ✅ |
| **2** | **English Delivery Complaint** | *"My order ORD-7821 is delayed, where is my package?"* | Intent: `DELIVERY_DELAY`, extracts `ORD-7821`, locates parcel at Hyderabad Hub (BlueDart) | **PASS** ✅ |
| **3** | **Telugu Delivery Complaint** | *"నా ఆర్డర్ ORD-7821 ఇంకా రాలేదు, డెలివరీ చాలా ఆలస్యం అయింది"* | Detected Lang: `Telugu`, Intent: `DELIVERY_DELAY`, empathetic Telugu customer response | **PASS** ✅ |
| **4** | **Hindi Refund Request** | *"मेरा रिफंड कब मिलेगा ORD-5532 के लिए?"* | Detected Lang: `Hindi`, Intent: `REFUND_REQUEST`, returns ₹2,499.00 and UPI ref `UPI-984102981` | **PASS** ✅ |
| **5** | **Invalid / Unknown Order ID** | *"Where is my order ORD-9999?"* | Sets `isUnknownOrderId: true`, explains ORD-9999 not in demo database, prompts valid demo IDs | **PASS** ✅ |
| **6** | **Missing Order ID** | *"Please track my shipment, where is it?"* | Sets `needsOrderId: true`, prompts customer for Order ID or one-click demo order | **PASS** ✅ |
| **7** | **Gnani Timbre TTS Spoken Audio** | Spoken response in Telugu (`Kalpana`) | Real binary WAV audio synthesized from `api.vachana.ai` (199,724 bytes, HTTP 200) | **PASS** ✅ |
| **8** | **API Error & Safe Recovery** | Missing audio file upload | Handled gracefully with HTTP 400 and clear error message (no unhandled crashes) | **PASS** ✅ |
| **9** | **Gnani Prisma STT Live Audio** | `public/real_speech.wav` (16kHz WAV) | Transcribed via `model=prisma-v3.0` (Request ID: `01a1c570-...`, Latency: 0.155s) | **PASS** ✅ |

---

## 🛠️ Setup & Local Development

### 1. Prerequisites
- Node.js 18.x / 20.x / 24.x
- npm 9+
- A valid **Gnani.ai API Key** from [Gnani.ai](https://gnani.ai)

### 2. Installation
```bash
# Clone or navigate to the repository
cd C:\hackathons\sahaay-ai

# Install dependencies
npm install
```

### 3. Environment Variables
Create or edit `.env.local` in the project root:
```env
# Gnani AI API Key (Vachana Speech Platform)
GNANI_API_KEY=your_actual_gnani_api_key_here
```
> **Security Note:** `.env.local` is ignored by Git and will never be committed or exposed to frontend code.

### 4. Running the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running Production Build
```bash
npm run build
npm run start
```

---

## 📡 API Architecture

| Endpoint | Method | Purpose | Upstream Provider |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | Health diagnostics, key check, Gnani reachability | Internal / Gnani probe |
| `/api/stt` | `POST` | Proxy audio upload to Gnani Prisma v3 | `https://api.vachana.ai/stt/v3` |
| `/api/tts` | `POST` | Proxy text-to-speech to Gnani Timbre v3 | `https://api.vachana.ai/api/v1/tts/inference` |
| `/api/support` | `POST` | Intent extraction, urgency, synthetic order lookup | Sahaay Intelligence Engine |

---

## ☁️ Deployment Instructions (Vercel)

1. Push your repository to GitHub or GitLab:
   ```bash
   git add .
   git commit -m "feat: Sahaay AI 3D Gold Multilingual Voice Helpdesk"
   git push origin main
   ```
2. Import the project into **Vercel**:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Add Environment Variable in Vercel Project Settings:
   - Key: `GNANI_API_KEY`
   - Value: `<your-gnani-api-key>`
4. Deploy! Your helpdesk will be instantly accessible globally with HTTPS, supporting microphone permissions.

---

## 🏆 Project Credits

Developed for the **Great Indian AI Internship Challenge** by **Gnani.ai**.
Proudly built with Next.js App Router, TypeScript, Tailwind CSS, Motion, and Gnani Speech Intelligence.
