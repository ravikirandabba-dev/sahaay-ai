"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Sparkles,
  AlertCircle,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle,
  ArrowRight,
  Info,
} from "lucide-react";
import { IntelligenceAnalysis } from "@/lib/supportIntelligence";

interface SttResultData {
  success: boolean;
  transcript?: string;
  detected_language_code?: string;
  request_id?: string;
  model?: string;
  serverElapsedMs?: number;
  processing_time?: number;
  error?: string;
  details?: unknown;
  gnaniStatus?: number;
}

interface ResultsPanelProps {
  sttResult: SttResultData | null;
  intelligence: IntelligenceAnalysis | null;
  isProcessing: boolean;
  onSelectOrderForHighlight?: (orderId: string) => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  sttResult,
  intelligence,
  isProcessing,
  onSelectOrderForHighlight,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioSourceType, setAudioSourceType] = useState<"Gnani-Timbre" | "WebSpeech" | null>(null);
  const [ttsNotice, setTtsNotice] = useState<string | null>(null);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Stop playback when response changes
  useEffect(() => {
    stopSpeech();
    setTtsNotice(null);
    setAudioSourceType(null);
  }, [intelligence?.customerResponseText]);

  const speakCustomerResponse = async () => {
    if (!intelligence?.customerResponseText) return;

    // First: Attempt genuine Gnani Timbre TTS via /api/tts
    try {
      setTtsNotice("Synthesizing voice response with Gnani Timbre...");
      const ttsResponse = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: intelligence.customerResponseText,
          languageCode: intelligence.languageCode || "hi-IN",
          voice:
            intelligence.languageCode === "te-IN"
              ? "Kalpana"
              : intelligence.languageCode === "en-IN"
              ? "Avinash"
              : "Shivani",
        }),
      });

      const providerHeader = ttsResponse.headers.get("X-Audio-Provider");

      if (ttsResponse.ok && providerHeader === "Gnani-Timbre") {
        const audioBlob = await ttsResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioPlayerRef.current) {
          audioPlayerRef.current.src = audioUrl;
          audioPlayerRef.current.play();
          setIsPlayingAudio(true);
          setAudioSourceType("Gnani-Timbre");
          setTtsNotice("Spoken via Gnani Timbre TTS (timbre-v3.0)");
          return;
        }
      } else {
        const errJson = await ttsResponse.json().catch(() => null);
        console.warn("Gnani Timbre notice:", errJson);
        setTtsNotice("Gnani Timbre unavailable. Falling back to browser speech synthesis.");
      }
    } catch (e) {
      console.warn("Gnani Timbre error:", e);
      setTtsNotice("Falling back to browser speech synthesis.");
    }

    // Fallback: Browser Web Speech API
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(intelligence.customerResponseText);

      if (intelligence.languageCode === "te-IN") {
        utterance.lang = "te-IN";
      } else if (intelligence.languageCode === "hi-IN") {
        utterance.lang = "hi-IN";
      } else {
        utterance.lang = "en-IN";
      }

      utterance.onstart = () => {
        setIsPlayingAudio(true);
        setAudioSourceType("WebSpeech");
        setTtsNotice("Audio produced via Browser Web Speech API (Fallback)");
      };
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  if (isProcessing) {
    return (
      <div className="w-full gold-3d-card rounded-3xl p-8 flex flex-col items-center justify-center min-h-[360px] text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E7] border-2 border-[#D4AF37] flex items-center justify-center text-[#812637] mb-4 animate-bounce shadow-md">
          <Sparkles className="w-8 h-8 text-[#812637] animate-spin" />
        </div>
        <h3 className="text-lg font-black text-[#812637]">Analyzing Speech with Gnani AI...</h3>
        <p className="text-xs text-[#812637]/75 max-w-md mt-1 font-bold">
          Passing audio to Gnani Prisma STT v3 for multilingual transcription, extracting customer intent, and retrieving synthetic logistics status.
        </p>
      </div>
    );
  }

  if (!sttResult && !intelligence) {
    return (
      <div className="w-full gold-3d-card rounded-3xl p-8 flex flex-col items-center justify-center min-h-[360px] text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E7] border-2 border-[#D4AF37] flex items-center justify-center text-[#812637] mb-4 shadow-xs">
          <MessageSquare className="w-8 h-8 text-[#812637]" />
        </div>
        <h3 className="text-lg font-black text-[#812637]">No Voice Interaction Yet</h3>
        <p className="text-xs text-[#812637]/75 max-w-md mt-1 font-bold">
          Record your voice in Telugu, Hindi, or English on the left, or pick one of the quick test scenarios from the synthetic records table below to see Sahaay AI in action.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* 1. Gnani Prisma STT Transcription Card */}
      <div className="gold-3d-card rounded-3xl p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D4AF37]/40 gap-2">
          <div className="flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#FFF8E7] border border-[#D4AF37] flex items-center justify-center text-[#812637]">
              <MessageSquare className="w-4 h-4 text-[#812637]" />
            </span>
            <h3 className="text-base font-black text-[#812637]">Gnani Prisma Speech-to-Text</h3>
          </div>

          {/* Model and Latency Tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {sttResult?.model && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFF8E7] text-[#812637] border border-[#D4AF37] font-black text-[11px] shadow-2xs">
                {sttResult.model}
              </span>
            )}
            {sttResult?.detected_language_code && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#F3E7D3] text-[#812637] border border-[#D4AF37] font-bold text-[11px]">
                Language: {sttResult.detected_language_code}
              </span>
            )}
            {sttResult?.serverElapsedMs && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFF8E7] text-[#812637] border border-[#D4AF37]/50 text-[11px] font-bold">
                {sttResult.serverElapsedMs}ms latency
              </span>
            )}
          </div>
        </div>

        {/* Transcript Content or Gnani Error */}
        <div className="pt-4">
          {sttResult?.success ? (
            <div className="space-y-2">
              <div className="text-[11px] font-black text-[#812637] uppercase tracking-wider">
                Genuine Transcription Output
              </div>
              <p className="text-base sm:text-lg font-bold text-[#1E293B] bg-[#FFF8E7] p-4 rounded-2xl border-2 border-[#D4AF37]/60 leading-relaxed shadow-xs">
                &ldquo;{sttResult.transcript || "(No speech detected in audio)"}&rdquo;
              </p>
              {sttResult.request_id && (
                <div className="text-[10px] text-[#812637] font-mono font-bold">
                  Gnani Request ID: {sttResult.request_id}
                </div>
              )}
            </div>
          ) : sttResult ? (
            <div className="p-4 rounded-2xl bg-[#FFF2F2] border-2 border-[#812637] text-xs text-[#812637] space-y-2">
              <div className="flex items-center space-x-2 font-black">
                <AlertCircle className="w-4 h-4 text-[#812637]" />
                <span>Gnani STT API Notice (HTTP {sttResult.gnaniStatus || 401}):</span>
              </div>
              <p className="font-bold">{sttResult.error}</p>
              <div className="p-2.5 bg-[#FFF8E7] rounded-xl border border-[#D4AF37] font-mono text-[11px] text-[#812637] overflow-x-auto">
                {typeof sttResult.details === "object"
                  ? JSON.stringify(sttResult.details, null, 2)
                  : String(sttResult.details || "Verify credentials in .env.local.")}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* 2. Customer Support Intelligence & Resolution Card */}
      {intelligence && (
        <div className="gold-3d-card rounded-3xl p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D4AF37]/40 gap-2">
            <div>
              <span className="text-[11px] font-black text-[#812637] uppercase tracking-wider">
                Support Intelligence Analysis
              </span>
              <h3 className="text-base font-black text-[#812637]">
                Detected Intent & Actionable Resolution
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              {/* Urgency Badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-black border ${
                  intelligence.urgency === "HIGH"
                    ? "bg-[#812637] text-[#FFF0C7] border-[#D4AF37] shadow-xs"
                    : intelligence.urgency === "MEDIUM"
                    ? "bg-[#FFF8E7] text-[#B45309] border-2 border-[#D4AF37]"
                    : "bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]"
                }`}
              >
                Urgency: {intelligence.urgency}
              </span>

              {/* Language Pill */}
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#F3E7D3] text-[#812637] border-2 border-[#D4AF37]">
                {intelligence.detectedLanguage}
              </span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#FFF8E7] border-2 border-[#D4AF37]/50 shadow-2xs">
              <span className="text-[10px] uppercase font-black text-[#812637]/75 tracking-wider block">
                Customer Intent
              </span>
              <span className="text-sm font-black text-[#812637] block mt-1">
                {intelligence.intentLabel}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF8E7] border-2 border-[#D4AF37]/50 shadow-2xs">
              <span className="text-[10px] uppercase font-black text-[#812637]/75 tracking-wider block">
                Order Reference
              </span>
              <span className="text-sm font-black font-mono text-[#1E293B] block mt-1">
                {intelligence.extractedOrderId ? (
                  intelligence.isUnknownOrderId ? (
                    <span className="text-[#812637] font-sans text-xs font-bold">
                      {intelligence.extractedOrderId} (Not in Demo DB)
                    </span>
                  ) : (
                    <span className="text-[#812637]">{intelligence.extractedOrderId}</span>
                  )
                ) : intelligence.needsOrderId ? (
                  <span className="text-[#812637] font-sans text-xs font-bold">ID Required</span>
                ) : (
                  <span className="text-slate-600 font-sans text-xs font-semibold">Not Required</span>
                )}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF8E7] border-2 border-[#D4AF37]/50 shadow-2xs">
              <span className="text-[10px] uppercase font-black text-[#812637]/75 tracking-wider block">
                Synthetic Record Match
              </span>
              <span className="text-sm font-black text-[#1E293B] block mt-1">
                {intelligence.demoOrderRecord ? (
                  <span className="text-emerald-800 font-bold">
                    Verified: {intelligence.demoOrderRecord.status}
                  </span>
                ) : intelligence.isUnknownOrderId ? (
                  <span className="text-[#812637] font-bold text-xs">No matching demo record</span>
                ) : (
                  <span className="text-slate-600 font-normal text-xs">General Logistics</span>
                )}
              </span>
            </div>
          </div>

          {/* Matched Demo Order Details Banner */}
          {intelligence.demoOrderRecord && (
            <div className="p-4 rounded-2xl bg-[#F3E7D3] border-2 border-[#D4AF37] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
              <div>
                <span className="font-black text-[#812637]">
                  Matched Synthetic Record: {intelligence.demoOrderRecord.orderId}
                </span>
                <p className="text-[#1E293B] mt-0.5 font-medium">
                  Customer: <strong>{intelligence.demoOrderRecord.customerName}</strong> | Carrier:{" "}
                  <strong>{intelligence.demoOrderRecord.carrier}</strong> | Location:{" "}
                  <strong>{intelligence.demoOrderRecord.currentLocation}</strong>
                </p>
              </div>
              {onSelectOrderForHighlight && (
                <button
                  onClick={() => onSelectOrderForHighlight(intelligence.demoOrderRecord!.orderId)}
                  className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-xl bg-[#FFF8E7] border-2 border-[#D4AF37] text-[#812637] hover:bg-[#F4E3B2] font-black text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  <span>View in Database</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Suggested Next Action */}
          <div className="space-y-2">
            <span className="text-[11px] font-black text-[#812637] uppercase tracking-wider block">
              Automated Next Action
            </span>
            <div className="p-4 rounded-2xl bg-[#FFF8E7] border-2 border-[#812637]/50 shadow-xs">
              <p className="text-sm font-bold text-[#812637]">
                {intelligence.suggestedAction}
              </p>
              {intelligence.recommendedWorkflow.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#D4AF37]/40 space-y-1.5">
                  <span className="text-[10px] uppercase font-black text-[#812637]/70 tracking-wider block">
                    Execution Workflow
                  </span>
                  {intelligence.recommendedWorkflow.map((step, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-[#1E293B]">
                      <CheckCircle className="w-3.5 h-3.5 text-[#812637] shrink-0" />
                      <span className="font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Customer Voice Response & Audio Player */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-[#812637] uppercase tracking-wider">
                Multilingual Spoken Response ({intelligence.responseLanguage})
              </span>
              {audioSourceType && (
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#FFF8E7] text-[#812637] border border-[#D4AF37]">
                  Source: {audioSourceType === "Gnani-Timbre" ? "Gnani Timbre v3 (Official API)" : "Browser Web Speech (Fallback)"}
                </span>
              )}
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF8E7] border-2 border-[#D4AF37]/50 space-y-3 shadow-xs">
              <p className="text-sm sm:text-base font-bold text-[#1E293B] leading-relaxed">
                &ldquo;{intelligence.customerResponseText}&rdquo;
              </p>

              {/* Audio Controls */}
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#D4AF37]/40 gap-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={isPlayingAudio ? stopSpeech : speakCustomerResponse}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl brand-btn-red text-xs font-black cursor-pointer shadow-xs"
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-4 h-4 text-[#FFF0C7]" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-[#FFF0C7]" />
                        <span>Speak Response</span>
                      </>
                    )}
                  </button>

                  {isPlayingAudio && (
                    <button
                      onClick={speakCustomerResponse}
                      className="p-2.5 rounded-xl bg-[#FFF8E7] hover:bg-[#F4E3B2] border-2 border-[#D4AF37] text-[#812637] text-xs font-bold cursor-pointer shadow-xs"
                      title="Replay"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {ttsNotice && (
                  <span className="text-[11px] text-[#812637] flex items-center space-x-1 font-bold">
                    <Info className="w-3.5 h-3.5 text-[#812637]" />
                    <span>{ttsNotice}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Audio element for Gnani Timbre binary playback */}
            <audio
              ref={audioPlayerRef}
              onEnded={() => setIsPlayingAudio(false)}
              onError={() => setIsPlayingAudio(false)}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};
