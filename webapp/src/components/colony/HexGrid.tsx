"use client";

import HexTileComp from "./HexTile";
import BeeCharacter from "./BeeCharacter";
import type { HexTile } from "./gameTypes";
import { hexKey, hexDistance } from "./hexUtils";

interface Props {
  hexes: Map<string, HexTile>;
  beePos: { q: number; r: number };
  selectedHex: string | null;
  onHexClick: (q: number, r: number) => void;
}

export default function HexGrid({ hexes, beePos, selectedHex, onHexClick }: Props) {
  return (
    <group>
      {Array.from(hexes.values()).map((tile) => {
        const key = hexKey(tile.q, tile.r);
        const dist = hexDistance(beePos, tile);
        return (
          <HexTileComp
            key={key}
            tile={tile}
            isSelected={selectedHex === key}
            isBeeHere={tile.q === beePos.q && tile.r === beePos.r}
            isAdjToBee={dist === 1}
            onClick={() => onHexClick(tile.q, tile.r)}
          />
        );
      })}
      <BeeCharacter q={beePos.q} r={beePos.r} />
    </group>
  );
}
