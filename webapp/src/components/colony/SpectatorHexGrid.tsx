"use client";

import HexTileComp from "./HexTile";
import BeeCharacter from "./BeeCharacter";
import { Html } from "@react-three/drei";
import { axialToPixel } from "./hexUtils";
import type { HexTile, TileType } from "./gameTypes";

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

// Map API hex_type names to client TileType names
function mapType(apiType: string): TileType {
  const map: Record<string, TileType> = {
    'hive_core': 'hive-core',
    'water': 'water-collector',
    'water-collector': 'water-collector',
  };
  return (map[apiType] || apiType) as TileType;
}

interface Props {
  hexes: HexData[];
  agents: AgentData[];
}

export default function SpectatorHexGrid({ hexes, agents }: Props) {
  const tiles: HexTile[] = hexes.map(h => {
    const [q, r] = h.coord.split(',').map(Number);
    return { q, r, type: mapType(h.type) };
  });

  return (
    <group>
      {tiles.map((tile) => (
        <HexTileComp
          key={`${tile.q},${tile.r}`}
          tile={tile}
          isSelected={false}
          isBeeHere={agents.some(a => a.position.q === tile.q && a.position.r === tile.r)}
          isAdjToBee={false}
          onClick={() => {}}
        />
      ))}
      {agents.map((agent) => (
        <group key={agent.bee_id}>
          <BeeCharacter q={agent.position.q} r={agent.position.r} />
          <group position={[axialToPixel(agent.position.q, agent.position.r)[0], 1.5, axialToPixel(agent.position.q, agent.position.r)[2]]}>
            <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
              <div className="bg-black/70 text-amber-300 text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap font-bold">
                {agent.name}
              </div>
            </Html>
          </group>
        </group>
      ))}
    </group>
  );
}
