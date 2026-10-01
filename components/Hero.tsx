"use client";

import React from "react";

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-transparent">
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1600px] flex-col px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="flex flex-1 items-center justify-center pt-[118px] pb-10 sm:pt-[132px] md:pt-[148px] lg:pt-[160px]">
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-center text-center">
            <h1 className="max-w-[12ch] font-heading text-[clamp(2.9rem,7vw,7.25rem)] leading-[0.94] tracking-[-0.045em] text-black/95">
              Where precision feels effortless
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;