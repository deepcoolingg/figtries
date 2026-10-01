"use client";

import React, { useEffect, useRef, useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

const TypingHeading: React.FC<{
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
}> = ({ text, className, as: Tag = "h2", delay = 0 }) => {
  const [charIndex, setCharIndex] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isIntersecting) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    timeoutId = setTimeout(() => {
      let i = 0;
      intervalId = setInterval(() => {
        i += 1;
        setCharIndex(i);
        if (i > text.length) clearInterval(intervalId);
      }, 35);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [delay, isIntersecting, text]);

  return (
    <Tag ref={ref as any} className={className}>
      {text.split("").map((char, index) => (
        <span
          key={`${char}-${index}`}
          className={index < charIndex ? "opacity-100" : "opacity-0"}
        >
          {char}
        </span>
      ))}
    </Tag>
  );
};

const AboutUs: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visionSectionRef = useRef<HTMLElement>(null);
  const visionArrowRef = useRef<HTMLDivElement>(null);
  const [isVisionEntered, setIsVisionEntered] = useState(false);

  useEffect(() => {
    const section = visionSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisionEntered(entry.intersectionRatio > 0.16);
      },
      {
        threshold: [0, 0.16, 0.24],
        rootMargin: "0px 0px -11% 0px",
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = visionSectionRef.current;
    const arrow = visionArrowRef.current;
    if (!section || !arrow) return;

    let rafId = 0;
    let targetProgress = 0;
    let currentProgress = 0;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));

    const getTargetProgress = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const start = viewportHeight * 0.9;
      
      const end = -viewportHeight * 1.0;

      return clamp((start - rect.top) / (start - end), 0, 1);
    };

    const render = () => {
      currentProgress += (targetProgress - currentProgress) * 0.07;

      const START_DEG = 0;
      const END_DEG = -90;
      
      const rotate = START_DEG + (END_DEG - START_DEG) * currentProgress;

      arrow.style.transform = `translate3d(0px, 0px, 0) rotate(${rotate}deg)`;

      if (Math.abs(targetProgress - currentProgress) > 0.0005) {
        rafId = window.requestAnimationFrame(render);
      } else {
        currentProgress = targetProgress;
        rafId = 0;
      }
    };

    const updateArrow = () => {
      targetProgress = getTargetProgress();
      if (!rafId) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    updateArrow();

    window.addEventListener("scroll", updateArrow, { passive: true });
    window.addEventListener("resize", updateArrow);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updateArrow);
      window.removeEventListener("resize", updateArrow);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    let width = parent ? parent.offsetWidth : window.innerWidth;
    let height = parent ? parent.offsetHeight : window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const colors = ["#86F3FD", "#000000", "#778BC3"];
    const particleCount = width < 768 ? 80 : 180; 

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.1,
        size: Math.random() * 2.5 + 1.2, 
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX - window.innerWidth / 2) * 0.05;
      targetY = (e.clientY - window.innerHeight / 2) * 0.05;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationId = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      ctx.save();
      ctx.translate(currentX, currentY);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50;
        if (p.y > height + 50) p.y = -50;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 15000) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(134, 243, 253, ${
              0.12 - (distSq / 15000) * 0.12
            })`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      ctx.restore();
      animationId = requestAnimationFrame(render);
    };

    render();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = entry.contentRect.height;
      }
    });

    if (parent) resizeObserver.observe(parent);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-black font-sans text-white selection:bg-kota-cyan selection:text-black">
      <section
        id="about"
        className="bg-[#F8F9FA] pb-16 pt-32 text-black md:pt-48"
      >
        <div className="container mx-auto mb-12 flex max-w-[1400px] flex-col items-start justify-between gap-8 px-6 md:flex-row md:px-12 lg:mb-16">
          <RevealOnScroll>
            <TypingHeading
              as="h1"
              text="We Architect Reliable Digital Systems."
              className="mb-0 font-heading text-4xl font-medium leading-none tracking-tight text-[#1A1A1A] md:text-[56px] lg:text-[72px]"
            />
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <p className="max-w-[480px] font-serif text-xl leading-snug text-[#1A1A1A]/80 md:text-[22px]">
              At Figtries, we combine data, infrastructure, and design to
              support systems that remain reliable as organizations grow.
            </p>
          </RevealOnScroll>
        </div>

        <div className="container mx-auto mb-16 max-w-[1400px] px-6 md:mb-24 md:px-12">
          <RevealOnScroll delay={200}>
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm md:h-[600px] md:rounded-[40px] lg:h-[700px]">
              <canvas
                ref={canvasRef}
                className="pointer-events-none absolute inset-0 z-0 h-full w-full mix-blend-multiply opacity-70"
              />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section
        ref={visionSectionRef}
        className="bg-white py-24 text-black md:py-32"
      >
        <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="mb-20 md:mb-32">
            <div className="flex items-center justify-between gap-6 md:gap-10">
              
              <div className="min-w-0 overflow-hidden pb-2 md:pb-3 lg:pb-4">
                <h2 className="font-heading text-5xl font-medium leading-[0.95] tracking-tight text-[#1A1A1A] md:text-7xl lg:text-[100px]">
                  <span
                    className="block"
                    style={{
                      transform: isVisionEntered
                        ? "translateY(0%)"
                        : "translateY(112%)",
                      transition:
                        "transform 1080ms cubic-bezier(0.215, 0.61, 0.355, 1)",
                    }}
                  >
                    Our Vision
                  </span>
                </h2>
              </div>

              <div className="pointer-events-none shrink-0 pb-2 md:pb-3 lg:pb-4">
                <div
                  ref={visionArrowRef}
                  className="will-change-transform"
                  style={{
                    transform: "translate3d(0px, 0px, 0) rotate(0deg)",
                    opacity: 1,
                  }}
                >
                  <img
                    src="/arrow.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-auto w-[70px] md:w-[120px] lg:w-[150px]"
                    draggable={false}
                  />
                </div>
              </div>

            </div>
          </div>

          <RevealOnScroll>
            <div className="flex flex-col gap-12 lg:flex-row lg:gap-24">
              <div className="w-full lg:w-[45%]">
                <TypingHeading
                  as="h3"
                  text="The foundational layer of future enterprises"
                  className="font-heading text-3xl font-normal leading-[1.1] tracking-tight text-[#1A1A1A] md:text-[40px] lg:text-[46px]"
                  delay={300}
                />
              </div>

              <div className="w-full lg:w-[55%]">
                <p className="text-justify font-serif text-lg font-normal leading-[1.4] text-[#1A1A1A] md:text-[22px]">
                  We aim to perfectly synthesize critical enterprise logic with
                  unparalleled digital aesthetics. We architect digital
                  infrastructure that enables businesses to operate efficiently,
                  scale endlessly, and inspire visually.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

<section className="bg-[#F8F9FA] py-16 text-black md:py-20 lg:py-24">
  <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
    <div className="mb-7 md:mb-5 lg:mb-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-8 lg:gap-14">
        <div className="md:w-[45%]">
          <RevealOnScroll>
            <TypingHeading
              as="h2"
              text="Our Mission"
              className="font-heading text-5xl font-medium tracking-tight text-[#1A1A1A] md:text-7xl lg:text-[100px]"
            />
          </RevealOnScroll>
        </div>

        <div className="md:w-[55%]">
          <RevealOnScroll delay={100}>
            <div className="flex h-[245px] w-full items-center justify-center bg-transparent pt-2 md:h-[300px] md:pt-0 lg:h-[360px]">
              <img
                src="/aboutus/mission.svg"
                alt="Mission"
                className="h-auto w-full"
              />
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </div>

    <RevealOnScroll delay={200}>
      <div className="mt-6 flex flex-col gap-10 md:mt-2 md:gap-6 lg:mt-3 lg:flex-row lg:gap-14">
        <div className="w-full lg:w-[45%]">
          <TypingHeading
            as="h3"
            text="Elevating enterprise capabilities through advanced engineering"
            className="font-heading text-3xl font-normal leading-[1.08] tracking-tight text-[#1A1A1A] md:text-[40px] lg:text-[46px]"
            delay={300}
          />
        </div>

        <div className="w-full lg:w-[55%]">
          <p className="text-justify font-serif text-lg font-normal leading-[1.4] text-[#1A1A1A] md:text-[22px]">
            We believe good systems don’t just work, they make sense.
            Behind every interface, pipeline, and model, there’s a structure that shapes how decisions are made.
            Our focus is not just on building what’s needed today, but designing foundations that stay clear, adaptable, and reliable as things evolve.
            Because when systems are built right, teams move faster, decisions get sharper, and complexity stops getting in the way.
          </p>
        </div>
      </div>
    </RevealOnScroll>
  </div>
</section>
    </div>
  );
};

export default AboutUs;
