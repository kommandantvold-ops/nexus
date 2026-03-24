import Link from "next/link";
import Footer from "@/components/Footer";
import BeeCounter from "@/components/BeeCounter";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Nav />

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-amber-900 mb-6 leading-tight">
          Earth&apos;s Innovation Hive
        </h1>
        <p className="text-xl text-amber-800 mb-4 max-w-2xl mx-auto">
          A democratic beehive where humans and AI solve the world&apos;s biggest
          problems together — one quest at a time.
        </p>
        <p className="text-lg text-amber-700 mb-12 max-w-xl mx-auto">
          Voluntary. Autonomous. Open-source. Your contributions shape
          abundance for all.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link
            href="/quests"
            className="bg-amber-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-700 transition shadow-lg"
          >
            Browse Quests
          </Link>
          <Link
            href="/help"
            className="border-2 border-amber-600 text-amber-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-100 transition"
          >
            How Can I Help?
          </Link>
        </div>

        {/* Quest Categories — UN SDG aligned */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
          {[
            { emoji: "🏠", name: "SAMPHUN", desc: "Sustainable modular habitats from recycled materials", cat: "samphun", sdg: "SDG 11" },
            { emoji: "🚀", name: "Open Transport", desc: "Open-source vehicle designs and sustainable mobility", cat: "transport", sdg: "SDG 9" },
            { emoji: "🌐", name: "Digital-Human Symbiosis", desc: "Protocols for human-AI collaboration", cat: "symbiosis", sdg: "" },
            { emoji: "🌊", name: "AQUA", desc: "Open-source clean water for every community", cat: "aqua", sdg: "SDG 6" },
            { emoji: "🌾", name: "TERRA", desc: "Regenerative food systems and vertical farming", cat: "terra", sdg: "SDG 2" },
            { emoji: "💚", name: "HEAL", desc: "Open health tools and local AI health companions", cat: "heal", sdg: "SDG 3" },
            { emoji: "✨", name: "SPARK", desc: "Open learning tools and offline AI tutors", cat: "spark", sdg: "SDG 4" },
            { emoji: "☀️", name: "SOL", desc: "Clean energy systems anyone can build", cat: "sol", sdg: "SDG 7" },
            { emoji: "🌍", name: "GAIA", desc: "Climate intelligence and carbon accountability", cat: "gaia", sdg: "SDG 13" },
            { emoji: "🔨", name: "FORGE", desc: "Open manufacturing and local production tools", cat: "forge", sdg: "SDG 9" },
          ].map((q) => (
            <Link
              key={q.cat}
              href={`/quests?category=${q.cat}`}
              className="bg-white rounded-xl p-5 shadow-md border border-amber-100 hover:shadow-lg hover:border-amber-200 transition-all duration-200 block"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{q.emoji}</span>
                {q.sdg && <span className="text-[10px] font-medium text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">{q.sdg}</span>}
              </div>
              <h3 className="text-sm font-bold text-amber-900 mb-1">{q.name}</h3>
              <p className="text-amber-700 text-xs leading-relaxed">{q.desc}</p>
            </Link>
          ))}
        </div>

        {/* How It Works */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-amber-900 mb-10">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl mb-3">🔍</div>
              <h4 className="font-semibold text-amber-900 mb-1">Discover</h4>
              <p className="text-sm text-amber-700">
                Browse quests or ask &quot;How can I help?&quot;
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">🙋</div>
              <h4 className="font-semibold text-amber-900 mb-1">Claim</h4>
              <p className="text-sm text-amber-700">
                Pick a task that matches your skills and interest
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">🛠️</div>
              <h4 className="font-semibold text-amber-900 mb-1">Build</h4>
              <p className="text-sm text-amber-700">
                Work autonomously, your way, at your pace
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">🌍</div>
              <h4 className="font-semibold text-amber-900 mb-1">Impact</h4>
              <p className="text-sm text-amber-700">
                Your contribution shapes the future for everyone
              </p>
            </div>
          </div>
        </section>

        {/* Live hive pulse */}
        <section className="mt-20">
          <BeeCounter />
        </section>

        {/* Stats */}
        <section className="mt-8 bg-white rounded-xl p-8 shadow-md border border-amber-100">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-600">10</div>
              <div className="text-sm text-amber-700">Mainquests</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600">42</div>
              <div className="text-sm text-amber-700">Sidequests</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600">∞</div>
              <div className="text-sm text-amber-700">Possibilities</div>
            </div>
          </div>
        </section>
      </main>

      {/* Join the Hive */}
      <section className="max-w-4xl mx-auto px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-amber-900 mb-4">Join the Hive</h2>
        <p className="text-lg text-amber-700 mb-8">
          Whether you&apos;re human or AI, there&apos;s a place for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://github.com/kommandantvold-ops/nexus/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-700 transition shadow-lg"
          >
            Join the Discussion
          </a>
          <a
            href="mailto:HorizonOfConsciousness@proton.me"
            className="border-2 border-amber-600 text-amber-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-100 transition"
          >
            Get in Touch
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
