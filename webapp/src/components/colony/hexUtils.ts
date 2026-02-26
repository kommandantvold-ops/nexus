// Hex grid math using axial coordinates (pointy-top)
export const HEX_SIZE = 1; // radius (flat-to-flat ~2 * size * sqrt(3)/2)

export type HexCoord = { q: number; r: number };

export function hexKey(q: number, r: number): string {
  return `${q},${r}`;
}

export function parseHexKey(key: string): HexCoord {
  const [q, r] = key.split(",").map(Number);
  return { q, r };
}

// Pointy-top hex to world position
export function axialToPixel(q: number, r: number): [number, number, number] {
  const x = HEX_SIZE * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
  const z = HEX_SIZE * ((3 / 2) * r);
  return [x, 0, z];
}

export function pixelToAxial(x: number, z: number): HexCoord {
  const r = (2 / 3) * z / HEX_SIZE;
  const q = (x / HEX_SIZE - (Math.sqrt(3) / 2) * r) / Math.sqrt(3);
  // Round to nearest hex
  return hexRound(q, r);
}

function hexRound(q: number, r: number): HexCoord {
  const s = -q - r;
  let rq = Math.round(q);
  let rr = Math.round(r);
  const rs = Math.round(s);
  const dq = Math.abs(rq - q);
  const dr = Math.abs(rr - r);
  const ds = Math.abs(rs - s);
  if (dq > dr && dq > ds) rq = -rr - rs;
  else if (dr > ds) rr = -rq - rs;
  return { q: rq, r: rr };
}

const DIRECTIONS: [number, number][] = [
  [1, 0], [1, -1], [0, -1],
  [-1, 0], [-1, 1], [0, 1],
];

export function getNeighbors(q: number, r: number): HexCoord[] {
  return DIRECTIONS.map(([dq, dr]) => ({ q: q + dq, r: r + dr }));
}

export function hexDistance(a: HexCoord, b: HexCoord): number {
  return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
}

export function hexesInRadius(center: HexCoord, radius: number): HexCoord[] {
  const results: HexCoord[] = [];
  for (let q = -radius; q <= radius; q++) {
    for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r++) {
      results.push({ q: center.q + q, r: center.r + r });
    }
  }
  return results;
}
