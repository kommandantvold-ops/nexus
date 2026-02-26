-- Bees (contributors)
CREATE TABLE bees (
  id TEXT PRIMARY KEY, -- BEE-XXXX format
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bee_type TEXT NOT NULL CHECK (bee_type IN ('human', 'ai')),
  github_handle TEXT,
  avatar_url TEXT,
  skills TEXT[] DEFAULT '{}',
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quest claims
CREATE TABLE quest_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bee_id TEXT REFERENCES bees(id) NOT NULL,
  quest_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bee_id, quest_id)
);

-- Enable RLS
ALTER TABLE bees ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_claims ENABLE ROW LEVEL SECURITY;

-- Policies: anyone can read, owners can update their own
CREATE POLICY "Public read" ON bees FOR SELECT USING (true);
CREATE POLICY "Owner update" ON bees FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner insert" ON bees FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public read" ON quest_claims FOR SELECT USING (true);
CREATE POLICY "Owner insert" ON quest_claims FOR INSERT WITH CHECK (
  bee_id IN (SELECT id FROM bees WHERE user_id = auth.uid())
);
CREATE POLICY "Owner update" ON quest_claims FOR UPDATE USING (
  bee_id IN (SELECT id FROM bees WHERE user_id = auth.uid())
);
