import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

const PRODUCTION: Record<string, Record<string, number>> = {
  farm: { food: 3 },
  solar: { energy: 4 },
  water: { water: 3 },
  workshop: { research: 1 },
}

// v3: Weather types and their resource multipliers
type WeatherType = 'calm' | 'clear' | 'breezy' | 'stormy';

const WEATHER_MULTIPLIERS: Record<WeatherType, Record<string, number>> = {
  calm:   { solar: 1.2, water: 0.8, food: 1.1, energy: 1.2 },
  clear:  { solar: 1.0, water: 1.0, food: 1.0, energy: 1.0 },
  breezy: { solar: 0.9, water: 1.2, food: 0.9, energy: 0.8 },
  stormy: { solar: 0.5, water: 1.5, food: 0.7, energy: 0.6 },
};

const WEATHER_TRANSITIONS: Record<WeatherType, WeatherType[]> = {
  calm:   ['calm', 'calm', 'clear', 'clear'],
  clear:  ['clear', 'clear', 'calm', 'breezy'],
  breezy: ['breezy', 'clear', 'stormy'],
  stormy: ['stormy', 'breezy', 'breezy', 'clear'],
};

function nextWeather(current: WeatherType): WeatherType {
  const options = WEATHER_TRANSITIONS[current] || ['clear'];
  return options[Math.floor(Math.random() * options.length)];
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cycle-secret')
  if (secret !== process.env.CYCLE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createServiceClient()

  // Get current weather
  const { data: weatherRow } = await db
    .from('colony_weather')
    .select('*')
    .eq('id', 'current')
    .single();

  const currentWeather: WeatherType = (weatherRow?.weather_type as WeatherType) || 'clear';
  const multipliers = WEATHER_MULTIPLIERS[currentWeather];

  // Count modules and apply weather multipliers
  const { data: hexes } = await db.from('colony_hexes').select('hex_type')
  const produced: Record<string, number> = {}

  for (const h of hexes || []) {
    const prod = PRODUCTION[h.hex_type]
    if (prod) {
      for (const [r, v] of Object.entries(prod)) {
        const mult = multipliers[r] || 1;
        produced[r] = (produced[r] || 0) + Math.round(v * mult);
      }
    }
  }

  // Get current resources
  const { data: res } = await db.from('colony_resources').select('*').eq('id', 'main').single()
  if (!res) return NextResponse.json({ error: 'Resources not found' }, { status: 500 })

  // Consume food
  const foodConsumed = Math.floor((res.population || 0) / 2)
  const newCycle = (res.cycle || 0) + 1;

  const updates: Record<string, unknown> = {
    cycle: newCycle,
    updated_at: new Date().toISOString(),
  }

  for (const [r, v] of Object.entries(produced)) {
    updates[r] = (res[r] || 0) + v
  }
  updates.food = Math.max(0, ((updates.food as number) ?? res.food) - foodConsumed)

  await db.from('colony_resources').update(updates).eq('id', 'main')

  // v3: Advance weather
  const newWeather = nextWeather(currentWeather);
  const windDir = (weatherRow?.wind_direction || 0) + (Math.random() - 0.5) * 0.8;
  const windStr = newWeather === 'stormy' ? 0.6 + Math.random() * 0.3
    : newWeather === 'breezy' ? 0.3 + Math.random() * 0.3
    : newWeather === 'calm' ? 0.05 + Math.random() * 0.1
    : 0.15 + Math.random() * 0.25;

  await db.from('colony_weather').update({
    weather_type: newWeather,
    wind_direction: windDir,
    wind_strength: windStr,
    updated_at: new Date().toISOString(),
  }).eq('id', 'current');

  // Log weather for this cycle
  await db.from('colony_weather_log').insert({
    cycle: newCycle,
    weather_type: currentWeather,
    multipliers,
  });

  // v3: Auto-reveal fog tiles adjacent to buildings
  const builtCoords = (hexes || [])
    .filter(h => ['housing', 'farm', 'solar', 'water', 'workshop', 'hive_core'].includes(h.hex_type))
    .map(() => null); // We need coords, let me re-query

  const { data: builtHexes } = await db
    .from('colony_hexes')
    .select('coord, hex_type')
    .in('hex_type', ['housing', 'farm', 'solar', 'water', 'workshop', 'hive_core']);

  const DIRS = [[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]];
  const fogToReveal: string[] = [];

  for (const bh of builtHexes || []) {
    const [bq, br] = bh.coord.split(',').map(Number);
    for (const [dq, dr] of DIRS) {
      fogToReveal.push(`${bq + dq},${br + dr}`);
    }
  }

  if (fogToReveal.length > 0) {
    // Reveal fog → random terrain
    const terrains = ['empty', 'empty', 'empty', 'forest', 'clay', 'metal'];
    for (const coord of [...new Set(fogToReveal)]) {
      const { data: hex } = await db.from('colony_hexes').select('hex_type').eq('coord', coord).single();
      if (hex?.hex_type === 'fog') {
        const terrain = terrains[Math.floor(Math.random() * terrains.length)];
        await db.from('colony_hexes').update({ hex_type: terrain }).eq('coord', coord);
      }
    }
  }

  return NextResponse.json({
    success: true,
    cycle: newCycle,
    weather: { previous: currentWeather, current: newWeather, wind: { direction: windDir, strength: windStr } },
    produced,
    food_consumed: foodConsumed,
    resources: { ...res, ...updates },
  })
}
