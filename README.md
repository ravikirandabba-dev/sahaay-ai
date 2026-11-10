# SAHAAY AI (సహాయ్ AI / सहाय AI)
### *One Voice, Three Solutions — India's Multilingual Voice Assistance Platform*

**Submission for:** The Great Indian AI Internship Challenge by **Gnani.ai**  
**Brand Tagline:** *"One Voice, Three Solutions. Your language. Your voice. Your solution."*  
**Platform Theme:** 3D Animated Gold & Soft Gold Luxury AI Platform  
- **Champagne Gold:** `#F4E3B2` (Dominant, radiant ambient canvas)  
- **Soft Gold:** `#FFF0C7` & `#FFF8E7` (Cards, panels, inputs, and workspace containers)  
- **Metallic Gold:** `#D4AF37` (3D floating metallic infinity loop, glowing accents, metallic bevels)  
- **Soft Beach Sand:** `#F3E7D3` (Secondary surfaces, chips, and subtle highlights)  
- **Dark Red:** `#812637` (Tactile 3D microphone button, primary CTAs, contrast typography)

---

## 🌊 Overview

Sahaay AI is a unified multilingual AI voice assistance platform designed for India, delivering **three distinct, functional assistance modes** powered by a single voice pipeline:

1. **Customer Support (Logistics & Orders)**: Instant live resolution for delivery delays, shipment tracking, refund status, and order cancellations with a deterministic synthetic logistics database.
2. **Personal AI Assistant (Education & Concepts)**: Plain-language explanations of core concepts in Artificial Intelligence, Machine Learning, study strategies, and technical interview preparation in Telugu, Hindi, and English.
3. **Public Services Guidance (Citizen Services)**: Step-by-step verified procedural guidance for official Indian government services — Birth Certificates (`crsorgi.gov.in`), UIDAI Aadhaar updates (`uidai.gov.in`), and National Scholarships (`scholarships.gov.in`).

Customers speak naturally in **Telugu (తెలుగు)**, **Hindi (हिन्दी)**, or **Indian English**. Voice audio is transcribed using **Gnani Prisma v3** (~150ms latency), processed by the relevant assistance mode, and answered with synthesized native voiceback using **Gnani Timbre v3**.

---

## 🚀 Key Features

### 1. 3D Floating Metallic Golden Infinity Symbol (∞)
- Built with lightweight, crash-proof **CSS 3D & SVG** inside [`src/components/GoldenInfinity3D.tsx`](file:///C:/hackathons/sahaay-ai/src/components/GoldenInfinity3D.tsx).
- Features a **minimal, symmetrical 3D infinity loop** with rounded metallic-gold cylindrical shading, champagne highlights, and soft ambient drop shadows.
- **Gentle Motion**: Slow peaceful floating levitation and subtle 3D tilt.
- **Optimal Sizing**: Responsive (260–320px on desktop, 170–220px on mobile) with generous breathing room and zero clutter.
- **Accessibility**: Automatically respects `prefers-reduced-motion` with static rendering and zero GPU overhead.

### 2. Three Interactive Mode-Selection Cards
- **Mode 1: Customer Support**: Logistics escalations, carrier OTPs, and synthetic order lookups (`ORD-7821`, `ORD-9104`, `ORD-5532`, `ORD-3319`).
- **Mode 2: Personal AI Assistant**: Concepts, definitions, key takeaways, and suggested follow-ups for AI, ML, cloud computing, and productivity.
- **Mode 3: Public Services Guidance**: Verified procedures, document checklists, official `.gov.in` portal links, and administrative disclaimers.
- Real-time conservative smart suggestion banner when user query matches an alternate mode.

### 3. Native Multilingual Voice Engine (Shared Pipeline)
- **Gnani Prisma v3 STT**: Real-time 16-bit PCM WAV (16kHz Mono) transcription via `POST https://api.vachana.ai/stt/v3`.
- **Gnani Timbre v3 TTS**: Native speech synthesis via `POST https://api.vachana.ai/api/v1/tts/inference` using verified voices:
  - `Kalpana` — Telugu (`te-IN`)
  - `Shivani` — Hindi (`hi-IN`)
  - `Avinash` — Indian English (`en-IN`)
- **Audio Source Transparency**: Clearly distinguishes between `Gnani Timbre` and browser fallback in the UI.

---

## 🧪 Comprehensive Verification Matrix (100% Pass — 13/13)

All 13 required scenarios across all three modes and the shared voice pipeline were verified against the live Gnani AI API:

| Category | # | Test Scenario | Input / Query | Verified Behavior / Output | Result |
| :--- | :---: | :--- | :--- | :--- | :---: |
| **Customer Support** | 1 | English Delivery Complaint | *"My order ORD-7821 is delayed, where is my package?"* | Intent: `DELIVERY_DELAY`, extracted `ORD-7821`, matched Srinivas Rao at Hyderabad Hub (BlueDart) | **PASS** ✅ |
| | 2 | Telugu Delivery Complaint | *"నా ఆర్డర్ ORD-7821 ఇంకా రాలేదు, డెలివరీ ఆలస్యం అయింది"* | Detected Lang: `Telugu`, Intent: `DELIVERY_DELAY`, empathetic Telugu customer response | **PASS** ✅ |
| | 3 | Invalid Order ID | *"Where is my parcel with order ORD-9999?"* | Sets `isUnknownOrderId: true`, explains ORD-9999 not in demo DB, suggests valid demo IDs | **PASS** ✅ |
| | 4 | General Inquiry | *"What you gonna do now?"* | Explains helpdesk capabilities without demanding an Order ID (`needsOrderId: false`) | **PASS** ✅ |
| **Personal AI** | 5 | English Study Tips Question | *"Give me three scientific study tips for exam preparation"* | Returns structured Active Recall, Spaced Repetition & Pomodoro breakdown with 3 key takeaways | **PASS** ✅ |
| | 6 | Telugu AI Concept Question | *"కృత్రిమ మేధస్సు (AI) అంటే ఏమిటి, సులభంగా వివరించండి"* | Detected Lang: `Telugu`, returns clear definition of AI and neural networks in Telugu | **PASS** ✅ |
| **Public Services** | 7 | Birth Certificate Procedure | *"How can I apply for a birth certificate in India?"* | Provides CRS guidelines, official link to `https://crsorgi.gov.in`, 4-step guide, and doc checklist | **PASS** ✅ |
| | 8 | Student Scholarships (NSP) | *"What are the rules and documents needed for National Scholarship Portal NSP?"* | Provides NSP guidelines, official link to `https://scholarships.gov.in`, and OTR / Aadhaar-seeding steps | **PASS** ✅ |
| **Shared Voice Engine** | 9 | Live Gnani Prisma STT | `public/real_speech.wav` (16kHz WAV) | Transcribed via `model=prisma-v3.0` (Request ID: `01a1c582-...`, Latency: 0.138s) | **PASS** ✅ |
| | 10 | Live Gnani Timbre TTS | Spoken response in Telugu (`Kalpana`) | Real binary WAV audio synthesized from `api.vachana.ai` (311,084 bytes, HTTP 200) | **PASS** ✅ |
| | 11 | API Error Recovery | Missing audio file upload payload | Handled gracefully with HTTP 400 and clear error message (no server crashes) | **PASS** ✅ |
| **3D UI & UX** | 12 | 3D Ribbon Sculpture | Procedural Three.js WebGL sculpture | Dual TorusKnotGeometry with specular reflections, mouse parallax, and reduced-motion | **PASS** ✅ |
| | 13 | Mode Selection Cards | 3 Interactive mode cards | Active state styling, sample query triggers, and dynamic placeholders | **PASS** ✅ |

---

## ⚡ 60-Second Demo Walkthrough

1. **0–8 seconds (3D Gold Interface & 3 Modes)**:
   - Open [http://localhost:3000](http://localhost:3000).
   - Observe the 3D procedural metallic golden ribbon rotating with mouse parallax.
   - Note the three mode-selection cards: Customer Support, Personal AI Assistant, and Public Services Guidance.

2. **8–25 seconds (Mode 1: Telugu Customer Support)**:
   - Click **Telugu Delivery** under Mode 1 or click the 3D Mic and speak: *"నా ఆర్డర్ ORD-7821 ఇంకా రాలేదు"*.
   - **Prisma STT** transcribes the speech in ~150ms.
   - **Sahaay Intelligence** identifies Srinivas Rao's Smart LED TV delayed at Hyderabad Hub via BlueDart.
   - Click **Speak Response** to hear live **Gnani Timbre TTS** in natural Telugu (`voice: Kalpana`).

3. **25–40 seconds (Mode 2: Personal AI Assistant)**:
   - Click **Mode 2: Personal AI Assistant**.
   - Click the **Telugu AI** prompt: *"కృత్రిమ మేధస్సు (AI) అంటే ఏమిటి, సులభంగా వివరించండి"*.
   - View the structured conceptual explanation, key takeaways, and suggested follow-up questions.
   - Listen to the explanation spoken aloud with Gnani Timbre.

4. **40–53 seconds (Mode 3: Public Services Guidance)**:
   - Click **Mode 3: Public Services Guidance**.
   - Click **English Birth Cert** or speak: *"How can I apply for a birth certificate in India?"*.
   - View the verified 21-day timeline, required documents checklist, and official portal link to [`crsorgi.gov.in`](https://crsorgi.gov.in).

5. **53–60 seconds (Tagline & Verification)**:
   - Play the synthesized voiceback and see the brand tagline:  
     **"Sahaay AI — One Voice. Three Solutions."**

---

## 🛠️ Setup & Local Development

### 1. Prerequisites
- Node.js 18.x / 20.x / 22.x / 24.x
- npm 9+
- A valid **Gnani.ai API Key** from [Gnani.ai](https://gnani.ai)

### 2. Installation
```bash
cd C:\hackathons\sahaay-ai
npm install
```

### 3. Environment Variables
Create or verify `.env.local` in the project root:
```env
# Gnani AI API Key (Vachana Speech Platform)
GNANI_API_KEY=your_actual_gnani_api_key_here
```
> **Security Note:** `.env.local` is ignored by Git (`.gitignore`) and is never committed or exposed to frontend code.

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
| `/api/support` | `POST` | Unified router: Customer Support, Personal AI, Public Services | Sahaay Unified Intelligence Engine |

---

## ☁️ Deployment Instructions (Vercel)

1. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: Sahaay AI 3-in-1 Multilingual Voice Assistance Platform"
   git push origin main
   ```
2. Import the repository into **Vercel**:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Add Environment Variable in Vercel Project Settings:
   - Key: `GNANI_API_KEY`
   - Value: `<your-gnani-api-key>`
4. Deploy! Your helpdesk will be accessible globally via HTTPS with full microphone support.

---

## 🏆 Project Credits

Developed for the **Great Indian AI Internship Challenge** by **Gnani.ai**.  
Built with Next.js App Router, TypeScript, Three.js, Tailwind CSS, Motion, and Gnani Speech Intelligence.
