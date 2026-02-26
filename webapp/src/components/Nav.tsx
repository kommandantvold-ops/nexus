'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'

export default function Nav({ active }: { active?: string }) {
  const { bee, loading } = useAuth()

  const linkClass = (name: string) =>
    name === active
      ? 'font-semibold text-amber-600'
      : 'hover:text-amber-600 transition'

  return (
    <header className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
      <Link href="/" className="flex items-center gap-3">
        <span className="text-3xl">🐝</span>
        <span className="text-2xl font-bold text-amber-900">Nexus</span>
      </Link>
      <nav className="flex gap-6 text-amber-800 items-center">
        <Link href="/quests" className={linkClass('quests')}>Quests</Link>
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
    </header>
  )
}
