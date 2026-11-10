"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Eye, ShieldCheck } from "lucide-react";

export default function GoldenRibbonSculpture3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Check WebGL availability
    try {
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.z = 8.5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // LIGHTING SYSTEM
    // Warm Champagne Ambient
    const ambientLight = new THREE.AmbientLight(0xfff3d1, 1.4);
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
    // Primary Lustrous Metallic Ribbon Material
    const ribbonMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xd4af37),
      roughness: 0.16,
      metalness: 0.94,
    });

    // Secondary Fine Accent Ribbon Material
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xf4e3b2),
      roughness: 0.22,
      metalness: 0.88,
    });

    // Outer Floating Ring Material (Semi-specular)
    const haloMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xe6c265),
      roughness: 0.14,
      metalness: 0.96,
      wireframe: false,
    });

    // SCULPTURE GROUP
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    // 1. Primary Intertwined Golden Ribbon (Torus Knot: p=2, q=3)
    const primaryGeometry = new THREE.TorusKnotGeometry(2.1, 0.54, 220, 36, 2, 3);
    const primaryMesh = new THREE.Mesh(primaryGeometry, ribbonMaterial);
    sculptureGroup.add(primaryMesh);

    // 2. Interlocking Secondary Fluid Ribbon (Torus Knot: p=3, q=4)
    const secondaryGeometry = new THREE.TorusKnotGeometry(2.55, 0.14, 180, 24, 3, 4);
    const secondaryMesh = new THREE.Mesh(secondaryGeometry, accentMaterial);
    sculptureGroup.add(secondaryMesh);

    // 3. Floating Orbital Beveled Ring
    const ringGeometry = new THREE.TorusGeometry(3.2, 0.05, 16, 120);
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
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
      setIsInteracting(false);
    };

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("mouseleave", handlePointerLeave);

    // ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Continuous smooth 3D fluid rotation
        primaryMesh.rotation.y += 0.007;
        primaryMesh.rotation.x += 0.0035;
        primaryMesh.rotation.z += 0.002;

        secondaryMesh.rotation.y -= 0.009;
        secondaryMesh.rotation.x -= 0.005;

        ringMesh.rotation.z += 0.004;

        // Gentle floating levitation
        sculptureGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.14;

        // Dynamic light oscillation for shifting metallic specular shine
        keyLight.position.x = 6 + Math.cos(elapsedTime * 0.8) * 2;
        keyLight.position.y = 8 + Math.sin(elapsedTime * 0.8) * 1.5;
      }

      // Smooth mouse parallax lerp
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      sculptureGroup.rotation.y += (mouseX - sculptureGroup.rotation.y * 0.2) * 0.05;
      sculptureGroup.rotation.x += (-mouseY - sculptureGroup.rotation.x * 0.2) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE OBSERVER
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("mouseleave", handlePointerLeave);

      primaryGeometry.dispose();
      secondaryGeometry.dispose();
      ringGeometry.dispose();
      ribbonMaterial.dispose();
      accentMaterial.dispose();
      haloMaterial.dispose();
      renderer.dispose();
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

      {/* WebGL Canvas */}
      {hasWebGL ? (
        <canvas
          ref={canvasRef}
          className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-300"
          style={{ touchAction: "none" }}
        />
      ) : (
        /* Graceful CSS 3D Fallback if WebGL unavailable */
        <div className="relative z-10 w-[260px] h-[260px] flex items-center justify-center">
          <div className="w-56 h-56 rounded-full border-4 border-[#D4AF37] shadow-[0_0_30px_#D4AF37] animate-spin flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border-4 border-[#F4E3B2] animate-pulse flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-[#812637]" />
            </div>
          </div>
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
        <span>WebGL 60FPS</span>
      </div>
    </div>
  );
}
