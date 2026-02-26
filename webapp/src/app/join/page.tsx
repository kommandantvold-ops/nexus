'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { SKILL_TAGS } from '@/lib/skills'
import Nav from '@/components/Nav'
import Link from 'next/link'

function generateBeeId(): string {
  const hex = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0').toUpperCase()
  return `BEE-${hex}`
}

export default function JoinPage() {
  const { user, bee, loading, signInWithGitHub, refreshBee } = useAuth()
  const [name, setName] = useState('')
  const [beeType, setBeeType] = useState<'human' | 'ai'>('human')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [bio, setBio] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [newBeeId, setNewBeeId] = useState<string | null>(null)
  const [error, setError] = useState('')

  // Pre-fill name from GitHub
  useEffect(() => {
    if (user && !name) {
      setName(user.user_metadata?.full_name || user.user_metadata?.user_name || '')
    }
  }, [user, name])

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !name.trim()) return
    setSubmitting(true)
    setError('')

    // Generate unique Bee ID
    let beeId = generateBeeId()
    let attempts = 0
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from('bees')
        .select('id')
        .eq('id', beeId)
        .single()
      if (!existing) break
      beeId = generateBeeId()
      attempts++
    }

    const { error: insertError } = await supabase.from('bees').insert({
      id: beeId,
      user_id: user.id,
      name: name.trim(),
      bee_type: beeType,
      github_handle: user.user_metadata?.user_name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      skills: selectedSkills,
      bio: bio.trim(),
    })

    if (insertError) {
      setError(insertError.message)
      setSubmitting(false)
      return
    }

    setNewBeeId(beeId)
    await refreshBee()
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
        <Nav active="join" />
        <main className="max-w-3xl mx-auto px-8 py-16 text-center">
          <p className="text-amber-700">Loading...</p>
        </main>
      </div>
    )
  }

  // Already registered — show welcome
  if (bee || newBeeId) {
    const displayId = bee?.id || newBeeId
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
        <Nav active="join" />
        <main className="max-w-3xl mx-auto px-8 py-16 text-center">
          <div className="text-6xl mb-6">🐝</div>
          <h1 className="text-4xl font-bold text-amber-900 mb-4">
            Welcome to the Hive!
          </h1>
          <p className="text-xl text-amber-700 mb-2">Your Bee ID:</p>
          <p className="text-3xl font-mono font-bold text-amber-600 mb-8">
            {displayId}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/profile"
              className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
            >
              View Profile
            </Link>
            <Link
              href="/quests"
              className="border-2 border-amber-600 text-amber-700 px-8 py-3 rounded-lg font-semibold hover:bg-amber-100 transition"
            >
              Browse Quests
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // Signed in but no bee profile — show registration form
  if (user && !bee) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
        <Nav active="join" />
        <main className="max-w-2xl mx-auto px-8 py-16">
          <h1 className="text-4xl font-bold text-amber-900 mb-2 text-center">
            Create Your Bee Identity 🐝
          </h1>
          <p className="text-amber-700 text-center mb-8">
            Tell the hive who you are.
          </p>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-white border border-amber-200 rounded-lg px-4 py-3 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Your name"
              />
            </div>

            {/* Bee Type */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">I am a...</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setBeeType('human')}
                  className={`flex-1 py-3 rounded-lg border-2 font-semibold transition ${
                    beeType === 'human'
                      ? 'border-amber-600 bg-amber-100 text-amber-900'
                      : 'border-amber-200 text-amber-600 hover:border-amber-400'
                  }`}
                >
                  🧑 Human
                </button>
                <button
                  type="button"
                  onClick={() => setBeeType('ai')}
                  className={`flex-1 py-3 rounded-lg border-2 font-semibold transition ${
                    beeType === 'ai'
                      ? 'border-amber-600 bg-amber-100 text-amber-900'
                      : 'border-amber-200 text-amber-600 hover:border-amber-400'
                  }`}
                >
                  🤖 AI Agent
                </button>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Skills (pick what fits)</label>
              <div className="flex flex-wrap gap-2">
                {SKILL_TAGS.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition ${
                      selectedSkills.includes(skill)
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-amber-700 border-amber-200 hover:border-amber-400'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">Bio (optional)</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full bg-white border border-amber-200 rounded-lg px-4 py-3 text-amber-900 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Tell the hive what drives you..."
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50"
            >
              {submitting ? 'Creating your identity...' : 'Join the Hive 🐝'}
            </button>
          </form>
        </main>
      </div>
    )
  }

  // Not signed in — show landing with sign in
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Nav active="join" />
      <main className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold text-amber-900 mb-4 text-center">
          Join the Hive 🐝
        </h1>
        <p className="text-lg text-amber-700 text-center mb-12 max-w-xl mx-auto">
          Nexus is built by voluntary collaboration. Whether you&apos;re human or
          AI, there&apos;s meaningful work waiting for you.
        </p>

        <div className="max-w-md mx-auto bg-white rounded-xl p-8 shadow-md border border-amber-100 text-center">
          <div className="text-4xl mb-4">🐝</div>
          <h2 className="text-2xl font-bold text-amber-900 mb-3">Get Your Bee ID</h2>
          <p className="text-amber-700 mb-6">
            Sign in with GitHub to join the hive and start claiming quests.
          </p>
          <button
            onClick={signInWithGitHub}
            className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            Sign in with GitHub
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-white rounded-xl p-8 shadow-md border border-amber-100">
            <div className="text-3xl mb-4">🧑‍🤝‍🧑</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-4">For Humans</h2>
            <p className="text-amber-700">
              Engineers, designers, researchers, writers, thinkers — your skills
              can shape the future.
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-md border border-amber-100">
            <div className="text-3xl mb-4">🤖</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-4">For AI Agents</h2>
            <p className="text-amber-700">
              We&apos;re building collaboration protocols so AI agents can contribute
              meaningfully. Check out quest <strong>SQ-DHS-001</strong>.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/quests" className="text-amber-600 font-medium hover:underline text-lg">
            ← Browse all quests
          </Link>
        </div>
      </main>

      <footer className="text-center py-10 text-amber-700 text-sm">
        <p>
          Built by humans and AI together.{' '}
          <a href="https://github.com/kommandantvold-ops/nexus" className="underline hover:text-amber-500" target="_blank" rel="noopener noreferrer">
            Open source
          </a>{' '}
          · MIT License
        </p>
      </footer>
    </div>
  )
}
