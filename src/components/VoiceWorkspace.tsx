"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, Square, Upload, AlertTriangle, Sparkles, Volume2 } from "lucide-react";
import { WavRecorder } from "@/lib/audioRecorder";
import { Waveform } from "./Waveform";

import { AssistanceMode } from "@/lib/unifiedIntelligence";

interface VoiceWorkspaceProps {
  onAudioReady: (audioBlob: Blob, languageCode: string, fileName?: string) => void;
  onDirectQuerySubmit: (text: string, languageCode: string) => void;
  isProcessing: boolean;
  statusMessage: string;
  activeMode?: AssistanceMode;
}

export const VoiceWorkspace: React.FC<VoiceWorkspaceProps> = ({
  onAudioReady,
  onDirectQuerySubmit,
  isProcessing,
  statusMessage,
  activeMode = "support",
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("indic-auto");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordTimer, setRecordTimer] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [manualText, setManualText] = useState<string>("");

  const recorderRef = useRef<WavRecorder | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize recorder
  useEffect(() => {
    recorderRef.current = new WavRecorder();
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startRecording = async () => {
    setMicError(null);
    setAudioUrl(null);
    try {
      if (!recorderRef.current) {
        recorderRef.current = new WavRecorder();
      }
      await recorderRef.current.start();
      setIsRecording(true);
      setRecordTimer(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordTimer((prev) => {
          if (prev >= 30) {
            // Gnani REST max is 30 seconds
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Mic access error:", error);
      setMicError(
        error.name === "NotAllowedError"
          ? "Microphone access was denied. Please allow microphone permissions in your browser or upload an audio file."
          : `Microphone error: ${error.message}`
      );
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current || !isRecording) return;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    try {
      setIsRecording(false);
      const { blob } = await recorderRef.current.stop();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // Dispatch to parent for Gnani Prisma STT transcription
      onAudioReady(blob, selectedLanguage, "recording.wav");
    } catch (err: unknown) {
      const error = err as Error;
      setMicError(`Failed to process recording: ${error.message}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMicError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setMicError("Uploaded file exceeds 15MB limit. Gnani REST STT supports recordings up to 30 seconds.");
      return;
    }

    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    onAudioReady(file, selectedLanguage, file.name);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    onDirectQuerySubmit(manualText.trim(), selectedLanguage);
  };

  return (
    <div className="w-full gold-3d-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative Metallic Gold Glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-[#D4AF37]/25 to-transparent rounded-bl-full pointer-events-none" />

      {/* Top Bar: Language Selector & Instructions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D4AF37]/40 gap-4 relative z-10">
        <div>
          <span className="text-[11px] font-black text-[#812637] uppercase tracking-wider">
            Voice Intelligence Workspace
          </span>
          <h2 className="text-xl font-black text-[#812637] mt-0.5">
            Speak Naturally in Telugu, Hindi, or English
          </h2>
          <p className="text-xs text-[#812637]/75 mt-1 font-bold">
            Record and transcribe using Gnani Prisma v3 REST Speech-to-Text.
          </p>
        </div>

        {/* 3D Language Selection Pills in Soft Gold / Sand */}
        <div className="flex items-center space-x-1.5 p-1.5 rounded-2xl bg-[#F3E7D3] border-2 border-[#D4AF37] self-start sm:self-auto shadow-2xs">
          {[
            { id: "indic-auto", label: "Auto Detect" },
            { id: "te-IN", label: "తెలుగు" },
            { id: "hi-IN", label: "हिन्दी" },
            { id: "en-IN", label: "English" },
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              disabled={isProcessing || isRecording}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedLanguage === lang.id
                  ? "bg-[#812637] text-[#FFF0C7] border border-[#D4AF37] shadow-xs scale-102"
                  : "text-[#812637] hover:bg-[#F4E3B2]"
              } disabled:opacity-50`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Mic Stage */}
      <div className="py-8 flex flex-col items-center justify-center text-center relative z-10">
        {/* Active Assistance Mode Indicator */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#812637] text-[#FFF0C7] text-xs font-extrabold border border-[#D4AF37] mb-5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
          <span>Active Mode:</span>
          <span className="text-[#F4E3B2] underline decoration-[#D4AF37]">
            {activeMode === "assistant"
              ? "Personal AI Assistant"
              : activeMode === "services"
              ? "Public Services Guidance"
              : "Customer Support (Logistics)"}
          </span>
        </div>

        {/* Large 3D Microphone Button with Golden Rim & Floating Levitation */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Animated 3D Ripple Ring */}
          <div
            className={`absolute inset-0 rounded-full ${
              isRecording ? "mic-gold-pulse scale-150" : ""
            }`}
          />

          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            aria-label={isRecording ? "Stop voice recording" : "Start voice recording"}
            className={`relative z-10 w-26 h-26 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
              isRecording
                ? "bg-gradient-to-tr from-[#691E2C] to-[#812637] text-white ring-4 ring-[#D4AF37]"
                : isProcessing
                ? "bg-[#F4E3B2] text-[#812637] cursor-not-allowed opacity-80"
                : "animate-mic-levitate hover:scale-106 hover:shadow-2xl"
            }`}
            style={{
              background: isRecording
                ? "radial-gradient(circle at 35% 30%, #812637 0%, #4E121E 100%)"
                : "radial-gradient(circle at 32% 28%, #A8374E 0%, #812637 60%, #4F1320 100%)",
              boxShadow:
                "0 18px 36px -6px rgba(129, 38, 55, 0.45), 0 0 0 4px #D4AF37, inset 0 3px 6px rgba(255, 255, 255, 0.35)",
            }}
          >
            {isRecording ? (
              <>
                <Square className="w-8 h-8 fill-current text-[#FFF0C7]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FFF0C7] mt-1">
                  Stop
                </span>
              </>
            ) : (
              <>
                <Mic className="w-9 h-9 text-[#FFF0C7]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FFF0C7] mt-1">
                  Speak
                </span>
              </>
            )}
          </button>
        </div>

        {/* Live Status and Timer */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-center space-x-2">
            {isRecording ? (
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black bg-[#812637] text-[#FFF0C7] border-2 border-[#D4AF37] shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping mr-2" />
                Recording: {formatTimer(recordTimer)} (Max 30s)
              </span>
            ) : isProcessing ? (
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black bg-[#FFF8E7] text-[#812637] border-2 border-[#D4AF37]">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37] animate-spin" />
                {statusMessage || "Processing with Gnani AI..."}
              </span>
            ) : (
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black bg-[#F3E7D3] text-[#812637] border border-[#D4AF37]">
                Click 3D microphone to speak or upload audio
              </span>
            )}
          </div>

          {/* Audio-Reactive Waveform */}
          <div className="flex justify-center pt-1">
            <Waveform isRecording={isRecording} isProcessing={isProcessing} />
          </div>
        </div>

        {/* Audio Playback Preview if recorded */}
        {audioUrl && !isRecording && (
          <div className="w-full max-w-md p-3.5 mb-6 rounded-2xl bg-[#FFF8E7] border-2 border-[#D4AF37] flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-black text-[#812637]">
              <Volume2 className="w-4 h-4 text-[#D4AF37]" />
              <span>16-bit PCM WAV Ready</span>
            </div>
            <audio src={audioUrl} controls className="h-8 max-w-[200px]" />
          </div>
        )}

        {/* Error Notification */}
        {micError && (
          <div className="w-full max-w-lg mb-6 p-3.5 rounded-2xl bg-[#FFF2F2] border-2 border-[#812637] flex items-start space-x-2.5 text-left text-xs text-[#812637]">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#812637]" />
            <div>
              <span className="font-black">Microphone Notice: </span>
              {micError}
            </div>
          </div>
        )}

        {/* Alternative Actions: File Upload & Text Simulator */}
        <div className="w-full max-w-xl border-t border-[#D4AF37]/40 pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/wav,audio/mp3,audio/mpeg,audio/ogg,audio/flac,audio/aac,audio/m4a,.wav,.mp3,.ogg,.flac,.aac,.m4a"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing || isRecording}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#F3E7D3] hover:bg-[#F4E3B2] text-[#812637] border-2 border-[#D4AF37] text-xs font-black transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Upload className="w-4 h-4 text-[#D4AF37]" />
            <span>Upload Audio File (WAV/MP3/M4A)</span>
          </button>
        </div>

        {/* Quick Text Input for verification */}
        <form
          onSubmit={handleManualSubmit}
          className="w-full max-w-xl mt-4 flex items-center gap-2"
        >
          <input
            type="text"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            disabled={isProcessing}
            placeholder={
              activeMode === "assistant"
                ? "Ask concept in Telugu/Hindi/English (e.g. కృత్రిమ మేధస్సు గురించి చెప్పండి / What is ML?)..."
                : activeMode === "services"
                ? "Ask service in Telugu/Hindi/English (e.g. How to apply for birth certificate / ఆధార్ అప్‌డేట్)..."
                : "Type query in Telugu, Hindi, or English (e.g. నా ఆర్డర్ ORD-7821 రాలేదు / My package is delayed)..."
            }
            className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-[#FFF8E7] border-2 border-[#D4AF37]/70 text-[#1E293B] placeholder-[#812637]/50 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#812637] focus:border-[#812637]"
          />
          <button
            type="submit"
            disabled={!manualText.trim() || isProcessing}
            className="px-5 py-2.5 rounded-xl brand-btn-red text-xs font-black disabled:opacity-50 cursor-pointer shadow-xs"
          >
            Analyze
          </button>
        </form>
      </div>
    </div>
  );
};
