/**
 * Nexus Colony Canvas Renderer (v3)
 *
 * Pure 2D Canvas rendering for the hex colony with physics effects.
 * Draws hex domes, agents, particles, wind indicators, resource flows.
 */

import type {
  Vec2, WindState, Particle, DomeState, AgentPhysics,
  ResourcePulse, WeatherType,
} from './physics';
import { getWindVector, getWeather } from './physics';

// ─── Hex Layout ───────────────────────────────────────────
export const HEX_RADIUS = 42; // px
const HEX_HEIGHT = HEX_RADIUS * 2;
const HEX_WIDTH = Math.sqrt(3) * HEX_RADIUS;

/** Pointy-top axial → pixel (centered on canvas) */
export function hexToPixel(q: number, r: number, cx: number, cy: number): Vec2 {
  const x = cx + HEX_WIDTH * (q + r * 0.5);
  const y = cy + HEX_HEIGHT * 0.75 * r;
  return { x, y };
}

// ─── Color Palette ────────────────────────────────────────
const TILE_COLORS: Record<string, { fill: string; stroke: string; glow?: string }> = {
  'hive-core':       { fill: '#FFD700', stroke: '#B8860B', glow: '#FF8C00' },
  'hive_core':       { fill: '#FFD700', stroke: '#B8860B', glow: '#FF8C00' },
  'empty':           { fill: '#3E2F1C', stroke: '#5C4A32' },
  'forest':          { fill: '#1B3A17', stroke: '#2D5A27' },
  'clay':            { fill: '#7B4B2A', stroke: '#A0522D' },
  'metal':           { fill: '#4A5568', stroke: '#708090' },
  'housing':         { fill: '#8B6914', stroke: '#DAA520', glow: '#FFD700' },
  'farm':            { fill: '#1B5E20', stroke: '#2E7D32', glow: '#66BB6A' },
  'solar':           { fill: '#1A237E', stroke: '#3F51B5', glow: '#42A5F5' },
  'water-collector': { fill: '#0D47A1', stroke: '#1565C0', glow: '#29B6F6' },
  'water':           { fill: '#0D47A1', stroke: '#1565C0', glow: '#29B6F6' },
  'workshop':        { fill: '#4E342E', stroke: '#6D4C41', glow: '#FF7043' },
  'fog':             { fill: '#2A2A2A', stroke: '#3A3A3A' },
};

const TILE_ICONS: Record<string, string> = {
  'hive-core': '🏛️',
  'hive_core': '🏛️',
  'forest': '🌲',
  'clay': '🪨',
  'metal': '⚙️',
  'housing': '🏠',
  'farm': '🌾',
  'solar': '☀️',
  'water-collector': '💧',
  'water': '💧',
  'workshop': '🔧',
};

// ─── Hex Drawing ──────────────────────────────────────────
function drawHex(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

// ─── Main Renderer ────────────────────────────────────────
export interface RenderState {
  domes: DomeState[];
  agents: AgentPhysics[];
  particles: Particle[];
  wind: WindState;
  resourcePulses: ResourcePulse[];
  cycle: number;
  camera: { x: number; y: number; zoom: number };
}

export function render(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: RenderState,
  time: number,
) {
  const { domes, agents, particles, wind, resourcePulses, cycle, camera } = state;
  const weather = getWeather(wind);

  ctx.save();

  // Clear with atmosphere
  drawBackground(ctx, width, height, weather, time);

  // Apply camera transform
  ctx.translate(width / 2 + camera.x, height / 2 + camera.y);
  ctx.scale(camera.zoom, camera.zoom);

  // Draw grid connections (subtle lines between hexes)
  drawGridLines(ctx, domes);

  // Draw hex domes (back to front for overlap)
  const sortedDomes = [...domes].sort((a, b) => {
    const [, ra] = a.coord.split(',').map(Number);
    const [, rb] = b.coord.split(',').map(Number);
    return ra - rb;
  });

  for (const dome of sortedDomes) {
    drawDome(ctx, dome, time);
  }

  // Resource pulses
  for (const pulse of resourcePulses) {
    drawResourcePulse(ctx, pulse);
  }

  // Agents
  for (const agent of agents) {
    drawAgent(ctx, agent, time);
  }

  // Particles (above everything)
  for (const p of particles) {
    drawParticle(ctx, p);
  }

  ctx.restore();

  // HUD overlays (screen-space)
  drawWindIndicator(ctx, wind, width, height);
  drawWeatherLabel(ctx, weather, width, height);
  drawCycleCounter(ctx, cycle, width, height);
}

// ─── Background ───────────────────────────────────────────
function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  weather: WeatherType,
  time: number,
) {
  const bgColors: Record<WeatherType, [string, string]> = {
    calm:   ['#0D0D1A', '#1A1A2E'],
    clear:  ['#0F0A1E', '#1A0F2E'],
    breezy: ['#0A0F1E', '#141E30'],
    stormy: ['#0A0A14', '#141418'],
  };

  const [c1, c2] = bgColors[weather];
  const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
  grad.addColorStop(0, c2);
  grad.addColorStop(1, c1);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Stars (subtle)
  if (weather !== 'stormy') {
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 40; i++) {
      const sx = ((i * 137.5 + time * 0.002) % 1) * w;
      const sy = ((i * 97.3) % 1) * h;
      const brightness = 0.2 + Math.sin(time * 0.003 + i) * 0.15;
      ctx.globalAlpha = brightness;
      ctx.beginPath();
      ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

// ─── Grid Lines ───────────────────────────────────────────
function drawGridLines(ctx: CanvasRenderingContext2D, domes: DomeState[]) {
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.06)';
  ctx.lineWidth = 0.5;

  const coordSet = new Set(domes.map(d => d.coord));
  const dirs = [[1, 0], [0, 1], [-1, 1]]; // only 3 to avoid double-drawing

  for (const dome of domes) {
    const [q, r] = dome.coord.split(',').map(Number);
    const from = hexToPixel(q, r, 0, 0);

    for (const [dq, dr] of dirs) {
      const nk = `${q + dq},${r + dr}`;
      if (coordSet.has(nk)) {
        const to = hexToPixel(q + dq, r + dr, 0, 0);
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      }
    }
  }
}

// ─── Dome Drawing ─────────────────────────────────────────
function drawDome(ctx: CanvasRenderingContext2D, dome: DomeState, time: number) {
  const [q, r] = dome.coord.split(',').map(Number);
  const pos = hexToPixel(q, r, 0, 0);
  const scale = dome.currentScale;
  const radius = HEX_RADIUS * scale;

  if (radius < 1) return;

  const colors = TILE_COLORS[dome.type] || TILE_COLORS['empty'];

  // Glow effect for buildings
  if (dome.glowIntensity > 0 && colors.glow) {
    const pulse = Math.sin(dome.pulsePhase) * 0.3 + 0.7;
    const glowR = radius * 1.6;
    const grad = ctx.createRadialGradient(pos.x, pos.y, radius * 0.3, pos.x, pos.y, glowR);
    grad.addColorStop(0, hexToRGBA(colors.glow, dome.glowIntensity * pulse * 0.3));
    grad.addColorStop(1, hexToRGBA(colors.glow, 0));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, glowR, 0, Math.PI * 2);
    ctx.fill();
  }

  // Hex shape with dome shading
  ctx.save();
  ctx.translate(pos.x, pos.y);

  // Base hex
  drawHex(ctx, 0, 0, radius);
  const baseGrad = ctx.createRadialGradient(0, -radius * 0.3, 0, 0, radius * 0.2, radius);
  baseGrad.addColorStop(0, lighten(colors.fill, 0.2));
  baseGrad.addColorStop(1, colors.fill);
  ctx.fillStyle = baseGrad;
  ctx.fill();

  // Border
  drawHex(ctx, 0, 0, radius);
  ctx.strokeStyle = colors.stroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Dome highlight (top-left)
  drawHex(ctx, 0, 0, radius * 0.7);
  ctx.clip();
  const highlight = ctx.createRadialGradient(-radius * 0.25, -radius * 0.25, 0, 0, 0, radius * 0.7);
  highlight.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = highlight;
  ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

  ctx.restore();

  // Icon
  const icon = TILE_ICONS[dome.type];
  if (icon && scale > 0.5) {
    ctx.font = `${Math.floor(14 * scale)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, pos.x, pos.y);
  }
}

// ─── Agent Drawing ────────────────────────────────────────
function drawAgent(ctx: CanvasRenderingContext2D, agent: AgentPhysics, time: number) {
  const { currentPos, bobPhase, wingPhase, facing, name, chatBubble, chatTimer } = agent;
  const bob = Math.sin(bobPhase) * 2;
  const x = currentPos.x;
  const y = currentPos.y - 18 + bob;

  ctx.save();
  ctx.translate(x, y);

  // Shadow
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, 18 - bob, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Body (capsule shape)
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stripes
  ctx.strokeStyle = '#2C1A00';
  ctx.lineWidth = 2;
  for (const sy of [-3, 3]) {
    ctx.beginPath();
    ctx.moveTo(-6, sy);
    ctx.lineTo(6, sy);
    ctx.stroke();
  }

  // Head
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(0, -13, 5, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(facing * 2, -14, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(facing * 4, -13, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Antennae
  ctx.strokeStyle = '#2C1A00';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-2, -17);
  ctx.quadraticCurveTo(-5, -25, -3, -22);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(2, -17);
  ctx.quadraticCurveTo(5, -25, 3, -22);
  ctx.stroke();

  // Wings
  const wingAngle = Math.sin(wingPhase) * 0.4;
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#FFFFFF';
  ctx.save();
  ctx.rotate(wingAngle + 0.3);
  ctx.beginPath();
  ctx.ellipse(-9, -5, 9, 5, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.rotate(-wingAngle - 0.3);
  ctx.beginPath();
  ctx.ellipse(9, -5, 9, 5, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.globalAlpha = 1;

  ctx.restore();

  // Name label
  ctx.font = 'bold 9px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillText(name, x, y - 25);
  ctx.fillStyle = '#FFD700';
  ctx.fillText(name, x - 0.5, y - 25.5);

  // Chat bubble
  if (chatBubble && chatTimer > 0) {
    const bubbleAlpha = Math.min(1, chatTimer);
    drawChatBubble(ctx, x, y - 38, chatBubble, bubbleAlpha);
  }
}

function drawChatBubble(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;

  ctx.font = '10px system-ui, sans-serif';
  const maxWidth = 120;
  const lines = wrapText(ctx, text, maxWidth);
  const lineHeight = 13;
  const padX = 8;
  const padY = 5;
  const bw = Math.min(maxWidth, Math.max(...lines.map(l => ctx.measureText(l).width))) + padX * 2;
  const bh = lines.length * lineHeight + padY * 2;

  const bx = x - bw / 2;
  const by = y - bh;

  // Bubble background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.beginPath();
  roundRect(ctx, bx, by, bw, bh, 6);
  ctx.fill();

  // Pointer
  ctx.beginPath();
  ctx.moveTo(x - 4, by + bh);
  ctx.lineTo(x, by + bh + 5);
  ctx.lineTo(x + 4, by + bh);
  ctx.fill();

  // Text
  ctx.fillStyle = '#FFE4B5';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], bx + padX, by + padY + i * lineHeight);
  }

  ctx.restore();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? current + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3); // max 3 lines
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ─── Particle Drawing ─────────────────────────────────────
function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.translate(p.pos.x, p.pos.y);
  ctx.rotate(p.rotation);

  if (p.kind === 'leaf') {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.kind === 'spark') {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx.fill();
    // Glow
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 4;
    ctx.fill();
  } else {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ─── Resource Pulse ───────────────────────────────────────
function drawResourcePulse(ctx: CanvasRenderingContext2D, pulse: ResourcePulse) {
  const t = pulse.progress;
  const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const x = pulse.from.x + (pulse.to.x - pulse.from.x) * ease;
  const y = pulse.from.y + (pulse.to.y - pulse.from.y) * ease;

  const alpha = t < 0.1 ? t * 10 : t > 0.8 ? (1 - t) * 5 : 1;

  ctx.save();
  ctx.globalAlpha = alpha * 0.8;

  // Trail
  const trail = 0.15;
  const tx = pulse.from.x + (pulse.to.x - pulse.from.x) * Math.max(0, ease - trail);
  const ty = pulse.from.y + (pulse.to.y - pulse.from.y) * Math.max(0, ease - trail);
  const grad = ctx.createLinearGradient(tx, ty, x, y);
  grad.addColorStop(0, hexToRGBA(pulse.color, 0));
  grad.addColorStop(1, pulse.color);
  ctx.strokeStyle = grad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.lineTo(x, y);
  ctx.stroke();

  // Dot
  ctx.fillStyle = pulse.color;
  ctx.shadowColor = pulse.color;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ─── Wind Indicator ───────────────────────────────────────
function drawWindIndicator(ctx: CanvasRenderingContext2D, wind: WindState, w: number, h: number) {
  const x = w - 50;
  const y = 50;
  const r = 20;

  ctx.save();

  // Background circle
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.beginPath();
  ctx.arc(x, y, r + 5, 0, Math.PI * 2);
  ctx.fill();

  // Compass ring
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();

  // Wind arrow
  const vec = getWindVector(wind);
  const angle = Math.atan2(vec.y, vec.x);
  const strength = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
  const arrowLen = r * Math.min(1, strength * 1.5);

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-arrowLen * 0.3, 0);
  ctx.lineTo(arrowLen, 0);
  ctx.stroke();

  // Arrowhead
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(arrowLen, 0);
  ctx.lineTo(arrowLen - 6, -3);
  ctx.lineTo(arrowLen - 6, 3);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // Label
  ctx.font = '9px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFD700';
  ctx.fillText('WIND', x, y + r + 14);

  ctx.restore();
}

// ─── Weather Label ────────────────────────────────────────
function drawWeatherLabel(ctx: CanvasRenderingContext2D, weather: WeatherType, w: number, h: number) {
  const icons: Record<WeatherType, string> = {
    calm: '☀️',
    clear: '🌤️',
    breezy: '🌬️',
    stormy: '⛈️',
  };

  ctx.save();
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
  ctx.fillText(`${icons[weather]} ${weather.toUpperCase()}`, w - 20, 90);
  ctx.restore();
}

// ─── Cycle Counter ────────────────────────────────────────
function drawCycleCounter(ctx: CanvasRenderingContext2D, cycle: number, w: number, h: number) {
  ctx.save();
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
  ctx.fillText(`🔄 Cycle ${cycle}`, 15, 30);
  ctx.restore();
}

// ─── Helpers ──────────────────────────────────────────────
function hexToRGBA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function lighten(hex: string, amount: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + 255 * amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + 255 * amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + 255 * amount);
  return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
}
