"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";
import { type ServiceData } from "@/lib/services-data";

const MOBILE_DIVIDER_CLASS = "border-t-[1.5px] border-black/[0.16]";
const DESKTOP_DIVIDER_CLASS = "border-t-[1.5px] border-black/[0.14]";

function CapabilityPlaceholder({ accentBg }: { accentBg: string }) {
  return (
    <div
      className="relative min-h-[300px] w-full overflow-hidden rounded-[28px] md:rounded-[34px] lg:min-h-[480px]"
      style={{ backgroundColor: accentBg }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent to-black/[0.04]" />
    </div>
  );
}

function TypewriterTitle({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const shouldType =
    text.replace(/\n/g, " ").trim().toLowerCase() ===
    "where data becomes operational";
    
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    // Stop efek ngetik kalau teksnya bukan "Where data becomes operational" biar performa enteng
    if (!shouldType) return;

    setDisplayed("");
    let index = 0;

    const timer = window.setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, 34);

    return () => window.clearInterval(timer);
  }, [text, shouldType]);

  return (
    <h2 className={className} style={style}>
      {shouldType ? displayed : text}
      {shouldType && displayed.length < text.length ? (
        <span className="ml-[0.02em] inline-block animate-pulse text-black/70">
          |
        </span>
      ) : null}
    </h2>
  );
}

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-black/[0.12]">
      <button
        onClick={onToggle}
        className="group flex w-full items-start justify-between gap-6 py-5 text-left transition-colors duration-200 sm:py-6"
      >
        <span className="font-heading text-[clamp(1.14rem,1.72vw,1.48rem)] leading-[1.3] tracking-[-0.02em] text-black/88 transition-colors duration-200 group-hover:text-black">
          {question}
        </span>

        <span
          className={`mt-0.5 flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full border border-black/[0.12] text-black/55 transition-all duration-200 ease-out ${
            isOpen ? "rotate-45 bg-black/[0.035] text-black/80" : ""
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1V13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M1 7H13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      <div
        className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="max-w-[900px] pb-5 font-serif text-[1.06rem] leading-[1.74] tracking-[-0.01em] text-black/58 sm:text-[1.12rem]">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function ServiceVisualPanel({ service }: { service: ServiceData }) {
  const displayImage = service.secondaryImage || service.image;
  const displayBg = service.secondaryAccentBg || service.accentBg;

  const mobileFrameClass =
    service.slug === "system-architecture"
      ? "max-w-[360px] h-[380px]"
      : service.slug === "data-intelligence"
      ? "max-w-[350px] h-[350px]"
      : service.slug === "artificial-intelligence"
      ? "max-w-[320px] h-[300px]"
      : "max-w-[330px] h-[320px]";

  const desktopFrameClass =
    service.slug === "system-architecture"
      ? "max-w-[640px] h-[620px] xl:h-[680px]"
      : service.slug === "data-intelligence"
      ? "max-w-[620px] h-[540px] xl:h-[600px]"
      : service.slug === "artificial-intelligence"
      ? "max-w-[560px] h-[430px] xl:h-[470px]"
      : "max-w-[580px] h-[480px] xl:h-[540px]";

  return (
    <div className="lg:sticky lg:top-28">
      {/* Mobile */}
      <div className={`relative w-full ${mobileFrameClass} lg:hidden`}>
        {displayImage ? (
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-transparent">
            <img
              src={encodeURI(displayImage)}
              alt={service.name}
              draggable={false}
              loading="eager"
              decoding="sync"
              className="pointer-events-none block max-h-full max-w-full select-none object-contain object-center"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)",
              }}
            />
          </div>
        ) : (
          <div className="h-full w-full">
            <CapabilityPlaceholder accentBg={displayBg} />
          </div>
        )}
      </div>

      {/* Desktop */}
      <div className={`relative hidden w-full ${desktopFrameClass} lg:block`}>
        {displayImage ? (
          // Wadah diubah jadi flex center biar gambar utuh di tengah
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-transparent">
            <img
              src={encodeURI(displayImage)}
              alt={service.name}
              draggable={false}
              loading="eager"
              decoding="sync"
              // h-full w-full diubah jadi max-h-full max-w-full biar gak kepotong
              className="pointer-events-none block max-h-full max-w-full select-none object-contain object-center"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)",
              }}
            />
          </div>
        ) : (
          <div className="h-full w-full">
            <CapabilityPlaceholder accentBg={displayBg} />
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceGoalsSection({ service }: { service: ServiceData }) {
  const outcomes = service.outcomes.slice(0, 3);

  return (
    <section className="bg-[#f3f3f1] px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 md:px-10 md:pb-24 md:pt-14 lg:px-12 lg:pb-28 lg:pt-16">
      <div className="mx-auto max-w-[1600px]">
        <RevealOnScroll>
          <div className="rounded-[30px] border border-black/6 bg-[#fcfcfc] px-5 py-12 sm:px-8 sm:py-14 md:px-10 md:py-16 lg:px-12 lg:py-[4.5rem]">
            <h2
              className="mx-auto text-center font-heading text-[#7F6FA1]/90"
              style={{
                fontSize: "clamp(2.8rem, 5.35vw, 6rem)",
                lineHeight: 0.96,
                letterSpacing: "-0.035em",
              }}
            >
              {service.outcomesHeading}
            </h2>
          </div>
        </RevealOnScroll>

        <div className="mt-4 grid gap-5 sm:mt-5 lg:mt-6 lg:grid-cols-3">
          {outcomes.map((item, index) => (
            <RevealOnScroll key={item.label} delay={index * 90}>
              <div className="flex h-full flex-col rounded-[24px] border border-black/8 bg-[#fcfcfc] px-7 py-8 text-left">
                <h3
                  className="w-full font-heading text-[#7F6FA1]"
                  style={{
                    fontSize: "clamp(2.05rem, 2.9vw, 3rem)",
                    lineHeight: 0.98,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {item.label}
                </h3>

                <p
                  className="mt-5 w-full font-serif text-black/58"
                  style={{
                    fontSize: "clamp(1.08rem, 1.15vw, 1.2rem)",
                    lineHeight: 1.68,
                    letterSpacing: "-0.012em",
                    textAlign: "left",
                  }}
                >
                  {item.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceFAQSection({ service }: { service: ServiceData }) {
  const faqs = service.faqs || [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs.length) return null;

  return (
    <section className="bg-[#fcfcfc] px-4 pb-16 pt-2 sm:px-6 sm:pb-20 sm:pt-3 md:px-10 md:pb-24 md:pt-4 lg:px-12 lg:pb-28 lg:pt-6">
      <div className="mx-auto max-w-[1600px]">
        <RevealOnScroll>
          <div className="rounded-[30px] border border-black/6 bg-white px-5 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14 lg:px-12 lg:py-16">
            <h2
              className="font-heading text-black/90"
              style={{
                fontSize: "clamp(2.35rem, 5vw, 5rem)",
                lineHeight: 0.94,
                letterSpacing: "-0.05em",
              }}
            >
              Frequently asked questions.
            </h2>

            <div className="mt-6 sm:mt-8 lg:mt-10">
              {faqs.map((faq, index) => (
                <RevealOnScroll key={faq.question} delay={index * 60}>
                  <FAQItem
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === index}
                    onToggle={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                  />
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

const ServiceDetailPage: React.FC<{ service: ServiceData }> = ({ service }) => {
  return (
    <>
      <section className="relative bg-[#fcfcfc]">
        <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-28 sm:px-6 sm:pb-12 sm:pt-32 md:px-10 md:pb-14 md:pt-36 lg:px-12 lg:pb-16 lg:pt-40">
          <RevealOnScroll>
            <div className="lg:hidden">
              <h1
                className="font-heading leading-[0.94] tracking-[-0.04em] text-black/90"
                style={{ fontSize: "clamp(2.7rem, 10vw, 4.7rem)" }}
              >
                {service.hero.title}
              </h1>
              <p
                className="mt-5 font-heading leading-[1.08] tracking-[-0.03em] text-black/84"
                style={{
                  fontSize: "clamp(1.35rem, 5vw, 1.9rem)",
                  fontWeight: 400,
                }}
              >
                {service.hero.description}
              </p>
            </div>

            <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.78fr)] lg:items-end lg:gap-20">
              <h1
                className="max-w-[900px] font-heading leading-[0.92] tracking-[-0.055em] text-black/90"
                style={{ fontSize: "clamp(4rem, 5.25vw, 5.45rem)" }}
              >
                {service.hero.title}
              </h1>
              <p
                className="font-heading leading-[1.06] tracking-[-0.035em] text-black/84"
                style={{
                  fontSize: "clamp(1.6rem, 2.15vw, 2.35rem)",
                  fontWeight: 400,
                }}
              >
                {service.hero.description}
              </p>
            </div>
          </RevealOnScroll>
        </div>

        <div className="px-4 pb-8 sm:px-6 sm:pb-10 md:px-10 md:pb-12 lg:px-12 lg:pb-14">
          <div className="mx-auto max-w-[1600px]">
            <div
              className="relative w-full overflow-hidden rounded-[20px] sm:rounded-[26px] lg:rounded-[32px]"
              style={{
                backgroundColor: "#f5f4f1",
                aspectRatio:
                  service.slug === "system-architecture"
                    ? "1.45 / 1"
                    : service.slug === "data-intelligence"
                    ? "1.9 / 1"
                    : service.slug === "artificial-intelligence"
                    ? "1.9 / 1"
                    : "1.7 / 1",
              }}
            >
              <Image
                src={encodeURI(service.image)}
                alt={service.name}
                fill
                priority
                quality={100}
                sizes="(min-width: 1600px) 1600px, 100vw"
                className="pointer-events-none select-none object-cover object-center mix-blend-multiply"
              />
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/[0.05]" />
            </div>
          </div>
        </div>
      </section>

      <section
        id="capabilities"
        className="relative overflow-hidden bg-[#f3f3f1] px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 md:px-10 md:pb-14 md:pt-32 lg:px-12 lg:pb-16 lg:pt-36"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="lg:hidden">
            <RevealOnScroll>
              <div className="mx-auto max-w-[432px]">
                <div className="pt-[30px]">
                  <TypewriterTitle
                    text={
                      service.capabilitiesIntro.title.trim() ===
                      "Where Data Becomes Operational"
                        ? "Where Data\nBecomes Operational"
                        : service.capabilitiesIntro.title
                    }
                    className="max-w-[300px] whitespace-pre-line font-heading text-black/90"
                    style={{
                      fontSize: "clamp(2rem, 7.15vw, 2.46rem)",
                      lineHeight: 0.95,
                      letterSpacing: "-0.05em",
                    }}
                  />

                  <div className="mt-[28px] ml-auto w-full max-w-[304px]">
                    <p
                      className="max-w-[270px] font-heading text-black/84"
                      style={{
                        fontSize: "clamp(1.08rem, 4vw, 1.18rem)",
                        lineHeight: 1.28,
                        letterSpacing: "-0.02em",
                        fontWeight: 400,
                      }}
                    >
                      {service.capabilitiesIntro.description}
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="mx-auto mt-[34px] max-w-[432px]">
                <div className="ml-auto w-full max-w-[304px]">
                  <ServiceVisualPanel service={service} />
                </div>
              </div>
            </RevealOnScroll>

            <div className="mx-auto mt-[22px] max-w-[432px]">
              <div className="ml-auto w-full max-w-[304px]">
                {service.capabilities.map((cap, index) => (
                  <RevealOnScroll key={cap.title} delay={index * 90}>
                    <article
                      className={`${MOBILE_DIVIDER_CLASS} pb-[34px] pt-[28px]`}
                    >
                      <h3
                        className="w-full font-heading text-black/92"
                        style={{
                          fontSize: "clamp(1.28rem, 4.7vw, 1.58rem)",
                          lineHeight: 1.14,
                          letterSpacing: "-0.03em",
                          fontWeight: 600,
                        }}
                      >
                        {cap.title}.
                      </h3>

                      <p
                        className="mt-[18px] w-full font-heading text-black/74"
                        style={{
                          fontSize: "clamp(1.02rem, 3.65vw, 1.1rem)",
                          lineHeight: 1.58,
                          letterSpacing: "-0.01em",
                          fontWeight: 400,
                        }}
                      >
                        {cap.description}
                      </p>

                      {cap.bullets.length > 0 && (
                        <div className="mt-4 w-full space-y-2">
                          {cap.bullets.map((b) => (
                            <p
                              key={b}
                              className="w-full font-heading text-black/66"
                              style={{
                                fontSize: "0.98rem",
                                lineHeight: 1.48,
                                letterSpacing: "-0.01em",
                                fontWeight: 400,
                              }}
                            >
                              {b}
                            </p>
                          ))}
                        </div>
                      )}
                    </article>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <RevealOnScroll>
              <div className="grid gap-10 lg:grid-cols-[minmax(420px,0.9fr)_minmax(0,1fr)] lg:items-center lg:gap-16 xl:gap-20">
                <div className="w-full">
                  <TypewriterTitle
                    text={service.capabilitiesIntro.title}
                    className="w-full whitespace-pre-line font-heading text-black/86"
                    style={{
                      fontSize: "clamp(2.4rem, 3.9vw, 4.1rem)",
                      lineHeight: 0.94,
                      letterSpacing: "-0.055em",
                    }}
                  />
                </div>

                <div className="w-full">
                  <p
                    className="w-full font-heading text-black/74"
                    style={{
                      fontSize: "clamp(1.36rem, 1.82vw, 1.96rem)",
                      lineHeight: 1.12,
                      letterSpacing: "-0.03em",
                      fontWeight: 500,
                    }}
                  >
                    {service.capabilitiesIntro.description}
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            <div className="pt-8 sm:pt-10 lg:grid lg:grid-cols-[minmax(420px,0.9fr)_minmax(0,1fr)] lg:gap-16 lg:pt-12 xl:gap-20">
              <RevealOnScroll>
                <div className="mb-10 lg:mb-0">
                  <ServiceVisualPanel service={service} />
                </div>
              </RevealOnScroll>

              <div className="relative w-full">
                {service.capabilities.map((cap, index) => (
                  <RevealOnScroll key={cap.title} delay={index * 90}>
                    <article
                      className={`w-full ${
                        index === 0
                          ? "pb-8 sm:pb-10"
                          : `${DESKTOP_DIVIDER_CLASS} py-8 sm:py-10`
                      }`}
                    >
                      <h3
                        className="w-full font-heading text-black/88"
                        style={{
                          fontSize: "clamp(1.52rem, 1.82vw, 2.14rem)",
                          lineHeight: 1.06,
                          letterSpacing: "-0.04em",
                          fontWeight: 500,
                        }}
                      >
                        {cap.title}.
                      </h3>

                      <p
                        className="mt-5 w-full font-serif text-black/62"
                        style={{
                          fontSize: "clamp(1.04rem, 1.1vw, 1.18rem)",
                          lineHeight: 1.82,
                          letterSpacing: "-0.01em",
                          textAlign: "justify",
                        }}
                      >
                        {cap.description}
                      </p>

                      {cap.bullets.length > 0 && (
                        <div className="mt-5 w-full space-y-2.5">
                          {cap.bullets.map((b) => (
                            <p
                              key={b}
                              className="w-full font-serif text-black/55"
                              style={{
                                fontSize: "1rem",
                                lineHeight: 1.7,
                                letterSpacing: "-0.01em",
                                textAlign: "justify",
                              }}
                            >
                              {b}
                            </p>
                          ))}
                        </div>
                      )}
                    </article>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceGoalsSection service={service} />
      <ServiceFAQSection service={service} />
    </>
  );
};

export default ServiceDetailPage;