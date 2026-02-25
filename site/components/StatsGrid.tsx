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

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
    return (
        <div className="stat-card glass-card p-6 text-center">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-2">{label}</p>
            <p className="text-3xl font-black font-mono" style={{ color: color || 'var(--text-primary)', fontFamily: "'Space Grotesk', monospace" }}>{value}</p>
            {sub && <p className="text-xs text-[var(--text-muted)] mt-2 font-mono">{sub}</p>}
        </div>
    );
}

function WaterLevelCard({ level }: { level: number }) {
    return (
        <div className="stat-card glass-card p-6 text-center">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-2">Water Level</p>
            <p className="text-3xl font-black font-mono mb-3" style={{ color: 'var(--accent)', fontFamily: "'Space Grotesk', monospace" }}>{level}%</p>
            <div className="h-3 rounded-full mx-auto max-w-[120px]" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${level}%`, background: 'linear-gradient(90deg, var(--accent-dark), var(--accent), var(--accent-light))' }} />
            </div>
        </div>
    );
}

export default function StatsGrid({ balance, pnl, wins, losses, winRate, totalTrades, waterLevel, unanimousDecisions, escapeAttempts }: StatsGridProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            <StatCard label="Balance" value={`${balance.toFixed(2)} SOL`} />
            <StatCard
                label="Total P&L"
                value={`${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} SOL`}
                color={pnl >= 0 ? 'var(--success)' : 'var(--danger)'}
            />
            <StatCard label="Win Rate" value={`${winRate.toFixed(1)}%`} sub={`${wins}W / ${losses}L`} color={winRate >= 50 ? 'var(--success)' : undefined} />
            <StatCard label="Total Trades" value={String(totalTrades)} />
            <WaterLevelCard level={waterLevel} />
            <StatCard label="Unanimous" value={String(unanimousDecisions)} sub="All 5 agreed" color="var(--accent)" />
            <StatCard label="Escape Attempts" value={String(escapeAttempts)} sub="Lobsters tried to flee" color="var(--warning)" />
        </div>
    );
}
