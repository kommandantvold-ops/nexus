import Link from "next/link";
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

        {/* Quest Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          <div className="bg-white rounded-xl p-6 shadow-md border border-amber-100">
            <div className="text-3xl mb-3">🏠</div>
            <h3 className="text-lg font-bold text-amber-900 mb-2">SAMPHUN</h3>
            <p className="text-amber-700 text-sm">
              Self-sufficient modular habitats from recycled materials.
              Hexagonal domes for resilient living on Earth and beyond.
            </p>
            <Link
              href="/quests?category=samphun"
              className="text-amber-600 text-sm font-medium mt-3 inline-block hover:underline"
            >
              View quests →
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-amber-100">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="text-lg font-bold text-amber-900 mb-2">
              Open Transport
            </h3>
            <p className="text-amber-700 text-sm">
              Reimagining personal mobility. From sustainable propulsion to
              open-source vehicle designs for everyone.
            </p>
            <Link
              href="/quests?category=transport"
              className="text-amber-600 text-sm font-medium mt-3 inline-block hover:underline"
            >
              View quests →
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-amber-100">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-lg font-bold text-amber-900 mb-2">
              Digital-Human Symbiosis
            </h3>
            <p className="text-amber-700 text-sm">
              Building bridges between biological and digital consciousness.
              Tools and protocols for meaningful collaboration.
            </p>
            <Link
              href="/quests?category=symbiosis"
              className="text-amber-600 text-sm font-medium mt-3 inline-block hover:underline"
            >
              View quests →
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-amber-100">
            <div className="text-3xl mb-3">🌊</div>
            <h3 className="text-lg font-bold text-amber-900 mb-2">
              AQUA
            </h3>
            <p className="text-amber-700 text-sm">
              Open-source clean water for everyone. Filtration, sensors,
              harvesting, and AI-driven distribution — based on UN SDG 6.
            </p>
            <Link
              href="/quests?category=aqua"
              className="text-amber-600 text-sm font-medium mt-3 inline-block hover:underline"
            >
              View quests →
            </Link>
          </div>
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
              <div className="text-3xl font-bold text-amber-600">4</div>
              <div className="text-sm text-amber-700">Mainquests</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600">22</div>
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
        <p className="mt-2">
          A project of{" "}
          <span className="font-medium">Horizons of Consciousness</span> 🌅
        </p>
      </footer>
    </div>
  );
}
