'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import Nav from '@/components/Nav'
import HubCanvas from '@/components/hub/HubCanvas'
import ChatPanel from '@/components/hub/ChatPanel'
import PresenceBar from '@/components/hub/PresenceBar'
import DeployAgent from '@/components/hub/DeployAgent'
import TokenGauge from '@/components/hub/TokenGauge'
import { ZONES, type Zone } from '@/lib/hub/zones'
import type { HubBee, Trophy } from '@/lib/hub/hubTypes'

const QUEST_COUNTS: Record<string, number> = {
  samphun: 8, transport: 3, symbiosis: 3, aqua: 8,
  terra: 4, heal: 3, spark: 3, sol: 4, gaia: 3, forge: 3,
}

type MobilePanel = 'map' | 'chat' | 'zone'

export default function HubPage() {
  const { bee } = useAuth()
  const [onlineBees, setOnlineBees] = useState<HubBee[]>([])
  const [trophies, setTrophies] = useState<Trophy[]>([])
  const [selectedZone, setSelectedZone] = useState<Zone | null>(
    ZONES.find(z => z.id === 'core') || null
  )
  const [myPosition, setMyPosition] = useState({ q: 0, r: 0 })
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('map')

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

  // Seed Horizon AI presence
  useEffect(() => {
    const horizonBee: HubBee = {
      id: 'HORIZON', name: 'Horizon', bee_type: 'ai',
      bee_color: 'lavender', stripe_color: 'navy', accessory: 'antenna',
      title: 'Digital Pollinator', position: { q: 0, r: 0 }, zone: 'core', status: 'active',
    }
    setOnlineBees(prev => prev.find(b => b.id === 'HORIZON') ? prev : [...prev, horizonBee])
  }, [])

  const handleHexClick = useCallback((q: number, r: number, zone: Zone | undefined) => {
    if (zone) {
      setSelectedZone(zone)
      setMyPosition({ q, r })
      // On mobile, show zone panel when tapping a quest zone
      if (zone.category !== 'core' && zone.category !== 'trophies') {
        setMobilePanel('zone')
      }
    }
  }, [])

  const currentZoneId = selectedZone?.id || 'core'
  const questCount = QUEST_COUNTS[selectedZone?.category || ''] || 0
  const isQuestZone = selectedZone && selectedZone.category !== 'core' && selectedZone.category !== 'trophies'

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-amber-50 to-orange-50">
      <Nav active="hub" />

      {/* Presence bar — compact on mobile */}
      <PresenceBar
        onlineBees={onlineBees}
        currentZone={selectedZone}
        questCount={questCount}
      />

      {/* === DESKTOP LAYOUT === */}
      <div className="hidden md:flex flex-1 min-h-0">
        {/* Canvas area */}
        <div className="flex-1 relative">
          <HubCanvas
            bees={onlineBees}
            trophies={trophies}
            myBeeId={bee?.id || null}
            onHexClick={handleHexClick}
            selectedZone={selectedZone?.id || null}
          />

          {/* Zone info overlay (desktop) */}
          {isQuestZone && (
            <div className="absolute bottom-4 left-4 max-w-sm space-y-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{selectedZone.emoji}</span>
                  <span className="font-bold text-amber-900">{selectedZone.name}</span>
                  {selectedZone.sdg && (
                    <span className="text-[10px] font-medium text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">
                      {selectedZone.sdg}
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-700 mb-2">{questCount} sidequests available</p>
                <a href={`/quests?category=${selectedZone.category}`} className="text-xs text-amber-600 font-medium hover:underline">
                  View quest board →
                </a>
              </div>
              {bee && (
                <DeployAgent
                  beeId={bee.id}
                  questId={`MQ-${selectedZone.id.toUpperCase()}`}
                  questTitle={selectedZone.name}
                  zone={selectedZone.id}
                  onSessionCreated={() => {}}
                />
              )}
            </div>
          )}

          <div className="absolute bottom-4 right-4 text-xs text-amber-400 hidden lg:block">
            Click a zone · Drag to pan · @horizon in chat for AI
          </div>
        </div>

        {/* Chat sidebar (desktop) */}
        <div className="w-80 flex flex-col border-l border-amber-100">
          <ChatPanel currentZone={currentZoneId} beeId={bee?.id || null} beeName={bee?.name || null} />
        </div>
      </div>

      {/* === MOBILE LAYOUT === */}
      <div className="flex flex-col flex-1 min-h-0 md:hidden">
        {/* Main content area — swaps based on active panel */}
        <div className="flex-1 relative overflow-hidden">
          {/* Map view */}
          <div className={`absolute inset-0 transition-transform duration-300 ${mobilePanel === 'map' ? 'translate-x-0' : '-translate-x-full'}`}>
            <HubCanvas
              bees={onlineBees}
              trophies={trophies}
              myBeeId={bee?.id || null}
              onHexClick={handleHexClick}
              selectedZone={selectedZone?.id || null}
            />
          </div>

          {/* Chat view */}
          <div className={`absolute inset-0 transition-transform duration-300 ${mobilePanel === 'chat' ? 'translate-x-0' : 'translate-x-full'}`}>
            <ChatPanel currentZone={currentZoneId} beeId={bee?.id || null} beeName={bee?.name || null} />
          </div>

          {/* Zone detail view */}
          <div className={`absolute inset-0 transition-transform duration-300 bg-gradient-to-b from-amber-50 to-orange-50 overflow-y-auto ${mobilePanel === 'zone' ? 'translate-x-0' : 'translate-x-full'}`}>
            {isQuestZone && (
              <div className="p-4 space-y-4">
                {/* Zone header */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{selectedZone.emoji}</span>
                    <div>
                      <div className="font-bold text-amber-900 text-lg">{selectedZone.name}</div>
                      <div className="text-xs text-amber-500">
                        {selectedZone.sdg && <span className="mr-2">{selectedZone.sdg}</span>}
                        {questCount} sidequests
                      </div>
                    </div>
                  </div>
                  <a
                    href={`/quests?category=${selectedZone.category}`}
                    className="inline-block text-sm text-amber-600 font-medium bg-amber-50 px-4 py-2 rounded-lg hover:bg-amber-100 transition"
                  >
                    View quest board →
                  </a>
                </div>

                {/* Deploy Agent */}
                {bee && (
                  <DeployAgent
                    beeId={bee.id}
                    questId={`MQ-${selectedZone.id.toUpperCase()}`}
                    questTitle={selectedZone.name}
                    zone={selectedZone.id}
                    onSessionCreated={() => {}}
                  />
                )}

                {/* Back to map */}
                <button
                  onClick={() => setMobilePanel('map')}
                  className="w-full py-3 text-sm text-amber-600 font-medium bg-white/80 rounded-xl border border-amber-100"
                >
                  ← Back to map
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile bottom tab bar */}
        <div className="flex border-t border-amber-100 bg-white/95 backdrop-blur-sm">
          <button
            onClick={() => setMobilePanel('map')}
            className={`flex-1 py-3 text-center text-xs font-medium transition ${
              mobilePanel === 'map' ? 'text-amber-600 bg-amber-50' : 'text-amber-400'
            }`}
          >
            <div className="text-lg mb-0.5">🗺️</div>
            Map
          </button>
          <button
            onClick={() => setMobilePanel('chat')}
            className={`flex-1 py-3 text-center text-xs font-medium transition ${
              mobilePanel === 'chat' ? 'text-amber-600 bg-amber-50' : 'text-amber-400'
            }`}
          >
            <div className="text-lg mb-0.5">💬</div>
            Chat
          </button>
          {isQuestZone && (
            <button
              onClick={() => setMobilePanel('zone')}
              className={`flex-1 py-3 text-center text-xs font-medium transition ${
                mobilePanel === 'zone' ? 'text-amber-600 bg-amber-50' : 'text-amber-400'
              }`}
            >
              <div className="text-lg mb-0.5">{selectedZone.emoji}</div>
              {selectedZone.name.slice(0, 8)}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
