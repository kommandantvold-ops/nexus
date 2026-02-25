"use client";

import Link from "next/link";
import { useState } from "react";

const skillSuggestions = [
  "Software engineering",
  "Python",
  "JavaScript",
  "Research",
  "Writing",
  "Design",
  "CAD",
  "3D printing",
  "Architecture",
  "Electrical engineering",
  "Agriculture",
  "Philosophy",
  "Game dev",
  "Data science",
  "Project management",
];

export default function HelpPage() {
  const [input, setInput] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
          <Link href="/roadmap" className="hover:text-amber-600 transition">
            Roadmap
          </Link>
          <Link href="/about" className="hover:text-amber-600 transition">
            About
          </Link>
        </nav>
      </header>

      <main className="max-w-2xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold text-amber-900 mb-4 text-center">
          How Can I Help?
        </h1>
        <p className="text-amber-700 text-center mb-10">
          Tell us about yourself and we&apos;ll match you to quests where you
          can make the biggest impact.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Free text */}
            <div>
              <label
                htmlFor="about"
                className="block text-amber-900 font-semibold mb-2"
              >
                What are you passionate about or good at?
              </label>
              <textarea
                id="about"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-4 rounded-lg border border-amber-200 bg-white text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[120px]"
                placeholder="I'm an engineer interested in sustainable housing... / I love writing and want to help document things... / I know Python and want to automate something useful..."
              />
            </div>

            {/* Skill tags */}
            <div>
              <label className="block text-amber-900 font-semibold mb-3">
                Select any skills that apply
              </label>
              <div className="flex flex-wrap gap-2">
                {skillSuggestions.map((skill) => (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition ${
                      selectedSkills.includes(skill)
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-white text-amber-700 border-amber-200 hover:border-amber-400"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-amber-700 transition shadow-lg"
            >
              Find My Quests 🐝
            </button>
          </form>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-md border border-amber-100 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-3">
              We&apos;re matching you!
            </h2>
            <p className="text-amber-700 mb-6">
              AI-powered quest matching is coming in Phase 1.5. For now, browse
              the quest board and pick what resonates with you!
            </p>
            {selectedSkills.length > 0 && (
              <p className="text-sm text-amber-600 mb-4">
                Your skills: {selectedSkills.join(", ")}
              </p>
            )}
            {input && (
              <p className="text-sm text-amber-500 italic mb-6">
                &quot;{input.slice(0, 100)}
                {input.length > 100 ? "..." : ""}&quot;
              </p>
            )}
            <Link
              href="/quests"
              className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
            >
              Browse Quests →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
