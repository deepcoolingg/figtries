"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: "01",
    title: "Data & Intelligence",
    desc: "Turn scattered data into clear, actionable insight. We structure your data and deliver analytics that support faster, better decisions.",
    tags: ["Analytics", "Data Pipeline", "Business Intelligence"],
    cardBg: "#f4f4f4",
    visualBg: "#ece7f5",
    image: "/data-intelligence.svg",
    href: "/services/data-intelligence",
  },
  {
    id: "02",
    title: "AI & Machine Learning",
    desc: "Apply AI and machine learning to real problems. We build systems that automate workflows and improve decision accuracy at scale.",
    tags: ["Process Automation", "Machine Learning", "Applied AI Systems"],
    cardBg: "#f4f4f4",
    visualBg: "#dff0ff",
    image: "/ai.svg",
    href: "/services/artificial-intelligence",
  },
  {
    id: "03",
    title: "System Architecture",
    desc: "Build systems that stay reliable as you grow. We design strong backend and integration architecture built for stability and scalability.",
    tags: ["Enterprise Systems", "API Infrastructure", "Scalable Integration"],
    cardBg: "#f4f4f4",
    visualBg: "#ebefe8",
    image: "/system-architecture.svg",
    href: "/services/system-architecture",
  },
];

type Service = (typeof services)[number];

function ServiceArtwork({ service }: { service: Service }) {
  const artworkClassName =
    service.id === "02"
      ? "pointer-events-none select-none object-cover object-[50%_40%] scale-[1.04] md:object-center md:scale-[1.08] lg:scale-[1.05]"
      : "pointer-events-none select-none object-cover object-center scale-[1.12] md:scale-[1.08] lg:scale-[1.05]";

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: service.visualBg }}
    >
      <Image
        src={encodeURI(service.image)}
        alt={service.title}
        fill
        priority={service.id === "01"}
        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 52vw, 48vw"
        className={artworkClassName}
        draggable={false}
      />
    </div>
  );
}

function FindOutMoreButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="group inline-flex h-[48px] items-center justify-center gap-3 rounded-full border border-black bg-transparent px-6 text-[0.98rem] font-heading tracking-[-0.03em] text-black transition-all duration-300 hover:bg-black hover:text-white"
    >
      <span>Find out more</span>
      <span
        aria-hidden="true"
        className="text-[1.15rem] leading-none transition-transform duration-300 group-hover:translate-x-[2px]"
      >
        →
      </span>
    </a>
  );
}

function ServiceContent({
  service,
  isMobile = false,
}: {
  service: Service;
  isMobile?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-[640px]">
      <h4
        className={`font-heading tracking-normal text-black/78 ${
          isMobile
            ? "max-w-[8.5ch] text-[clamp(2.35rem,10vw,3.5rem)] leading-[0.92]"
            : "max-w-[7.6ch] text-[clamp(3rem,6vw,6.2rem)] leading-[0.88]"
        }`}
      >
        {service.title}
      </h4>

      <div
        className={`mt-5 flex max-w-[38rem] flex-wrap gap-2.5 ${
          isMobile ? "" : "md:mt-6"
        }`}
      >
        {service.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-black/10 bg-white/72 px-4 py-2 text-[0.8rem] font-medium leading-none tracking-[-0.02em] text-black/58 backdrop-blur-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <p
        className={`mt-6 max-w-[36rem] text-[1rem] leading-[1.45] tracking-[-0.02em] text-black/62 sm:text-[1.04rem] ${
          isMobile ? "" : "md:mt-7 md:text-[1.08rem] lg:text-[1.14rem]"
        }`}
      >
        {service.desc}
      </p>

      <div className="mt-7">
        <FindOutMoreButton href={service.href} />
      </div>
    </div>
  );
}

function MobileServiceCard({ service }: { service: Service }) {
  return (
    <div
      className="overflow-hidden rounded-[28px] border border-black/6"
      style={{ backgroundColor: service.cardBg }}
    >
      <div className="relative aspect-[1.08/1] overflow-hidden border-b border-black/6 bg-white/35">
        <ServiceArtwork service={service} />
      </div>

      <div className="px-5 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pt-6">
        <ServiceContent service={service} isMobile />
      </div>
    </div>
  );
}

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  const setPanelRef = (el: HTMLDivElement | null, index: number) => {
    panelsRef.current[index] = el;
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pinWrap = pinWrapRef.current;
    const panels = panelsRef.current.filter(
      (panel): panel is HTMLDivElement => panel !== null
    );

    if (!section || !pinWrap || panels.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const lenis = new Lenis({
        duration: 0.95,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        wheelMultiplier: 0.82,
        touchMultiplier: 0.95,
        infinite: false,
        syncTouch: false,
        gestureOrientation: "vertical",
      });

      lenis.on("scroll", ScrollTrigger.update);

      const lenisRaf = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(lenisRaf);
      gsap.ticker.lagSmoothing(0);

      const ctx = gsap.context(() => {
        panels.forEach((panel, index) => {
          gsap.set(panel, {
            yPercent: index === 0 ? 0 : 104,
            scale: 1,
            transformOrigin: "center top",
            willChange: "transform",
            force3D: true,
            backfaceVisibility: "hidden",
            zIndex: index + 1,
          });
        });

        const totalTransitions = panels.length - 1;
        const scrollPerPanel = window.innerHeight * 1.28;
        const finalHold = window.innerHeight * 0.34;
        const totalScroll = scrollPerPanel * totalTransitions + finalHold;

        const tl = gsap.timeline({
          defaults: {
            ease: "none",
          },
          scrollTrigger: {
            trigger: pinWrap,
            start: "top top",
            end: () => `+=${totalScroll}`,
            scrub: 0.9,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: false,
            snap: {
              snapTo: "labelsDirectional",
              duration: { min: 0.26, max: 0.48 },
              delay: 0.08,
              ease: "power3.out",
            },
            onRefresh: () => lenis.resize(),
          },
        });

        tl.addLabel("panel-0", 0);

        panels.forEach((panel, index) => {
          if (index === 0) return;

          const prev = panels[index - 1];
          const curr = panel;
          const unit = index - 1;

          tl.to(
            prev,
            {
              scale: 0.968,
              ease: "none",
              duration: 1,
              immediateRender: false,
            },
            unit
          );

          tl.to(
            curr,
            {
              yPercent: 0,
              ease: "none",
              duration: 1,
              immediateRender: false,
            },
            unit + 0.1
          );

          tl.addLabel(`panel-${index}`, index);
        });

        tl.to(
          {},
          {
            duration: 0.42,
          },
          panels.length - 1
        );

        ScrollTrigger.refresh();
      }, section);

      return () => {
        ctx.revert();
        gsap.ticker.remove(lenisRaf);
        lenis.destroy();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative mt-2 overflow-hidden bg-transparent px-4 pb-24 pt-12 sm:mt-3 sm:px-5 sm:pt-14 md:mt-5 md:px-6 md:pb-32 md:pt-20"
    >
      <div className="relative z-10 mx-auto max-w-[1750px]">
        <RevealOnScroll>
          <div className="mb-3 md:mb-4">
            <div className="mx-auto max-w-[1680px]">
              <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-end md:justify-between md:pb-8">
                <div>
                  <h3 className="font-heading text-[clamp(2.6rem,7vw,6.6rem)] leading-[0.9] tracking-wide text-black/80">
                    Our Services
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <div className="space-y-4 md:hidden">
          {services.map((service) => (
            <MobileServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div
          ref={pinWrapRef}
          className="relative mx-auto hidden max-w-[1750px] md:block"
        >
          <div className="relative h-[calc(100svh-22px)] overflow-hidden lg:h-[calc(100svh-28px)]">
            {services.map((service, index) => (
              <div
                key={service.id}
                ref={(el) => setPanelRef(el, index)}
                className="absolute inset-0"
              >
                <div
                  className="h-full overflow-hidden rounded-[34px] border border-black/6 md:rounded-[42px]"
                  style={{ backgroundColor: service.cardBg }}
                >
                  <div className="grid h-full grid-cols-1 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
                    <div className="flex h-full items-center justify-center px-5 py-6 sm:px-6 md:px-7 md:py-7 lg:px-9 lg:py-9 xl:px-10">
                      <ServiceContent service={service} />
                    </div>

                    <div className="relative min-h-[36svh] border-t border-black/6 lg:min-h-0 lg:border-l lg:border-t-0">
                      <div className="relative h-full w-full overflow-hidden bg-white/35">
                        <ServiceArtwork service={service} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;