"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import RevealOnScroll from "./RevealOnScroll";
import { Plus } from "lucide-react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const cards = [
  {
    number: "01",
    label: "Partnership",
    description:
      "We work as a close technical partner, not a distant vendor. That means staying aligned with your priorities, understanding the context behind the work, and helping decisions move with more clarity from the very beginning.",
    points: [
      "Closer collaboration across strategy, product, and execution",
      "Technical decisions shaped around your real business context",
      "Long-term alignment that supports continuity, not just delivery",
    ],
  },
  {
    number: "02",
    label: "Engineering",
    description:
      "We build the systems behind the experience with discipline and precision. From architecture and backend logic to integrations, performance, and maintainability. The work is designed to support real operational growth not just launch day polish.",
    points: [
      "Robust foundations built for stability and scale",
      "Clear architecture that stays manageable over time",
      "Execution that balances speed, reliability, and maintainability",
    ],
  },
  {
    number: "03",
    label: "Intelligence",
    description:
      "We turn complexity into usable direction. Whether through analytics, automation, or decision support systems, we shape intelligence into something practical so teams can act with more confidence, less noise, and less friction.",
    points: [
      "Operational visibility that reduces guesswork",
      "Decision support grounded in real signals and real use cases",
      "Systems that surface insight without creating extra complexity",
    ],
  },
  {
    number: "04",
    label: "Aesthetics",
    description:
      "We design digital experiences that feel as considered as the systems behind them. The goal is not decoration it is clarity, trust, and a user experience that helps people understand, navigate, and use the product more naturally.",
    points: [
      "Sharper hierarchy and clearer interaction patterns",
      "Interfaces that feel intuitive, credible, and intentional",
      "Design decisions tied to function—not excess",
    ],
  },
  {
    number: "05",
    label: "Evolution",
    description:
      "We build to evolve. As your business grows, the platform should be able to adapt without becoming fragile too early. That means creating room for iteration, extension, and better decisions over time.",
    points: [
      "Flexible systems that can support new needs as they emerge",
      "A foundation that makes iteration easier over time",
      "Longer-term thinking built into the work from the start",
    ],
  },
];

const introLines = ["Clear in thought.", "Precise in execution."];

type CardItem = (typeof cards)[number];

function useFastMobileMode() {
  const [fastMobileMode, setFastMobileMode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const coarseQuery = window.matchMedia("(pointer: coarse)");
    // Ubah breakpoint mobile jadi 767px biar iPad (768px ke atas) dapet animasi teks ala desktop
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const update = () => {
      setFastMobileMode(
        (coarseQuery.matches && mobileQuery.matches) ||
          reducedMotionQuery.matches
      );
    };

    update();

    coarseQuery.addEventListener("change", update);
    mobileQuery.addEventListener("change", update);
    reducedMotionQuery.addEventListener("change", update);

    return () => {
      coarseQuery.removeEventListener("change", update);
      mobileQuery.removeEventListener("change", update);
      reducedMotionQuery.removeEventListener("change", update);
    };
  }, []);

  return fastMobileMode;
}

const WhyChooseUsIntro: React.FC<{ fastMobileMode: boolean }> = ({
  fastMobileMode,
}) => {
  const [typedChars, setTypedChars] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const introRef = useRef<HTMLDivElement | null>(null);

  const firstLineLength = introLines[0].length;
  const totalLength = firstLineLength + introLines[1].length;

  useEffect(() => {
    if (fastMobileMode) return;

    const el = introRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed) {
          setHasPlayed(true);
        }
      },
      { threshold: 0.28 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fastMobileMode, hasPlayed]);

  useEffect(() => {
    if (fastMobileMode) return;
    if (!hasPlayed || typedChars >= totalLength) return;

    let delay = 26;
    let nextChar = "";

    if (typedChars < firstLineLength) {
      nextChar = introLines[0].charAt(typedChars);
    } else {
      nextChar = introLines[1].charAt(typedChars - firstLineLength);
    }

    if (nextChar === " ") delay = 14;
    if (nextChar === "," || nextChar === ".") delay = 86;
    if (typedChars === firstLineLength) delay = 160;

    const timeout = window.setTimeout(() => {
      setTypedChars((prev) => prev + 1);
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [fastMobileMode, hasPlayed, typedChars, totalLength, firstLineLength]);

  if (fastMobileMode) {
    return (
      <div
        ref={introRef}
        className="max-w-none font-heading leading-[0.92] tracking-[-0.055em] text-white/96 lg:max-w-[920px]"
      >
        <span className="block min-h-[0.92em] text-[clamp(2rem,8vw,3.35rem)] lg:text-[clamp(3.8rem,5vw,5.7rem)]">
          {introLines[0]}
        </span>
        <span className="block min-h-[0.92em] text-[clamp(2rem,8vw,3.35rem)] lg:text-[clamp(3.8rem,5vw,5.7rem)]">
          {introLines[1]}
        </span>
      </div>
    );
  }

  const typedLineOne =
    typedChars <= firstLineLength
      ? introLines[0].slice(0, typedChars)
      : introLines[0];

  const typedLineTwo =
    typedChars > firstLineLength
      ? introLines[1].slice(0, typedChars - firstLineLength)
      : "";

  const showCaret = typedChars < totalLength;

  return (
    <div
      ref={introRef}
      className="max-w-none font-heading leading-[0.92] tracking-[-0.055em] text-white/96 lg:max-w-[920px]"
    >
      <span className="block min-h-[0.92em] text-[clamp(2rem,8vw,3.35rem)] lg:text-[clamp(3.8rem,5vw,5.7rem)]">
        {typedLineOne}
        {showCaret && typedChars <= firstLineLength ? (
          <span
            aria-hidden="true"
            className="ml-[0.06em] inline-block text-kota-cyan motion-safe:animate-[caret-blink_920ms_steps(1,end)_infinite]"
          >
            |
          </span>
        ) : null}
      </span>

      <span className="block min-h-[0.92em] text-[clamp(2rem,8vw,3.35rem)] lg:text-[clamp(3.8rem,5vw,5.7rem)]">
        {typedLineTwo}
        {showCaret && typedChars > firstLineLength ? (
          <span
            aria-hidden="true"
            className="ml-[0.06em] inline-block text-kota-cyan motion-safe:animate-[caret-blink_920ms_steps(1,end)_infinite]"
          >
            |
          </span>
        ) : null}
      </span>
    </div>
  );
};

const CardContent: React.FC<{ card: CardItem }> = ({ card }) => {
  return (
    <div className="pb-1 sm:pb-0">
      {/* Teks di iPad dikecilin dikit biar gak meluber */}
      <p className="max-w-[75ch] text-left text-[0.88rem] leading-[1.62] tracking-[-0.012em] text-black/76 md:text-[1.1rem] lg:text-[1.15rem] xl:max-w-[60ch] xl:text-[1.03rem] xl:text-justify">
        {card.description}
      </p>

      <div className="mt-4 lg:mt-5 md:mt-7">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-black/38 md:text-[0.8rem] lg:text-[0.85rem] xl:text-[0.7rem]">
          What this includes
        </p>

        <ul className="mt-3 space-y-2.5 md:space-y-4 xl:space-y-2.5 md:mt-4">
          {card.points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 text-[0.85rem] leading-[1.52] tracking-[-0.01em] text-black/72 md:text-[1.05rem] md:gap-4 lg:text-[1.1rem] xl:gap-3 xl:text-[0.98rem]"
            >
              <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-black/55 md:h-2 md:w-2 md:mt-[0.55rem] xl:h-1.5 xl:w-1.5 xl:mt-[0.45rem]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const WhyChooseUs: React.FC = () => {
  const [openCard, setOpenCard] = useState<number | null>(null);
  const fastMobileMode = useFastMobileMode();

  const handleToggle = useCallback((index: number) => {
    setOpenCard((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section
      id="why-choose-us"
      className="relative overflow-hidden bg-[#0b0d14] pb-12 pt-20 text-white sm:pb-14 sm:pt-24 md:pb-16 md:pt-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_62%,rgba(65,130,168,0.18),transparent_44%),radial-gradient(circle_at_88%_10%,rgba(127,111,161,0.14),transparent_36%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.015),rgba(255,255,255,0))]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12">
        <RevealOnScroll>
          <div className="grid grid-cols-1 gap-8 pb-10 sm:gap-9 sm:pb-12 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] lg:gap-12 lg:pb-16">
            <div className="lg:pt-2">
              <span className="inline-block text-[clamp(1.25rem,4vw,2rem)] font-heading leading-none tracking-[-0.02em] text-white">
                How We Work
              </span>
            </div>

            <WhyChooseUsIntro fastMobileMode={fastMobileMode} />
          </div>
        </RevealOnScroll>

        <div>
          {/* Layout tumpuk ke bawah untuk tablet (termasuk iPad Pro 1024), horizontal card hanya di ukuran laptop xl (1280px ke atas) */}
          <ul className="flex flex-col gap-2.5 sm:gap-3 xl:h-[540px] xl:flex-row xl:items-stretch xl:overflow-hidden">
            {cards.map((card, index) => {
              const isOpen = openCard === index;

              return (
                <li
                  key={card.number}
                  onClick={() => handleToggle(index)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleToggle(index);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  className={`group relative w-full cursor-pointer select-none overflow-hidden rounded-[26px] border px-4 pb-4 pt-4 transition-[colors,flex-grow] duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)] xl:transition-[background-color,border-color,color,box-shadow,flex-grow] sm:rounded-[28px] sm:p-6 md:p-8 xl:min-h-0 xl:min-w-0 xl:shrink-0 xl:p-6 ${
                    isOpen
                      ? "border-kota-cyan/70 bg-[#f2fcff] text-[#121212] xl:flex-[2.5] xl:shadow-[0_18px_44px_rgba(134,243,253,0.10)]"
                      : "border-white/14 bg-white/[0.02] text-white hover:border-kota-cyan/55 hover:bg-white/[0.035] xl:flex-[1]"
                  }`}
                  style={{
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div className="relative z-[1] flex h-full w-full flex-col text-left">
                    <div className="w-full flex-none">
                      <div className="min-w-0">
                        <p
                          className={`text-[0.84rem] font-heading tracking-[-0.01em] transition-colors duration-[400ms] md:text-[1.1rem] xl:text-[0.84rem] ${
                            isOpen ? "text-black/42" : "text-white/38"
                          }`}
                        >
                          {card.number}
                        </p>

                        <h4
                          className={`font-heading leading-[0.98] tracking-[-0.045em] transition-all duration-[400ms] mt-[1.05rem] sm:mt-5 text-[1.62rem] sm:text-[1.82rem] md:text-[2.25rem] lg:text-[2.5rem] xl:text-[1.95rem] ${
                            isOpen ? "text-black" : "text-white/96"
                          }`}
                        >
                          {card.label}
                        </h4>
                      </div>

                      {/* Konten vertikal muncul di HP dan Tablet */}
                      <div
                        className={`grid transition-[grid-template-rows,opacity] duration-[450ms] ease-[cubic-bezier(0.25,1,0.5,1)] xl:hidden ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                        style={{ willChange: "grid-template-rows, opacity" }}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <div className="pb-4 pt-5">
                            <CardContent card={card} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tombol ditaruh ke bawah khusus mode xl ke atas */}
                    <div
                      className={`mt-9 grid h-[44px] w-[44px] place-items-center rounded-full border transition-colors duration-[400ms] sm:h-12 sm:w-12 md:h-16 md:w-16 md:mt-12 xl:absolute xl:bottom-0 xl:left-0 xl:mt-0 xl:h-12 xl:w-12 ${
                        isOpen
                          ? "border-black bg-black text-white"
                          : "border-white/20 text-white/60 xl:group-hover:border-kota-cyan xl:group-hover:text-kota-cyan"
                      }`}
                    >
                      <Plus
                        size={17}
                        strokeWidth={2.2}
                        aria-hidden="true"
                        style={{
                          transform: `rotate(${isOpen ? 45 : 0}deg)`,
                          transition: "transform 400ms cubic-bezier(0.25, 1, 0.5, 1)",
                        }}
                      />
                    </div>

                    {/* Konten desktop muncul mulai ukuran xl (xl:block) */}
                    <div
                      className={`pointer-events-none absolute left-0 right-0 top-[6.8rem] hidden transition-opacity duration-[400ms] ease-out xl:block ${
                        isOpen ? "opacity-100 delay-[150ms]" : "opacity-0 delay-0"
                      }`}
                    >
                      {/* Lebar teks dibuat w-full mengikuti ruang kartu agar aman */}
                      <div className="w-full xl:max-w-[360px]">
                        <CardContent card={card} />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;