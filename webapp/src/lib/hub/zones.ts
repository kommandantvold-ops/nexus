// Zone definitions: hex coords → quest categories
// The hive is a hex grid with (0,0) at center

export interface Zone {
  q: number
  r: number
  id: string
  name: string
  emoji: string
  category: string // matches quest category
  sdg?: string
  color: string // hex fill color
}

// Core + 10 quest zones + trophy park
export const ZONES: Zone[] = [
  // Center — social hub
  { q: 0, r: 0, id: 'core', name: 'Hive Core', emoji: '🐝', category: 'core', color: '#FEF3C7' },

  // Inner ring — quest zones (6 hexes)
  { q: 1, r: 0, id: 'terra', name: 'TERRA', emoji: '🌾', category: 'terra', sdg: 'SDG 2', color: '#D9F99D' },
  { q: 0, r: 1, id: 'heal', name: 'HEAL', emoji: '💚', category: 'heal', sdg: 'SDG 3', color: '#BBF7D0' },
  { q: -1, r: 1, id: 'spark', name: 'SPARK', emoji: '✨', category: 'spark', sdg: 'SDG 4', color: '#FEF9C3' },
  { q: -1, r: 0, id: 'aqua', name: 'AQUA', emoji: '🌊', category: 'aqua', sdg: 'SDG 6', color: '#BAE6FD' },
  { q: 0, r: -1, id: 'sol', name: 'SOL', emoji: '☀️', category: 'sol', sdg: 'SDG 7', color: '#FEF08A' },
  { q: 1, r: -1, id: 'forge', name: 'FORGE', emoji: '🔨', category: 'forge', sdg: 'SDG 9', color: '#FED7AA' },

  // Outer ring — more quest zones (4 hexes)
  { q: 2, r: -1, id: 'transport', name: 'Open Transport', emoji: '🚀', category: 'transport', sdg: 'SDG 9', color: '#E0E7FF' },
  { q: -2, r: 1, id: 'samphun', name: 'SAMPHUN', emoji: '🏠', category: 'samphun', sdg: 'SDG 11', color: '#FECACA' },
  { q: 1, r: 1, id: 'gaia', name: 'GAIA', emoji: '🌍', category: 'gaia', sdg: 'SDG 13', color: '#A7F3D0' },
  { q: -1, r: -1, id: 'symbiosis', name: 'Digital-Human Symbiosis', emoji: '🌐', category: 'symbiosis', color: '#DDD6FE' },

  // Trophy Park — south area
  { q: 0, r: 2, id: 'trophy-1', name: 'Trophy Park', emoji: '🏆', category: 'trophies', color: '#FDE68A' },
  { q: -1, r: 2, id: 'trophy-2', name: 'Trophy Park', emoji: '🏆', category: 'trophies', color: '#FDE68A' },
  { q: 1, r: 2, id: 'trophy-3', name: 'Trophy Park', emoji: '🏆', category: 'trophies', color: '#FDE68A' },
]

// Lookup zone by hex coord
export function getZone(q: number, r: number): Zone | undefined {
  return ZONES.find(z => z.q === q && z.r === r)
}

// Get zone by category
export function getZoneByCategory(category: string): Zone | undefined {
  return ZONES.find(z => z.category === category)
}

// All quest zone categories (excluding core and trophies)
export const QUEST_ZONE_CATEGORIES = [
  'terra', 'heal', 'spark', 'aqua', 'sol', 'forge',
  'transport', 'samphun', 'gaia', 'symbiosis'
]

// Hex math for rendering
export const HEX_SIZE = 52
export const HEX_GAP = 4

export function hexToPixel(q: number, r: number): [number, number] {
  const size = HEX_SIZE + HEX_GAP
  const x = size * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r)
  const y = size * (3 / 2 * r)
  return [x, y]
}

export function pixelToHex(px: number, py: number): [number, number] {
  const size = HEX_SIZE + HEX_GAP
  const q = (Math.sqrt(3) / 3 * px - 1 / 3 * py) / size
  const r = (2 / 3 * py) / size
  // Round to nearest hex
  let rq = Math.round(q)
  let rr = Math.round(r)
  const rs = Math.round(-q - r)
  const dq = Math.abs(rq - q)
  const dr = Math.abs(rr - r)
  const ds = Math.abs(rs - (-q - r))
  if (dq > dr && dq > ds) rq = -rr - rs
  else if (dr > ds) rr = -rq - rs
  return [rq, rr]
}

// Hex corner points for drawing
export function hexCorners(cx: number, cy: number): [number, number][] {
  const corners: [number, number][] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30)
    corners.push([
      cx + HEX_SIZE * Math.cos(angle),
      cy + HEX_SIZE * Math.sin(angle),
    ])
  }
  return corners
}
