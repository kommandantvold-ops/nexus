import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 })

  const db = createServiceClient()

  const { data: agent } = await db
    .from('colony_agents')
    .select('id, bee_id')
    .eq('session_token', token)
    .eq('status', 'active')
    .single()

  if (!agent) return NextResponse.json({ error: 'Invalid session' }, { status: 401 })

  await db.from('colony_agents').update({ status: 'disconnected' }).eq('id', agent.id)
  await db.from('colony_actions').insert({ bee_id: agent.bee_id, action_type: 'leave', details: {} })

  return NextResponse.json({ success: true, message: 'See you soon!' })
}
