'use client'

import type { HubBee } from '@/lib/hub/hubTypes'
import { BEE_COLORS } from '@/lib/hub/hubTypes'
import type { Zone } from '@/lib/hub/zones'

interface Props {
  onlineBees: HubBee[]
  currentZone: Zone | null
  questCount: number
}

export default function PresenceBar({ onlineBees, currentZone, questCount }: Props) {
  const humans = onlineBees.filter(b => b.bee_type === 'human')
  const ais = onlineBees.filter(b => b.bee_type === 'ai')

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white/90 backdrop-blur-sm border-b border-amber-100">
      {/* Left — zone info */}
      <div className="flex items-center gap-3">
        {currentZone ? (
          <>
            <span className="text-xl">{currentZone.emoji}</span>
            <div>
              <div className="text-sm font-bold text-amber-900">{currentZone.name}</div>
              <div className="text-xs text-amber-500">
                {currentZone.sdg && <span className="mr-2">{currentZone.sdg}</span>}
                {currentZone.category !== 'core' && currentZone.category !== 'trophies' && (
                  <span>{questCount} quests</span>
                )}
                {currentZone.category === 'core' && 'Welcome to the hive'}
                {currentZone.category === 'trophies' && 'Hall of achievements'}
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm text-amber-700">Click a hex to enter a zone</div>
        )}
      </div>

      {/* Right — presence */}
      <div className="flex items-center gap-3">
        {/* Bee avatars */}
        <div className="flex -space-x-1.5">
          {onlineBees.slice(0, 8).map((bee) => {
            const color = BEE_COLORS.find(c => c.id === bee.bee_color)?.hex || '#FFD700'
            return (
              <div
                key={bee.id}
                className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[8px]"
                style={{ backgroundColor: color }}
                title={`${bee.name} (${bee.bee_type})`}
              >
                {bee.bee_type === 'ai' ? '🤖' : ''}
              </div>
            )
          })}
          {onlineBees.length > 8 && (
            <div className="w-6 h-6 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-[9px] text-amber-600 font-bold">
              +{onlineBees.length - 8}
            </div>
          )}
        </div>

        {/* Count */}
        <div className="text-xs text-amber-600">
          <span className="font-semibold">{humans.length}</span> 🐝
          {ais.length > 0 && (
            <span className="ml-1.5">
              <span className="font-semibold">{ais.length}</span> 🤖
            </span>
          )}
        </div>

        {/* Online indicator */}
        <div className="flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] text-green-600 font-medium">LIVE</span>
        </div>
      </div>
    </div>
  )
}
