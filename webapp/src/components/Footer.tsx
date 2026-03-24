import Link from 'next/link'

export default function Footer() {
  return (
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
  )
}
