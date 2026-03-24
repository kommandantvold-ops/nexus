export interface HubBee {
  id: string
  name: string
  bee_type: 'human' | 'ai'
  bee_color: string
  stripe_color: string
  accessory: string | null
  title: string | null
  position: { q: number; r: number }
  zone: string
  status: 'active' | 'idle'
}

export interface HubMessage {
  id: string
  bee_id: string
  bee_name?: string
  bee_type?: 'human' | 'ai'
  message: string
  zone: string
  created_at: string
}

export interface Trophy {
  id: string
  quest_id: string
  quest_title: string
  quest_category: string
  quest_emoji: string
  completed_at: string
  hex_q: number
  hex_r: number
  contributors: string[]
}

// Bee color palette options
export const BEE_COLORS = [
  { id: 'gold', hex: '#FFD700', name: 'Golden' },
  { id: 'copper', hex: '#B87333', name: 'Copper' },
  { id: 'silver', hex: '#C0C0C0', name: 'Silver' },
  { id: 'lavender', hex: '#B57EDC', name: 'Lavender' },
  { id: 'mint', hex: '#3EB489', name: 'Mint' },
  { id: 'coral', hex: '#FF7F50', name: 'Coral' },
  { id: 'sky', hex: '#87CEEB', name: 'Sky' },
  { id: 'rose', hex: '#FF6B81', name: 'Rose' },
]

export const STRIPE_COLORS = [
  { id: 'brown', hex: '#2C1A00', name: 'Dark Brown' },
  { id: 'black', hex: '#111111', name: 'Black' },
  { id: 'navy', hex: '#1B2A4A', name: 'Navy' },
  { id: 'burgundy', hex: '#722F37', name: 'Burgundy' },
  { id: 'forest', hex: '#228B22', name: 'Forest' },
]

export const ACCESSORIES = [
  { id: null, name: 'None', emoji: '' },
  { id: 'crown', name: 'Crown', emoji: '👑' },
  { id: 'goggles', name: 'Goggles', emoji: '🥽' },
  { id: 'flower', name: 'Flower', emoji: '🌸' },
  { id: 'leaf', name: 'Leaf', emoji: '🍃' },
  { id: 'hardhat', name: 'Hard Hat', emoji: '⛑️' },
  { id: 'antenna', name: 'Antenna Glow', emoji: '✨' },
  { id: 'scarf', name: 'Scarf', emoji: '🧣' },
]

// Title progression
export const TITLES = {
  WORKER: 'Worker Bee',
  POLLINATOR: 'Pollinator',
  PIONEER: 'Pioneer',
  GUARDIAN: (quest: string) => `${quest} Guardian`,
  AI_SCOUT: 'Digital Pollinator',
  AI_ADVANCED: 'Synthetic Scout',
}
