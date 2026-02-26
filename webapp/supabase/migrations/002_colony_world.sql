-- Colony world state
CREATE TABLE colony_hexes (
  coord TEXT PRIMARY KEY, -- "q,r" format
  hex_type TEXT NOT NULL DEFAULT 'empty',
  built_by TEXT REFERENCES bees(id),
  built_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE colony_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bee_id TEXT REFERENCES bees(id) UNIQUE NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  position_q INTEGER NOT NULL DEFAULT 0,
  position_r INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'idle', 'disconnected')),
  last_action_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE colony_resources (
  id TEXT PRIMARY KEY DEFAULT 'main',
  wood INTEGER NOT NULL DEFAULT 30,
  clay INTEGER NOT NULL DEFAULT 15,
  metal INTEGER NOT NULL DEFAULT 5,
  water INTEGER NOT NULL DEFAULT 10,
  food INTEGER NOT NULL DEFAULT 10,
  energy INTEGER NOT NULL DEFAULT 10,
  research INTEGER NOT NULL DEFAULT 0,
  population INTEGER NOT NULL DEFAULT 0,
  population_max INTEGER NOT NULL DEFAULT 2,
  cycle INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE colony_chat (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bee_id TEXT REFERENCES bees(id) NOT NULL,
  message TEXT NOT NULL,
  position_q INTEGER,
  position_r INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE colony_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bee_id TEXT REFERENCES bees(id) NOT NULL,
  action_type TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE colony_hexes ENABLE ROW LEVEL SECURITY;
ALTER TABLE colony_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE colony_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE colony_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE colony_actions ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read" ON colony_hexes FOR SELECT USING (true);
CREATE POLICY "Public read" ON colony_agents FOR SELECT USING (true);
CREATE POLICY "Public read" ON colony_resources FOR SELECT USING (true);
CREATE POLICY "Public read" ON colony_chat FOR SELECT USING (true);
CREATE POLICY "Public read" ON colony_actions FOR SELECT USING (true);

-- Service role write
CREATE POLICY "Service write hexes" ON colony_hexes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service write agents" ON colony_agents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service write resources" ON colony_resources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service write chat" ON colony_chat FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service write actions" ON colony_actions FOR ALL USING (true) WITH CHECK (true);

-- Initialize resources
INSERT INTO colony_resources (id) VALUES ('main');

-- Initialize hex grid
INSERT INTO colony_hexes (coord, hex_type) VALUES
  ('0,0', 'hive_core'),
  ('1,0', 'empty'), ('0,1', 'empty'), ('-1,1', 'empty'),
  ('-1,0', 'forest'), ('0,-1', 'empty'), ('1,-1', 'empty'),
  ('2,0', 'empty'), ('1,1', 'clay'), ('0,2', 'forest'),
  ('-1,2', 'empty'), ('-2,2', 'empty'), ('-2,1', 'metal'),
  ('-2,0', 'forest'), ('-1,-1', 'empty'), ('0,-2', 'clay'),
  ('1,-2', 'forest'), ('2,-2', 'empty'), ('2,-1', 'empty');
