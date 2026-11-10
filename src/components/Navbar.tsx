"use client";

import React, { useState } from "react";
import { Mic, ShieldCheck, RefreshCw, Sparkles } from "lucide-react";

interface HealthData {
  service: string;
  status: string;
  diagnostics?: {
    gnaniCredentialsConfigured: boolean;
    keyMasked: string;
    gnaniApiEndpointSTT: string;
    gnaniApiEndpointTTS: string;
    gnaniApiReachable: boolean;
    connectivityNote: string;
    sttModel: string;
    ttsModel: string;
    geminiConfigured?: boolean;
    geminiKeyMasked?: string;
    llmProvider?: string;
  };
}

interface NavbarProps {
  health: HealthData | null;
  onRefreshHealth: () => void;
  isLoadingHealth: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ health, onRefreshHealth, isLoadingHealth }) => {
  const [showModal, setShowModal] = useState(false);
  const isConfigured = Boolean(health?.diagnostics?.gnaniCredentialsConfigured);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FFF0C7]/95 backdrop-blur-md border-b-2 border-[#D4AF37]/60 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo & Title with 3D Gold Depth */}
          <div className="flex items-center space-x-3.5">
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#812637] opacity-70 blur-xs group-hover:opacity-100 transition duration-300" />
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#812637] to-[#5C1B27] flex items-center justify-center text-white border-2 border-[#D4AF37] shadow-md">
                <Mic className="w-5 h-5 text-[#FFF0C7]" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-[#812637]">
                  Sahaay <span className="text-[#812637] underline decoration-[#D4AF37] decoration-2">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#F3E7D3] text-[#812637] border border-[#D4AF37] shadow-xs">
                  <Sparkles className="w-3 h-3 mr-1 text-[#D4AF37]" />
                  Gnani Prisma v3
                </span>
              </div>
              <p className="text-xs text-[#812637]/80 font-bold hidden md:block">
                Your language. Your voice. Your solution.
              </p>
            </div>
          </div>

          {/* Navigation Actions & Status Badge */}
          <div className="flex items-center space-x-3">
            {/* API Health Pill */}
            <button
              onClick={() => setShowModal(true)}
              className={`flex items-center space-x-2 text-xs font-black px-3.5 py-1.5 rounded-full border-2 transition-all cursor-pointer shadow-xs ${
                isConfigured
                  ? "bg-[#FFF8E7] border-[#D4AF37] text-[#812637] hover:bg-[#F4E3B2]"
                  : "bg-[#FFF8E7] border-[#812637] text-[#812637] hover:bg-[#F3E7D3]"
              }`}
            >
              {isConfigured ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>Gnani API Active</span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  <span>API Key Required</span>
                </>
              )}
            </button>

            {/* Diagnostics Link */}
            <button
              onClick={() => setShowModal(true)}
              className="text-xs font-black text-[#812637] hover:text-[#FFF0C7] bg-[#FFF8E7] hover:bg-[#812637] border-2 border-[#D4AF37] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Diagnostics
            </button>
          </div>
        </div>
      </header>

      {/* Diagnostics Modal in Soft Gold (#FFF0C7) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2108]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FFF0C7] rounded-3xl max-w-lg w-full border-2 border-[#D4AF37] shadow-2xl p-6 sm:p-7 relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F4E3B2] flex items-center justify-center text-[#812637] border border-[#D4AF37]">
                  <ShieldCheck className="w-5 h-5 text-[#812637]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#812637]">System & API Diagnostics</h3>
                  <p className="text-xs text-[#812637]/75 font-semibold">Real-time connectivity to Gnani Vachana platform</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#812637] hover:text-[#691E2C] text-lg font-black p-1 rounded-lg hover:bg-[#F4E3B2] transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FFF8E7] border border-[#D4AF37] flex items-center justify-between shadow-2xs">
                <div>
                  <div className="font-black text-[#812637]">Gnani API Key Status</div>
                  <div className="text-slate-700 text-[11px] mt-0.5 font-medium">
                    {isConfigured ? (
                      <span className="text-emerald-800 font-bold">
                        Active & Verified ({health?.diagnostics?.keyMasked})
                      </span>
                    ) : (
                      <span className="text-amber-900 font-bold">
                        Missing in .env.local (`GNANI_API_KEY=`)
                      </span>
                    )}
                  </div>
                </div>
                {isConfigured ? (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-black text-[11px] border border-emerald-300">
                    Verified
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-black text-[11px] border border-amber-300">
                    Missing Key
                  </span>
                )}
              </div>

              {/* Google Gemini LLM Status */}
              <div className="p-3.5 rounded-2xl bg-[#FFF8E7] border border-[#D4AF37] flex items-center justify-between shadow-2xs">
                <div>
                  <div className="font-black text-[#812637]">Google Gemini LLM Intelligence</div>
                  <div className="text-slate-700 text-[11px] mt-0.5 font-medium">
                    {health?.diagnostics?.geminiConfigured ? (
                      <span className="text-emerald-800 font-bold">
                        Active ({health?.diagnostics?.geminiKeyMasked})
                      </span>
                    ) : (
                      <span className="text-slate-700 font-semibold">
                        Add <code className="font-mono font-bold text-[#812637]">GEMINI_API_KEY</code> in .env.local for unlimited questions
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#812637] font-semibold mt-0.5">
                    Provider: {health?.diagnostics?.llmProvider || "Verified Knowledge Engine"}
                  </div>
                </div>
                {health?.diagnostics?.geminiConfigured ? (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-black text-[11px] border border-emerald-300">
                    Active
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-[#F3E7D3] text-[#812637] font-bold text-[11px] border border-[#D4AF37]">
                    Optional
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-[#FFF8E7] border border-[#D4AF37]/50 shadow-2xs">
                  <div className="text-[10px] text-[#812637]/70 font-black uppercase tracking-wider">STT Model</div>
                  <div className="text-sm font-black text-[#812637] mt-1">Prisma v3.0</div>
                  <div className="text-[10px] text-slate-600 mt-0.5 font-mono">POST /stt/v3</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#FFF8E7] border border-[#D4AF37]/50 shadow-2xs">
                  <div className="text-[10px] text-[#812637]/70 font-black uppercase tracking-wider">TTS Model</div>
                  <div className="text-sm font-black text-[#812637] mt-1">Timbre v3.0</div>
                  <div className="text-[10px] text-slate-600 mt-0.5 font-mono">POST /api/v1/tts/inference</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#F3E7D3] border border-[#D4AF37]">
                <div className="font-bold text-[#812637]">Platform Connectivity</div>
                <div className="text-[11px] text-slate-700 mt-1 flex items-center justify-between font-medium">
                  <span>Target: https://api.vachana.ai</span>
                  <span className="font-black text-[#812637]">{health?.diagnostics?.connectivityNote || "Reachable"}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4E3B2] border border-[#D4AF37] text-[#812637] text-[11px] leading-relaxed">
                <strong className="font-black">Credential Security:</strong>
                <p className="mt-0.5 text-slate-800 font-medium">
                  The API key is securely loaded on the server from <code className="bg-[#FFF8E7] px-1.5 py-0.5 rounded border border-[#D4AF37] font-mono text-[#812637] font-bold">.env.local</code> and is never exposed to browser bundles.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D4AF37]/50 flex items-center justify-between">
              <button
                onClick={onRefreshHealth}
                disabled={isLoadingHealth}
                className="flex items-center space-x-1.5 text-xs text-[#812637] hover:underline font-black cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHealth ? "animate-spin" : ""}`} />
                <span>Recheck Diagnostics</span>
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="brand-btn-red text-xs font-black px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
