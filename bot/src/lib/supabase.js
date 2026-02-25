import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

export const supabase = createClient(
    config.SUPABASE_URL,
    config.SUPABASE_SERVICE_KEY || config.SUPABASE_ANON_KEY
);

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════
export async function updateSystemStatus(data) {
    const { error } = await supabase
        .from('system_status')
        .upsert({ id: 1, ...data, updated_at: new Date().toISOString() });
    if (error) console.error('[SUPABASE] Status error:', error.message);
    return !error;
}

export async function getSystemStatus() {
    const { data } = await supabase.from('system_status').select('*').eq('id', 1).single();
    return data;
}

// ═══════════════════════════════════════════════════════════════
// LOBSTERS (Council Members)
// ═══════════════════════════════════════════════════════════════
export async function updateLobster(id, updates) {
    const { error } = await supabase
        .from('lobsters')
        .upsert({ id, ...updates, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    if (error) console.error('[SUPABASE] Lobster error:', error.message);
    return !error;
}

export async function getLobsters() {
    const { data } = await supabase.from('lobsters').select('*');
    return data || [];
}

export async function getLobster(id) {
    const { data } = await supabase.from('lobsters').select('*').eq('id', id).single();
    return data;
}

// ═══════════════════════════════════════════════════════════════
// TOKENS
// ═══════════════════════════════════════════════════════════════
export async function upsertToken(token) {
    const { data, error } = await supabase
        .from('tokens')
        .upsert({ ...token, updated_at: new Date().toISOString() }, { onConflict: 'ca' })
        .select()
        .single();
    if (error) console.error('[SUPABASE] Token error:', error.message);
    return data;
}

export async function getToken(ca) {
    const { data } = await supabase.from('tokens').select('*').eq('ca', ca).single();
    return data;
}

// ═══════════════════════════════════════════════════════════════
// TRADES
// ═══════════════════════════════════════════════════════════════
export async function recordTrade(trade) {
    const { data, error } = await supabase.from('trades').insert(trade).select().single();
    if (error) console.error('[SUPABASE] Trade error:', error.message);
    return data;
}

export async function getRecentTrades(limit = 20) {
    const { data } = await supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
    return data || [];
}

// ═══════════════════════════════════════════════════════════════
// POSITIONS
// ═══════════════════════════════════════════════════════════════
export async function createPosition(position) {
    const { data, error } = await supabase.from('positions').insert(position).select().single();
    if (error) console.error('[SUPABASE] Position error:', error.message);
    return data;
}

export async function getOpenPositions() {
    const { data } = await supabase.from('positions').select('*').eq('status', 'open');
    return data || [];
}

export async function closePosition(id, pnl) {
    const { data, error } = await supabase
        .from('positions')
        .update({ status: 'closed', pnl_sol: pnl, closed_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    if (error) console.error('[SUPABASE] Close error:', error.message);
    return data;
}

// ═══════════════════════════════════════════════════════════════
// COUNCIL LOG
// ═══════════════════════════════════════════════════════════════
export async function addCouncilLog(entry) {
    const { error } = await supabase.from('council_log').insert({
        ...entry,
        created_at: new Date().toISOString()
    });
    if (error) console.error('[SUPABASE] Council log error:', error.message);
    return !error;
}

export async function getCouncilLog(limit = 50) {
    const { data } = await supabase
        .from('council_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
    return data || [];
}

// ═══════════════════════════════════════════════════════════════
// TANK HIGHLIGHTS
// ═══════════════════════════════════════════════════════════════
export async function addHighlight(highlight) {
    const { error } = await supabase.from('tank_highlights').insert({
        ...highlight,
        created_at: new Date().toISOString()
    });
    if (error) console.error('[SUPABASE] Highlight error:', error.message);
    return !error;
}

export async function getHighlights(limit = 20) {
    const { data } = await supabase
        .from('tank_highlights')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
    return data || [];
}
