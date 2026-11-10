# SAHAAY AI (సహాయ్ AI / सहाय AI)
### *One Voice, Three Solutions — India's Multilingual Voice Intelligence Platform*
**Submission for:** The Great Indian AI Internship Challenge by **Gnani.ai**  
**Repository:** [github.com/ravikirandabba-dev/sahaay-ai](https://github.com/ravikirandabba-dev/sahaay-ai) | **Format:** Executive One-Page Solution Pitch

---

## 1. The Problem
Over 1.4 billion citizens across India speak 22+ official languages and countless code-mixed dialects (Hinglish, Tenglish). Yet the modern digital ecosystem remains predominantly text-heavy, English-first, and severely fragmented:
- **E-Commerce Logistics:** Customers facing delayed shipments must navigate complex dashboards or rigid IVR menus that fail on Indian accents and vernacular speech.
- **Citizen Paperwork:** Government procedures for essential certificates and welfare portals are buried under bureaucratic legal jargon, leaving non-technical citizens dependent on middlemen.
- **Conversational AI:** Traditional multilingual assistants either recite rigid pre-programmed FAQ scripts or hallucinate sensitive transactional facts.

---

## 2. The Solution: Sahaay AI
**Sahaay AI** (*"Sahaay"* meaning *Help / Assistance*) is a voice-first, multilingual AI platform uniting **three critical daily domains into a single spoken interface**. Users speak naturally in **Telugu (తెలుగు)**, **Hindi (हिन्दी)**, or **Indian English**, and receive immediate audio responses in native regional accents alongside structured, high-contrast visual cards.

### Three Assistance Modes, One Seamless Voice Pipeline
1. **Mode 1 — Customer Support (Logistics & Orders):** Resolves shipment delays, delivery ETA lookups, refund statuses, and carrier escalations. *Deterministic Safety:* Inquiries match verified synthetic records (`ORD-7821`, `ORD-9104`, `ORD-5532`, `ORD-3319`) to ensure zero hallucinations in order tracking.
2. **Mode 2 — Personal AI Assistant (Conversational Reasoning):** Delivers fluid explanations across world knowledge, geography (*"Where is India on the world map?"*), science, math calculations, programming, and career advice with multi-turn session context.
3. **Mode 3 — Public Services Guidance (Citizen Navigation):** Provides step-by-step procedural checklists, statutory timelines (e.g., 21-day birth registration window), and direct links to official `.gov.in` portals for Birth Certificates ([crsorgi.gov.in](https://crsorgi.gov.in)), UIDAI Aadhaar ([uidai.gov.in](https://uidai.gov.in)), and National Scholarships ([scholarships.gov.in](https://scholarships.gov.in)).

---

## 3. Technology Architecture & Integration
$$\text{Customer Speech} \xrightarrow{\text{Web Audio (16kHz WAV)}} \mathbf{\text{Gnani Prisma v3 STT}} \xrightarrow{\text{Unified Router}} \mathbf{\text{Google Gemini 3.5 Flash}} \xrightarrow{\text{Native Voiceback}} \mathbf{\text{Gnani Timbre v3 TTS}}$$

- **Gnani Prisma v3 REST STT:** Real-time speech-to-text with industry-leading Indic accent handling, sub-150ms transcription latency, and automatic code-mixed speech recognition.
- **Google Gen AI SDK (`@google/genai`):** Powers open-ended reasoning via `gemini-3.5-flash` with bounded conversation history for contextual follow-up inquiries.
- **Gnani Timbre v3 REST TTS:** High-fidelity speech synthesis utilizing verified Indic voices—**Kalpana** (Telugu), **Shivani** (Hindi), and **Avinash** (Indian English).
- **Frontend & 3D UI:** Next.js App Router, Tailwind CSS, and a lightweight, crash-proof **3D Golden Infinity Symbol (∞)** rendered in pure CSS 3D/SVG for smooth 60fps performance on mobile and desktop.

---

## 4. Target Users & Practical Impact
- **Vernacular Consumers:** Track orders and resolve logistics disputes without typing or translating into English.
- **Rural & Semi-Urban Citizens:** Navigate statutory government processes without paying exploitative agent commissions.
- **Students & Learners:** Ask open conceptual questions in their native language with conversational follow-up capability.
- **Enterprises:** Drastically cut Tier-1 support call load by automating multilingual voice resolution.

---

## 5. Originality & Transparent Disclosures
- **Originality:** Unifies transactional logistics lookups, generative conversational reasoning, and civic navigation under one adaptive voice model with conservative cross-mode suggestion banners.
- **Transparent Disclosures:**
  1. *Synthetic Order Data:* Logistics records are synthetic demonstration data created for hackathon evaluation and deterministic test verification.
  2. *Informational Public Services:* Guidance is strictly procedural and informational; Sahaay AI does not collect citizen credentials or process statutory filings directly.

**Tagline:** *Sahaay AI — One Voice, Three Solutions. Your language. Your voice. Your solution.*
