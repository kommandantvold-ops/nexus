"use client";

import type { HexTile, ModuleType } from "./gameTypes";
import { GATHER_YIELDS, RESOURCE_ICONS } from "./gameTypes";

interface Props {
  adjacentTiles: HexTile[];
  selectedModule: ModuleType | null;
  gathering: boolean;
  onGather: (tile: HexTile) => void;
  onBuild: (tile: HexTile) => void;
}

export default function ActionButton({ adjacentTiles, selectedModule, gathering, onGather, onBuild }: Props) {
  // Find gatherable adjacent tiles
  const gatherableTile = adjacentTiles.find((t) => GATHER_YIELDS[t.type]);
  // Find buildable adjacent tile (empty)
  const buildableTile = selectedModule ? adjacentTiles.find((t) => t.type === "empty") : null;

  if (!gatherableTile && !buildableTile) return null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-auto flex gap-2">
      {gatherableTile && GATHER_YIELDS[gatherableTile.type] && (
        <button
          onClick={() => onGather(gatherableTile)}
          disabled={gathering}
          className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
            gathering
              ? "bg-gray-600 text-gray-300 animate-pulse"
              : "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30"
          }`}
        >
          {gathering
            ? "Gathering..."
            : `Gather ${RESOURCE_ICONS[GATHER_YIELDS[gatherableTile.type]!.resource]}`}
        </button>
      )}
      {buildableTile && selectedModule && (
        <button
          onClick={() => onBuild(buildableTile)}
          className="px-6 py-3 rounded-xl font-bold text-lg bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/30 transition-all"
        >
          🏗️ Build Here
        </button>
      )}
    </div>
  );
}
