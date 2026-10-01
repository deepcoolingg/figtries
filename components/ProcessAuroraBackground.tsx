"use client";

import React from "react";

const ProcessAuroraBackground: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_26%,rgba(255,255,255,0.28),transparent_50%),radial-gradient(circle_at_78%_72%,rgba(134,243,253,0.24),transparent_48%)]" />

      <div className="absolute -left-24 top-12 h-[340px] w-[340px] rounded-full bg-white/24 blur-[95px] animate-blob" />
      <div className="absolute left-[36%] top-1/3 h-[400px] w-[400px] rounded-full bg-kota-cyan/28 blur-[120px] animate-blob animation-delay-2000" />
      <div className="absolute -right-28 bottom-4 h-[420px] w-[420px] rounded-full bg-kota-blue/26 blur-[125px] animate-blob animation-delay-4000" />

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(127,111,161,0.22),transparent_26%,transparent_72%,rgba(127,111,161,0.28))]" />
    </div>
  );
};

export default ProcessAuroraBackground;