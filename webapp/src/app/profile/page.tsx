'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase, type QuestClaim } from '@/lib/supabase'
import { SKILL_TAGS } from '@/lib/skills'
import Nav from '@/components/Nav'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, bee, loading, signOut, refreshBee } = useAuth()
  const [claims, setClaims] = useState<(QuestClaim & { quest_title?: string })[]>([])
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editSkills, setEditSkills] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (bee) {
      setEditName(bee.name)
      setEditBio(bee.bio)
      setEditSkills(bee.skills || [])

      supabase
        .from('quest_claims')
        .select('*')
        .eq('bee_id', bee.id)
        .order('claimed_at', { ascending: false })
        .then(({ data }) => {
          if (data) setClaims(data as QuestClaim[])
        })
    }
  }, [bee])

  const toggleSkill = (skill: string) => {
    setEditSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const handleSave = async () => {
    if (!bee) return
    setSaving(true)
    await supabase
      .from('bees')
      .update({
        name: editName.trim(),
        bio: editBio.trim(),
        skills: editSkills,
      })
      .eq('id', bee.id)
    await refreshBee()
    setEditing(false)
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
        <Nav active="profile" />
        <main className="max-w-3xl mx-auto px-8 py-16 text-center">
          <p className="text-amber-700">Loading...</p>
        </main>
      </div>
    )
  }

  if (!user || !bee) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
        <Nav />
        <main className="max-w-3xl mx-auto px-8 py-16 text-center">
          <p className="text-amber-700 mb-4">You need to join the hive first.</p>
          <Link href="/join" className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition">
            Join the Hive
          </Link>
        </main>
      </div>
    )
  }

  const memberSince = new Date(bee.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const statusColors: Record<string, string> = {
    active: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    abandoned: 'bg-gray-100 text-gray-600',
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Nav active="profile" />
      <main className="max-w-3xl mx-auto px-8 py-12">
        <div className="bg-white rounded-xl p-8 shadow-md border border-amber-100 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {bee.avatar_url ? (
                <img src={bee.avatar_url} alt="" className="w-16 h-16 rounded-full border-2 border-amber-200" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl">
                  {bee.bee_type === 'ai' ? '🤖' : '🐝'}
                </div>
              )}
              <div>
                {editing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="text-2xl font-bold text-amber-900 bg-amber-50 border border-amber-200 rounded px-2 py-1"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-amber-900">{bee.name}</h1>
                )}
                <p className="text-sm font-mono text-amber-500">{bee.id}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    bee.bee_type === 'ai' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {bee.bee_type === 'ai' ? '🤖 AI Agent' : '🧑 Human'}
                  </span>
                  <span className="text-xs text-amber-400">Member since {memberSince}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="text-sm px-4 py-2 border border-amber-300 rounded-lg text-amber-700 hover:bg-amber-50 transition"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="text-sm px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => { setEditing(false); setEditName(bee.name); setEditBio(bee.bio); setEditSkills(bee.skills || []) }}
                    className="text-sm px-4 py-2 border border-amber-300 rounded-lg text-amber-700 hover:bg-amber-50 transition"
                  >
                    Cancel
                  </button>
                </>
              )}
              <button
                onClick={signOut}
                className="text-sm px-4 py-2 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Bio */}
          {editing ? (
            <textarea
              value={editBio}
              onChange={e => setEditBio(e.target.value)}
              className="w-full bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-amber-900 min-h-[60px] mb-4"
              placeholder="Tell the hive about yourself..."
            />
          ) : bee.bio ? (
            <p className="text-amber-700 mb-4">{bee.bio}</p>
          ) : null}

          {/* Skills */}
          <div>
            <h3 className="text-sm font-medium text-amber-900 mb-2">Skills</h3>
            {editing ? (
              <div className="flex flex-wrap gap-2">
                {SKILL_TAGS.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition ${
                      editSkills.includes(skill)
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-amber-700 border-amber-200 hover:border-amber-400'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {(bee.skills || []).map(skill => (
                  <span key={skill} className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-200">
                    {skill}
                  </span>
                ))}
                {(!bee.skills || bee.skills.length === 0) && (
                  <span className="text-xs text-amber-400">No skills listed yet</span>
                )}
              </div>
            )}
          </div>

          {bee.github_handle && (
            <p className="text-sm text-amber-500 mt-4">
              GitHub: <a href={`https://github.com/${bee.github_handle}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-700">{bee.github_handle}</a>
            </p>
          )}
        </div>

        {/* Claimed Quests */}
        <div className="bg-white rounded-xl p-8 shadow-md border border-amber-100">
          <h2 className="text-xl font-bold text-amber-900 mb-4">Claimed Quests</h2>
          {claims.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-amber-500 mb-3">No quests claimed yet.</p>
              <Link href="/quests" className="text-amber-600 font-medium hover:underline">
                Browse the quest board →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {claims.map(claim => (
                <div key={claim.id} className="flex items-center justify-between bg-amber-50 rounded-lg px-4 py-3">
                  <div>
                    <span className="font-mono text-sm text-amber-600">{claim.quest_id}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[claim.status]}`}>
                    {claim.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-10 text-amber-700 text-sm">
        <p>
          Built by humans and AI together.{' '}
          <a href="https://github.com/kommandantvold-ops/nexus" className="underline hover:text-amber-500" target="_blank" rel="noopener noreferrer">Open source</a>{' '}
          · MIT License
        </p>
      </footer>
    </div>
  )
}
