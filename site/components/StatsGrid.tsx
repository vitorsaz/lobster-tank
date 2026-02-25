'use client';

interface StatsGridProps {
    balance: number;
    pnl: number;
    wins: number;
    losses: number;
    winRate: number;
    totalTrades: number;
    waterLevel: number;
    unanimousDecisions: number;
    escapeAttempts: number;
}

function StatCard({ label, value, sub, color, icon }: { label: string; value: string; sub?: string; color?: string; icon: React.ReactNode }) {
    return (
        <div className="glass-card p-5 group relative overflow-hidden transition-all duration-300 hover:scale-[1.02]">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-80 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${color || 'var(--accent)'}, transparent)` }} />

            <div className="flex items-start justify-between mb-3">
                <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">{label}</p>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity" style={{ background: `${color || 'var(--accent)'}15` }}>
                    {icon}
                </div>
            </div>
            <p className="text-3xl font-black font-mono tracking-tight" style={{ color: color || 'var(--text-primary)', fontFamily: "'Space Grotesk', 'JetBrains Mono', monospace" }}>{value}</p>
            {sub && <p className="text-[11px] text-[var(--text-muted)] mt-1.5 font-mono">{sub}</p>}
        </div>
    );
}

function WaterLevelCard({ level }: { level: number }) {
    return (
        <div className="glass-card p-5 group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] sm:col-span-2 lg:col-span-1">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-80 transition-opacity" style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />

            <div className="flex items-start justify-between mb-3">
                <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">Water Level</p>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity" style={{ background: 'rgba(0,212,170,0.15)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>
                </div>
            </div>

            <div className="flex items-end gap-3">
                <p className="text-3xl font-black font-mono tracking-tight" style={{ color: 'var(--accent)', fontFamily: "'Space Grotesk', 'JetBrains Mono', monospace" }}>{level}%</p>
                {/* Mini water bar */}
                <div className="flex-1 h-8 rounded-lg overflow-hidden mb-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="h-full rounded-lg transition-all duration-1000 relative" style={{ width: `${level}%`, background: `linear-gradient(90deg, var(--accent-dark), var(--accent), var(--accent-light))` }}>
                        <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.3), transparent)' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function StatsGrid({ balance, pnl, wins, losses, winRate, totalTrades, waterLevel, unanimousDecisions, escapeAttempts }: StatsGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCard
                label="Balance"
                value={`${balance.toFixed(2)}`}
                sub="SOL"
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v12M16 10H8M16 14H8" /></svg>}
            />
            <StatCard
                label="Total P&L"
                value={`${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}`}
                sub="SOL"
                color={pnl >= 0 ? 'var(--success)' : 'var(--danger)'}
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={pnl >= 0 ? 'var(--success)' : 'var(--danger)'} strokeWidth="2"><path d="M23 6l-9.5 9.5-5-5L1 18" /></svg>}
            />
            <StatCard
                label="Win Rate"
                value={`${winRate.toFixed(1)}%`}
                sub={`${wins}W / ${losses}L`}
                color={winRate >= 50 ? 'var(--success)' : winRate > 0 ? 'var(--warning)' : undefined}
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>}
            />
            <StatCard
                label="Total Trades"
                value={String(totalTrades)}
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>}
            />
            <WaterLevelCard level={waterLevel} />
            <StatCard
                label="Unanimous"
                value={String(unanimousDecisions)}
                sub="All 5 agreed"
                color="var(--accent)"
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>}
            />
            <StatCard
                label="Escape Attempts"
                value={String(escapeAttempts)}
                sub="Lobsters tried to flee"
                color="var(--warning)"
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>}
            />
        </div>
    );
}
