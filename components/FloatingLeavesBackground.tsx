"use client";

import React, { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  swayAmpX: number;
  swayAmpY: number;
  swaySpeedX: number;
  swaySpeedY: number;
  phaseX: number;
  phaseY: number;
  size: number;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
  spriteIndex: number;
  depth: number;
  interactionX: number;
  interactionY: number;
  interactionRotation: number;
};

const BASE_PALETTE = ["#86F3FD", "#7F6FA1", "#778BC3", "#4182A8"];

const FIELD = {
  desktopCount: 420,
  mobileCount: 210,
  desktopMaxCount: 720,
  mobileMaxCount: 300,

  influenceRadiusRatio: 0.42, 
  midRadiusRatio: 0.7,
  coreRadiusRatio: 0.3,

  pullStrength: 0,     
  swirlStrength: 22,    
  pushStrength: 34,     

  mouseFollow: 0.16,    
  scrollFollow: 0.025,
  desktopInteractionSmooth: 0.14,
  mobileInteractionSmooth: 0.1,
  motionSpeed: 1.65,
};

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const value = parseInt(clean, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToString(r: number, g: number, b: number) {
  return `rgb(${r}, ${g}, ${b})`;
}

function mixHex(hexA: string, hexB: string, t: number) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);

  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bb = Math.round(a.b + (b.b - a.b) * t);

  return rgbToString(r, g, bb);
}

function darkenRgbString(rgb: string, amount: number) {
  const match = rgb.match(/\d+/g);
  if (!match) return rgb;

  const [r, g, b] = match.map(Number);

  return rgbToString(
    Math.max(0, Math.round(r * (1 - amount))),
    Math.max(0, Math.round(g * (1 - amount))),
    Math.max(0, Math.round(b * (1 - amount)))
  );
}

function buildColorRamp(steps: number) {
  const colors: string[] = [];

  for (let i = 0; i < steps; i++) {
    const progress = (i / steps) * BASE_PALETTE.length;
    const index = Math.floor(progress) % BASE_PALETTE.length;
    const nextIndex = (index + 1) % BASE_PALETTE.length;
    const t = progress - Math.floor(progress);

    colors.push(mixHex(BASE_PALETTE[index], BASE_PALETTE[nextIndex], t));
  }

  return colors;
}

function buildLeafSprites(colors: string[]) {
  const scale = 4;

  return colors.map((color) => {
    const sprite = document.createElement("canvas");
    sprite.width = 42 * scale;
    sprite.height = 62 * scale;

    const ctx = sprite.getContext("2d");
    if (!ctx) return sprite;

    const cx = sprite.width / 2;
    const cy = sprite.height / 2;

    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.quadraticCurveTo(9.5, -5, 0, 21);
    ctx.quadraticCurveTo(-9.5, -5, 0, -18);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -13);
    ctx.lineTo(0, 15);
    ctx.strokeStyle = darkenRgbString(color, 0.22);
    ctx.lineWidth = 1.05;
    ctx.lineCap = "round";
    ctx.stroke();

    return sprite;
  });
}

function createParticles(
  width: number,
  height: number,
  spriteCount: number,
  viewportHeight: number
): Particle[] {
  const isMobile = width < 768;
  const baseCount = isMobile ? FIELD.mobileCount : FIELD.desktopCount;
  const heightFactor = Math.min(
    isMobile ? 1.65 : 2.15,
    Math.max(1, height / Math.max(viewportHeight, 1))
  );
  const maxCount = isMobile ? FIELD.mobileMaxCount : FIELD.desktopMaxCount;
  const count = Math.min(maxCount, Math.round(baseCount * heightFactor));

  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const depth = random(0.55, 1.25);
    const near = depth > 0.95;

    particles.push({
      x: random(-80, width + 80),
      y: random(-80, height + 80),
      driftX: random(-6.2, 6.2) * depth,
      driftY: random(-19.2, -7.4) * depth,
      swayAmpX: random(12, 32) * depth,      
      swayAmpY: random(6, 18) * depth,       
      swaySpeedX: random(0.09, 0.25),        
      swaySpeedY: random(0.075, 0.22),        
      phaseX: random(0, Math.PI * 2),
      phaseY: random(0, Math.PI * 2),
      size: random(8.6, 19.5) * depth,
      alpha: near ? random(0.36, 0.6) : random(0.24, 0.42),
      rotation: random(0, Math.PI * 2),
      rotationSpeed: random(-0.045, 0.045) * (0.15 + depth * 0.2), 
      spriteIndex: Math.floor(random(0, spriteCount)),
      depth,
      interactionX: 0,
      interactionY: 0,
      interactionRotation: 0,
    });
  }

  return particles;
}

const FloatingLeavesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const ramp = buildColorRamp(22);
    const sprites = buildLeafSprites(ramp);
    const parent = canvas.parentElement;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];

    let rafId = 0;
    let lastTime = performance.now();
    let timeAcc = 0;
    let frameIntervalMs = 1000 / 45;

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let mouseActive = false;

    let scrollOffset = 0;
    let smoothScrollOffset = 0;
    let isVisible = true;
    let pageVisible = document.visibilityState === "visible";
    let observer: IntersectionObserver | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = motionQuery.matches;

    const resize = () => {
      const prevWidth = width;
      const prevHeight = height;

      width = parent?.clientWidth ?? window.innerWidth;
      height = parent?.clientHeight ?? window.innerHeight;

      const isMobileViewportNow = width < 768;
      dpr = Math.min(window.devicePixelRatio || 1, isMobileViewportNow ? 1.2 : 1.6);
      frameIntervalMs = 1000 / (isMobileViewportNow ? 33 : 45);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const widthDelta = Math.abs(width - prevWidth);
      const heightDelta = Math.abs(height - prevHeight);
      const isMobileViewport = width < 768;

      const shouldRebuildParticles =
        particles.length === 0 ||
        widthDelta > 2 ||
        (!isMobileViewport && heightDelta > 2) ||
        (isMobileViewport && heightDelta > 140);

      if (shouldRebuildParticles) {
        targetMouseX = width / 2;
        targetMouseY = height / 2;
        currentMouseX = width / 2;
        currentMouseY = height / 2;

        particles = createParticles(width, height, sprites.length, window.innerHeight);
        return;
      }

      if (heightDelta > 0.5) {
        const yShift = height - prevHeight;
        for (let i = 0; i < particles.length; i++) {
          particles[i].y += yShift * 0.35;
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      mouseActive = true;
    };

    const handleMouseLeave = () => {
      mouseActive = false;
      targetMouseX = width / 2;
      targetMouseY = height / 2;
    };

    const handleScroll = () => {
      const isMobileViewport = width < 768;
      const scrollFactor = isMobileViewport ? 0.008 : 0.015;
      const maxOffset = isMobileViewport ? 8 : 16;

      scrollOffset = Math.max(-maxOffset, Math.min(maxOffset, window.scrollY * scrollFactor));
    };

    const recycleParticle = (p: Particle) => {
      p.x = random(-50, width + 50);
      p.y = height + random(20, 130);
      p.driftX = random(-6.2, 6.2) * p.depth;
      p.driftY = random(-19.2, -7.4) * p.depth;
      p.swayAmpX = random(12, 32) * p.depth;
      p.swayAmpY = random(6, 18) * p.depth;
      p.swaySpeedX = random(0.09, 0.25);
      p.swaySpeedY = random(0.075, 0.22);
      p.phaseX = random(0, Math.PI * 2);
      p.phaseY = random(0, Math.PI * 2);
      p.rotation = random(0, Math.PI * 2);
      p.rotationSpeed = random(-0.045, 0.045) * (0.15 + p.depth * 0.2);
      p.interactionX = 0;
      p.interactionY = 0;
      p.interactionRotation = 0;
    };

    const render = () => {
      if (!isVisible || !pageVisible || prefersReducedMotion) {
        rafId = 0;
        return;
      }

      const now = performance.now();
      const elapsed = now - lastTime;
      if (elapsed < frameIntervalMs) {
        rafId = requestAnimationFrame(render);
        return;
      }

      let delta = elapsed / 1000;
      lastTime = now;

      if (delta > 0.05) delta = 0.05;
      
      timeAcc += delta * FIELD.motionSpeed;

      const mouseLerp = 1 - Math.pow(1 - FIELD.mouseFollow, delta * 60);
      const scrollLerp = 1 - Math.pow(1 - FIELD.scrollFollow, delta * 60);

      currentMouseX += (targetMouseX - currentMouseX) * mouseLerp;
      currentMouseY += (targetMouseY - currentMouseY) * mouseLerp;
      smoothScrollOffset += (scrollOffset - smoothScrollOffset) * scrollLerp;

      ctx.clearRect(0, 0, width, height);

      const influenceRadius = Math.min(width, height) * FIELD.influenceRadiusRatio;
      const midRadius = influenceRadius * FIELD.midRadiusRatio;
      const coreRadius = influenceRadius * FIELD.coreRadiusRatio;
      const influenceRadiusSq = influenceRadius * influenceRadius;
      const isMobileViewport = width < 768;
      const interactionSmooth = isMobileViewport
        ? FIELD.mobileInteractionSmooth
        : FIELD.desktopInteractionSmooth;
      const interactionLerp = 1 - Math.pow(1 - interactionSmooth, delta * 60);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.driftX * delta * FIELD.motionSpeed;
        p.y += p.driftY * delta * FIELD.motionSpeed;
        p.rotation += p.rotationSpeed * delta * FIELD.motionSpeed;

        if (p.y < -160) recycleParticle(p);
        if (p.x < -140) p.x = width + 100;
        if (p.x > width + 140) p.x = -100;

        const swayX = Math.sin(timeAcc * p.swaySpeedX + p.phaseX) * p.swayAmpX;
        const swayY = Math.cos(timeAcc * p.swaySpeedY + p.phaseY) * p.swayAmpY;

        const baseX = p.x + swayX;
        const baseY = p.y + swayY + smoothScrollOffset * p.depth;

        if (baseX < -180 || baseX > width + 180 || baseY < -220 || baseY > height + 220) {
          continue;
        }

        let outerField = 0;
        let midField = 0;
        let targetInteractionX = 0;
        let targetInteractionY = 0;
        let targetInteractionRotation = 0;

        if (mouseActive) {
          const dx = currentMouseX - baseX;
          const dy = currentMouseY - baseY;
          const distSq = dx * dx + dy * dy;

          if (distSq < influenceRadiusSq) {
            const dist = Math.sqrt(distSq) || 0.0001;

            outerField = 1 - smoothstep(0, influenceRadius, dist);
            midField =
              smoothstep(coreRadius * 0.9, midRadius, dist) *
              (1 - smoothstep(midRadius, influenceRadius, dist));
            const coreField = 1 - smoothstep(0, coreRadius, dist);

            const nx = dx / dist;
            const ny = dy / dist;
            
            const tx = -ny;
            const ty = nx;

            const pushForce = coreField * FIELD.pushStrength * p.depth;
            const swirlForce = midField * FIELD.swirlStrength * p.depth;

            targetInteractionX = (-nx * pushForce) + (tx * swirlForce);
            targetInteractionY = (-ny * pushForce) + (ty * swirlForce);

            targetInteractionRotation = (pushForce + swirlForce) * 0.03;
          }

          targetInteractionX += (currentMouseX - width / 2) * 0.0009 * p.depth;
          targetInteractionY += (currentMouseY - height / 2) * 0.0009 * p.depth;
        }

        p.interactionX += (targetInteractionX - p.interactionX) * interactionLerp;
        p.interactionY += (targetInteractionY - p.interactionY) * interactionLerp;
        p.interactionRotation +=
          (targetInteractionRotation - p.interactionRotation) * interactionLerp;

        const drawX = baseX + p.interactionX;
        const drawY = baseY + p.interactionY;

        const drawWidth = p.size * 1.28;
        const drawHeight = p.size * 2.28;

        ctx.save();
        ctx.translate(drawX, drawY);
        ctx.rotate(p.rotation + p.interactionRotation);
        ctx.globalAlpha = p.alpha + outerField * 0.07;

        ctx.drawImage(
          sprites[p.spriteIndex],
          -drawWidth / 2,
          -drawHeight / 2,
          drawWidth,
          drawHeight
        );

        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    const stopAnimation = () => {
      if (!rafId) return;
      cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const startAnimation = () => {
      if (rafId || !isVisible || !pageVisible || prefersReducedMotion) return;
      lastTime = performance.now(); 
      rafId = requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      pageVisible = document.visibilityState === "visible";
      if (pageVisible) {
        startAnimation();
      } else {
        stopAnimation();
      }
    };

    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
      if (prefersReducedMotion) {
        stopAnimation();
        ctx.clearRect(0, 0, width, height);
      } else {
        startAnimation();
      }
    };

    resize();
    handleScroll();

    if ("IntersectionObserver" in window && canvas.parentElement) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = Boolean(entry?.isIntersecting);

          if (isVisible) {
            startAnimation();
          } else {
            mouseActive = false;
            stopAnimation();
          }
        },
        {
          threshold: 0.02,
        }
      );

      observer.observe(canvas.parentElement);
    }

    if ("ResizeObserver" in window && parent) {
      resizeObserver = new ResizeObserver(() => {
        resize();
      });

      resizeObserver.observe(parent);
    }

    startAnimation();

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionQuery.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      stopAnimation();

      if (observer) {
        observer.disconnect();
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionQuery.removeEventListener("change", handleMotionPreferenceChange);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.06),transparent_52%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(134,243,253,0.12),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(119,139,195,0.12),transparent_29%),radial-gradient(circle_at_50%_78%,rgba(127,111,161,0.11),transparent_31%)]" />

      <div className="absolute inset-0 opacity-45 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,transparent_28%,transparent_72%,rgba(255,255,255,0.045)_100%)]" />
    </>
  );
};

export default FloatingLeavesBackground;