"use client";

import React from "react";
import { Headphones, Sparkles, Landmark, CheckCircle2, ArrowRight } from "lucide-react";
import { AssistanceMode } from "@/lib/unifiedIntelligence";

interface ModeSelectorProps {
  currentMode: AssistanceMode;
  onSelectMode: (mode: AssistanceMode) => void;
  onQuickQuerySelect?: (query: string, mode: AssistanceMode) => void;
}

interface ModeCardConfig {
  id: AssistanceMode;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  sampleQueries: { label: string; text: string }[];
  accentColor: string;
}

const MODES: ModeCardConfig[] = [
  {
    id: "support",
    number: "01",
    title: "Customer Support",
    subtitle: "Logistics & Order Resolution",
    description:
      "Instant resolution for delayed parcels, live courier tracking, refund verification & order cancellations.",
    icon: Headphones,
    badge: "Prisma + Timbre + Demo DB",
    sampleQueries: [
      { label: "Telugu Delivery", text: "నా ఆర్డర్ ORD-7821 ఇంకా రాలేదు, డెలివరీ చాలా ఆలస్యం అయింది" },
      { label: "English Status", text: "My order ORD-7821 is delayed, where is my package?" },
      { label: "Hindi Refund", text: "मेरा रिफंड कब मिलेगा ORD-5532 के लिए?" },
    ],
    accentColor: "#812637",
  },
  {
    id: "assistant",
    number: "02",
    title: "Personal AI Assistant",
    subtitle: "Concepts, Study & Career",
    description:
      "Multilingual personal AI answering core concepts in Artificial Intelligence, Machine Learning, study strategies, and interviews.",
    icon: Sparkles,
    badge: "Prisma + Timbre + Verified Knowledge",
    sampleQueries: [
      { label: "Telugu AI", text: "కృత్రిమ మేధస్సు (AI) అంటే ఏమిటి, సులభంగా వివరించండి" },
      { label: "English Study", text: "Give me three scientific study tips for exam preparation" },
      { label: "Hindi ML", text: "मशीन लर्निंग और आर्टिफिशियल इंटेलिजेंस में क्या अंतर है?" },
    ],
    accentColor: "#D4AF37",
  },
  {
    id: "services",
    number: "03",
    title: "Public Services Guidance",
    subtitle: "Indian Citizen Procedures",
    description:
      "Verified step-by-step guidance for official Indian government services: Birth Certificates, Aadhaar updates, and NSP Scholarships.",
    icon: Landmark,
    badge: "Prisma + Timbre + Official .gov.in",
    sampleQueries: [
      { label: "English Birth Cert", text: "How can I apply for a birth certificate in India?" },
      { label: "Telugu Aadhaar", text: "ఆధార్ కార్డులో చిరునామా మరియు మొబైల్ నంబర్ ఎలా మార్చుకోవాలి?" },
      { label: "Hindi Scholarship", text: "राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) पर स्कॉलरशिप के नियम क्या हैं?" },
    ],
    accentColor: "#812637",
  },
];

export default function ModeSelector({
  currentMode,
  onSelectMode,
  onQuickQuerySelect,
}: ModeSelectorProps) {
  return (
    <section className="w-full mb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-2">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-[#812637]">
            One Voice, Three Solutions
          </span>
          <h2 className="text-2xl font-extrabold text-[#812637] tracking-tight">
            Select Your AI Assistance Mode
          </h2>
        </div>
        <p className="text-xs text-[#812637]/75 max-w-md">
          Switch modes instantly or speak naturally — each mode harnesses Gnani Prisma STT and Timbre TTS in English, Telugu, and Hindi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MODES.map((mode) => {
          const isActive = currentMode === mode.id;
          const Icon = mode.icon;

          return (
            <div
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-300 transform select-none ${
                isActive
                  ? "bg-[#FFF0C7] border-2 border-[#D4AF37] shadow-[0_14px_32px_-6px_rgba(212,175,55,0.35)] -translate-y-1.5 ring-2 ring-[#812637]/15"
                  : "bg-[#FFF8E7]/90 border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#FFF0C7]/80 hover:-translate-y-0.5 shadow-sm"
              }`}
            >
              {/* Active Glow Bar */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#812637] to-[#D4AF37] rounded-t-2xl" />
              )}

              {/* Header with Mode Number, Icon, and Active Indicator */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-[#812637] text-[#FFF0C7] shadow-md shadow-[#812637]/30"
                        : "bg-[#F3E7D3] text-[#812637]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-[#812637]/60 block uppercase">
                      Mode {mode.number}
                    </span>
                    <h3 className="text-base font-bold text-[#812637] leading-tight">
                      {mode.title}
                    </h3>
                  </div>
                </div>

                {isActive ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#812637] text-[#FFF0C7] shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Active
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-[#812637]/60 px-2 py-0.5 rounded-full bg-[#F3E7D3]/60 hover:text-[#812637]">
                    Select
                  </span>
                )}
              </div>

              {/* Subtitle */}
              <div className="text-xs font-semibold text-[#812637]/90 mb-1.5">
                {mode.subtitle}
              </div>

              {/* Description */}
              <p className="text-xs text-[#812637]/80 line-clamp-2 mb-3 leading-relaxed">
                {mode.description}
              </p>

              {/* Provider Badge */}
              <div className="mb-3.5">
                <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F3E7D3] border border-[#D4AF37]/30 text-[#812637]">
                  {mode.badge}
                </span>
              </div>

              {/* Quick Scenario Chips */}
              <div className="pt-2.5 border-t border-[#D4AF37]/20">
                <div className="text-[10px] uppercase font-bold text-[#812637]/70 mb-1.5">
                  Sample Queries:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {mode.sampleQueries.map((sq, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMode(mode.id);
                        if (onQuickQuerySelect) {
                          onQuickQuerySelect(sq.text, mode.id);
                        }
                      }}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-[#FFF8E7] hover:bg-[#812637] hover:text-[#FFF0C7] border border-[#D4AF37]/40 text-[#812637] transition-all flex items-center gap-1"
                    >
                      <span>{sq.label}</span>
                      <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
