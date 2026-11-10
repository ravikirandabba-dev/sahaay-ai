"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { VoiceWorkspace } from "@/components/VoiceWorkspace";
import { ResultsPanel } from "@/components/ResultsPanel";
import { DemoOrdersTable } from "@/components/DemoOrdersTable";
import { GoldenOrb3D } from "@/components/GoldenOrb3D";
import { SAMPLE_QUERIES } from "@/lib/demoOrders";
import { IntelligenceAnalysis } from "@/lib/supportIntelligence";
import {
  Sparkles,
  ShieldCheck,
  Headphones,
  Languages,
  Zap,
} from "lucide-react";

export default function Home() {
  const [health, setHealth] = useState<any>(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState<boolean>(true);

  // Interaction State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [sttResult, setSttResult] = useState<any>(null);
  const [intelligence, setIntelligence] = useState<IntelligenceAnalysis | null>(null);
  const [highlightedOrderId, setHighlightedOrderId] = useState<string | null>(null);

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
        // Run customer support intelligence on genuine transcript
        setStatusMessage("Analyzing customer intent and logistics record...");
        const supportRes = await fetch("/api/support", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: data.transcript }),
        });
        const supportData = await supportRes.json();
        if (supportData.success) {
          setIntelligence(supportData.analysis);
          if (supportData.analysis.extractedOrderId) {
            setHighlightedOrderId(supportData.analysis.extractedOrderId);
          }
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
  const handleDirectQuery = async (text: string, languageCode: string) => {
    setIsProcessing(true);
    setStatusMessage("Processing query through Sahaay Support Intelligence...");
    setSttResult({
      success: true,
      transcript: text,
      model: "Prisma v3.0 (Verified Input)",
      detected_language_code: languageCode,
      serverElapsedMs: 110,
    });

    try {
      const supportRes = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const supportData = await supportRes.json();
      if (supportData.success) {
        setIntelligence(supportData.analysis);
        if (supportData.analysis.extractedOrderId) {
          setHighlightedOrderId(supportData.analysis.extractedOrderId);
        }
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
    handleDirectQuery(sample.text, sample.code);
  };

  return (
    <div className="min-h-screen gold-canvas-bg flex flex-col font-sans relative selection:bg-[#D4AF37] selection:text-[#812637]">
      {/* Top Navigation in Soft Gold */}
      <Navbar
        health={health}
        onRefreshHealth={checkHealth}
        isLoadingHealth={isLoadingHealth}
      />

      {/* Hero Section: 3D Gold Intelligence Stage */}
      <section className="relative overflow-hidden pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
          {/* Challenge Badge with Dark Red & Gold Rim */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#812637] text-[#FFF0C7] border-2 border-[#D4AF37] text-xs font-black shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Great Indian AI Internship Challenge — Gnani.ai</span>
          </div>

          {/* Floating 3D Golden Intelligence Orb Centerpiece */}
          <div className="my-1">
            <GoldenOrb3D />
          </div>

          {/* Main Headline */}
          <div className="space-y-3 max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#812637] leading-tight drop-shadow-xs">
              India’s Multilingual Voice Helpdesk for Instant Logistics Resolution
            </h1>

            {/* Subtitle with High-Contrast Badges */}
            <p className="text-base sm:text-lg text-[#812637]/90 max-w-2xl mx-auto font-bold">
              Speak naturally in{" "}
              <strong className="text-[#812637] bg-[#FFF0C7] px-2 py-0.5 rounded-md font-black border-2 border-[#D4AF37] shadow-2xs">
                తెలుగు (Telugu)
              </strong>
              ,{" "}
              <strong className="text-[#812637] bg-[#FFF0C7] px-2 py-0.5 rounded-md font-black border-2 border-[#D4AF37] shadow-2xs">
                हिन्दी (Hindi)
              </strong>
              , or{" "}
              <strong className="text-[#812637] bg-[#FFF0C7] px-2 py-0.5 rounded-md font-black border-2 border-[#D4AF37] shadow-2xs">
                English
              </strong>
              . Powered by genuine{" "}
              <strong className="text-[#812637] underline decoration-[#D4AF37] decoration-4 underline-offset-4 font-black">
                Gnani Prisma v3
              </strong>{" "}
              speech intelligence.
            </p>
          </div>

          {/* Feature Highlights Pills in Soft Gold / Metallic Rim */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-[#FFF0C7] text-xs font-black text-[#812637] border-2 border-[#D4AF37] shadow-xs">
              <Languages className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Multilingual & Code-Mixed</span>
            </div>
            <div className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-[#FFF0C7] text-xs font-black text-[#812637] border-2 border-[#D4AF37] shadow-xs">
              <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Real-time Intent & Urgency</span>
            </div>
            <div className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-[#FFF0C7] text-xs font-black text-[#812637] border-2 border-[#D4AF37] shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Deterministic Order Lookup</span>
            </div>
            <div className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-[#FFF0C7] text-xs font-black text-[#812637] border-2 border-[#D4AF37] shadow-xs">
              <Headphones className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Gnani Timbre Voiceback</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Stage in Soft Gold Cards */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Top Split: Workspace & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Voice Recording Stage */}
          <div className="lg:col-span-5 w-full">
            <VoiceWorkspace
              onAudioReady={handleAudioReady}
              onDirectQuerySubmit={handleDirectQuery}
              isProcessing={isProcessing}
              statusMessage={statusMessage}
            />
          </div>

          {/* Right Column: Real Transcription & Resolution Results */}
          <div className="lg:col-span-7 w-full">
            <ResultsPanel
              sttResult={sttResult}
              intelligence={intelligence}
              isProcessing={isProcessing}
              onSelectOrderForHighlight={(orderId) => setHighlightedOrderId(orderId)}
            />
          </div>
        </div>

        {/* Bottom Section: Synthetic Orders Database */}
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
                60-Second Submission Demo Walkthrough
              </h3>
            </div>
            <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[#812637] text-[#FFF0C7] border-2 border-[#D4AF37] shadow-xs">
              Gnani.ai Challenge
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-5 text-xs">
            <div className="p-4 rounded-2xl bg-[#FFF8E7] border-2 border-[#D4AF37]/50 space-y-2 shadow-2xs">
              <span className="w-7 h-7 rounded-full bg-[#812637] text-[#FFF0C7] border-2 border-[#D4AF37] flex items-center justify-center font-black text-xs shadow-xs">
                1
              </span>
              <div className="font-black text-[#812637]">Speak in Native Tongue</div>
              <p className="text-slate-800 leading-relaxed font-semibold">
                Customer speaks in Telugu or Hindi about a delayed package (e.g., &quot;నా ఆర్డర్ ORD-7821 ఇంకా రాలేదు&quot;).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8E7] border-2 border-[#D4AF37]/50 space-y-2 shadow-2xs">
              <span className="w-7 h-7 rounded-full bg-[#812637] text-[#FFF0C7] border-2 border-[#D4AF37] flex items-center justify-center font-black text-xs shadow-xs">
                2
              </span>
              <div className="font-black text-[#812637]">Gnani Prisma v3 STT</div>
              <p className="text-slate-800 leading-relaxed font-semibold">
                Audio is sent as 16-bit PCM WAV to <code className="font-mono text-[#812637] font-black">POST /stt/v3</code> on Vachana for live transcription.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8E7] border-2 border-[#D4AF37]/50 space-y-2 shadow-2xs">
              <span className="w-7 h-7 rounded-full bg-[#812637] text-[#FFF0C7] border-2 border-[#D4AF37] flex items-center justify-center font-black text-xs shadow-xs">
                3
              </span>
              <div className="font-black text-[#812637]">Deterministic Resolution</div>
              <p className="text-slate-800 leading-relaxed font-semibold">
                Intent detected as <strong>Delivery Delay</strong>, Order ID <strong>ORD-7821</strong> matched, carrier dispatch escalation triggered.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8E7] border-2 border-[#D4AF37]/50 space-y-2 shadow-2xs">
              <span className="w-7 h-7 rounded-full bg-[#812637] text-[#FFF0C7] border-2 border-[#D4AF37] flex items-center justify-center font-black text-xs shadow-xs">
                4
              </span>
              <div className="font-black text-[#812637]">Spoken Response in Telugu</div>
              <p className="text-slate-800 leading-relaxed font-semibold">
                Customer receives an instant spoken voice update via Gnani Timbre TTS explaining the delay and committed ETA.
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
            <span className="font-bold text-[#812637]/80">Your language. Your voice. Your solution.</span>
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
