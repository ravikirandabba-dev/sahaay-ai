"use client";

import React from "react";

interface WaveformProps {
  isRecording: boolean;
  isProcessing: boolean;
}

export const Waveform: React.FC<WaveformProps> = ({ isRecording, isProcessing }) => {
  // Height sequence for natural voice wave appearance
  const heights = [10, 24, 16, 34, 20, 28, 14, 30, 18, 32, 22, 12];

  return (
    <div className="flex items-center justify-center space-x-1.5 h-12 px-5 py-2 rounded-2xl bg-[#FFF8E7] border-2 border-[#D4AF37]/50 shadow-inner">
      {heights.map((defaultHeight, idx) => {
        const animationClass = isRecording
          ? `animate-soundwave-${(idx % 5) + 1}`
          : isProcessing
          ? "animate-pulse"
          : "";

        return (
          <div
            key={idx}
            className={`w-1 rounded-full transition-all duration-300 ${
              isRecording
                ? "bg-gradient-to-t from-[#812637] via-[#D4AF37] to-[#FFF4D1] shadow-xs shadow-[#D4AF37]/60"
                : isProcessing
                ? "bg-[#D4AF37]"
                : "bg-[#D4AF37]/40"
            } ${animationClass}`}
            style={{
              height: isRecording ? `${defaultHeight}px` : "6px",
            }}
          />
        );
      })}
    </div>
  );
};
