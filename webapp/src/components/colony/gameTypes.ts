export type TileType =
  | "empty"
  | "hive-core"
  | "forest"
  | "clay"
  | "metal"
  | "housing"
  | "farm"
  | "solar"
  | "water-collector"
  | "workshop"
  | "fog";

export type ModuleType = "housing" | "farm" | "solar" | "water-collector" | "workshop";

export interface HexTile {
  q: number;
  r: number;
  type: TileType;
}

export interface Resources {
  wood: number;
  clay: number;
  metal: number;
  water: number;
  food: number;
  energy: number;
  research: number;
}

export interface Population {
  current: number;
  max: number;
}

export interface ModuleInfo {
  name: string;
  icon: string;
  cost: Partial<Resources>;
  produces?: Partial<Resources>;
  populationCapacity?: number;
}

export const MODULE_DEFS: Record<ModuleType, ModuleInfo> = {
  housing: {
    name: "Housing Pod",
    icon: "🏠",
    cost: { wood: 10, clay: 5 },
    populationCapacity: 2,
  },
  farm: {
    name: "Farm",
    icon: "🌾",
    cost: { wood: 5, water: 3 },
    produces: { food: 3 },
  },
  solar: {
    name: "Solar Array",
    icon: "☀️",
    cost: { clay: 10, metal: 5 },
    produces: { energy: 4 },
  },
  "water-collector": {
    name: "Water Collector",
    icon: "💧",
    cost: { wood: 8, clay: 3 },
    produces: { water: 3 },
  },
  workshop: {
    name: "Workshop",
    icon: "🔧",
    cost: { wood: 15, clay: 10, metal: 5 },
    produces: { research: 1 },
  },
};

export const RESOURCE_ICONS: Record<keyof Resources, string> = {
  wood: "🪵",
  clay: "🧱",
  metal: "⚙️",
  water: "💧",
  food: "🌾",
  energy: "⚡",
  research: "🔬",
};

export const GATHER_YIELDS: Partial<Record<TileType, { resource: keyof Resources; amount: number }>> = {
  forest: { resource: "wood", amount: 5 },
  clay: { resource: "clay", amount: 3 },
  metal: { resource: "metal", amount: 2 },
};
