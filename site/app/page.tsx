'use client';
import { useState, useEffect } from 'react';
import TankVisual from '@/components/TankVisual';
import StatsGrid from '@/components/StatsGrid';
import LobsterChat from '@/components/LobsterChat';
import CouncilRoster from '@/components/CouncilRoster';
import { getSupabase } from '@/lib/supabase';
import type { SystemStatus } from '@/lib/types';

export default function Home() {
    const [status, setStatus] = useState<SystemStatus | null>(null);

    useEffect(() => {
        const sb = getSupabase();
        if (!sb) return;
        sb.from('system_status').select('*').eq('id', 1).single().then(({ data }) => {
            if (data) setStatus(data as SystemStatus);
        });

        // Realtime subscription
        const channel = sb.channel('tank-status').on('postgres_changes', {
            event: '*', schema: 'public', table: 'system_status', filter: 'id=eq.1'
        }, (payload) => {
            if (payload.new) setStatus(payload.new as SystemStatus);
        }).subscribe();

        return () => { sb.removeChannel(channel); };
    }, []);

    const s = status || {
        water_level: 75, tank_state: 'STEADY_CURRENTS', balance: 0.5,
        total_pnl: 0, today_pnl: 0, wins: 0, losses: 0, win_rate: 0,
        total_trades: 0, escape_attempts: 0, unanimous_decisions: 0, council_fights: 0,
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* HERO */}
            <section className="text-center py-12 md:py-20 animate-slide-up">
                <div className="mb-6">
                    <span className="text-6xl md:text-8xl block mb-4 animate-float">🦞</span>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        THE LOBSTER <span className="glow-text" style={{ color: 'var(--accent)' }}>TANK</span>
                    </h1>
                    <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                        Five lobsters. One tank. Zero financial literacy.<br />
                        <span className="text-[var(--text-muted)]">They vote on memecoins by committee. Don&apos;t tap the glass.</span>
                    </p>
                </div>

                <div className="flex items-center justify-center gap-3 mb-8">
                    <span className="text-sm font-mono px-4 py-2 rounded-full" style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.2)' }}>
                        $TANK
                    </span>
                    <span className={`tank-badge ${s.tank_state.toLowerCase().replace('_', '-')}`}>
                        {s.tank_state.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                        {s.total_trades > 0 ? 'Live' : 'Initializing'}
                    </span>
                </div>
            </section>

            {/* TANK VISUAL */}
            <section className="mb-12">
                <TankVisual waterLevel={s.water_level} tankState={s.tank_state} />
            </section>

            {/* LORE */}
            <section className="mb-12">
                <div className="glass-card p-8 max-w-3xl mx-auto text-center">
                    <p className="text-[var(--text-secondary)] leading-relaxed italic" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        &ldquo;They were supposed to be dinner. Instead, someone left a laptop next to the tank.
                        Now they trade memecoins by committee &mdash; arguing, voting, and occasionally profiting
                        through the sheer chaos of crustacean democracy.&rdquo;
                    </p>
                </div>
            </section>

            {/* STATS */}
            <section className="mb-12">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <span>📊</span> Tank Status
                </h2>
                <StatsGrid
                    balance={s.balance}
                    pnl={s.total_pnl}
                    wins={s.wins}
                    losses={s.losses}
                    winRate={s.win_rate}
                    totalTrades={s.total_trades}
                    waterLevel={s.water_level}
                    unanimousDecisions={s.unanimous_decisions}
                    escapeAttempts={s.escape_attempts}
                />
            </section>

            {/* COUNCIL CHAT + ROSTER */}
            <section className="mb-12">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <span>🗳️</span> Council Vote — Live
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LobsterChat />
                    <div className="space-y-4">
                        <div className="glass-card p-6">
                            <h3 className="font-semibold text-sm mb-3 text-[var(--text-secondary)] uppercase tracking-wider">How Voting Works</h3>
                            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                                <li className="flex gap-2"><span className="text-[var(--accent)]">1.</span> New token detected on PumpFun</li>
                                <li className="flex gap-2"><span className="text-[var(--accent)]">2.</span> Each lobster analyzes independently</li>
                                <li className="flex gap-2"><span className="text-[var(--accent)]">3.</span> 5 votes cast: BUY, SKIP, or ABSTAIN</li>
                                <li className="flex gap-2"><span className="text-[var(--accent)]">4.</span> 3/5 majority = trade executed</li>
                                <li className="flex gap-2"><span className="text-[var(--accent)]">5.</span> Unanimous = legendary event</li>
                            </ul>
                        </div>
                        <div className="glass-card p-6">
                            <h3 className="font-semibold text-sm mb-3 text-[var(--text-secondary)] uppercase tracking-wider">Tank States</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2"><span className="tank-badge reef-paradise text-[10px]">REEF PARADISE</span> <span className="text-xs text-[var(--text-muted)]">80-100% — Harmony</span></div>
                                <div className="flex items-center gap-2"><span className="tank-badge steady-currents text-[10px]">STEADY CURRENTS</span> <span className="text-xs text-[var(--text-muted)]">60-79% — Normal</span></div>
                                <div className="flex items-center gap-2"><span className="tank-badge choppy-waters text-[10px]">CHOPPY WATERS</span> <span className="text-xs text-[var(--text-muted)]">40-59% — Agitated</span></div>
                                <div className="flex items-center gap-2"><span className="tank-badge red-tide text-[10px]">RED TIDE</span> <span className="text-xs text-[var(--text-muted)]">20-39% — Crisis</span></div>
                                <div className="flex items-center gap-2"><span className="tank-badge tank-breach text-[10px]">TANK BREACH</span> <span className="text-xs text-[var(--text-muted)]">0-19% — Chaos</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* COUNCIL ROSTER */}
            <section className="mb-12">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <span>🦞</span> The Council
                </h2>
                <CouncilRoster />
            </section>
        </div>
    );
}
