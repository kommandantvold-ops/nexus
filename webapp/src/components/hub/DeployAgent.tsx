'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import TokenGauge from './TokenGauge'

interface WorkSession {
  id: string
  quest_id: string
  quest_title: string
  zone: string
  token_budget: number
  tokens_used: number
  prompt_tokens: number
  completion_tokens: number
  status: string
  output_summary: string | null
  started_at: string | null
  created_at: string
}

interface Props {
  beeId: string
  questId: string
  questTitle: string
  zone: string
  existingSession?: WorkSession | null
  onSessionCreated: (session: WorkSession) => void
}

const BUDGET_PRESETS = [
  { label: '10K', value: 10_000, desc: 'Quick check' },
  { label: '50K', value: 50_000, desc: 'Standard task' },
  { label: '200K', value: 200_000, desc: 'Deep research' },
  { label: '500K', value: 500_000, desc: 'Full investigation' },
  { label: '1M', value: 1_000_000, desc: 'Major sprint' },
]

export default function DeployAgent({ beeId, questId, questTitle, zone, existingSession, onSessionCreated }: Props) {
  const [budget, setBudget] = useState(50_000)
  const [customBudget, setCustomBudget] = useState('')
  const [deploying, setDeploying] = useState(false)

  const session = existingSession

  const handleDeploy = async () => {
    setDeploying(true)
    const finalBudget = customBudget ? parseInt(customBudget) : budget

    const { data, error } = await supabase
      .from('work_sessions')
      .insert({
        bee_id: beeId,
        quest_id: questId,
        quest_title: questTitle,
        zone: zone,
        token_budget: finalBudget,
        status: 'pending',
      })
      .select()
      .single()

    if (data && !error) {
      onSessionCreated(data as WorkSession)

      // Update bee stats (best-effort)
      try {
        await supabase.from('bee_stats').upsert({
          bee_id: beeId,
          total_sessions: 1,
          total_quests_worked: 1,
          total_tokens_contributed: 0,
        }, { onConflict: 'bee_id' })
      } catch {
        // stats update is best-effort
      }
    }
    setDeploying(false)
  }

  const handlePause = async () => {
    if (!session) return
    await supabase
      .from('work_sessions')
      .update({ status: 'paused' })
      .eq('id', session.id)
  }

  const handleResume = async () => {
    if (!session) return
    await supabase
      .from('work_sessions')
      .update({ status: 'active' })
      .eq('id', session.id)
  }

  const handleStop = async () => {
    if (!session) return
    await supabase
      .from('work_sessions')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', session.id)
  }

  // Active session view
  if (session && ['active', 'pending', 'paused'].includes(session.status)) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-100">
        <div className="flex items-start gap-4">
          <TokenGauge
            used={session.tokens_used}
            budget={session.token_budget}
            status={session.status}
            label={session.quest_title}
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-amber-900 truncate">{session.quest_title}</div>
            <div className="text-xs text-amber-500 mt-0.5">
              {session.status === 'active' && '🔄 Agent is working...'}
              {session.status === 'pending' && '⏳ Waiting to start...'}
              {session.status === 'paused' && '⏸ Paused by you'}
            </div>

            {session.output_summary && (
              <div className="mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg p-2">
                {session.output_summary}
              </div>
            )}

            <div className="flex gap-2 mt-3">
              {session.status === 'active' && (
                <button onClick={handlePause} className="text-xs px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition">
                  ⏸ Pause
                </button>
              )}
              {session.status === 'paused' && (
                <button onClick={handleResume} className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition">
                  ▶ Resume
                </button>
              )}
              <button onClick={handleStop} className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                ⏹ Stop & Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Completed session view
  if (session && ['completed', 'budget_reached', 'failed'].includes(session.status)) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-100">
        <div className="flex items-start gap-4">
          <TokenGauge
            used={session.tokens_used}
            budget={session.token_budget}
            status={session.status}
            label="Finished"
            size="sm"
          />
          <div className="flex-1">
            <div className="text-sm font-bold text-amber-900">{session.quest_title}</div>
            <div className="text-xs text-amber-500">
              Used {(session.tokens_used).toLocaleString()} tokens
            </div>
            {session.output_summary && (
              <div className="mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg p-2">
                {session.output_summary}
              </div>
            )}
            <button
              onClick={() => onSessionCreated(null as unknown as WorkSession)}
              className="mt-2 text-xs text-amber-600 underline hover:text-amber-700"
            >
              Start new session →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Deploy new agent view
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-100">
      <div className="text-sm font-bold text-amber-900 mb-1">Deploy Agent</div>
      <div className="text-xs text-amber-500 mb-3">
        Set a token budget and send your agent to work on this quest
      </div>

      {/* Budget presets */}
      <div className="grid grid-cols-5 gap-1.5 mb-3">
        {BUDGET_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => { setBudget(preset.value); setCustomBudget('') }}
            className={`text-center py-2 rounded-lg text-xs transition ${
              budget === preset.value && !customBudget
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <div className="font-bold">{preset.label}</div>
            <div className="text-[9px] opacity-70">{preset.desc}</div>
          </button>
        ))}
      </div>

      {/* Custom budget */}
      <div className="flex gap-2 mb-3">
        <input
          type="number"
          value={customBudget}
          onChange={(e) => setCustomBudget(e.target.value)}
          placeholder="Custom token budget"
          className="flex-1 px-3 py-1.5 text-xs border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400"
        />
        <span className="text-xs text-amber-400 self-center">tokens</span>
      </div>

      {/* Preview gauge */}
      <div className="flex justify-center mb-3">
        <TokenGauge
          used={0}
          budget={customBudget ? parseInt(customBudget) || 0 : budget}
          status="pending"
          label={questTitle}
          size="sm"
        />
      </div>

      {/* Deploy button */}
      <button
        onClick={handleDeploy}
        disabled={deploying}
        className="w-full py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 disabled:opacity-40 transition shadow-md"
      >
        {deploying ? 'Deploying...' : '🐝 Deploy Agent'}
      </button>

      <div className="text-[10px] text-amber-400 text-center mt-2">
        Your agent uses your own compute. Nexus never charges for tokens.
      </div>
    </div>
  )
}
