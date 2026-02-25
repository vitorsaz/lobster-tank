-- ═══════════════════════════════════════════════════════════════
-- THE LOBSTER TANK - FULL Database Schema
-- Run this in Supabase SQL Editor (supabase.com > SQL Editor)
-- ═══════════════════════════════════════════════════════════════

-- 1. SYSTEM STATUS
CREATE TABLE IF NOT EXISTS system_status (
    id INTEGER PRIMARY KEY DEFAULT 1,
    status VARCHAR DEFAULT 'stopped',
    water_level FLOAT DEFAULT 75,
    tank_state VARCHAR DEFAULT 'STEADY_CURRENTS',
    balance FLOAT DEFAULT 0.5,
    total_pnl FLOAT DEFAULT 0,
    today_pnl FLOAT DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    total_trades INTEGER DEFAULT 0,
    win_rate FLOAT DEFAULT 0,
    escape_attempts INTEGER DEFAULT 0,
    unanimous_decisions INTEGER DEFAULT 0,
    council_fights INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LOBSTERS
CREATE TABLE IF NOT EXISTS lobsters (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    emoji VARCHAR,
    current_mood VARCHAR DEFAULT 'normal',
    total_votes INTEGER DEFAULT 0,
    correct_votes INTEGER DEFAULT 0,
    wrong_votes INTEGER DEFAULT 0,
    win_rate FLOAT DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    best_call TEXT,
    worst_call TEXT,
    times_overruled INTEGER DEFAULT 0,
    escape_attempts INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TOKENS
CREATE TABLE IF NOT EXISTS tokens (
    id SERIAL PRIMARY KEY,
    ca VARCHAR UNIQUE NOT NULL,
    name VARCHAR,
    symbol VARCHAR,
    logo TEXT,
    mc FLOAT,
    liquidity FLOAT,
    volume_24h FLOAT,
    holders INTEGER,
    price FLOAT,
    council_score FLOAT,
    vote_result VARCHAR,
    chad_vote VARCHAR,
    nancy_vote VARCHAR,
    papaclaw_vote VARCHAR,
    snappy_vote VARCHAR,
    coral_vote VARCHAR,
    was_unanimous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TRADES
CREATE TABLE IF NOT EXISTS trades (
    id SERIAL PRIMARY KEY,
    ca VARCHAR,
    symbol VARCHAR,
    type VARCHAR NOT NULL,
    amount_sol FLOAT,
    price FLOAT,
    mc_at_trade FLOAT,
    pnl_percent FLOAT,
    pnl_sol FLOAT,
    vote_breakdown JSONB,
    tank_state VARCHAR,
    water_level FLOAT,
    deciding_lobster VARCHAR,
    council_commentary TEXT,
    was_chad_solo BOOLEAN DEFAULT FALSE,
    tx_signature VARCHAR,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. POSITIONS
CREATE TABLE IF NOT EXISTS positions (
    id SERIAL PRIMARY KEY,
    ca VARCHAR NOT NULL,
    symbol VARCHAR,
    entry_price FLOAT,
    current_price FLOAT,
    amount_sol FLOAT,
    pnl_sol FLOAT,
    status VARCHAR DEFAULT 'open',
    tank_state_at_entry VARCHAR,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

-- 6. COUNCIL LOG
CREATE TABLE IF NOT EXISTS council_log (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR NOT NULL,
    message TEXT NOT NULL,
    tank_state VARCHAR,
    water_level FLOAT,
    related_token VARCHAR,
    vote_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TANK HIGHLIGHTS
CREATE TABLE IF NOT EXISTS tank_highlights (
    id SERIAL PRIMARY KEY,
    highlight_type VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    lobsters_involved TEXT[],
    tank_state VARCHAR,
    water_level_before FLOAT,
    water_level_after FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- DEFAULT DATA
-- ═══════════════════════════════════════════════════════════════

INSERT INTO system_status (id, status, water_level, tank_state, balance)
VALUES (1, 'stopped', 75, 'STEADY_CURRENTS', 0.5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO lobsters (id, name, emoji, current_mood) VALUES
    ('chad', 'Chad', '💪', 'pumped'),
    ('nancy', 'Nancy', '📊', 'normal'),
    ('papaclaw', 'Papaclaw', '👴', 'normal'),
    ('snappy', 'Snappy', '⚡', 'normal'),
    ('coral', 'Coral', '🌺', 'normal')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- RLS (allow all for now)
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE system_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE lobsters ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE council_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE tank_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all system_status" ON system_status FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all lobsters" ON lobsters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all tokens" ON tokens FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all trades" ON trades FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all positions" ON positions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all council_log" ON council_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all tank_highlights" ON tank_highlights FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- REALTIME (run each separately if error)
-- ═══════════════════════════════════════════════════════════════

ALTER PUBLICATION supabase_realtime ADD TABLE system_status;
ALTER PUBLICATION supabase_realtime ADD TABLE lobsters;
ALTER PUBLICATION supabase_realtime ADD TABLE trades;
ALTER PUBLICATION supabase_realtime ADD TABLE council_log;
ALTER PUBLICATION supabase_realtime ADD TABLE tank_highlights;
