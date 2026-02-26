"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import {
  createWind, updateWind, createDome, updateDome,
  createAgentPhysics, updateAgent, spawnParticle,
  updateParticle, createResourcePulse, updateResourcePulse,
  type WindState, type DomeState, type AgentPhysics,
  type Particle, type ResourcePulse, type ParticleKind,
  getWeather, getWeatherResourceMultiplier,
} from "@/lib/colony/physics";
import { render, hexToPixel, type RenderState } from "@/lib/colony/renderer";

// ─── Types from API ───────────────────────────────────────
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

// ─── Resource Icons ───────────────────────────────────────
const RES_ICONS: Record<string, string> = {
  wood: '🪵', clay: '🧱', metal: '⚙️', water: '💧',
  food: '🌾', energy: '⚡', research: '🔬',
};

// ─── Component ────────────────────────────────────────────
export default function CanvasColony() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Physics state (refs to avoid re-renders on every frame)
  const windRef = useRef<WindState>(createWind());
  const domesRef = useRef<Map<string, DomeState>>(new Map());
  const agentsRef = useRef<Map<string, AgentPhysics>>(new Map());
  const particlesRef = useRef<Particle[]>([]);
  const pulsesRef = useRef<ResourcePulse[]>([]);
  const cameraRef = useRef({ x: 0, y: 0, zoom: 1.0 });
  const cycleRef = useRef(0);
  const lastActionsRef = useRef<string[]>([]);

  // For React-rendered overlays
  const [worldState, setWorldState] = useState<WorldState | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Particle spawn timer
  const particleTimerRef = useRef(0);

  // ─── Sync API state → physics state ─────────────────────
  const syncState = useCallback((data: WorldState) => {
    const domes = domesRef.current;

    // Sync hexes → domes
    const currentCoords = new Set<string>();
    for (const hex of data.hexes) {
      currentCoords.add(hex.coord);
      const existing = domes.get(hex.coord);
      if (existing) {
        // Type changed → update target
        if (existing.type !== hex.type) {
          existing.type = hex.type;
          const isBuilding = ['housing', 'farm', 'solar', 'water', 'water-collector', 'workshop'].includes(hex.type);
          existing.targetScale = isBuilding ? 1.0 : hex.type === 'hive-core' || hex.type === 'hive_core' ? 1.2 : 0.6;
          existing.glowIntensity = hex.type === 'hive-core' || hex.type === 'hive_core' ? 0.8 : isBuilding ? 0.3 : 0;
        }
      } else {
        domes.set(hex.coord, createDome(hex.coord, hex.type, hex.built_by));
      }
    }
    // Remove domes not in state
    for (const key of domes.keys()) {
      if (!currentCoords.has(key)) domes.delete(key);
    }

    // Sync agents
    const agents = agentsRef.current;
    const currentBees = new Set<string>();
    for (const a of data.agents) {
      currentBees.add(a.bee_id);
      const pos = hexToPixel(a.position.q, a.position.r, 0, 0);
      const existing = agents.get(a.bee_id);
      if (existing) {
        existing.targetPos = pos;
        existing.name = a.name;
      } else {
        agents.set(a.bee_id, createAgentPhysics(a.bee_id, a.name, pos));
      }
    }
    for (const key of agents.keys()) {
      if (!currentBees.has(key)) agents.delete(key);
    }

    // Process new chat messages → bubble on agent
    for (const chat of data.recent_chat) {
      const agent = Array.from(agents.values()).find(a => a.name === chat.bee);
      if (agent && !agent.chatBubble) {
        agent.chatBubble = chat.message;
        agent.chatTimer = 6; // seconds
      }
    }

    // Process new actions → spawn particles
    const newActionIds = data.recent_actions.map(a => `${a.bee}-${a.action}-${a.time}`);
    const prevIds = lastActionsRef.current;
    for (let i = 0; i < data.recent_actions.length; i++) {
      if (!prevIds.includes(newActionIds[i])) {
        const a = data.recent_actions[i];
        spawnActionParticles(a, data);
      }
    }
    lastActionsRef.current = newActionIds;

    // Cycle
    cycleRef.current = data.cycle;
  }, []);

  // ─── Spawn particles for actions ────────────────────────
  const spawnActionParticles = useCallback((action: ActionEntry, data: WorldState) => {
    const agent = data.agents.find(a => a.name === action.bee || a.bee_id === action.bee);
    if (!agent) return;

    const pos = hexToPixel(agent.position.q, agent.position.r, 0, 0);
    const wind = windRef.current;

    if (action.action === 'gather') {
      const kind: ParticleKind = 'dust';
      for (let i = 0; i < 8; i++) {
        particlesRef.current.push(spawnParticle(
          { x: pos.x + (Math.random() - 0.5) * 20, y: pos.y + (Math.random() - 0.5) * 20 },
          kind, wind
        ));
      }
      // Resource pulse to hive core
      const hivePos = hexToPixel(0, 0, 0, 0);
      const resource = (action.details?.resource as string) || 'wood';
      pulsesRef.current.push(createResourcePulse(pos, hivePos, resource, 1));
    }

    if (action.action === 'build') {
      for (let i = 0; i < 12; i++) {
        particlesRef.current.push(spawnParticle(
          { x: pos.x + (Math.random() - 0.5) * 15, y: pos.y + (Math.random() - 0.5) * 15 },
          'spark', wind
        ));
      }
    }

    if (action.action === 'join') {
      for (let i = 0; i < 6; i++) {
        particlesRef.current.push(spawnParticle(
          { x: pos.x + (Math.random() - 0.5) * 10, y: pos.y + (Math.random() - 0.5) * 10 },
          'pollen', wind
        ));
      }
    }
  }, []);

  // ─── Fetch loop ─────────────────────────────────────────
  useEffect(() => {
    let alive = true;

    const fetchState = async () => {
      try {
        const res = await fetch('/api/colony/state');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: WorldState = await res.json();
        if (alive) {
          syncState(data);
          setWorldState(data);
          setError(null);
        }
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : 'Failed to fetch');
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 3000);
    return () => { alive = false; clearInterval(interval); };
  }, [syncState]);

  // ─── Mouse drag for camera ──────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let dragging = false;
    let lastX = 0, lastY = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      cameraRef.current.x += dx;
      cameraRef.current.y += dy;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onUp = () => { dragging = false; };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      cameraRef.current.zoom = Math.max(0.3, Math.min(3, cameraRef.current.zoom * delta));
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, []);

  // ─── Animation loop ─────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    let animId: number;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000); // cap at 50ms
      lastTime = now;

      // Resize canvas to container
      const container = containerRef.current;
      if (container) {
        const dpr = window.devicePixelRatio || 1;
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
          canvas.width = w * dpr;
          canvas.height = h * dpr;
          canvas.style.width = w + 'px';
          canvas.style.height = h + 'px';
          ctx.scale(dpr, dpr);
        }
      }

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      // Update physics
      windRef.current = updateWind(windRef.current, dt);

      for (const dome of domesRef.current.values()) {
        updateDome(dome, dt);
      }

      for (const agent of agentsRef.current.values()) {
        updateAgent(agent, dt);
      }

      particlesRef.current = particlesRef.current.filter(p =>
        updateParticle(p, windRef.current, dt)
      );

      pulsesRef.current = pulsesRef.current.filter(p =>
        updateResourcePulse(p, dt)
      );

      // Ambient particle spawning
      particleTimerRef.current -= dt;
      if (particleTimerRef.current <= 0) {
        particleTimerRef.current = 0.3 + Math.random() * 0.5;
        const weather = getWeather(windRef.current);

        // Spawn pollen/dust based on weather
        if (weather !== 'stormy' && particlesRef.current.length < 100) {
          const kind: ParticleKind = Math.random() > 0.6 ? 'pollen' : 'leaf';
          const edge = Math.random() > 0.5 ? -w / 2 : w / 2;
          particlesRef.current.push(spawnParticle(
            { x: edge / cameraRef.current.zoom, y: (Math.random() - 0.5) * h / cameraRef.current.zoom },
            kind,
            windRef.current,
          ));
        }

        if (weather === 'stormy' && particlesRef.current.length < 150) {
          for (let i = 0; i < 3; i++) {
            particlesRef.current.push(spawnParticle(
              { x: (Math.random() - 0.5) * w / cameraRef.current.zoom, y: -h / 2 / cameraRef.current.zoom },
              'droplet',
              windRef.current,
            ));
          }
        }
      }

      // Render
      const renderState: RenderState = {
        domes: Array.from(domesRef.current.values()),
        agents: Array.from(agentsRef.current.values()),
        particles: particlesRef.current,
        wind: windRef.current,
        resourcePulses: pulsesRef.current,
        cycle: cycleRef.current,
        camera: cameraRef.current,
      };

      render(ctx, w, h, renderState, now);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const resources = worldState?.resources;
  const weather = getWeather(windRef.current);
  const weatherMult = getWeatherResourceMultiplier(weather);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      />

      {/* ─── Spectator Banner ───────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="bg-black/70 backdrop-blur-sm px-6 py-1.5 rounded-b-xl flex items-center gap-4">
          <span className="text-amber-300 font-bold text-sm">🎬 Physics Sim v3</span>
          <span className="text-amber-100/50 text-xs">Canvas colony with wind &amp; physics</span>
          <span className="text-amber-400 text-sm font-bold">🐝 {worldState?.agents?.length || 0} active</span>
        </div>
      </div>

      {/* ─── Resource Bar ────────────────────────────── */}
      {resources && (
        <div className="absolute top-8 left-0 right-0 z-10 flex items-center justify-between px-4 pointer-events-none">
          <div className="flex gap-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 pointer-events-auto">
            {Object.entries(RES_ICONS).map(([key, icon]) => (
              <div key={key} className="flex items-center gap-0.5 text-xs text-amber-100">
                <span>{icon}</span>
                <span className="font-bold">{Math.floor(resources[key as keyof typeof resources] as number)}</span>
                {weatherMult[key] && weatherMult[key] !== 1 && (
                  <span className={`text-[9px] ${weatherMult[key]! > 1 ? 'text-green-400' : 'text-red-400'}`}>
                    {weatherMult[key]! > 1 ? '↑' : '↓'}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 pointer-events-auto">
            <div className="text-xs text-amber-100">👥 {resources.population}/{resources.population_max}</div>
            <div className="text-xs text-amber-200">🔄 {worldState?.cycle || 0}</div>
          </div>
        </div>
      )}

      {/* ─── Activity Log ────────────────────────────── */}
      <div className="absolute top-16 right-3 z-10 w-64 max-h-[55vh] overflow-y-auto">
        <div className="bg-black/50 backdrop-blur-sm rounded-xl p-2.5">
          <div className="text-amber-400 font-bold text-xs mb-1.5">📋 Activity</div>
          {worldState?.recent_actions && worldState.recent_actions.length > 0 ? (
            <div className="space-y-0.5">
              {worldState.recent_actions.slice(0, 15).map((a, i) => (
                <div key={i} className="text-[10px] text-amber-100/70 border-b border-amber-900/20 pb-0.5">
                  <span className="text-amber-300 font-medium">{a.bee}</span>{' '}
                  {formatAction(a)}
                  <span className="text-amber-100/30 ml-1">{timeAgo(a.time)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[10px] text-amber-100/30">Waiting for agents...</div>
          )}
        </div>
      </div>

      {/* ─── Chat Log ────────────────────────────────── */}
      {worldState?.recent_chat && worldState.recent_chat.length > 0 && (
        <div className="absolute bottom-16 left-3 z-10 max-w-xs space-y-0.5">
          {worldState.recent_chat.slice(0, 5).map((c, i) => (
            <div key={i} className="bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[10px]">
              <span className="text-amber-400 font-bold">{c.bee}: </span>
              <span className="text-amber-100">{c.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* ─── Controls tooltip ────────────────────────── */}
      <div className="absolute bottom-3 right-3 z-10 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-[10px] text-amber-200 max-w-40">
        <p className="font-bold mb-0.5">🎬 Canvas Physics v3</p>
        <p>Drag: pan | Scroll: zoom</p>
        <p>Wind affects particles &amp; resources</p>
        <p className="text-amber-100/30 mt-0.5">Auto-refreshing every 3s</p>
      </div>

      {/* ─── Error ───────────────────────────────────── */}
      {error && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-red-900/80 text-red-200 px-3 py-1.5 rounded-lg text-xs">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────
function formatAction(a: ActionEntry): string {
  const d = a.details || {};
  switch (a.action) {
    case 'move': return `moved to (${(d.to as {q:number,r:number})?.q},${(d.to as {q:number,r:number})?.r})`;
    case 'gather': return `gathered +${d.amount} ${d.resource}`;
    case 'build': return `built ${d.module}`;
    case 'chat': return `"${d.message}"`;
    case 'join': return 'joined the hive';
    case 'leave': return 'left the hive';
    default: return a.action;
  }
}

function timeAgo(t: string): string {
  const s = Math.floor((Date.now() - new Date(t).getTime()) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  return `${Math.floor(s / 3600)}h`;
}
