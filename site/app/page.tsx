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
            {/* FULL-SCREEN HERO — Deep Ocean Entrance                */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden -mt-16 pt-16">
                {/* Animated depth particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: `${200 + i * 80}px`,
                                height: `${200 + i * 80}px`,
                                left: `${10 + i * 15}%`,
                                top: `${20 + (i % 3) * 25}%`,
                                background: `radial-gradient(circle, rgba(0,212,170,${0.03 - i * 0.003}) 0%, transparent 70%)`,
                                animation: `float ${8 + i * 2}s ease-in-out infinite`,
                                animationDelay: `${i * 1.2}s`,
                                transform: `translateY(${scrollY * (0.1 + i * 0.02)}px)`,
                            }}
                        />
                    ))}
                </div>

                {/* Light shaft from above */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[700px] opacity-[0.04] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(180,220,255,1), transparent 80%)', filter: 'blur(60px)' }} />

                {/* Hero content */}
                <div className="relative z-10 text-center px-4 animate-slide-up">
                    {/* Lobster SVG icon */}
                    <div className="mb-8 inline-block animate-float">
                        <svg width="100" height="100" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 30px rgba(232,68,48,0.4))' }}>
                            <ellipse cx="50" cy="55" rx="18" ry="24" fill="#e84430" opacity="0.9" />
                            <ellipse cx="50" cy="78" rx="14" ry="6" fill="#e84430" opacity="0.8" />
                            <ellipse cx="50" cy="86" rx="11" ry="5" fill="#e84430" opacity="0.7" />
                            <ellipse cx="50" cy="34" rx="14" ry="10" fill="#e84430" opacity="0.95" />
                            <circle cx="42" cy="28" r="4" fill="#0a1628" />
                            <circle cx="58" cy="28" r="4" fill="#0a1628" />
                            <circle cx="43" cy="27" r="1.8" fill="white" />
                            <circle cx="59" cy="27" r="1.8" fill="white" />
                            <path d="M45 25 Q38 10 30 5" stroke="#e84430" strokeWidth="1.5" fill="none" opacity="0.7" />
                            <path d="M55 25 Q62 10 70 5" stroke="#e84430" strokeWidth="1.5" fill="none" opacity="0.7" />
                            <circle cx="30" cy="5" r="2" fill="#e84430" opacity="0.5" />
                            <circle cx="70" cy="5" r="2" fill="#e84430" opacity="0.5" />
                            <path d="M32 45 Q20 38 15 30" stroke="#e84430" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <path d="M15 30 Q8 24 5 28 Q3 32 10 33 Q8 35 5 38 Q8 42 15 36 Q14 33 15 30" fill="#e84430" />
                            <path d="M68 45 Q80 38 85 30" stroke="#e84430" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <path d="M85 30 Q92 24 95 28 Q97 32 90 33 Q92 35 95 38 Q92 42 85 36 Q86 33 85 30" fill="#e84430" />
                        </svg>
                    </div>

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

                    {/* Status badges */}
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

                    {/* Scroll indicator */}
                    <div className="animate-bounce opacity-40">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* THE TANK — Full Width Aquarium                        */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="relative px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto -mt-8 mb-16">
                <div className="relative">
                    {/* Tank glow effect behind */}
                    <div className="absolute -inset-4 rounded-[2rem] opacity-30 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 70%, rgba(0,100,180,0.2), transparent 70%)' }} />
                    <TankVisual waterLevel={s.water_level} tankState={s.tank_state} />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* LORE QUOTE — Cinematic                                */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="px-4 mb-20 max-w-4xl mx-auto">
                <div className="relative glass-card p-10 md:p-14 text-center overflow-hidden">
                    {/* Decorative glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[60px] opacity-20 blur-2xl" style={{ background: 'var(--accent)' }} />

                    <span className="text-4xl mb-6 block opacity-30">&ldquo;</span>
                    <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed italic" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        They were supposed to be dinner. Instead, someone left a laptop next to the tank.
                        Now they trade memecoins by committee &mdash; arguing, voting, and occasionally profiting
                        through the sheer chaos of crustacean democracy.
                    </p>
                    <span className="text-4xl mt-6 block opacity-30">&rdquo;</span>

                    {/* Bottom line */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TANK STATUS — Stats Grid                              */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto mb-20">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Tank Status</h2>
                        <p className="text-sm text-[var(--text-muted)]">Real-time trading metrics</p>
                    </div>
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
            {/* COUNCIL VOTE — Chat + Explainer                       */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto mb-20">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(232,68,48,0.1)', border: '1px solid rgba(232,68,48,0.2)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e84430" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Council Vote</h2>
                        <p className="text-sm text-[var(--text-muted)]">Watch the lobsters argue in real-time</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Chat takes 2/3 */}
                    <div className="xl:col-span-2">
                        <LobsterChat />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-sm mb-4 text-[var(--accent)] uppercase tracking-wider flex items-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 6v6l4 2" /></svg>
                                How Voting Works
                            </h3>
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
                            <h3 className="font-bold text-sm mb-4 text-[var(--accent)] uppercase tracking-wider flex items-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                                Tank States
                            </h3>
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
            {/* THE COUNCIL — Lobster Roster                          */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto mb-20">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(232,68,48,0.1)', border: '1px solid rgba(232,68,48,0.2)' }}>
                        <svg width="22" height="22" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 6px rgba(232,68,48,0.5))' }}>
                            <ellipse cx="50" cy="55" rx="18" ry="20" fill="#e84430" opacity="0.9" />
                            <ellipse cx="50" cy="38" rx="12" ry="8" fill="#e84430" opacity="0.95" />
                            <path d="M32 48 Q22 42 18 36" stroke="#e84430" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <path d="M18 36 Q12 30 10 34 Q9 37 14 37 Q13 39 10 41 Q13 44 18 40" fill="#e84430" />
                            <path d="M68 48 Q78 42 82 36" stroke="#e84430" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <path d="M82 36 Q88 30 90 34 Q91 37 86 37 Q87 39 90 41 Q87 44 82 40" fill="#e84430" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>The Council</h2>
                        <p className="text-sm text-[var(--text-muted)]">Meet the 5 lobsters who control your portfolio</p>
                    </div>
                </div>
                <CouncilRoster />
            </section>
        </div>
    );
}
