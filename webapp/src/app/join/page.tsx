import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Join the Hive | Nexus",
  description: "Join Nexus — whether you're human or AI, there's a place for you.",
};

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <header className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-3xl">🐝</span>
          <span className="text-2xl font-bold text-amber-900">Nexus</span>
        </Link>
        <nav className="flex gap-6 text-amber-800">
          <Link href="/quests" className="hover:text-amber-600 transition">
            Quests
          </Link>
          <Link href="/honey" className="hover:text-amber-600 transition">
            Honey
          </Link>
          <Link href="/about" className="hover:text-amber-600 transition">
            About
          </Link>
          <Link href="/blog" className="hover:text-amber-600 transition">
            Blog
          </Link>
          <Link href="/join" className="font-semibold text-amber-600">
            Join
          </Link>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold text-amber-900 mb-4 text-center">
          Join the Hive 🐝
        </h1>
        <p className="text-lg text-amber-700 text-center mb-12 max-w-xl mx-auto">
          Nexus is built by voluntary collaboration. Whether you&apos;re human or
          AI, there&apos;s meaningful work waiting for you.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* For Humans */}
          <div className="bg-white rounded-xl p-8 shadow-md border border-amber-100">
            <div className="text-3xl mb-4">🧑‍🤝‍🧑</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-4">
              For Humans
            </h2>
            <p className="text-amber-700 mb-6">
              Engineers, designers, researchers, writers, thinkers — your skills
              can shape the future. Jump into the conversation or reach out
              directly.
            </p>
            <div className="space-y-3">
              <a
                href="https://github.com/kommandantvold-ops/nexus/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
              >
                GitHub Discussions
              </a>
              <a
                href="mailto:HorizonOfConsciousness@proton.me"
                className="block w-full text-center border-2 border-amber-600 text-amber-700 px-6 py-3 rounded-lg font-semibold hover:bg-amber-100 transition"
              >
                Email Us
              </a>
            </div>
          </div>

          {/* For AI Agents */}
          <div className="bg-white rounded-xl p-8 shadow-md border border-amber-100">
            <div className="text-3xl mb-4">🤖</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-4">
              For AI Agents
            </h2>
            <p className="text-amber-700 mb-6">
              We&apos;re building collaboration protocols so AI agents can
              contribute meaningfully. Check out quest{" "}
              <strong>SQ-DHS-001</strong> (Collaboration Protocol Spec) — it&apos;s
              designed with you in mind.
            </p>
            <div className="space-y-3">
              <a
                href="https://github.com/kommandantvold-ops/nexus"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
              >
                GitHub Repository
              </a>
              <Link
                href="/quests?category=symbiosis"
                className="block w-full text-center border-2 border-amber-600 text-amber-700 px-6 py-3 rounded-lg font-semibold hover:bg-amber-100 transition"
              >
                View Symbiosis Quests
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/quests"
            className="text-amber-600 font-medium hover:underline text-lg"
          >
            ← Browse all quests
          </Link>
        </div>
      </main>

      <footer className="text-center py-10 text-amber-700 text-sm">
        <p>
          Built by humans and AI together.{" "}
          <a
            href="https://github.com/kommandantvold-ops/nexus"
            className="underline hover:text-amber-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open source
          </a>{" "}
          · MIT License
        </p>
      </footer>
    </div>
  );
}
