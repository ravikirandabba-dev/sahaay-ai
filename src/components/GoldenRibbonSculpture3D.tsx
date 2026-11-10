"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Eye, ShieldCheck } from "lucide-react";

export default function GoldenRibbonSculpture3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dynamically create a FRESH canvas element for Three.js
    // This guarantees Three.js has 100% exclusive ownership of the canvas context
    // and eliminates "Canvas has an existing context of a different type" error in React Strict Mode.
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.touchAction = "none";
    canvas.className = "relative z-10 w-full h-full cursor-grab active:cursor-grabbing select-none";

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number = 0;
    let resizeObserver: ResizeObserver | null = null;

    let primaryGeometry: THREE.TorusKnotGeometry | null = null;
    let secondaryGeometry: THREE.TorusKnotGeometry | null = null;
    let ringGeometry: THREE.TorusGeometry | null = null;
    let ribbonMaterial: THREE.MeshStandardMaterial | null = null;
    let accentMaterial: THREE.MeshStandardMaterial | null = null;
    let haloMaterial: THREE.MeshStandardMaterial | null = null;

    try {
      // Safe Three.js WebGLRenderer instantiation
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch (err) {
      console.warn("Three.js WebGLRenderer initialization caught error, switching to SVG 3D ribbon:", err);
      setHasWebGL(false);
      return;
    }

    // Append canvas to container only after renderer confirms WebGL context creation
    container.appendChild(canvas);

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.z = 8.5;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // LIGHTING SYSTEM
    // Warm Champagne Ambient
    const ambientLight = new THREE.AmbientLight(0xfff3d1, 1.5);
    scene.add(ambientLight);

    // Key Specular Directional Light (Bright White & Gold)
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    // Warm Metallic Gold Fill Light
    const fillLight = new THREE.DirectionalLight(0xf5d77f, 2.2);
    fillLight.position.set(-6, -4, 4);
    scene.add(fillLight);

    // Deep Metallic Rim Light
    const rimLight = new THREE.PointLight(0xd4af37, 4.5, 30);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // Subtle Crimson Accent Reflection Light
    const crimsonLight = new THREE.PointLight(0x812637, 1.8, 20);
    crimsonLight.position.set(4, -5, 3);
    scene.add(crimsonLight);

    // GOLDEN MATERIALS
    ribbonMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xd4af37),
      roughness: 0.16,
      metalness: 0.94,
    });

    accentMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xf4e3b2),
      roughness: 0.22,
      metalness: 0.88,
    });

    haloMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xe6c265),
      roughness: 0.14,
      metalness: 0.96,
    });

    // SCULPTURE GROUP
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    // 1. Primary Intertwined Golden Ribbon (Torus Knot: p=2, q=3)
    primaryGeometry = new THREE.TorusKnotGeometry(2.1, 0.54, 220, 36, 2, 3);
    const primaryMesh = new THREE.Mesh(primaryGeometry, ribbonMaterial);
    sculptureGroup.add(primaryMesh);

    // 2. Interlocking Secondary Fluid Ribbon (Torus Knot: p=3, q=4)
    secondaryGeometry = new THREE.TorusKnotGeometry(2.55, 0.14, 180, 24, 3, 4);
    const secondaryMesh = new THREE.Mesh(secondaryGeometry, accentMaterial);
    sculptureGroup.add(secondaryMesh);

    // 3. Floating Orbital Beveled Ring
    ringGeometry = new THREE.TorusGeometry(3.2, 0.05, 16, 120);
    const ringMesh = new THREE.Mesh(ringGeometry, haloMaterial);
    ringMesh.rotation.x = Math.PI / 3.2;
    ringMesh.rotation.y = Math.PI / 5;
    sculptureGroup.add(ringMesh);

    // MOUSE PARALLAX TRACKING
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.6;
      targetY = y * 0.4;
      setIsInteracting(true);
      setMouseOffset({ x: targetX * 15, y: -targetY * 15 });
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
      setIsInteracting(false);
      setMouseOffset({ x: 0, y: 0 });
    };

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("mouseleave", handlePointerLeave);

    // ANIMATION LOOP
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        primaryMesh.rotation.y += 0.007;
        primaryMesh.rotation.x += 0.0035;
        primaryMesh.rotation.z += 0.002;

        secondaryMesh.rotation.y -= 0.009;
        secondaryMesh.rotation.x -= 0.005;

        ringMesh.rotation.z += 0.004;

        sculptureGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.14;

        keyLight.position.x = 6 + Math.cos(elapsedTime * 0.8) * 2;
        keyLight.position.y = 8 + Math.sin(elapsedTime * 0.8) * 1.5;
      }

      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      sculptureGroup.rotation.y += (mouseX - sculptureGroup.rotation.y * 0.2) * 0.05;
      sculptureGroup.rotation.x += (-mouseY - sculptureGroup.rotation.x * 0.2) * 0.05;

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    // RESIZE OBSERVER
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0 && renderer) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // CLEANUP FUNCTION (React Strict Mode Safe)
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (resizeObserver) resizeObserver.disconnect();

      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("mouseleave", handlePointerLeave);

      if (primaryGeometry) primaryGeometry.dispose();
      if (secondaryGeometry) secondaryGeometry.dispose();
      if (ringGeometry) ringGeometry.dispose();
      if (ribbonMaterial) ribbonMaterial.dispose();
      if (accentMaterial) accentMaterial.dispose();
      if (haloMaterial) haloMaterial.dispose();

      if (renderer) {
        renderer.dispose();
        try {
          renderer.forceContextLoss();
        } catch {
          // Ignore context loss errors during unmount
        }
      }

      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] aspect-square mx-auto flex items-center justify-center select-none"
      title="Sahaay AI 3D Metallic Golden Ribbon Sculpture"
    >
      {/* Radiant Golden Ambient Glow Backdrop */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/25 via-[#F4E3B2]/30 to-[#812637]/10 blur-3xl pointer-events-none transform scale-95" />

      {/* Volumetric Metallic Concentric Halo */}
      <div className="absolute w-[82%] h-[82%] rounded-full border border-[#D4AF37]/35 shadow-[0_0_50px_rgba(212,175,55,0.22)] pointer-events-none animate-pulse" />
      <div className="absolute w-[66%] h-[66%] rounded-full border border-[#D4AF37]/20 pointer-events-none" />

      {/* Elegant SVG 3D Golden Ribbon Fallback (active if WebGL is unavailable or unmounted) */}
      {!hasWebGL && (
        <div
          className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-200"
          style={{
            transform: `perspective(600px) rotateY(${mouseOffset.x}deg) rotateX(${mouseOffset.y}deg)`,
          }}
        >
          <svg
            viewBox="0 0 320 320"
            className="w-[85%] h-[85%] animate-spin-slow drop-shadow-[0_20px_35px_rgba(212,175,55,0.4)]"
            style={{ animationDuration: "24s" }}
          >
            <defs>
              <linearGradient id="goldRibbonGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9E6" />
                <stop offset="25%" stopColor="#D4AF37" />
                <stop offset="50%" stopColor="#F4E3B2" />
                <stop offset="75%" stopColor="#AA7C11" />
                <stop offset="100%" stopColor="#D4AF37" />
              </linearGradient>

              <linearGradient id="goldRibbonGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="40%" stopColor="#812637" />
                <stop offset="70%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#FFF5D6" />
              </linearGradient>

              <linearGradient id="haloGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#F4E3B2" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.8" />
              </linearGradient>

              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Orbiting Ring */}
            <ellipse
              cx="160"
              cy="160"
              rx="135"
              ry="55"
              fill="none"
              stroke="url(#haloGrad)"
              strokeWidth="3.5"
              transform="rotate(-25 160 160)"
              filter="url(#goldGlow)"
            />

            {/* Outer Fluid Golden Ribbon Loop */}
            <path
              d="M 90,130 C 60,60 160,30 210,80 C 260,130 270,220 200,250 C 130,280 60,220 110,160 C 160,100 250,110 230,190 C 210,270 110,240 90,130 Z"
              fill="none"
              stroke="url(#goldRibbonGrad1)"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#goldGlow)"
            />

            {/* Inner Interlocking Specular Ribbon Accent */}
            <path
              d="M 120,110 C 80,160 160,250 210,210 C 260,170 230,80 150,110 C 70,140 120,240 180,220"
              fill="none"
              stroke="url(#goldRibbonGrad2)"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.95"
            />

            {/* Central Specular Shimmer Node */}
            <circle cx="160" cy="160" r="14" fill="#FFF9E6" filter="url(#goldGlow)" opacity="0.8" />
          </svg>
        </div>
      )}

      {/* Floating 3D Metadata Chips */}
      <div className="absolute -top-3 right-2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0C7]/95 backdrop-blur-md border border-[#D4AF37]/50 shadow-md text-xs font-semibold text-[#812637]">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
        <span>3D Golden Ribbon Sculpture</span>
      </div>

      <div className="absolute -bottom-3 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0C7]/95 backdrop-blur-md border border-[#D4AF37]/50 shadow-md text-xs font-medium text-[#812637]">
        <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>{isInteracting ? "Parallax Active" : "Interactive Specular Flow"}</span>
      </div>

      <div className="absolute bottom-2 -right-2 z-20 hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF8E7]/90 border border-[#D4AF37]/30 text-[10px] text-[#812637]/80">
        <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
        <span>{hasWebGL ? "WebGL 60FPS" : "SVG 3D Fallback"}</span>
      </div>
    </div>
  );
}
