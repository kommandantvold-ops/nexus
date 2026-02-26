import Link from "next/link";

interface HoneyItem {
  source: string;
  title: string;
  description: string;
  status: "crystallizing" | "ready" | "idea";
}

const honey: HoneyItem[] = [
  {
    source: "SAMPHUN",
    title: "Modular Dome Franchise Kit",
    description:
      "Open-source plans + material spec → local micro-factories in any city. Potential revenue model for builders who want to manufacture and sell habitat modules.",
    status: "idea",
  },
  {
    source: "Digital-Human Symbiosis",
    title: "Open Collaboration Protocol v0.1",
    description:
      "Standards for human-AI collaborative work: attribution, consent, communication patterns. Already drafted from SQ-DHS-001. Ready for first swarm test.",
    status: "crystallizing",
  },
  {
    source: "SAMPHUN",
    title: "Recycled Plastic Panel Database",
    description:
      "Community-contributed test results for different recycled plastic formulations. Could become a reference standard for sustainable building.",
    status: "idea",
  },
  {
    source: "Open Transport",
    title: "Open Vehicle Design Library",
    description:
      "Parametric CAD files for sustainable vehicle components. Build-your-own starting point for makers worldwide.",
    status: "idea",
  },
  {
    source: "Nexus Platform",
    title: "Quest Engine as a Service",
    description:
      "The quest matching + swarm coordination system itself. Other communities could use it for their own innovation hives.",
    status: "idea",
  },
];

const statusStyles: Record<string, { bg: string; label: string }> = {
  crystallizing: { bg: "bg-yellow-100 text-yellow-800", label: "Crystallizing" },
  ready: { bg: "bg-green-100 text-green-800", label: "Ready" },
  idea: { bg: "bg-amber-100 text-amber-700", label: "Seed" },
};

export default function HoneyPage() {
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
          <Link href="/honey" className="font-semibold text-amber-600">
            Honey
          </Link>
          <Link href="/about" className="hover:text-amber-600 transition">
            About
          </Link>
          <Link href="/blog" className="hover:text-amber-600 transition">
            Blog
          </Link>
          <Link href="/join" className="hover:text-amber-600 transition">
            Join
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold text-amber-900 mb-2">
          🍯 Honey
        </h1>
        <p className="text-amber-700 mb-10">
          Value crystallizing from the swarm. When quest work produces something
          tangible — a tool, a standard, a product — it appears here. This is
          how open collaboration becomes open abundance.
        </p>

        <div className="space-y-4">
          {honey.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm border border-amber-100 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-xs font-mono text-amber-500">
                  {item.source}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    statusStyles[item.status].bg
                  }`}
                >
                  {statusStyles[item.status].label}
                </span>
              </div>
              <h3 className="text-lg font-bold text-amber-900 mb-1">
                {item.title}
              </h3>
              <p className="text-amber-700 text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-amber-100 rounded-xl p-8 text-center border border-amber-200">
          <div className="text-3xl mb-3">🌱</div>
          <h3 className="text-lg font-bold text-amber-900 mb-2">
            This section grows with the swarm
          </h3>
          <p className="text-amber-700 text-sm max-w-lg mx-auto">
            As contributors submit solutions to quests, the valuable outputs
            crystallize here. Every solved quest produces honey — knowledge,
            tools, designs, and protocols that benefit everyone.
          </p>
          <Link
            href="/quests"
            className="inline-block mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition"
          >
            Contribute to a quest →
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
