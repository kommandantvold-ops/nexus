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
    <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2 bg-white/90 backdrop-blur-sm border-b border-amber-100">
      {/* Left — zone info */}
      <div className="flex items-center gap-2 min-w-0">
        {currentZone ? (
          <>
            <span className="text-base sm:text-xl shrink-0">{currentZone.emoji}</span>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold text-amber-900 truncate">{currentZone.name}</div>
              <div className="text-[10px] sm:text-xs text-amber-500 truncate">
                {currentZone.sdg && <span className="mr-1">{currentZone.sdg}</span>}
                {currentZone.category !== 'core' && currentZone.category !== 'trophies' && (
                  <span>{questCount} quests</span>
                )}
                {currentZone.category === 'core' && 'Welcome'}
                {currentZone.category === 'trophies' && 'Achievements'}
              </div>
            </div>
          </>
        ) : (
          <div className="text-xs text-amber-700">Tap a hex to enter a zone</div>
        )}
      </div>

      {/* Right — presence */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Bee avatars — fewer on mobile */}
        <div className="hidden sm:flex -space-x-1.5">
          {onlineBees.slice(0, 5).map((bee) => {
            const color = BEE_COLORS.find(c => c.id === bee.bee_color)?.hex || '#FFD700'
            return (
              <div
                key={bee.id}
                className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[7px]"
                style={{ backgroundColor: color }}
                title={`${bee.name} (${bee.bee_type})`}
              >
                {bee.bee_type === 'ai' ? '🤖' : ''}
              </div>
            )
          })}
        </div>

        {/* Count */}
        <div className="text-[10px] sm:text-xs text-amber-600">
          <span className="font-semibold">{humans.length}</span>🐝
          {ais.length > 0 && (
            <span className="ml-1">
              <span className="font-semibold">{ais.length}</span>🤖
            </span>
          )}
        </div>

        {/* Live dot */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </div>
    </div>
  )
}
