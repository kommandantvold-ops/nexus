/**
 * Nexus Colony Physics Engine (v3)
 *
 * Lightweight 2D physics for the colony canvas:
 * - Wind system (direction + strength, affects particles & resources)
 * - Particle system (pollen, dust, sparks, water droplets)
 * - Dome growth interpolation
 * - Agent movement with easing
 * - Resource flow visualization
 */

// ─── Vector2 ──────────────────────────────────────────────
export interface Vec2 {
  x: number;
  y: number;
}

export function vec2(x: number, y: number): Vec2 {
  return { x, y };
}

export function vec2Add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function vec2Scale(v: Vec2, s: number): Vec2 {
  return { x: v.x * s, y: v.y * s };
}

export function vec2Lerp(a: Vec2, b: Vec2, t: number): Vec2 {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function vec2Dist(a: Vec2, b: Vec2): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function vec2Normalize(v: Vec2): Vec2 {
  const len = Math.sqrt(v.x * v.x + v.y * v.y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

export function vec2Rotate(v: Vec2, angle: number): Vec2 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
}

// ─── Wind System ──────────────────────────────────────────
export interface WindState {
  direction: number;    // radians (0 = east, PI/2 = south)
  strength: number;     // 0-1 normalized
  gustTimer: number;    // time until next gust
  gustStrength: number; // current gust multiplier
  turbulence: number;   // noise in wind direction
}

export function createWind(): WindState {
  return {
    direction: Math.random() * Math.PI * 2,
    strength: 0.2 + Math.random() * 0.3,
    gustTimer: 3 + Math.random() * 5,
    gustStrength: 0,
    turbulence: 0,
  };
}

export function updateWind(wind: WindState, dt: number): WindState {
  // Slowly drift direction
  const dirDrift = (Math.random() - 0.5) * 0.3 * dt;
  let direction = wind.direction + dirDrift;

  // Gust logic
  let gustTimer = wind.gustTimer - dt;
  let gustStrength = wind.gustStrength;
  let strength = wind.strength;

  if (gustTimer <= 0) {
    gustStrength = 0.5 + Math.random() * 0.5;
    gustTimer = 4 + Math.random() * 8;
  }

  // Gust decays
  gustStrength = Math.max(0, gustStrength - dt * 0.3);

  // Base strength meanders
  strength += (Math.random() - 0.5) * 0.1 * dt;
  strength = Math.max(0.05, Math.min(0.8, strength));

  // Turbulence
  const turbulence = Math.sin(Date.now() * 0.001) * 0.15;

  return { direction, strength, gustTimer, gustStrength, turbulence };
}

export function getWindVector(wind: WindState): Vec2 {
  const total = wind.strength + wind.gustStrength;
  const angle = wind.direction + wind.turbulence;
  return {
    x: Math.cos(angle) * total,
    y: Math.sin(angle) * total,
  };
}

// ─── Particle System ──────────────────────────────────────
export type ParticleKind = 'pollen' | 'dust' | 'spark' | 'droplet' | 'leaf';

export interface Particle {
  pos: Vec2;
  vel: Vec2;
  life: number;     // 0-1, decays to 0
  maxLife: number;
  kind: ParticleKind;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  rotSpeed: number;
}

const PARTICLE_COLORS: Record<ParticleKind, string[]> = {
  pollen:  ['#FFD700', '#FFC107', '#FFB300'],
  dust:    ['#8B7355', '#A0826D', '#C4A882'],
  spark:   ['#FF6B35', '#FF8C42', '#FFD166'],
  droplet: ['#4FC3F7', '#29B6F6', '#03A9F4'],
  leaf:    ['#4CAF50', '#66BB6A', '#81C784'],
};

export function spawnParticle(
  pos: Vec2,
  kind: ParticleKind,
  wind: WindState,
): Particle {
  const colors = PARTICLE_COLORS[kind];
  const windVec = getWindVector(wind);
  const spread = 0.5 + Math.random() * 1.0;

  return {
    pos: { ...pos },
    vel: {
      x: windVec.x * spread + (Math.random() - 0.5) * 30,
      y: windVec.y * spread + (Math.random() - 0.5) * 30 - (kind === 'spark' ? 40 : 0),
    },
    life: 1,
    maxLife: kind === 'spark' ? 0.5 + Math.random() * 0.5 : 1.5 + Math.random() * 2,
    kind,
    size: kind === 'pollen' ? 1.5 + Math.random() * 2 :
          kind === 'dust' ? 2 + Math.random() * 3 :
          kind === 'spark' ? 1 + Math.random() * 2 :
          kind === 'leaf' ? 3 + Math.random() * 4 :
          2 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: 0.6 + Math.random() * 0.4,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 3,
  };
}

export function updateParticle(p: Particle, wind: WindState, dt: number): boolean {
  const windVec = getWindVector(wind);
  const windForce = 40;

  // Wind influence varies by kind
  const windScale = p.kind === 'leaf' ? 1.2 :
                    p.kind === 'pollen' ? 1.0 :
                    p.kind === 'dust' ? 0.8 :
                    p.kind === 'droplet' ? 0.4 : 0.2;

  p.vel.x += windVec.x * windForce * windScale * dt;
  p.vel.y += windVec.y * windForce * windScale * dt;

  // Gravity for droplets and sparks
  if (p.kind === 'droplet') p.vel.y += 60 * dt;
  if (p.kind === 'spark') p.vel.y += 30 * dt;

  // Damping
  p.vel.x *= 1 - 1.5 * dt;
  p.vel.y *= 1 - 1.5 * dt;

  p.pos.x += p.vel.x * dt;
  p.pos.y += p.vel.y * dt;

  p.life -= dt / p.maxLife;
  p.alpha = Math.max(0, p.life * 0.8);
  p.rotation += p.rotSpeed * dt;

  return p.life > 0;
}

// ─── Dome Growth ──────────────────────────────────────────
export interface DomeState {
  coord: string;
  type: string;
  targetScale: number;
  currentScale: number;
  pulsePhase: number;
  builtBy: string | null;
  glowIntensity: number;
}

export function createDome(coord: string, type: string, builtBy: string | null): DomeState {
  const isBuilding = ['housing', 'farm', 'solar', 'water', 'water-collector', 'workshop'].includes(type);
  return {
    coord,
    type,
    targetScale: isBuilding ? 1.0 : type === 'hive-core' || type === 'hive_core' ? 1.2 : 0.6,
    currentScale: 0.1, // starts small, grows
    pulsePhase: Math.random() * Math.PI * 2,
    builtBy,
    glowIntensity: type === 'hive-core' || type === 'hive_core' ? 0.8 : isBuilding ? 0.3 : 0,
  };
}

export function updateDome(dome: DomeState, dt: number): void {
  // Smooth growth toward target
  dome.currentScale += (dome.targetScale - dome.currentScale) * 2.0 * dt;
  dome.pulsePhase += dt * 1.5;
}

// ─── Agent Movement ───────────────────────────────────────
export interface AgentPhysics {
  beeId: string;
  name: string;
  currentPos: Vec2;
  targetPos: Vec2;
  velocity: Vec2;
  bobPhase: number;
  wingPhase: number;
  chatBubble: string | null;
  chatTimer: number;
  idleTimer: number;
  facing: number; // -1 left, 1 right
}

export function createAgentPhysics(beeId: string, name: string, pos: Vec2): AgentPhysics {
  return {
    beeId,
    name,
    currentPos: { ...pos },
    targetPos: { ...pos },
    velocity: { x: 0, y: 0 },
    bobPhase: Math.random() * Math.PI * 2,
    wingPhase: Math.random() * Math.PI * 2,
    chatBubble: null,
    chatTimer: 0,
    idleTimer: 0,
    facing: 1,
  };
}

export function updateAgent(agent: AgentPhysics, dt: number): void {
  const dx = agent.targetPos.x - agent.currentPos.x;
  const dy = agent.targetPos.y - agent.currentPos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > 1) {
    // Moving - spring physics
    const spring = 4.0;
    const damp = 0.85;
    agent.velocity.x += dx * spring * dt;
    agent.velocity.y += dy * spring * dt;
    agent.velocity.x *= damp;
    agent.velocity.y *= damp;
    agent.currentPos.x += agent.velocity.x * dt;
    agent.currentPos.y += agent.velocity.y * dt;
    agent.idleTimer = 0;

    // Facing direction
    if (Math.abs(dx) > 0.5) agent.facing = dx > 0 ? 1 : -1;
  } else {
    // Arrived - snap and idle
    agent.currentPos.x += (agent.targetPos.x - agent.currentPos.x) * 5 * dt;
    agent.currentPos.y += (agent.targetPos.y - agent.currentPos.y) * 5 * dt;
    agent.velocity.x *= 0.9;
    agent.velocity.y *= 0.9;
    agent.idleTimer += dt;
  }

  // Bob animation
  agent.bobPhase += dt * (dist > 1 ? 8 : 3);

  // Wing animation
  agent.wingPhase += dt * 15;

  // Chat bubble decay
  if (agent.chatBubble) {
    agent.chatTimer -= dt;
    if (agent.chatTimer <= 0) {
      agent.chatBubble = null;
    }
  }
}

// ─── Resource Flow Vis ────────────────────────────────────
export interface ResourcePulse {
  from: Vec2;
  to: Vec2;
  progress: number; // 0-1
  resource: string;
  amount: number;
  color: string;
}

const RESOURCE_COLORS: Record<string, string> = {
  wood: '#8B6914',
  clay: '#CD853F',
  metal: '#C0C0C0',
  water: '#4FC3F7',
  food: '#66BB6A',
  energy: '#FFD54F',
  research: '#AB47BC',
};

export function createResourcePulse(from: Vec2, to: Vec2, resource: string, amount: number): ResourcePulse {
  return {
    from,
    to,
    progress: 0,
    resource,
    amount,
    color: RESOURCE_COLORS[resource] || '#FFD700',
  };
}

export function updateResourcePulse(pulse: ResourcePulse, dt: number): boolean {
  pulse.progress += dt * 0.8;
  return pulse.progress < 1;
}

// ─── Weather Effects (tied to wind) ──────────────────────
export type WeatherType = 'clear' | 'breezy' | 'stormy' | 'calm';

export function getWeather(wind: WindState): WeatherType {
  const total = wind.strength + wind.gustStrength;
  if (total < 0.15) return 'calm';
  if (total < 0.4) return 'clear';
  if (total < 0.7) return 'breezy';
  return 'stormy';
}

export function getWeatherResourceMultiplier(weather: WeatherType): Record<string, number> {
  switch (weather) {
    case 'calm':   return { solar: 1.2, water: 0.8, food: 1.1, energy: 1.2 };
    case 'clear':  return { solar: 1.0, water: 1.0, food: 1.0, energy: 1.0 };
    case 'breezy': return { solar: 0.9, water: 1.2, food: 0.9, energy: 0.8 };
    case 'stormy': return { solar: 0.5, water: 1.5, food: 0.7, energy: 0.6 };
  }
}
