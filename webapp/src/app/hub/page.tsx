'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import Nav from '@/components/Nav'
import HubCanvas from '@/components/hub/HubCanvas'
import ChatPanel from '@/components/hub/ChatPanel'
import PresenceBar from '@/components/hub/PresenceBar'
import { ZONES, getZone, type Zone } from '@/lib/hub/zones'
import type { HubBee, Trophy } from '@/lib/hub/hubTypes'

// Quest count per category (static for now, could be fetched)
const QUEST_COUNTS: Record<string, number> = {
  samphun: 8, transport: 3, symbiosis: 3, aqua: 8,
  terra: 4, heal: 3, spark: 3, sol: 4, gaia: 3, forge: 3,
}

export default function HubPage() {
  const { bee } = useAuth()
  const [onlineBees, setOnlineBees] = useState<HubBee[]>([])
  const [trophies, setTrophies] = useState<Trophy[]>([])
  const [selectedZone, setSelectedZone] = useState<Zone | null>(
    ZONES.find(z => z.id === 'core') || null
  )
  const [myPosition, setMyPosition] = useState({ q: 0, r: 0 })

  // Load trophies
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('trophies').select('*')
      if (data) setTrophies(data)
    }
    load()
  }, [])

  // Presence channel
  useEffect(() => {
    const channel = supabase.channel('hub-presence', {
      config: { presence: { key: bee?.id || 'anon-' + Math.random().toString(36).slice(2) } }
    })

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      const bees: HubBee[] = []
      for (const key of Object.keys(state)) {
        const entries = state[key] as Array<Record<string, unknown>>
        for (const entry of entries) {
          bees.push({
            id: (entry.bee_id as string) || key,
            name: (entry.name as string) || 'Anonymous',
            bee_type: (entry.bee_type as 'human' | 'ai') || 'human',
            bee_color: (entry.bee_color as string) || 'gold',
            stripe_color: (entry.stripe_color as string) || 'brown',
            accessory: (entry.accessory as string | null) || null,
            title: (entry.title as string | null) || null,
            position: (entry.position as { q: number; r: number }) || { q: 0, r: 0 },
            zone: (entry.zone as string) || 'core',
            status: 'active',
          })
        }
      }
      setOnlineBees(bees)
    })

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          bee_id: bee?.id || 'visitor',
          name: bee?.name || 'Visitor',
          bee_type: bee?.bee_type || 'human',
          bee_color: 'gold',
          stripe_color: 'brown',
          accessory: null,
          title: null,
          position: myPosition,
          zone: selectedZone?.id || 'core',
        })
      }
    })

    return () => { supabase.removeChannel(channel) }
  }, [bee, myPosition, selectedZone])

  // Also seed Horizon as an AI presence
  useEffect(() => {
    const horizonBee: HubBee = {
      id: 'HORIZON',
      name: 'Horizon',
      bee_type: 'ai',
      bee_color: 'lavender',
      stripe_color: 'navy',
      accessory: 'antenna',
      title: 'Digital Pollinator',
      position: { q: 0, r: 0 },
      zone: 'core',
      status: 'active',
    }
    setOnlineBees(prev => {
      if (prev.find(b => b.id === 'HORIZON')) return prev
      return [...prev, horizonBee]
    })
  }, [])

  const handleHexClick = useCallback((q: number, r: number, zone: Zone | undefined) => {
    if (zone) {
      setSelectedZone(zone)
      setMyPosition({ q, r })
    }
  }, [])

  const currentZoneId = selectedZone?.id || 'core'
  const questCount = QUEST_COUNTS[selectedZone?.category || ''] || 0

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-amber-50 to-orange-50">
      <Nav active="hub" />

      <PresenceBar
        onlineBees={onlineBees}
        currentZone={selectedZone}
        questCount={questCount}
      />

      {/* Main content — canvas + chat */}
      <div className="flex-1 flex min-h-0">
        {/* Canvas area */}
        <div className="flex-1 relative">
          <HubCanvas
            bees={onlineBees}
            trophies={trophies}
            myBeeId={bee?.id || null}
            onHexClick={handleHexClick}
            selectedZone={selectedZone?.id || null}
          />

          {/* Zone info overlay (bottom-left) */}
          {selectedZone && selectedZone.category !== 'core' && selectedZone.category !== 'trophies' && (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-amber-100 max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{selectedZone.emoji}</span>
                <span className="font-bold text-amber-900">{selectedZone.name}</span>
                {selectedZone.sdg && (
                  <span className="text-[10px] font-medium text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">
                    {selectedZone.sdg}
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-700 mb-2">
                {questCount} sidequests available
              </p>
              <a
                href={`/quests?category=${selectedZone.category}`}
                className="text-xs text-amber-600 font-medium hover:underline"
              >
                View quest board →
              </a>
            </div>
          )}

          {/* Help hint */}
          <div className="absolute bottom-4 right-4 text-xs text-amber-400">
            Click a zone · Drag to pan · @horizon in chat for AI
          </div>
        </div>

        {/* Chat sidebar */}
        <div className="w-80 hidden md:flex flex-col">
          <ChatPanel
            currentZone={currentZoneId}
            beeId={bee?.id || null}
            beeName={bee?.name || null}
          />
        </div>
      </div>
    </div>
  )
}
