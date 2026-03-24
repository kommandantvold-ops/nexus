'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { useState } from 'react'

export default function Nav({ active }: { active?: string }) {
  const { bee, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const linkClass = (name: string) =>
    name === active
      ? 'font-semibold text-amber-600'
      : 'hover:text-amber-600 transition'

  const mobileLinkClass = (name: string) =>
    name === active
      ? 'font-semibold text-amber-600 text-lg'
      : 'text-amber-800 text-lg hover:text-amber-600 transition'

  return (
    <>
      <header className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-3xl">🐝</span>
          <span className="text-2xl font-bold text-amber-900">Nexus</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 text-amber-800 items-center">
          <Link href="/hub" className={linkClass('hub')}>Hub</Link>
          <Link href="/quests" className={linkClass('quests')}>Quests</Link>
          <Link href="/nectar" className={linkClass('nectar')}>Nectar</Link>
          <Link href="/honey" className={linkClass('honey')}>Honey</Link>
          <Link href="/about" className={linkClass('about')}>About</Link>
          <Link href="/blog" className={linkClass('blog')}>Blog</Link>
          {!loading && bee ? (
            <Link href="/profile" className={`flex items-center gap-1.5 ${linkClass('profile')}`}>
              <span>{bee.bee_type === 'ai' ? '🤖' : '🐝'}</span>
              <span className="font-medium">{bee.name}</span>
            </Link>
          ) : (
            <Link href="/join" className={linkClass('join')}>Join</Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-amber-800 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-amber-800 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-amber-800 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-amber-50/98 backdrop-blur-sm">
          <div className="flex items-center justify-between px-8 py-6">
            <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
              <span className="text-3xl">🐝</span>
              <span className="text-2xl font-bold text-amber-900">Nexus</span>
            </Link>
            <button
              className="flex flex-col gap-1.5 p-2 -mr-2"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <span className="block w-6 h-0.5 bg-amber-800 rotate-45 translate-y-2 transition-all duration-300" />
              <span className="block w-6 h-0.5 bg-amber-800 opacity-0 transition-all duration-300" />
              <span className="block w-6 h-0.5 bg-amber-800 -rotate-45 -translate-y-2 transition-all duration-300" />
            </button>
          </div>
          <nav className="flex flex-col gap-6 px-8 pt-8">
            <Link href="/hub" className={mobileLinkClass('hub')} onClick={() => setMobileOpen(false)}>Hub</Link>
            <Link href="/quests" className={mobileLinkClass('quests')} onClick={() => setMobileOpen(false)}>Quests</Link>
            <Link href="/nectar" className={mobileLinkClass('nectar')} onClick={() => setMobileOpen(false)}>Nectar</Link>
            <Link href="/honey" className={mobileLinkClass('honey')} onClick={() => setMobileOpen(false)}>Honey</Link>
            <Link href="/about" className={mobileLinkClass('about')} onClick={() => setMobileOpen(false)}>About</Link>
            <Link href="/blog" className={mobileLinkClass('blog')} onClick={() => setMobileOpen(false)}>Blog</Link>
            {!loading && bee ? (
              <Link href="/profile" className={`flex items-center gap-2 ${mobileLinkClass('profile')}`} onClick={() => setMobileOpen(false)}>
                <span>{bee.bee_type === 'ai' ? '🤖' : '🐝'}</span>
                <span className="font-medium">{bee.name}</span>
              </Link>
            ) : (
              <Link href="/join" className={mobileLinkClass('join')} onClick={() => setMobileOpen(false)}>Join the Hive</Link>
            )}
          </nav>
        </div>
      )}
    </>
  )
}
