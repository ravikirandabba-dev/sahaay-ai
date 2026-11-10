"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Cpu, Layers } from "lucide-react";

export const GoldenOrb3D: React.FC = () => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20; // -10px to +10px
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMouseOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto flex items-center justify-center pointer-events-none select-none"
      style={{
        perspective: "1000px",
        transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
        transition: "transform 0.25s ease-out",
      }}
    >
      {/* Outer Golden Aura Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/35 via-[#F4E3B2]/50 to-transparent blur-2xl transform scale-110" />

      {/* Rotating Metallic Outer Ring X (3D tilted) */}
      <div
        className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border-2 border-dashed border-[#D4AF37] animate-ring-x opacity-70"
        style={{
          boxShadow: "0 0 20px rgba(212, 175, 55, 0.4), inset 0 0 15px rgba(212, 175, 55, 0.2)",
        }}
      />

      {/* Rotating Metallic Ring Y (Counter-rotating perpendicular) */}
      <div
        className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full border border-[#D4AF37] animate-ring-y opacity-80"
        style={{
          boxShadow: "0 0 15px rgba(212, 175, 55, 0.35)",
        }}
      />

      {/* Floating 3D Golden Orb Sphere Core */}
      <div
        className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full animate-orb-float flex items-center justify-center"
        style={{
          background: "radial-gradient(circle at 32% 30%, #FFFDF5 0%, #F5E5B8 30%, #D4AF37 68%, #8C6710 100%)",
          boxShadow:
            "0 15px 35px -5px rgba(140, 103, 16, 0.45), inset -8px -8px 20px rgba(110, 83, 22, 0.6), inset 8px 8px 18px rgba(255, 255, 255, 0.8)",
        }}
      >
        {/* Core Shimmer Specular Light */}
        <div className="absolute top-4 left-5 w-8 h-5 rounded-full bg-white/70 blur-xs transform -rotate-25" />

        {/* Central Emblazoned AI Node */}
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/60 flex items-center justify-center text-[#812637] shadow-inner">
          <Sparkles className="w-7 h-7 text-[#812637] animate-pulse" />
        </div>

        {/* Floating Mini Gyro Satellite Pills */}
        <div className="absolute -top-3 -right-2 px-2.5 py-0.5 rounded-full bg-[#812637] text-[#F4E3B2] text-[10px] font-bold border border-[#D4AF37] shadow-md">
          Prisma v3
        </div>

        <div className="absolute -bottom-2 -left-3 px-2 py-0.5 rounded-full bg-[#FFF0C7] text-[#812637] text-[10px] font-black border border-[#D4AF37] shadow-md flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
          <span>Multilingual</span>
        </div>
      </div>
    </div>
  );
};
