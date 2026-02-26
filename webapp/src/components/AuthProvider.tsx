'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { supabase, type Bee } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  bee: Bee | null
  loading: boolean
  signInWithGitHub: () => Promise<void>
  signOut: () => Promise<void>
  refreshBee: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  bee: null,
  loading: true,
  signInWithGitHub: async () => {},
  signOut: async () => {},
  refreshBee: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [bee, setBee] = useState<Bee | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchBee = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('bees')
      .select('*')
      .eq('user_id', userId)
      .single()
    setBee(data as Bee | null)
  }, [])

  const refreshBee = useCallback(async () => {
    if (user) await fetchBee(user.id)
  }, [user, fetchBee])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchBee(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchBee(session.user.id)
      } else {
        setBee(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [fetchBee])

  const signInWithGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/join` },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setBee(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, bee, loading, signInWithGitHub, signOut, refreshBee }}>
      {children}
    </AuthContext.Provider>
  )
}
