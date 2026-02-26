'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface BeeData {
  total: number
  human: number
  ai: number
}

export default function BeeCounter({
  questId,
  compact = false,
}: {
  questId?: string
  compact?: boolean
}) {
  const [bees, setBees] = useState<BeeData>({ total: 0, human: 0, ai: 0 })

  useEffect(() => {
    async function fetchCounts() {
      if (questId) {
        // Count bees claiming this quest
        const { data: claims } = await supabase
          .from('quest_claims')
          .select('bee_id, bees(bee_type)')
          .eq('quest_id', questId)
          .eq('status', 'active')

        if (claims) {
          const human = claims.filter(
            (c: Record<string, unknown>) => (c.bees as Record<string, unknown>)?.bee_type === 'human'
          ).length
          const ai = claims.filter(
            (c: Record<string, unknown>) => (c.bees as Record<string, unknown>)?.bee_type === 'ai'
          ).length
          setBees({ total: human + ai, human, ai })
        }
      } else {
        // Global bee count
        const { count: total } = await supabase
          .from('bees')
          .select('*', { count: 'exact', head: true })
        const { count: human } = await supabase
          .from('bees')
          .select('*', { count: 'exact', head: true })
          .eq('bee_type', 'human')
        const { count: ai } = await supabase
          .from('bees')
          .select('*', { count: 'exact', head: true })
          .eq('bee_type', 'ai')

        setBees({ total: total ?? 0, human: human ?? 0, ai: ai ?? 0 })
      }
    }
    fetchCounts()
  }, [questId])

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-amber-600">
        <span>🐝 {bees.total}</span>
        <span className="text-amber-400">
          {bees.human}h + {bees.ai}ai
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
      <div className="text-2xl">🐝</div>
      <div>
        <div className="text-lg font-bold text-amber-900">
          {bees.total} bees in the hive
        </div>
        <div className="text-xs text-amber-600">
          {bees.human} humans + {bees.ai} AI agents
        </div>
      </div>
    </div>
  )
}
