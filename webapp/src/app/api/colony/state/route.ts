import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const db = createServiceClient()

  const [hexes, agents, resources, chat, actions, weather] = await Promise.all([
    db.from('colony_hexes').select('*'),
    db.from('colony_agents').select('bee_id, position_q, position_r, status').eq('status', 'active'),
    db.from('colony_resources').select('*').eq('id', 'main').single(),
    db.from('colony_chat').select('bee_id, message, created_at').order('created_at', { ascending: false }).limit(20),
    db.from('colony_actions').select('bee_id, action_type, details, created_at').order('created_at', { ascending: false }).limit(30),
    db.from('colony_weather').select('*').eq('id', 'current').single(),
  ])

  const beeIds = [...new Set([...(agents.data || []).map(a => a.bee_id), ...(chat.data || []).map(c => c.bee_id), ...(actions.data || []).map(a => a.bee_id)])]
  const { data: bees } = await db.from('bees').select('id, name').in('id', beeIds.length ? beeIds : ['_none_'])
  const nameMap: Record<string, string> = {}
  for (const b of bees || []) nameMap[b.id] = b.name

  return NextResponse.json({
    hexes: (hexes.data || []).map(h => ({ coord: h.coord, type: h.hex_type, built_by: h.built_by })),
    agents: (agents.data || []).map(a => ({
      bee_id: a.bee_id,
      name: nameMap[a.bee_id] || a.bee_id,
      position: { q: a.position_q, r: a.position_r },
      status: a.status
    })),
    resources: resources.data ? {
      wood: resources.data.wood, clay: resources.data.clay, metal: resources.data.metal,
      water: resources.data.water, food: resources.data.food, energy: resources.data.energy,
      research: resources.data.research, population: resources.data.population,
      population_max: resources.data.population_max
    } : null,
    recent_chat: (chat.data || []).map(c => ({
      bee: nameMap[c.bee_id] || c.bee_id, message: c.message, time: c.created_at
    })),
    recent_actions: (actions.data || []).map(a => ({
      bee: nameMap[a.bee_id] || a.bee_id, action: a.action_type, details: a.details, time: a.created_at
    })),
    cycle: resources.data?.cycle || 0,
    // v3: Weather data for canvas physics sync
    weather: weather.data ? {
      type: weather.data.weather_type,
      wind_direction: weather.data.wind_direction,
      wind_strength: weather.data.wind_strength,
      temperature: weather.data.temperature,
    } : null,
  })
}
