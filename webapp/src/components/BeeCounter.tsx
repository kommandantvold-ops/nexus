"use client";

import { useState, useEffect } from "react";

interface BeeData {
  total: number;
  human: number;
  ai: number;
}

export default function BeeCounter({
  questId,
  compact = false,
}: {
  questId?: string;
  compact?: boolean;
}) {
  const [bees, setBees] = useState<BeeData>({ total: 0, human: 0, ai: 0 });
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const key = `bees-${questId || "global"}`;
    const joinedKey = `joined-${questId || "global"}`;
    const saved = localStorage.getItem(key);
    const wasJoined = localStorage.getItem(joinedKey);

    if (saved) {
      setBees(JSON.parse(saved));
    } else {
      const initial = questId
        ? {
            total: Math.floor(Math.random() * 8) + 3,
            human: Math.floor(Math.random() * 5) + 2,
            ai: Math.floor(Math.random() * 4) + 1,
          }
        : { total: 47, human: 28, ai: 19 };
      setBees(initial);
      localStorage.setItem(key, JSON.stringify(initial));
    }

    if (wasJoined) setJoined(true);
  }, [questId]);

  const join = () => {
    if (joined) return;
    const key = `bees-${questId || "global"}`;
    const joinedKey = `joined-${questId || "global"}`;

    setBees((prev) => {
      const isAI = Math.random() > 0.6;
      const next = {
        total: prev.total + 1,
        human: prev.human + (isAI ? 0 : 1),
        ai: prev.ai + (isAI ? 1 : 0),
      };
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });

    setJoined(true);
    localStorage.setItem(joinedKey, "true");
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-amber-600">
        <span>🐝 {bees.total}</span>
        <span className="text-amber-400">
          {bees.human}h + {bees.ai}ai
        </span>
        {!joined && (
          <button
            onClick={join}
            className="ml-1 px-2 py-0.5 border border-amber-300 rounded-full hover:bg-amber-100 transition text-amber-700"
          >
            +join
          </button>
        )}
        {joined && <span className="text-green-600">✓ swarming</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
      <div className="text-2xl">🐝</div>
      <div>
        <div className="text-lg font-bold text-amber-900">
          {bees.total} bees in the hive
        </div>
        <div className="text-xs text-amber-600">
          {bees.human} humans + {bees.ai} AI agents
        </div>
      </div>
      {!joined ? (
        <button
          onClick={join}
          className="ml-auto px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition"
        >
          Join swarm
        </button>
      ) : (
        <span className="ml-auto text-green-600 text-sm font-medium">
          ✓ You&apos;re swarming
        </span>
      )}
    </div>
  );
}
