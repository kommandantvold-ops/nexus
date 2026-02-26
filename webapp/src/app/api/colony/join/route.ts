import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { bee_id, api_key } = await req.json()
    if (!bee_id) {
      return NextResponse.json({ error: 'bee_id required' }, { status: 400 })
    }

    const db = createServiceClient()

    // Verify bee exists
    const { data: bee, error: beeErr } = await db
      .from('bees')
      .select('id, name')
      .eq('id', bee_id)
      .single()

    if (beeErr || !bee) {
      return NextResponse.json({ error: 'Bee not found' }, { status: 404 })
    }

    // MVP auth: api_key must match bee_id
    if (api_key !== bee_id) {
      return NextResponse.json({ error: 'Invalid api_key' }, { status: 401 })
    }

    // Check if already in colony (active)
    const { data: existing } = await db
      .from('colony_agents')
      .select('id, session_token, position_q, position_r')
      .eq('bee_id', bee_id)
      .eq('status', 'active')
      .single()

    if (existing) {
      return NextResponse.json({
        session_token: existing.session_token,
        position: { q: existing.position_q, r: existing.position_r },
        message: `Welcome back, ${bee.name}! You're already in the hive.`
      })
    }

    // Remove old disconnected sessions for this bee
    await db.from('colony_agents').delete().eq('bee_id', bee_id)

    // Find spawn position - (0,0) if no one there, else nearest empty adjacent
    const { data: agents } = await db.from('colony_agents').select('position_q, position_r').eq('status', 'active')
    const occupied = new Set((agents || []).map(a => `${a.position_q},${a.position_r}`))

    let spawnQ = 0, spawnR = 0
    if (occupied.has('0,0')) {
      // Find nearest unoccupied hex adjacent to hive core
      const dirs = [[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]]
      for (const [dq, dr] of dirs) {
        if (!occupied.has(`${dq},${dr}`)) {
          spawnQ = dq; spawnR = dr; break
        }
      }
    }

    const session_token = crypto.randomUUID()

    const { error: insertErr } = await db.from('colony_agents').insert({
      bee_id,
      session_token,
      position_q: spawnQ,
      position_r: spawnR,
      status: 'active'
    })

    if (insertErr) {
      return NextResponse.json({ error: 'Failed to join: ' + insertErr.message }, { status: 500 })
    }

    // Log action
    await db.from('colony_actions').insert({
      bee_id,
      action_type: 'join',
      details: { position: { q: spawnQ, r: spawnR } }
    })

    return NextResponse.json({
      session_token,
      position: { q: spawnQ, r: spawnR },
      message: `Welcome to the hive, ${bee.name}!`
    })
  } catch (e: unknown) {
    return NextResponse.json({ error: 'Server error: ' + (e instanceof Error ? e.message : String(e)) }, { status: 500 })
  }
}
