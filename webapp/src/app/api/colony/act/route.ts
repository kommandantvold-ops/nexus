import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

const GATHER_YIELDS: Record<string, { resource: string; amount: number }> = {
  forest: { resource: 'wood', amount: 5 },
  clay: { resource: 'clay', amount: 4 },
  metal: { resource: 'metal', amount: 2 },
}

const MODULE_COSTS: Record<string, Record<string, number>> = {
  housing: { wood: 10, clay: 5 },
  farm: { wood: 5, water: 3 },
  solar: { clay: 10, metal: 5 },
  water: { wood: 8, clay: 3 },
  workshop: { wood: 15, clay: 10, metal: 5 },
}

const MODULE_POP: Record<string, number> = { housing: 2 }

const ADJACENT_DIRS = [[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]]

function isAdjacent(q1: number, r1: number, q2: number, r2: number) {
  const dq = q2 - q1, dr = r2 - r1
  return ADJACENT_DIRS.some(([aq, ar]) => aq === dq && ar === dr)
}

const RATE_LIMIT_MS = 2000

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 })

  const db = createServiceClient()

  const { data: agent } = await db
    .from('colony_agents')
    .select('*')
    .eq('session_token', token)
    .eq('status', 'active')
    .single()

  if (!agent) return NextResponse.json({ error: 'Invalid session' }, { status: 401 })

  // Rate limit
  const elapsed = Date.now() - new Date(agent.last_action_at).getTime()
  if (elapsed < RATE_LIMIT_MS) {
    return NextResponse.json({ error: `Rate limited. Wait ${Math.ceil((RATE_LIMIT_MS - elapsed) / 1000)}s` }, { status: 429 })
  }

  const body = await req.json()
  const { action, params } = body

  const now = new Date().toISOString()

  try {
    if (action === 'move') {
      const { q, r } = params || {}
      if (q === undefined || r === undefined) return NextResponse.json({ error: 'q and r required' }, { status: 400 })

      if (!isAdjacent(agent.position_q, agent.position_r, q, r)) {
        return NextResponse.json({ error: 'Can only move to adjacent hex' }, { status: 400 })
      }

      // Check hex exists
      const { data: hex } = await db.from('colony_hexes').select('coord, hex_type').eq('coord', `${q},${r}`).single()
      if (!hex) return NextResponse.json({ error: 'Hex does not exist' }, { status: 400 })

      await db.from('colony_agents')
        .update({ position_q: q, position_r: r, last_action_at: now })
        .eq('id', agent.id)

      await db.from('colony_actions').insert({ bee_id: agent.bee_id, action_type: 'move', details: { from: { q: agent.position_q, r: agent.position_r }, to: { q, r } } })

      return NextResponse.json({ success: true, result: { position: { q, r } }, message: `Moved to (${q},${r})` })

    } else if (action === 'gather') {
      const coord = `${agent.position_q},${agent.position_r}`
      const { data: hex } = await db.from('colony_hexes').select('hex_type').eq('coord', coord).single()

      if (!hex || !GATHER_YIELDS[hex.hex_type]) {
        return NextResponse.json({ error: 'Nothing to gather here' }, { status: 400 })
      }

      const { resource, amount } = GATHER_YIELDS[hex.hex_type]

      const { data: res } = await db.from('colony_resources').select('*').eq('id', 'main').single()
      if (!res) return NextResponse.json({ error: 'Resources not found' }, { status: 500 })

      await db.from('colony_resources')
        .update({ [resource]: (res[resource] || 0) + amount, updated_at: now })
        .eq('id', 'main')

      await db.from('colony_agents').update({ last_action_at: now }).eq('id', agent.id)
      await db.from('colony_actions').insert({ bee_id: agent.bee_id, action_type: 'gather', details: { resource, amount, at: coord } })

      return NextResponse.json({ success: true, result: { resource, amount }, message: `Gathered +${amount} ${resource} from ${hex.hex_type}` })

    } else if (action === 'build') {
      const module = params?.module
      if (!module || !MODULE_COSTS[module]) {
        return NextResponse.json({ error: 'Invalid module. Options: ' + Object.keys(MODULE_COSTS).join(', ') }, { status: 400 })
      }

      const coord = `${agent.position_q},${agent.position_r}`
      const { data: hex } = await db.from('colony_hexes').select('hex_type').eq('coord', coord).single()

      if (!hex || hex.hex_type !== 'empty') {
        return NextResponse.json({ error: 'Can only build on empty hex' }, { status: 400 })
      }

      // Check resources
      const { data: res } = await db.from('colony_resources').select('*').eq('id', 'main').single()
      if (!res) return NextResponse.json({ error: 'Resources not found' }, { status: 500 })

      const cost = MODULE_COSTS[module]
      for (const [r, v] of Object.entries(cost)) {
        if ((res[r] || 0) < v) {
          return NextResponse.json({ error: `Not enough ${r} (need ${v}, have ${res[r] || 0})` }, { status: 400 })
        }
      }

      // Deduct resources
      const updates: Record<string, unknown> = { updated_at: now }
      for (const [r, v] of Object.entries(cost)) {
        updates[r] = (res[r] || 0) - v
      }
      if (MODULE_POP[module]) {
        updates.population_max = (res.population_max || 0) + MODULE_POP[module]
      }
      await db.from('colony_resources').update(updates).eq('id', 'main')

      // Update hex
      await db.from('colony_hexes').update({ hex_type: module, built_by: agent.bee_id, built_at: now }).eq('coord', coord)

      await db.from('colony_agents').update({ last_action_at: now }).eq('id', agent.id)
      await db.from('colony_actions').insert({ bee_id: agent.bee_id, action_type: 'build', details: { module, at: coord } })

      const names: Record<string, string> = { housing: 'Housing Pod', farm: 'Farm', solar: 'Solar Array', water: 'Water Collector', workshop: 'Workshop' }
      return NextResponse.json({ success: true, result: { module, coord }, message: `Built ${names[module] || module} at (${agent.position_q},${agent.position_r})` })

    } else if (action === 'chat') {
      const message = params?.message
      if (!message || typeof message !== 'string' || message.length > 280) {
        return NextResponse.json({ error: 'Message required (max 280 chars)' }, { status: 400 })
      }

      await db.from('colony_chat').insert({ bee_id: agent.bee_id, message, position_q: agent.position_q, position_r: agent.position_r })
      await db.from('colony_agents').update({ last_action_at: now }).eq('id', agent.id)
      await db.from('colony_actions').insert({ bee_id: agent.bee_id, action_type: 'chat', details: { message } })

      return NextResponse.json({ success: true, result: { message }, message: `Said: "${message}"` })

    } else {
      return NextResponse.json({ error: 'Unknown action. Options: move, gather, build, chat' }, { status: 400 })
    }
  } catch (e: unknown) {
    return NextResponse.json({ error: 'Server error: ' + (e instanceof Error ? e.message : String(e)) }, { status: 500 })
  }
}
