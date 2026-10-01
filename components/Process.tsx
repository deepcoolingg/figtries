"use client";

import React, { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import ProcessAuroraBackground from "./ProcessAuroraBackground";

const phases = [
  {
    phase: "01",
    title: "Cut through the noise",
    desc: "We cut through the clutter, challenge assumptions, and get to what actually matters.",
  },
  {
    phase: "02",
    title: "Structure drives everything",
    desc: "We define the right structure, the part that holds, scales, and doesn't break under pressure.",
  },
  {
    phase: "03",
    title: "Build to perform",
    desc: "We build fast, solid, and without shortcuts. If it ships, it performs.",
  },
  {
    phase: "04",
    title: "Make every detail count",
    desc: "We push past good enough to refine every detail interaction until it feels right and works even better.",
  },
];

const Process: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="process" className="relative overflow-hidden py-32 md:py-48 bg-kota-periwinkle selection:bg-white selection:text-kota-periwinkle">
      <ProcessAuroraBackground />

      <div className="container relative z-10 mx-auto px-6 md:px-12 max-w-[1400px]">
        <RevealOnScroll>
          <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="block mb-6 text-sm font-heading font-medium uppercase tracking-[0.3em] text-white/78">
                Our Methodology
              </span>
              <h3 className="text-[clamp(2.65rem,13vw,6.25rem)] md:text-[100px] font-heading leading-[0.9] tracking-normal text-white/90">
                From Clarity <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/40 to-white/10">To Execution.</span>
              </h3>
            </div>
          </div>
        </RevealOnScroll>

        <ul className="flex flex-col">
          {phases.map((p, index) => (
            <RevealOnScroll key={p.phase} delay={index * 150}>
              <li
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group border-b border-white/20 py-10 md:py-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 transition-all duration-500 ${hoveredIndex !== null && hoveredIndex !== index ? "opacity-35" : "opacity-100"
                  }`}
              >
                <div className="flex min-w-0 items-center gap-4 sm:gap-8 md:items-start lg:w-1/2">
                  <span className="text-3xl md:text-4xl font-heading text-white/65 transition-colors group-hover:text-white">
                    {p.phase}
                  </span>
                  <h4 className="text-2xl sm:text-4xl md:text-5xl font-heading leading-[0.95] tracking-normal text-white/92 transition-transform duration-500 group-hover:translate-x-2 md:group-hover:translate-x-4">
                    {p.title}
                  </h4>
                </div>

                <div className="lg:w-5/12 ml-auto">
                  <p className="text-xl md:text-2xl leading-[1.45] tracking-[-0.02em] text-white/78 transition-colors duration-500 group-hover:text-white">
                    {p.desc}
                  </p>
                </div>
              </li>
            </RevealOnScroll>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Process;
