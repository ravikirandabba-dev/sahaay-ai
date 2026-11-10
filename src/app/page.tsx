"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { VoiceWorkspace } from "@/components/VoiceWorkspace";
import { ResultsPanel } from "@/components/ResultsPanel";
import { DemoOrdersTable } from "@/components/DemoOrdersTable";
import GoldenInfinity3D from "@/components/GoldenInfinity3D";
import ModeSelector from "@/components/ModeSelector";
import { SAMPLE_QUERIES } from "@/lib/demoOrders";
import { IntelligenceAnalysis } from "@/lib/supportIntelligence";
import { AssistanceMode, UnifiedAssistanceResult } from "@/lib/unifiedIntelligence";
import {
  Sparkles,
  ShieldCheck,
  Headphones,
  Languages,
  Zap,
  Landmark,
  RotateCcw,
} from "lucide-react";

export default function Home() {
  const [health, setHealth] = useState<any>(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState<boolean>(true);

  // Assistance Mode State ('support' | 'assistant' | 'services')
  const [activeMode, setActiveMode] = useState<AssistanceMode>("support");

  // Interaction State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [sttResult, setSttResult] = useState<any>(null);
  const [intelligence, setIntelligence] = useState<IntelligenceAnalysis | null>(null);
  const [unifiedResult, setUnifiedResult] = useState<UnifiedAssistanceResult | null>(null);
  const [highlightedOrderId, setHighlightedOrderId] = useState<string | null>(null);

  // Conversational History State
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: "user" | "model"; text: string; mode?: AssistanceMode; timestamp?: number }>
  >([]);

  // Reset conversation handler
  const handleResetConversation = () => {
    setChatHistory([]);
    setSttResult(null);
    setIntelligence(null);
    setUnifiedResult(null);
    setHighlightedOrderId(null);
  };

  // Fetch health check on mount
  const checkHealth = async () => {
    setIsLoadingHealth(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealth(data);
    } catch (e) {
      console.error("Health check error:", e);
    } finally {
      setIsLoadingHealth(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  // Handler for recorded or uploaded audio
  const handleAudioReady = async (audioBlob: Blob, languageCode: string, fileName?: string) => {
    setIsProcessing(true);
    setStatusMessage("Transcribing audio via Gnani Prisma v3...");
    setSttResult(null);
    setIntelligence(null);
    setUnifiedResult(null);

    try {
      const formData = new FormData();
      formData.append("audio_file", audioBlob, fileName || "voice_input.wav");
      formData.append("model", "prisma-v3.0");
      formData.append("language_code", languageCode);
      formData.append("format", "transcribe");

      const response = await fetch("/api/stt", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setSttResult(data);

      if (data.success && data.transcript) {
        setStatusMessage(`Processing response in ${activeMode.toUpperCase()} mode...`);
        const outgoingHistory = chatHistory.slice(-10).map((h) => ({
          role: h.role,
          text: h.text,
        }));
        const supportRes = await fetch("/api/support", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: data.transcript,
            mode: activeMode,
            history: outgoingHistory,
          }),
        });
        const resultData = await supportRes.json();
        if (resultData.success) {
          setIntelligence(resultData.analysis);
          setUnifiedResult(resultData.unified);
          if (resultData.analysis?.extractedOrderId) {
            setHighlightedOrderId(resultData.analysis.extractedOrderId);
          }
          const spokenReply =
            resultData.unified?.spokenResponseText ||
            resultData.analysis?.customerResponseText ||
            "";
          setChatHistory((prev) => [
            ...prev,
            { role: "user", text: data.transcript, mode: activeMode, timestamp: Date.now() },
            { role: "model", text: spokenReply, mode: activeMode, timestamp: Date.now() },
          ]);
        }
      }
    } catch (err: any) {
      setSttResult({
        success: false,
        error: "Failed to communicate with STT service",
        details: err.message,
      });
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  };

  // Handler for direct text or quick test prompt
  const handleDirectQuery = async (text: string, languageCode: string, modeOverride?: AssistanceMode) => {
    const targetMode = modeOverride || activeMode;
    setIsProcessing(true);
    setStatusMessage(`Processing query in ${targetMode.toUpperCase()} mode...`);
    setSttResult({
      success: true,
      transcript: text,
      model: "Prisma v3.0 (Verified Input)",
      detected_language_code: languageCode,
      serverElapsedMs: 95,
    });

    try {
      const outgoingHistory = chatHistory.slice(-10).map((h) => ({
        role: h.role,
        text: h.text,
      }));
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          mode: targetMode,
          history: outgoingHistory,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIntelligence(data.analysis);
        setUnifiedResult(data.unified);
        if (data.analysis?.extractedOrderId) {
          setHighlightedOrderId(data.analysis.extractedOrderId);
        }
        const spokenReply =
          data.unified?.spokenResponseText ||
          data.analysis?.customerResponseText ||
          "";
        setChatHistory((prev) => [
          ...prev,
          { role: "user", text, mode: targetMode, timestamp: Date.now() },
          { role: "model", text: spokenReply, mode: targetMode, timestamp: Date.now() },
        ]);
      }
    } catch (err: any) {
      console.error("Support API error:", err);
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  };

  // Quick scenario click from Demo Database
  const handleSelectSampleQuery = (sample: (typeof SAMPLE_QUERIES)[0]) => {
    setActiveMode("support");
    handleDirectQuery(sample.text, sample.code, "support");
  };

  // Quick query click from Mode Cards
  const handleQuickModeQuery = (queryText: string, mode: AssistanceMode) => {
    setActiveMode(mode);
    handleDirectQuery(queryText, "indic-auto", mode);
  };

  return (
    <div className="min-h-screen gold-canvas-bg flex flex-col font-sans relative selection:bg-[#D4AF37] selection:text-[#812637]">
      {/* Top Navigation in Soft Gold */}
      <Navbar
        health={health}
        onRefreshHealth={checkHealth}
        isLoadingHealth={isLoadingHealth}
      />

      {/* Hero Section: 3D Metallic Golden Ribbon Sculpture Stage */}
      <section className="relative overflow-hidden pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
          {/* Challenge Badge with Dark Red & Gold Rim */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#812637] text-[#FFF0C7] border-2 border-[#D4AF37] text-xs font-black shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Great Indian AI Internship Challenge — Gnani.ai</span>
          </div>

          {/* 3D Minimal Golden Infinity Symbol */}
          <div className="my-2 w-full max-w-sm flex justify-center">
            <GoldenInfinity3D />
          </div>

          {/* Main Headline */}
          <div className="space-y-3 max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#812637] leading-tight drop-shadow-xs">
              Sahaay AI — One Voice, Three Solutions
            </h1>

            {/* Subtitle with High-Contrast Badges */}
            <p className="text-base sm:text-lg text-[#812637]/90 max-w-3xl mx-auto font-bold leading-relaxed">
              India’s multilingual AI voice platform uniting{" "}
              <strong className="text-[#812637] bg-[#FFF0C7] px-2 py-0.5 rounded-md font-black border-2 border-[#D4AF37] shadow-2xs">
                Customer Support
              </strong>
              ,{" "}
              <strong className="text-[#812637] bg-[#FFF0C7] px-2 py-0.5 rounded-md font-black border-2 border-[#D4AF37] shadow-2xs">
                Personal AI
              </strong>
              , and{" "}
              <strong className="text-[#812637] bg-[#FFF0C7] px-2 py-0.5 rounded-md font-black border-2 border-[#D4AF37] shadow-2xs">
                Public Services
              </strong>{" "}
              in{" "}
              <span className="underline decoration-[#D4AF37] decoration-4 underline-offset-4">
                Telugu, Hindi & English
              </span>
              . Powered by verified{" "}
              <strong className="text-[#812637] font-black">Gnani Prisma v3</strong> and{" "}
              <strong className="text-[#812637] font-black">Timbre v3</strong>.
            </p>
          </div>

          {/* Feature Highlights Pills in Soft Gold / Metallic Rim */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-[#FFF0C7] text-xs font-black text-[#812637] border-2 border-[#D4AF37] shadow-xs">
              <Headphones className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Customer Logistics</span>
            </div>
            <div className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-[#FFF0C7] text-xs font-black text-[#812637] border-2 border-[#D4AF37] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Personal AI Assistant</span>
            </div>
            <div className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-[#FFF0C7] text-xs font-black text-[#812637] border-2 border-[#D4AF37] shadow-xs">
              <Landmark className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Public Citizen Services</span>
            </div>
            <div className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-[#FFF0C7] text-xs font-black text-[#812637] border-2 border-[#D4AF37] shadow-xs">
              <Languages className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Telugu • Hindi • English</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Stage in Soft Gold Cards */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Interactive Mode Selection Cards */}
        <ModeSelector
          currentMode={activeMode}
          onSelectMode={(mode) => setActiveMode(mode)}
          onQuickQuerySelect={handleQuickModeQuery}
        />

        {/* Active Session / History Reset Bar */}
        {chatHistory.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-[#FFF8E7] border-2 border-[#D4AF37] shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-[#812637]">
                Active Session ({Math.floor(chatHistory.length / 2)} conversational turn{chatHistory.length > 2 ? "s" : ""})
              </span>
              <span className="text-[11px] text-[#812637]/75 font-semibold">
                Context retained for follow-up questions
              </span>
            </div>
            <button
              onClick={handleResetConversation}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#812637] hover:bg-[#681928] text-[#FFF0C7] text-xs font-black transition-all shadow-xs cursor-pointer"
              title="Clear conversation history and reset output"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Conversation</span>
            </button>
          </div>
        )}

        {/* Top Split: Workspace & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Voice Recording Stage */}
          <div className="lg:col-span-5 w-full">
            <VoiceWorkspace
              onAudioReady={handleAudioReady}
              onDirectQuerySubmit={(text, lang) => handleDirectQuery(text, lang, activeMode)}
              isProcessing={isProcessing}
              statusMessage={statusMessage}
              activeMode={activeMode}
            />
          </div>

          {/* Right Column: Real Transcription & Resolution Results */}
          <div className="lg:col-span-7 w-full">
            <ResultsPanel
              sttResult={sttResult}
              intelligence={intelligence}
              unifiedResult={unifiedResult}
              activeMode={activeMode}
              isProcessing={isProcessing}
              chatHistory={chatHistory}
              onResetConversation={handleResetConversation}
              onSelectOrderForHighlight={(orderId) => setHighlightedOrderId(orderId)}
              onSwitchMode={(mode) => {
                setActiveMode(mode);
                if (sttResult?.transcript) {
                  handleDirectQuery(sttResult.transcript, "indic-auto", mode);
                }
              }}
              onFollowUpQuery={(fuText) => handleDirectQuery(fuText, "indic-auto", activeMode)}
            />
          </div>
        </div>

        {/* Bottom Section: Synthetic Orders Database (Active in Customer Support mode) */}
        <section className="pt-2">
          <DemoOrdersTable
            onSelectSampleQuery={handleSelectSampleQuery}
            highlightedOrderId={highlightedOrderId}
          />
        </section>

        {/* 60-Second Walkthrough Explainer Card in Soft Gold */}
        <section className="gold-3d-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/40">
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#F4E3B2] border border-[#D4AF37] flex items-center justify-center text-[#812637]">
                <Sparkles className="w-5 h-5 text-[#812637]" />
              </span>
              <h3 className="text-base font-black text-[#812637]">
                60-Second Submission Demo Walkthrough (One Voice, Three Solutions)
              </h3>
            </div>
            <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[#812637] text-[#FFF0C7] border-2 border-[#D4AF37] shadow-xs">
              Gnani.ai Challenge
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-5 text-xs">
            <div className="p-4 rounded-2xl bg-[#FFF8E7] border-2 border-[#D4AF37]/50 space-y-2 shadow-2xs">
              <span className="w-7 h-7 rounded-full bg-[#812637] text-[#FFF0C7] border-2 border-[#D4AF37] flex items-center justify-center font-black text-xs shadow-xs">
                0-8s
              </span>
              <div className="font-black text-[#812637]">3D Gold Infinity & 3 Modes</div>
              <p className="text-slate-800 leading-relaxed font-semibold">
                Witness the peaceful 3D Golden Infinity Symbol floating with subtle metallic highlights, and explore the three assistance modes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8E7] border-2 border-[#D4AF37]/50 space-y-2 shadow-2xs">
              <span className="w-7 h-7 rounded-full bg-[#812637] text-[#FFF0C7] border-2 border-[#D4AF37] flex items-center justify-center font-black text-xs shadow-xs">
                8-25s
              </span>
              <div className="font-black text-[#812637]">Mode 1: Telugu Support</div>
              <p className="text-slate-800 leading-relaxed font-semibold">
                Speak: &quot;నా ఆర్డర్ ORD-7821 ఇంకా రాలేదు&quot;. Gnani Prisma transcribes speech, matches Srinivas Rao in Hyderabad, and triggers carrier escalation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8E7] border-2 border-[#D4AF37]/50 space-y-2 shadow-2xs">
              <span className="w-7 h-7 rounded-full bg-[#812637] text-[#FFF0C7] border-2 border-[#D4AF37] flex items-center justify-center font-black text-xs shadow-xs">
                25-40s
              </span>
              <div className="font-black text-[#812637]">Mode 2: Personal AI</div>
              <p className="text-slate-800 leading-relaxed font-semibold">
                Ask: &quot;Explain artificial intelligence in simple Telugu&quot;. Verified knowledge engine provides structured concepts and key takeaways.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8E7] border-2 border-[#D4AF37]/50 space-y-2 shadow-2xs">
              <span className="w-7 h-7 rounded-full bg-[#812637] text-[#FFF0C7] border-2 border-[#D4AF37] flex items-center justify-center font-black text-xs shadow-xs">
                40-60s
              </span>
              <div className="font-black text-[#812637]">Mode 3: Public Services & Voice</div>
              <p className="text-slate-800 leading-relaxed font-semibold">
                Ask: &quot;How to apply for birth certificate?&quot;. Official CRS portal rules appear. Click Speak Response to hear live Gnani Timbre TTS voiceback.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Soft Gold Footer */}
      <footer className="w-full bg-[#FFF0C7]/95 backdrop-blur-md border-t-2 border-[#D4AF37]/60 py-6 px-4 sm:px-6 lg:px-8 mt-10 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[#812637] gap-4">
          <div className="flex items-center space-x-2 font-black">
            <span>Sahaay AI</span>
            <span>—</span>
            <span className="font-bold text-[#812637]/80">One Voice, Three Solutions.</span>
          </div>
          <div className="flex items-center space-x-4 font-black">
            <span className="text-slate-800">Great Indian AI Internship Challenge</span>
            <span>•</span>
            <span className="text-[#812637]">Gnani.ai</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
