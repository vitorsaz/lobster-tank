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
        <div>
            {/* ══════════════ HERO ══════════════ */}
            <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px', marginTop: '-64px', paddingTop: '64px' }}>
                <div className="animate-slide-up" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '24px', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>
                        THE LOBSTER{' '}
                        <span style={{ color: 'var(--accent)', textShadow: '0 0 40px rgba(0,212,170,0.4)' }}>TANK</span>
                    </h1>

                    <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.8rem)', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
                        Five lobsters. One tank. Zero financial literacy.
                    </p>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '40px' }}>
                        They vote on memecoins by committee. Don&apos;t tap the glass.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '48px' }}>
                        <span style={{ fontSize: '14px', fontFamily: 'monospace', padding: '10px 20px', borderRadius: '9999px', fontWeight: 700, background: 'rgba(0,212,170,0.12)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.25)', boxShadow: '0 0 30px rgba(0,212,170,0.1)' }}>
                            $TANK
                        </span>
                        <span className={`tank-badge ${s.tank_state.toLowerCase().replace(/_/g, '-')}`}>
                            {s.tank_state.replace(/_/g, ' ')}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', animation: 'pulse-glow 2s infinite' }} />
                            {s.total_trades > 0 ? 'Live Trading' : 'Initializing Tank'}
                        </span>
                    </div>

                    <div className="animate-bounce" style={{ opacity: 0.4 }}>
                        <svg style={{ margin: '0 auto' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* ══════════════ TANK ══════════════ */}
            <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>
                <TankVisual waterLevel={s.water_level} tankState={s.tank_state} />
            </section>

            {/* ══════════════ LORE ══════════════ */}
            <section style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px 80px' }}>
                <div className="glass-card" style={{ padding: '48px 40px', textAlign: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '300px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />
                    <span style={{ fontSize: '2rem', opacity: 0.3, display: 'block', marginBottom: '16px' }}>&ldquo;</span>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic', fontFamily: "'Space Grotesk', sans-serif" }}>
                        They were supposed to be dinner. Instead, someone left a laptop next to the tank.
                        Now they trade memecoins by committee &mdash; arguing, voting, and occasionally profiting
                        through the sheer chaos of crustacean democracy.
                    </p>
                    <span style={{ fontSize: '2rem', opacity: 0.3, display: 'block', marginTop: '16px' }}>&rdquo;</span>
                    <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '300px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />
                </div>
            </section>

            {/* ══════════════ STATS ══════════════ */}
            <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px', fontFamily: "'Space Grotesk', sans-serif" }}>Tank Status</h2>
                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Real-time trading metrics</p>
                </div>
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

            {/* ══════════════ COUNCIL VOTE ══════════════ */}
            <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px', fontFamily: "'Space Grotesk', sans-serif" }}>Council Vote</h2>
                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Watch the lobsters argue in real-time</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                    <LobsterChat />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        <div className="glass-card" style={{ padding: '24px' }}>
                            <h3 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '16px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>How Voting Works</h3>
                            <ol style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                {['New token detected on PumpFun', 'Each lobster analyzes independently', '5 votes cast: BUY, SKIP, or ABSTAIN', '3/5 majority = trade executed', 'Unanimous = legendary tank event'].map((text, i) => (
                                    <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                        <span style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>{i + 1}</span>
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className="glass-card" style={{ padding: '24px' }}>
                            <h3 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '16px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Tank States</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span className="tank-badge reef-paradise" style={{ fontSize: '10px' }}>REEF PARADISE</span> <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>80-100%</span></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span className="tank-badge steady-currents" style={{ fontSize: '10px' }}>STEADY CURRENTS</span> <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>60-79%</span></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span className="tank-badge choppy-waters" style={{ fontSize: '10px' }}>CHOPPY WATERS</span> <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>40-59%</span></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span className="tank-badge red-tide" style={{ fontSize: '10px' }}>RED TIDE</span> <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>20-39%</span></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span className="tank-badge tank-breach" style={{ fontSize: '10px' }}>TANK BREACH</span> <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>0-19%</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════ THE COUNCIL ══════════════ */}
            <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px', fontFamily: "'Space Grotesk', sans-serif" }}>The Council</h2>
                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Meet the 5 lobsters who control your portfolio</p>
                </div>
                <CouncilRoster />
            </section>
        </div>
    );
}
