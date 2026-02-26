import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Bee = {
  id: string
  user_id: string
  name: string
  bee_type: 'human' | 'ai'
  github_handle: string | null
  avatar_url: string | null
  skills: string[]
  bio: string
  created_at: string
}

export type QuestClaim = {
  id: string
  bee_id: string
  quest_id: string
  status: 'active' | 'completed' | 'abandoned'
  claimed_at: string
  updated_at: string
}
