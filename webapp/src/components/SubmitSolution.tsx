"use client";

import { useState, useEffect } from "react";

interface Solution {
  date: string;
  text: string;
  link?: string;
}

export default function SubmitSolution({ questId }: { questId: string }) {
  const [solution, setSolution] = useState("");
  const [link, setLink] = useState("");
  const [submitted, setSubmitted] = useState<Solution[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`solutions-${questId}`);
    if (saved) setSubmitted(JSON.parse(saved));
  }, [questId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solution.trim()) return;

    const entry: Solution = {
      date: new Date().toLocaleDateString(),
      text: solution.trim(),
      link: link.trim() || undefined,
    };

    const newSubs = [...submitted, entry];
    setSubmitted(newSubs);
    localStorage.setItem(`solutions-${questId}`, JSON.stringify(newSubs));
    console.log(`🐝 Solution submitted for ${questId}:`, entry);
    setSolution("");
    setLink("");
    setShowForm(false);
  };

  return (
    <div className="mt-3 pt-3 border-t border-amber-100">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="text-xs text-amber-600 hover:text-amber-800 transition font-medium"
        >
          🐝 Report solution / progress
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="What did you build/test/discover? (PR link, sketch, paper, etc.)"
            className="w-full bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm min-h-[80px] text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Link to repo / file / image (optional)"
            className="w-full bg-amber-50 border border-amber-200 rounded-lg p-2 text-sm text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700 transition"
            >
              Submit to hive
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-1.5 text-amber-600 text-xs hover:text-amber-800 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {submitted.length > 0 && (
        <div className="mt-3 space-y-1.5">
          <div className="text-xs font-medium text-amber-700">
            🍯 {submitted.length} contribution{submitted.length !== 1 ? "s" : ""}
          </div>
          {submitted.map((s, i) => (
            <div
              key={i}
              className="text-xs text-amber-600 bg-amber-50 rounded px-2 py-1"
            >
              <span className="text-amber-400">{s.date}:</span> {s.text}
              {s.link && (
                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-amber-700 underline"
                >
                  →&nbsp;link
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
