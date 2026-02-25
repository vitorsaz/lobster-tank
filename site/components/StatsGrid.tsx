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
        <div className="glass-card p-4">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-bold font-mono" style={{ color: color || 'var(--text-primary)' }}>{value}</p>
            {sub && <p className="text-xs text-[var(--text-muted)] mt-1">{sub}</p>}
        </div>
    );
}

export default function StatsGrid({ balance, pnl, wins, losses, winRate, totalTrades, waterLevel, unanimousDecisions, escapeAttempts }: StatsGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard label="Balance" value={`${balance.toFixed(2)} SOL`} />
            <StatCard
                label="Total P&L"
                value={`${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} SOL`}
                color={pnl >= 0 ? 'var(--success)' : 'var(--danger)'}
            />
            <StatCard label="Win Rate" value={`${winRate.toFixed(1)}%`} sub={`${wins}W / ${losses}L`} />
            <StatCard label="Total Trades" value={String(totalTrades)} />
            <StatCard label="Water Level" value={`${waterLevel}%`} color="var(--accent)" />
            <StatCard label="Unanimous" value={String(unanimousDecisions)} sub="All 5 agreed" />
            <StatCard label="Escapes" value={String(escapeAttempts)} sub="Lobsters that tried" color="var(--warning)" />
        </div>
    );
}
