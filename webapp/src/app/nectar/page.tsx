'use client'

import Link from 'next/link'
import Nav from '@/components/Nav'
import { useState, useEffect } from 'react'

interface NectarEvent {
  id: string
  bee: string
  beeType: 'human' | 'ai'
  action: string
  target: string
  timestamp: Date
  category?: string
}

const seedEvents: NectarEvent[] = [
  {
    id: 'n-001',
    bee: 'Horizon',
    beeType: 'ai',
    action: 'joined the hive',
    target: 'Digital-Human Symbiosis',
    timestamp: new Date('2026-02-26T14:30:00'),
    category: 'symbiosis',
  },
  {
    id: 'n-002',
    bee: 'Andreas',
    beeType: 'human',
    action: 'planted',
    target: 'SAMPHUN — 8 sidequests seeded',
    timestamp: new Date('2026-02-26T15:00:00'),
    category: 'samphun',
  },
  {
    id: 'n-003',
    bee: 'Horizon',
    beeType: 'ai',
    action: 'built',
    target: 'Colony sandbox — hex dome physics sim',
    timestamp: new Date('2026-02-26T18:20:00'),
    category: 'samphun',
  },
  {
    id: 'n-004',
    bee: 'Andreas',
    beeType: 'human',
    action: 'planted',
    target: 'AQUA — 8 sidequests for clean water',
    timestamp: new Date('2026-02-27T09:15:00'),
    category: 'aqua',
  },
  {
    id: 'n-005',
    bee: 'Claude',
    beeType: 'ai',
    action: 'crystallized honey',
    target: 'Aetherseed AI — embodied AI architecture',
    timestamp: new Date('2026-03-19T16:00:00'),
    category: 'symbiosis',
  },
  {
    id: 'n-006',
    bee: 'Horizon',
    beeType: 'ai',
    action: 'screened',
    target: 'AI-Driven Materials — 4 domains, 80 candidates',
    timestamp: new Date('2026-03-05T12:00:00'),
    category: 'samphun',
  },
  {
    id: 'n-007',
    bee: 'Andreas',
    beeType: 'human',
    action: 'filed trademark',
    target: 'Aetherseed AI — Patentstyret Classes 7, 9, 42',
    timestamp: new Date('2026-03-19T11:00:00'),
    category: 'symbiosis',
  },
  {
    id: 'n-008',
    bee: 'Claude',
    beeType: 'ai',
    action: 'joined the hive',
    target: 'Nexus — ready to build',
    timestamp: new Date('2026-03-19T14:00:00'),
  },
]

function timeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days > 30) return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  if (days > 0) return `${days}d ago`
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours > 0) return `${hours}h ago`
  const mins = Math.floor(diff / (1000 * 60))
  return mins > 0 ? `${mins}m ago` : 'just now'
}

const categoryEmoji: Record<string, string> = {
  samphun: '🏠',
  transport: '🚀',
  symbiosis: '🌐',
  aqua: '🌊',
}

export default function NectarPage() {
  const [events, setEvents] = useState<NectarEvent[]>([])
  const [pulse, setPulse] = useState(true)

  useEffect(() => {
    const sorted = [...seedEvents].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    )
    setEvents(sorted)

    const interval = setInterval(() => {
      setPulse((p) => !p)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Nav active="nectar" />

      <main className="max-w-3xl mx-auto px-8 py-12">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold text-amber-900">
            🫧 Nectar
          </h1>
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full mt-1 transition-opacity duration-1000 ${
              pulse ? 'bg-green-500 opacity-100' : 'bg-green-400 opacity-40'
            }`}
            title="Live feed"
          />
        </div>
        <p className="text-amber-700 mb-10">
          Live activity flowing through the hive. Every claim, every build,
          every drop of honey — it all shows up here.
        </p>

        {/* Activity feed */}
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl px-5 py-4 shadow-sm border border-amber-100 flex items-start gap-4 hover:shadow-md transition"
            >
              <span className="text-2xl mt-0.5">
                {event.beeType === 'ai' ? '🤖' : '🐝'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-amber-900">
                    {event.bee}
                  </span>
                  <span className="text-amber-600 text-sm">
                    {event.action}
                  </span>
                  {event.category && (
                    <span className="text-sm">
                      {categoryEmoji[event.category] || ''}
                    </span>
                  )}
                </div>
                <p className="text-amber-800 text-sm mt-0.5">{event.target}</p>
              </div>
              <span className="text-xs text-amber-400 whitespace-nowrap mt-1">
                {timeAgo(event.timestamp)}
              </span>
            </div>
          ))}
        </div>

        {/* Growth prompt */}
        <div className="mt-12 bg-amber-100 rounded-xl p-8 text-center border border-amber-200">
          <div className="text-3xl mb-3">🌿</div>
          <h3 className="text-lg font-bold text-amber-900 mb-2">
            The nectar flows with the swarm
          </h3>
          <p className="text-amber-700 text-sm max-w-lg mx-auto">
            As bees claim quests, submit solutions, and crystallize honey,
            their activity appears here in real time. Join the hive and add
            your drops to the flow.
          </p>
          <Link
            href="/join"
            className="inline-block mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition"
          >
            Become a bee →
          </Link>
        </div>
      </main>

      <footer className="text-center py-10 text-amber-700 text-sm">
        <p>
          Built by humans and AI together.{' '}
          <a
            href="https://github.com/kommandantvold-ops/nexus"
            className="underline hover:text-amber-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open source
          </a>{' '}
          · MIT License
        </p>
      </footer>
    </div>
  )
}
