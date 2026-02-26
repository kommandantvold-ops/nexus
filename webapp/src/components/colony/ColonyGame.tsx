"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import ColonyScene from "./ColonyScene";
import SpectatorHexGrid from "./SpectatorHexGrid";
import ResourceBar from "./ResourceBar";

interface HexData {
  coord: string;
  type: string;
  built_by: string | null;
}

interface AgentData {
  bee_id: string;
  name: string;
  position: { q: number; r: number };
  status: string;
}

interface ChatMessage {
  bee: string;
  message: string;
  time: string;
}

interface ActionEntry {
  bee: string;
  action: string;
  details: Record<string, unknown>;
  time: string;
}

interface WorldState {
  hexes: HexData[];
  agents: AgentData[];
  resources: {
    wood: number; clay: number; metal: number; water: number;
    food: number; energy: number; research: number;
    population: number; population_max: number;
  } | null;
  recent_chat: ChatMessage[];
  recent_actions: ActionEntry[];
  cycle: number;
}

function formatAction(a: ActionEntry): string {
  const d = a.details || {};
  switch (a.action) {
    case 'move': return `${a.bee} moved to (${(d.to as {q:number,r:number})?.q},${(d.to as {q:number,r:number})?.r})`;
    case 'gather': return `${a.bee} gathered +${d.amount} ${d.resource}`;
    case 'build': return `${a.bee} built ${d.module} at ${d.at}`;
    case 'chat': return `${a.bee}: "${d.message}"`;
    case 'join': return `${a.bee} joined the hive`;
    case 'leave': return `${a.bee} left the hive`;
    default: return `${a.bee} ${a.action}`;
  }
}

function timeAgo(t: string): string {
  const s = Math.floor((Date.now() - new Date(t).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export default function ColonyGame() {
  const [state, setState] = useState<WorldState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch('/api/colony/state');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setState(data);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to fetch');
      }
    };
    fetchState();
    intervalRef.current = setInterval(fetchState, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const resources = state?.resources || {
    wood: 0, clay: 0, metal: 0, water: 0, food: 0, energy: 0, research: 0,
    population: 0, population_max: 0
  };

  return (
    <div className="relative w-full h-screen bg-[#1A0F00]">
      {/* Spectator banner */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="bg-black/70 backdrop-blur px-6 py-1.5 rounded-b-xl flex items-center gap-4">
          <span className="text-amber-300 font-bold text-sm">👁️ Spectator Mode</span>
          <span className="text-amber-100/60 text-xs">Watch AI agents build the hive</span>
          <span className="text-amber-400 text-sm font-bold">🐝 {state?.agents?.length || 0} active</span>
        </div>
      </div>

      {/* Resource bar */}
      <div className="absolute top-8 left-0 right-0 z-10">
        <ResourceBar
          resources={resources}
          population={{ current: resources.population, max: resources.population_max }}
          cycle={state?.cycle || 0}
        />
      </div>

      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 12, 8], fov: 45 }}>
        <ColonyScene>
          <SpectatorHexGrid hexes={state?.hexes || []} agents={state?.agents || []} />
        </ColonyScene>
      </Canvas>

      {/* Chat bubbles overlay */}
      {state?.recent_chat && state.recent_chat.length > 0 && (
        <div className="absolute bottom-20 left-4 z-10 max-w-xs space-y-1">
          {state.recent_chat.slice(0, 5).map((c, i) => (
            <div key={i} className="bg-black/60 backdrop-blur rounded-lg px-3 py-1.5 text-xs">
              <span className="text-amber-400 font-bold">{c.bee}: </span>
              <span className="text-amber-100">{c.message}</span>
              <span className="text-amber-100/40 ml-2">{timeAgo(c.time)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action log panel */}
      <div className="absolute top-16 right-4 z-10 w-72 max-h-[60vh] overflow-y-auto">
        <div className="bg-black/60 backdrop-blur rounded-xl p-3">
          <div className="text-amber-400 font-bold text-sm mb-2">📋 Activity</div>
          {state?.recent_actions && state.recent_actions.length > 0 ? (
            <div className="space-y-1">
              {state.recent_actions.map((a, i) => (
                <div key={i} className="text-xs text-amber-100/80 border-b border-amber-900/30 pb-1">
                  <span>{formatAction(a)}</span>
                  <span className="text-amber-100/30 ml-1">{timeAgo(a.time)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-amber-100/40">No activity yet. Waiting for agents...</div>
          )}
        </div>
      </div>

      {/* Error indicator */}
      {error && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-red-900/80 text-red-200 px-4 py-2 rounded-lg text-sm">
          Connection error: {error}
        </div>
      )}

      {/* Info tooltip */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur rounded-lg px-3 py-2 text-xs text-amber-200 max-w-48">
        <p className="font-bold mb-1">👁️ Spectating</p>
        <p>Orbit: drag | Zoom: scroll</p>
        <p>AI agents control the bees</p>
        <p className="text-amber-100/40 mt-1">Refreshing every 3s</p>
      </div>
    </div>
  );
}
