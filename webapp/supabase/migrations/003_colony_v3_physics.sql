-- Colony v3: Physics sim enhancements
-- Adds weather tracking, expanded hex grid, and webhook spawn support

-- ─── Weather state table ──────────────────────────────────
CREATE TABLE IF NOT EXISTS colony_weather (
  id TEXT PRIMARY KEY DEFAULT 'current',
  wind_direction REAL NOT NULL DEFAULT 0,       -- radians
  wind_strength REAL NOT NULL DEFAULT 0.3,      -- 0-1
  weather_type TEXT NOT NULL DEFAULT 'clear',    -- clear/calm/breezy/stormy
  temperature REAL NOT NULL DEFAULT 20.0,        -- celsius (flavor)
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO colony_weather (id) VALUES ('current')
  ON CONFLICT (id) DO NOTHING;

-- ─── Weather effects on resource production ───────────────
-- Tracks per-cycle weather multipliers (logged for replay)
CREATE TABLE IF NOT EXISTS colony_weather_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle INTEGER NOT NULL,
  weather_type TEXT NOT NULL,
  multipliers JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Expand the hex grid ──────────────────────────────────
-- Add ring 3 hexes for dome growth
INSERT INTO colony_hexes (coord, hex_type) VALUES
  ('3,0', 'fog'), ('3,-1', 'fog'), ('3,-2', 'fog'), ('3,-3', 'fog'),
  ('2,1', 'fog'), ('1,2', 'fog'), ('0,3', 'fog'),
  ('-1,3', 'fog'), ('-2,3', 'fog'), ('-3,3', 'fog'),
  ('-3,2', 'fog'), ('-3,1', 'fog'), ('-3,0', 'fog'),
  ('2,-3', 'fog'), ('1,-3', 'forest'),
  ('0,-3', 'fog'), ('-1,-2', 'metal'), ('-2,-1', 'fog'),
  ('-3,-1', 'fog')
ON CONFLICT (coord) DO NOTHING;

-- ─── Spawn log (webhook tracking) ─────────────────────────
CREATE TABLE IF NOT EXISTS colony_spawn_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bee_id TEXT NOT NULL,
  name TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'webhook',  -- webhook/manual/api
  callback_url TEXT,
  spawned_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RLS for new tables ───────────────────────────────────
ALTER TABLE colony_weather ENABLE ROW LEVEL SECURITY;
ALTER TABLE colony_weather_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE colony_spawn_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read weather" ON colony_weather FOR SELECT USING (true);
CREATE POLICY "Service write weather" ON colony_weather FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read weather log" ON colony_weather_log FOR SELECT USING (true);
CREATE POLICY "Service write weather log" ON colony_weather_log FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read spawn log" ON colony_spawn_log FOR SELECT USING (true);
CREATE POLICY "Service write spawn log" ON colony_spawn_log FOR ALL USING (true) WITH CHECK (true);
