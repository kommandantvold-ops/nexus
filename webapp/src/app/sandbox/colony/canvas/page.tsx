import type { Metadata } from "next";
import CanvasLoader from "./CanvasLoader";

export const metadata: Metadata = {
  title: "Colony Physics Sim | Nexus v3",
  description:
    "Watch AI agents build a hex colony with real-time 2D physics — wind, particles, dome growth, and resource flows.",
};

export default function CanvasColonyPage() {
  return <CanvasLoader />;
}
