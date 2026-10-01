"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

const CallToAction: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    let width = parent ? parent.clientWidth : window.innerWidth;
    let height = parent ? parent.clientHeight : window.innerHeight;
    let dpr = 1;

    const resizeCanvas = (w: number, h: number) => {
      width = w;
      height = h;
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };

    resizeCanvas(width, height);

    const interactionHost = parent ?? canvas;

    const ripples: {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
      speed: number;
      color: string;
    }[] = [];

    let shapes: {
      x: number;
      y: number;
      vy: number;
      vx: number;
      size: number;
      rotation: number;
      rotSpeed: number;
      type: "circle" | "diamond" | "cross";
      opacity: number;
    }[] = [];

    const buildShapes = (w: number, h: number) => {
      const area = w * h;
      const baseDensity = w < 768 ? 1 / 42000 : 1 / 30000;
      const count = Math.max(w < 768 ? 28 : 54, Math.round(area * baseDensity));
      const nextShapes: typeof shapes = [];

      for (let i = 0; i < count; i++) {
        nextShapes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vy: -(Math.random() * 0.3 + 0.1),
          vx: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 8 + 3,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.01,
          type: (["circle", "diamond", "cross"] as const)[
            Math.floor(Math.random() * 3)
          ],
          opacity: Math.random() * 0.15 + 0.05,
        });
      }

      return nextShapes;
    };

    shapes = buildShapes(width, height);

    let lastRippleTime = 0;

    const toLocalPoint = (clientX: number, clientY: number) => {
      const rect = interactionHost.getBoundingClientRect();
      const scaleX = width / Math.max(rect.width, 1);
      const scaleY = height / Math.max(rect.height, 1);

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    };

    const handlePointerMove = (e: PointerEvent) => {
      const point = toLocalPoint(e.clientX, e.clientY);

      const now = Date.now();
      if (now - lastRippleTime > 300) {
        ripples.push({
          x: point.x,
          y: point.y,
          radius: 0,
          maxRadius: 180 + Math.random() * 80,
          opacity: 0.25,
          speed: 1.5 + Math.random() * 0.5,
          color: Math.random() > 0.5 ? "rgba(0, 0, 0," : "rgba(65, 130, 168,",
        });
        lastRippleTime = now;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const point = toLocalPoint(e.clientX, e.clientY);
      const cx = point.x;
      const cy = point.y;

      for (let i = 0; i < 3; i++) {
        ripples.push({
          x: cx,
          y: cy,
          radius: i * 15,
          maxRadius: 300 + i * 60,
          opacity: 0.3 - i * 0.05,
          speed: 2 - i * 0.3,
          color: "rgba(0, 0, 0,",
        });
      }
    };

    interactionHost.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    interactionHost.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });

    let animationId = 0;
    let isSectionVisible = true;
    let pageVisible = document.visibilityState === "visible";
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = motionQuery.matches;
    let observer: IntersectionObserver | null = null;

    const render = () => {
      if (!isSectionVisible || !pageVisible || prefersReducedMotion) {
        animationId = 0;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (const s of shapes) {
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotSpeed;

        if (s.y < -20) {
          s.y = height + 20;
          s.x = Math.random() * width;
        }
        if (s.x < -20) s.x = width + 20;
        if (s.x > width + 20) s.x = -20;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.globalAlpha = s.opacity;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
        ctx.lineWidth = 1;

        if (s.type === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, s.size, 0, Math.PI * 2);
          ctx.stroke();
        } else if (s.type === "diamond") {
          ctx.beginPath();
          ctx.moveTo(0, -s.size);
          ctx.lineTo(s.size, 0);
          ctx.lineTo(0, s.size);
          ctx.lineTo(-s.size, 0);
          ctx.closePath();
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(-s.size, 0);
          ctx.lineTo(s.size, 0);
          ctx.moveTo(0, -s.size);
          ctx.lineTo(0, s.size);
          ctx.stroke();
        }

        ctx.restore();
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.opacity -= 0.002;

        if (r.opacity <= 0 || r.radius > r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${r.color} ${r.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    const stopAnimation = () => {
      if (!animationId) return;
      cancelAnimationFrame(animationId);
      animationId = 0;
    };

    const startAnimation = () => {
      if (animationId || !isSectionVisible || !pageVisible || prefersReducedMotion) {
        return;
      }

      animationId = requestAnimationFrame(render);
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

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isSectionVisible = Boolean(entry?.isIntersecting);
          if (isSectionVisible) {
            startAnimation();
          } else {
            stopAnimation();
          }
        },
        { threshold: 0.02 }
      );

      observer.observe(interactionHost);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionQuery.addEventListener("change", handleMotionPreferenceChange);
    startAnimation();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        resizeCanvas(entry.contentRect.width, entry.contentRect.height);
        shapes = buildShapes(width, height);
      }
    });

    if (parent) resizeObserver.observe(parent);

    return () => {
      stopAnimation();
      observer?.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionQuery.removeEventListener("change", handleMotionPreferenceChange);
      interactionHost.removeEventListener("pointermove", handlePointerMove);
      interactionHost.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <section
      id="cta"
      className="relative overflow-hidden border-b-2 border-black bg-kota-cyan py-16 sm:py-20 md:py-24 lg:py-28"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      />

      <div className="container relative z-10 mx-auto max-w-[1450px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <RevealOnScroll>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-5 xl:gap-6">
            <div className="relative min-h-[300px] w-full overflow-hidden rounded-[24px] border border-black/10 bg-[#bfeef2] shadow-[0_16px_40px_rgba(0,0,0,0.07)] sm:min-h-[380px] lg:min-h-[560px]">
              <Image
                src="/consultation.svg"
                alt="Consultation illustration"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center"
              />
            </div>

            <div className="flex min-h-[320px] w-full items-center rounded-[24px] border border-black/10 bg-[rgba(255,255,255,0.84)] px-6 py-10 shadow-[0_16px_40px_rgba(0,0,0,0.06)] backdrop-blur-[2px] sm:min-h-[360px] sm:px-8 sm:py-12 md:px-10 lg:min-h-[560px] lg:px-12 lg:py-14">
              <div className="mx-auto flex w-full max-w-full flex-col items-center text-center lg:items-start lg:text-left">
                <h2 className="mt-2 max-w-full font-heading text-[clamp(1.95rem,4vw,3rem)] leading-[0.94] tracking-[-0.045em] text-black/92">
                  <span className="block">You&apos;ve seen the work.</span>
                  <span className="block">Now let&apos;s talk.</span>
                </h2>

                <div className="mt-7 flex w-full justify-center lg:justify-start">
                  <Link
                    href="https://wa.me/6285111213203"
                    target="_blank"
                    rel="noreferrer"
                    className="pointer-events-auto group inline-grid min-h-[58px] w-full max-w-[380px] grid-cols-[minmax(0,1fr)_76px] items-stretch rounded-full border border-black bg-black text-white shadow-[0_12px_34px_rgba(0,0,0,0.14)] transition-all duration-500 hover:-translate-y-[2px] hover:shadow-[0_18px_46px_rgba(0,0,0,0.18)] sm:min-h-[62px] sm:w-auto sm:min-w-[360px] sm:grid-cols-[minmax(0,1fr)_84px] md:min-w-[400px]"
                  >
                    <span className="grid w-full translate-x-5 place-items-center px-6 text-center font-heading text-[clamp(1rem,2vw,1.65rem)] leading-none tracking-[-0.035em] sm:px-8 md:px-10">
                      Start a consultation
                    </span>

                    <span className="pointer-events-none grid place-items-center">
                      <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/10 md:h-10 md:w-10">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4 text-white"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M5 12H19"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 5L19 12L12 19"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default CallToAction;
