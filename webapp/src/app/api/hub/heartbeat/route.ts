import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      session_id,
      tokens_used,
      prompt_tokens,
      completion_tokens,
      status,
      output_summary,
      output_artifacts,
    } = body

    if (!session_id) {
      return NextResponse.json({ error: 'session_id required' }, { status: 400 })
    }

    // Fetch current session to check budget
    const { data: session } = await supabase
      .from('work_sessions')
      .select('*')
      .eq('id', session_id)
      .single()

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Check if session is still active
    if (!['active', 'pending'].includes(session.status)) {
      return NextResponse.json({
        error: 'Session is not active',
        status: session.status,
        should_stop: true,
      }, { status: 409 })
    }

    // Calculate new totals
    const newTokensUsed = tokens_used || (session.tokens_used + (prompt_tokens || 0) + (completion_tokens || 0))
    const newPromptTokens = prompt_tokens ? session.prompt_tokens + prompt_tokens : session.prompt_tokens
    const newCompletionTokens = completion_tokens ? session.completion_tokens + completion_tokens : session.completion_tokens

    // Check budget
    const budgetReached = newTokensUsed >= session.token_budget
    const finalStatus = budgetReached ? 'budget_reached' : (status || 'active')

    // Update session
    const updateData: Record<string, unknown> = {
      tokens_used: newTokensUsed,
      prompt_tokens: newPromptTokens,
      completion_tokens: newCompletionTokens,
      status: finalStatus,
      last_heartbeat: new Date().toISOString(),
    }

    if (finalStatus === 'pending') {
      updateData.status = 'active'
      updateData.started_at = new Date().toISOString()
    }

    if (output_summary) updateData.output_summary = output_summary
    if (output_artifacts) updateData.output_artifacts = output_artifacts
    if (['completed', 'failed', 'budget_reached'].includes(finalStatus)) {
      updateData.completed_at = new Date().toISOString()
    }

    await supabase
      .from('work_sessions')
      .update(updateData)
      .eq('id', session_id)

    // Update bee stats
    if (['completed', 'budget_reached'].includes(finalStatus)) {
      const { data: stats } = await supabase
        .from('bee_stats')
        .select('*')
        .eq('bee_id', session.bee_id)
        .single()

      if (stats) {
        await supabase.from('bee_stats').update({
          total_tokens_contributed: stats.total_tokens_contributed + newTokensUsed,
          total_sessions: stats.total_sessions + 1,
          updated_at: new Date().toISOString(),
        }).eq('bee_id', session.bee_id)
      } else {
        await supabase.from('bee_stats').insert({
          bee_id: session.bee_id,
          total_tokens_contributed: newTokensUsed,
          total_sessions: 1,
          total_quests_worked: 1,
        })
      }
    }

    return NextResponse.json({
      session_id,
      tokens_used: newTokensUsed,
      budget: session.token_budget,
      remaining: Math.max(session.token_budget - newTokensUsed, 0),
      status: finalStatus,
      should_stop: budgetReached || ['paused', 'completed', 'failed'].includes(finalStatus),
    })
  } catch (err) {
    console.error('Heartbeat error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
