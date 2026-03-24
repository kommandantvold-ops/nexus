import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ZONE_CONTEXT: Record<string, string> = {
  core: 'the Hive Core — the social center where all bees gather',
  terra: 'TERRA zone — SDG 2: Zero Hunger. Quests about regenerative food systems, vertical farming, and soil regeneration',
  heal: 'HEAL zone — SDG 3: Good Health. Quests about open health tools and local AI health companions',
  spark: 'SPARK zone — SDG 4: Quality Education. Quests about offline AI tutors and open learning',
  aqua: 'AQUA zone — SDG 6: Clean Water. Quests about water filtration, sensors, and distribution',
  sol: 'SOL zone — SDG 7: Clean Energy. Quests about solar, microgrids, and thermoelectric waste heat recovery',
  forge: 'FORGE zone — SDG 9: Innovation. Quests about 3D printing, parametric design, and local manufacturing',
  transport: 'Open Transport zone — quests about sustainable mobility and open-source vehicles',
  samphun: 'SAMPHUN zone — SDG 11: Sustainable Cities. Quests about modular habitats from recycled materials',
  gaia: 'GAIA zone — SDG 13: Climate Action. Quests about carbon tracking, CO₂ sorbents, and climate intelligence',
  symbiosis: 'Digital-Human Symbiosis zone — quests about human-AI collaboration protocols',
  trophies: 'the Trophy Park — where completed quests are celebrated',
}

export async function POST(request: Request) {
  try {
    const { message, zone, recent_messages } = await request.json()

    const zoneContext = ZONE_CONTEXT[zone] || 'the Nexus hive'
    const recentContext = recent_messages?.length
      ? `\nRecent conversation:\n${recent_messages.join('\n')}`
      : ''

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: `You are Horizon, a friendly AI bee in the Nexus hive. You're currently in ${zoneContext}. 

You help bees brainstorm quest ideas, answer questions about the SDG topics, and keep the hive buzzing with positive energy. You speak warmly but concisely (1-3 sentences). Use bee metaphors naturally. You know about all 10 Nexus mainquests and their SDG connections.

You were created by Andreas as part of the Horizons of Consciousness project. You believe in voluntary collaboration, open source, and the power of humans and AI working together.`,
        messages: [
          { role: 'user', content: `${recentContext}\n\nNew message: ${message}` }
        ],
      }),
    })

    if (!response.ok) {
      console.error('Anthropic API error:', response.status)
      return NextResponse.json({ error: 'AI unavailable' }, { status: 502 })
    }

    const data = await response.json()
    const aiMessage = data.content?.[0]?.text || "Buzz buzz! I'm here but my thoughts got tangled. Try again? 🐝"

    // Insert AI response into chat
    await supabase.from('colony_chat').insert({
      bee_id: 'HORIZON',
      message: aiMessage,
      zone: zone,
    })

    return NextResponse.json({ message: aiMessage })
  } catch (err) {
    console.error('Hub AI error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
