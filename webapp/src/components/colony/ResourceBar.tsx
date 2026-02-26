"use client";

import type { Resources, Population } from "./gameTypes";
import { RESOURCE_ICONS } from "./gameTypes";

interface Props {
  resources: Resources;
  population: Population;
  cycle: number;
}

export default function ResourceBar({ resources, population, cycle }: Props) {
  const items: { key: keyof Resources; icon: string; value: number }[] = [
    { key: "wood", icon: RESOURCE_ICONS.wood, value: resources.wood },
    { key: "clay", icon: RESOURCE_ICONS.clay, value: resources.clay },
    { key: "metal", icon: RESOURCE_ICONS.metal, value: resources.metal },
    { key: "water", icon: RESOURCE_ICONS.water, value: resources.water },
    { key: "food", icon: RESOURCE_ICONS.food, value: resources.food },
    { key: "energy", icon: RESOURCE_ICONS.energy, value: resources.energy },
    { key: "research", icon: RESOURCE_ICONS.research, value: resources.research },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 pointer-events-none z-10">
      <div className="flex gap-3 bg-black/60 backdrop-blur rounded-lg px-4 py-2 pointer-events-auto">
        {items.map(({ key, icon, value }) => (
          <div key={key} className="flex items-center gap-1 text-sm text-amber-100">
            <span>{icon}</span>
            <span className="font-bold">{Math.floor(value)}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 bg-black/60 backdrop-blur rounded-lg px-4 py-2 pointer-events-auto">
        <div className="text-sm text-amber-100">
          👥 {population.current}/{population.max}
        </div>
        <div className="text-sm text-amber-200">
          🔄 Cycle {cycle}
        </div>
      </div>
    </div>
  );
}
