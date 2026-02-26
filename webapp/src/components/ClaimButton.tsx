'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'

export default function ClaimButton({ questId }: { questId: string }) {
  const { bee } = useAuth()
  const [claimed, setClaimed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!bee) { setLoading(false); return }
    supabase
      .from('quest_claims')
      .select('id')
      .eq('bee_id', bee.id)
      .eq('quest_id', questId)
      .single()
      .then(({ data }) => {
        setClaimed(!!data)
        setLoading(false)
      })
  }, [bee, questId])

  if (!bee || loading) return null

  const handleClaim = async () => {
    setLoading(true)
    const { error } = await supabase.from('quest_claims').insert({
      bee_id: bee.id,
      quest_id: questId,
    })
    if (!error) setClaimed(true)
    setLoading(false)
  }

  if (claimed) {
    return <span className="text-xs text-green-600 font-medium">✓ Claimed</span>
  }

  return (
    <button
      onClick={handleClaim}
      disabled={loading}
      className="text-xs px-3 py-1 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition disabled:opacity-50"
    >
      🐝 Claim Quest
    </button>
  )
}
