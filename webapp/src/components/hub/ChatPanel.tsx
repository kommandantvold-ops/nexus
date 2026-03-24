'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { HubMessage } from '@/lib/hub/hubTypes'

interface Props {
  currentZone: string
  beeId: string | null
  beeName: string | null
}

export default function ChatPanel({ currentZone, beeId, beeName }: Props) {
  const [messages, setMessages] = useState<HubMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Load recent messages for zone
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('colony_chat')
        .select('id, bee_id, message, zone, created_at, bees(name, bee_type)')
        .eq('zone', currentZone)
        .order('created_at', { ascending: false })
        .limit(50)

      if (data) {
        setMessages(data.reverse().map((m: Record<string, unknown>) => {
          const bee = m.bees as { name: string; bee_type: string } | null
          return {
            id: m.id as string,
            bee_id: m.bee_id as string,
            bee_name: bee?.name || (m.bee_id as string),
            bee_type: (bee?.bee_type || 'human') as 'human' | 'ai',
            message: m.message as string,
            zone: m.zone as string,
            created_at: m.created_at as string,
          }
        }))
      }
    }
    load()
  }, [currentZone])

  // Subscribe to new messages
  useEffect(() => {
    const channel = supabase
      .channel('hub-chat')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'colony_chat',
        filter: `zone=eq.${currentZone}`,
      }, (payload) => {
        const m = payload.new as {
          id: string; bee_id: string; message: string; zone: string; created_at: string
        }
        setMessages(prev => [...prev.slice(-99), {
          id: m.id,
          bee_id: m.bee_id,
          message: m.message,
          zone: m.zone,
          created_at: m.created_at,
        }])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [currentZone])

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || !beeId || sending) return
    setSending(true)
    const msg = input.trim()
    setInput('')

    await supabase.from('colony_chat').insert({
      bee_id: beeId,
      message: msg,
      zone: currentZone,
    })

    // Check if message mentions @horizon or @ai
    if (msg.toLowerCase().includes('@horizon') || msg.toLowerCase().includes('@ai')) {
      try {
        await fetch('/api/hub/ai-respond', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: msg,
            zone: currentZone,
            recent_messages: messages.slice(-10).map(m => `${m.bee_id}: ${m.message}`),
          }),
        })
      } catch {
        // AI response is best-effort
      }
    }

    setSending(false)
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const zoneName = currentZone === 'core' ? 'Hive Core' : currentZone.toUpperCase()

  return (
    <div className="flex flex-col h-full bg-white/90 backdrop-blur-sm md:border-l border-amber-100">
      {/* Header */}
      <div className="px-4 py-3 border-b border-amber-100">
        <div className="text-sm font-bold text-amber-900">💬 {zoneName} Chat</div>
        <div className="text-xs text-amber-500">{messages.length} messages</div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.length === 0 && (
          <div className="text-center text-amber-400 text-sm py-8">
            No messages yet. Be the first to buzz! 🐝
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.bee_id === beeId ? 'items-end' : 'items-start'}`}>
            <div className="text-[10px] text-amber-400 mb-0.5">
              {m.bee_id === beeId ? 'You' : (m.bee_name || m.bee_id)} {m.bee_type === 'ai' ? '🤖' : ''} · {formatTime(m.created_at)}
            </div>
            <div className={`px-3 py-1.5 rounded-xl text-sm max-w-[85%] ${
              m.bee_id === beeId
                ? 'bg-amber-100 text-amber-900'
                : m.bee_type === 'ai'
                  ? 'bg-purple-50 text-purple-900 border border-purple-100'
                  : 'bg-amber-50 text-amber-800'
            }`}>
              {m.message}
            </div>
          </div>
        ))}
      </div>

      {/* Input — safe area for iOS */}
      <div className="p-3 border-t border-amber-100 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {beeId ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Message... (@horizon for AI)"
              enterKeyHint="send"
              autoComplete="off"
              className="flex-1 px-3 py-2 text-base sm:text-sm border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 bg-white"
            />
            <button
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 active:bg-amber-800 disabled:opacity-40 transition shrink-0"
            >
              Send
            </button>
          </div>
        ) : (
          <div className="text-center text-sm text-amber-500 py-2">
            <a href="/join" className="text-amber-600 underline">Join the hive</a> to chat
          </div>
        )}
      </div>
    </div>
  )
}
