"use client";

import React from "react";

export default function GoldenInfinity3D() {
  return (
    <div
      className="relative w-full flex items-center justify-center my-3 select-none"
      title="Sahaay AI Golden Infinity Loop"
    >
      {/* Soft Ambient Golden Radial Glow */}
      <div className="absolute w-[280px] sm:w-[340px] h-[130px] sm:h-[150px] rounded-full bg-gradient-to-r from-[#D4AF37]/15 via-[#F4E3B2]/30 to-[#D4AF37]/15 blur-2xl pointer-events-none transform -translate-y-1" />

      {/* 3D Tilting & Floating Container */}
      <div className="relative z-10 w-[190px] sm:w-[290px] aspect-[300/160] transition-transform duration-700 ease-out hover:scale-105 animate-infinity-float">
        <svg
          viewBox="0 0 300 160"
          className="w-full h-full filter drop-shadow-[0_12px_24px_rgba(163,126,28,0.28)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Primary Metallic Gold Gradient */}
            <linearGradient id="infGoldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9E8" />
              <stop offset="18%" stopColor="#F4E3B2" />
              <stop offset="38%" stopColor="#D4AF37" />
              <stop offset="65%" stopColor="#A8811C" />
              <stop offset="85%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#FFF5D6" />
            </linearGradient>

            {/* Top Specular Reflection Gradient (Round Tube 3D Bevel) */}
            <linearGradient id="infSpecular" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="25%" stopColor="#FFF4D0" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="75%" stopColor="#FFF4D0" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
            </linearGradient>

            {/* Dark Metallic Underside Shadow Gradient */}
            <linearGradient id="infUnderShadow" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#6C4E0A" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#AA7C11" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>

            {/* Soft Ambient Shadow Filter for Overlapping Strand */}
            <filter id="strandShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="3.5"
                floodColor="#5A3E08"
                floodOpacity="0.55"
              />
            </filter>
          </defs>

          {/* 1. Base Deep Tube Shadow (Adds true rounded thickness underneath) */}
          <path
            d="M 150 80
               C 175 42, 230 42, 255 65
               C 280 88, 280 112, 255 135
               C 230 158, 175 118, 150 80
               C 125 42, 70 42, 45 65
               C 20 88, 20 112, 45 135
               C 70 158, 125 118, 150 80 Z"
            fill="none"
            stroke="#87620F"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
            transform="translate(0, 3)"
          />

          {/* 2. Full Infinity Loop Body (Smooth Metallic Gold Tube) */}
          <path
            d="M 150 80
               C 175 42, 230 42, 255 65
               C 280 88, 280 112, 255 135
               C 230 158, 175 118, 150 80
               C 125 42, 70 42, 45 65
               C 20 88, 20 112, 45 135
               C 70 158, 125 118, 150 80 Z"
            fill="none"
            stroke="url(#infGoldMetallic)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 3. Subtle Underside Shading (Creates cylindrical 3D depth) */}
          <path
            d="M 150 80
               C 175 42, 230 42, 255 65
               C 280 88, 280 112, 255 135
               C 230 158, 175 118, 150 80
               C 125 42, 70 42, 45 65
               C 20 88, 20 112, 45 135
               C 70 158, 125 118, 150 80 Z"
            fill="none"
            stroke="url(#infUnderShadow)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          />

          {/* 4. Overlapping Top Strand at the Center Crossing (3D Weave effect) */}
          <path
            d="M 125 118 C 137 99, 145 88, 150 80 C 158 68, 168 53, 175 42"
            fill="none"
            stroke="url(#infGoldMetallic)"
            strokeWidth="18"
            strokeLinecap="round"
            filter="url(#strandShadow)"
          />

          {/* 5. Highlight Specular Line along the Overlapping Strand */}
          <path
            d="M 127 116 C 138 98, 146 87, 150 80 C 157 69, 166 54, 173 44"
            fill="none"
            stroke="url(#infSpecular)"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* 6. Specular Highlight Rib along the Right Loop */}
          <path
            d="M 178 44 C 228 44, 252 66, 274 88"
            fill="none"
            stroke="url(#infSpecular)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* 7. Specular Highlight Rib along the Left Loop */}
          <path
            d="M 122 44 C 72 44, 48 66, 26 88"
            fill="none"
            stroke="url(#infSpecular)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
      </div>
    </div>
  );
}
