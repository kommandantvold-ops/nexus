"use client";

import dynamic from "next/dynamic";

const ColonyGame = dynamic(() => import("@/components/colony/ColonyGame"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-[#1A0F00] flex items-center justify-center">
      <div className="text-amber-400 text-2xl animate-pulse">🐝 Loading Colony...</div>
    </div>
  ),
});

export default function ClientLoader() {
  return <ColonyGame />;
}
