import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Can I Help? | Nexus",
  description: "Find quests matching your skills and start contributing.",
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
