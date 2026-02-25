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
    const [scrollY, setScrollY] = useState(0);

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

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const s = status || {
        water_level: 75, tank_state: 'STEADY_CURRENTS', balance: 0.5,
        total_pnl: 0, today_pnl: 0, wins: 0, losses: 0, win_rate: 0,
        total_trades: 0, escape_attempts: 0, unanimous_decisions: 0, council_fights: 0,
    };

    return (
        <div className="relative">
            {/* ═══════════════════════════════════════════════════════ */}
            {/* FULL-SCREEN HERO                                      */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden -mt-16 pt-16">
                {/* Background image */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: 'url(/lobster-bg.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center 40%',
                        backgroundRepeat: 'no-repeat',
                        transform: `translateY(${scrollY * 0.15}px) scale(1.1)`,
                        transition: 'transform 0.1s linear',
                    }}
                />
                <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(180deg, rgba(6,14,26,0.55) 0%, rgba(10,22,40,0.5) 30%, rgba(10,22,40,0.45) 60%, rgba(10,22,40,0.85) 85%, rgba(10,22,40,1) 100%)' }} />
                <div className="absolute inset-0 z-[2] pointer-events-none" style={{ boxShadow: 'inset 0 0 150px 60px rgba(6,14,26,0.7)' }} />

                <div className="relative z-10 text-center px-6 animate-slide-up w-full max-w-4xl mx-auto">
                    <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        THE LOBSTER{' '}
                        <span className="relative inline-block" style={{ color: 'var(--accent)' }}>
                            TANK
                            <span className="absolute -inset-2 blur-2xl opacity-30 rounded-full" style={{ background: 'var(--accent)' }} />
                        </span>
                    </h1>

                    <p className="text-xl sm:text-2xl md:text-3xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed mb-4 font-light">
                        Five lobsters. One tank. Zero financial literacy.
                    </p>
                    <p className="text-base md:text-lg text-[var(--text-muted)] max-w-2xl mx-auto mb-10">
                        They vote on memecoins by committee. Don&apos;t tap the glass.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                        <span className="text-sm font-mono px-5 py-2.5 rounded-full font-bold" style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.25)', boxShadow: '0 0 30px rgba(0,212,170,0.1)' }}>
                            $TANK
                        </span>
                        <span className={`tank-badge ${s.tank_state.toLowerCase().replace(/_/g, '-')}`}>
                            {s.tank_state.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                            {s.total_trades > 0 ? 'Live Trading' : 'Initializing Tank'}
                        </span>
                    </div>

                    <div className="animate-bounce opacity-40">
                        <svg className="mx-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* THE TANK                                              */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-6 -mt-8 mb-20">
                <TankVisual waterLevel={s.water_level} tankState={s.tank_state} />
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* LORE QUOTE                                            */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="max-w-3xl mx-auto px-6 mb-24">
                <div className="relative glass-card p-10 md:p-14 text-center">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />
                    <span className="text-4xl mb-4 block opacity-30">&ldquo;</span>
                    <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed italic" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        They were supposed to be dinner. Instead, someone left a laptop next to the tank.
                        Now they trade memecoins by committee &mdash; arguing, voting, and occasionally profiting
                        through the sheer chaos of crustacean democracy.
                    </p>
                    <span className="text-4xl mt-4 block opacity-30">&rdquo;</span>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TANK STATUS                                           */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-6 mb-24">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Tank Status</h2>
                    <p className="text-base text-[var(--text-muted)]">Real-time trading metrics</p>
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

            {/* ═══════════════════════════════════════════════════════ */}
            {/* COUNCIL VOTE                                          */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-6 mb-24">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Council Vote</h2>
                    <p className="text-base text-[var(--text-muted)]">Watch the lobsters argue in real-time</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                        <LobsterChat />
                    </div>
                    <div className="space-y-6">
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-sm mb-4 text-[var(--accent)] uppercase tracking-wider text-center">How Voting Works</h3>
                            <ol className="space-y-3 text-sm text-[var(--text-secondary)]">
                                <li className="flex gap-3 items-start">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>1</span>
                                    <span>New token detected on PumpFun</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>2</span>
                                    <span>Each lobster analyzes independently</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>3</span>
                                    <span>5 votes cast: BUY, SKIP, or ABSTAIN</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>4</span>
                                    <span>3/5 majority = trade executed</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>5</span>
                                    <span>Unanimous = legendary tank event</span>
                                </li>
                            </ol>
                        </div>

                        <div className="glass-card p-6">
                            <h3 className="font-bold text-sm mb-4 text-[var(--accent)] uppercase tracking-wider text-center">Tank States</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3"><span className="tank-badge reef-paradise text-[10px]">REEF PARADISE</span> <span className="text-xs text-[var(--text-muted)]">80-100%</span></div>
                                <div className="flex items-center gap-3"><span className="tank-badge steady-currents text-[10px]">STEADY CURRENTS</span> <span className="text-xs text-[var(--text-muted)]">60-79%</span></div>
                                <div className="flex items-center gap-3"><span className="tank-badge choppy-waters text-[10px]">CHOPPY WATERS</span> <span className="text-xs text-[var(--text-muted)]">40-59%</span></div>
                                <div className="flex items-center gap-3"><span className="tank-badge red-tide text-[10px]">RED TIDE</span> <span className="text-xs text-[var(--text-muted)]">20-39%</span></div>
                                <div className="flex items-center gap-3"><span className="tank-badge tank-breach text-[10px]">TANK BREACH</span> <span className="text-xs text-[var(--text-muted)]">0-19%</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* THE COUNCIL                                           */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-6 mb-24">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>The Council</h2>
                    <p className="text-base text-[var(--text-muted)]">Meet the 5 lobsters who control your portfolio</p>
                </div>
                <CouncilRoster />
            </section>
        </div>
    );
}
