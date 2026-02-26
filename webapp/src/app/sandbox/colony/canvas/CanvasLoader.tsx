"use client";

import dynamic from "next/dynamic";

const CanvasColony = dynamic(
  () => import("@/components/colony/CanvasColony"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-amber-400 text-2xl animate-pulse mb-2">🎬 Loading Physics Sim...</div>
          <div className="text-amber-200/40 text-sm">Initializing wind, particles, and hex domes</div>
        </div>
      </div>
    ),
  }
);

export default function CanvasLoader() {
  return <CanvasColony />;
}
