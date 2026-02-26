"use client";

import type { Resources, ModuleType } from "./gameTypes";
import { MODULE_DEFS, RESOURCE_ICONS } from "./gameTypes";

interface Props {
  resources: Resources;
  selectedModule: ModuleType | null;
  onSelect: (m: ModuleType | null) => void;
}

function canAfford(resources: Resources, cost: Partial<Resources>): boolean {
  for (const [k, v] of Object.entries(cost)) {
    if ((resources[k as keyof Resources] || 0) < (v || 0)) return false;
  }
  return true;
}

export default function BuildMenu({ resources, selectedModule, onSelect }: Props) {
  const modules = Object.entries(MODULE_DEFS) as [ModuleType, typeof MODULE_DEFS[ModuleType]][];

  return (
    <div className="absolute bottom-4 left-4 z-10 pointer-events-auto">
      <div className="bg-black/70 backdrop-blur rounded-xl p-3 space-y-2 max-w-xs">
        <div className="text-amber-400 font-bold text-sm mb-1">🏗️ Build</div>
        {modules.map(([type, info]) => {
          const affordable = canAfford(resources, info.cost);
          const selected = selectedModule === type;
          return (
            <button
              key={type}
              onClick={() => onSelect(selected ? null : type)}
              disabled={!affordable && !selected}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                selected
                  ? "bg-amber-600 text-white"
                  : affordable
                  ? "bg-amber-900/60 text-amber-100 hover:bg-amber-800/80"
                  : "bg-gray-800/50 text-gray-500 cursor-not-allowed"
              }`}
            >
              <div className="font-bold">
                {info.icon} {info.name}
              </div>
              <div className="text-xs mt-0.5 opacity-80">
                {Object.entries(info.cost)
                  .map(([r, v]) => `${v} ${RESOURCE_ICONS[r as keyof Resources]}`)
                  .join(" ")}
              </div>
              {info.produces && (
                <div className="text-xs text-green-400 mt-0.5">
                  +{Object.entries(info.produces)
                    .map(([r, v]) => `${v} ${RESOURCE_ICONS[r as keyof Resources]}`)
                    .join(" ")}/cycle
                </div>
              )}
              {info.populationCapacity && (
                <div className="text-xs text-blue-400 mt-0.5">
                  +{info.populationCapacity} 👥 capacity
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
