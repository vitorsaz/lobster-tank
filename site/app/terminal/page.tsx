'use client';
import { useState, useEffect, useRef } from 'react';
import { getSupabase } from '@/lib/supabase';

interface LogEntry {
    id: number;
    timestamp: string;
    type: 'buy' | 'sell' | 'vote' | 'skip' | 'system' | 'narration' | 'error' | 'profit' | 'loss';
    message: string;
}

// Colors for terminal output
const TYPE_COLORS: Record<string, string> = {
    buy: '#00e87a',
    sell: '#ff4757',
    vote: '#00d4aa',
    skip: '#ffa340',
    system: '#8baab8',
    narration: '#60a5fa',
    error: '#ff4757',
    profit: '#00e87a',
    loss: '#ff4757',
};

const TYPE_BADGES: Record<string, string> = {
    buy: '[  BUY  ]',
    sell: '[ SELL  ]',
    vote: '[ VOTE  ]',
    skip: '[ SKIP  ]',
    system: '[ SYS   ]',
    narration: '[ TANK  ]',
    error: '[ ERR   ]',
    profit: '[ +P&L  ]',
    loss: '[ -P&L  ]',
};

function generateFakeLogs(): LogEntry[] {
    const tickers = ['$LOBSTER', '$CRAB', '$REEF', '$WHALE', '$CLAWS', '$OCEAN', '$TIDE', '$KRILL', '$SQUID'];
    const logs: LogEntry[] = [];
    let id = 0;

    const now = new Date();
    const ts = () => {
        now.setSeconds(now.getSeconds() + Math.floor(Math.random() * 5) + 1);
        return now.toLocaleTimeString('en-US', { hour12: false });
    };

    // Boot sequence
    logs.push({ id: id++, timestamp: ts(), type: 'system', message: 'THE LOBSTER TANK — Crustacean Democracy Trading Bot v1.0' });
    logs.push({ id: id++, timestamp: ts(), type: 'system', message: 'Initializing tank systems...' });
    logs.push({ id: id++, timestamp: ts(), type: 'system', message: 'Council members loaded: Chad, Nancy, Papaclaw, Snappy, Coral' });
    logs.push({ id: id++, timestamp: ts(), type: 'system', message: 'Simulation mode: 0.50 SOL' });
    logs.push({ id: id++, timestamp: ts(), type: 'system', message: 'PumpPortal WebSocket connected' });
    logs.push({ id: id++, timestamp: ts(), type: 'system', message: 'Subscribed to new tokens — listening...' });
    logs.push({ id: id++, timestamp: ts(), type: 'narration', message: 'The tank hums to life. Five pairs of eyes scan the waters for opportunity.' });

    // Generate some token events
    for (let i = 0; i < 6; i++) {
        const ticker = tickers[Math.floor(Math.random() * tickers.length)];
        const mc = (Math.random() * 200 + 10).toFixed(0);
        const score = Math.floor(Math.random() * 50 + 30);

        logs.push({ id: id++, timestamp: ts(), type: 'system', message: `New token detected: ${ticker} — MC: $${mc}K` });

        // Votes
        const lobsters = [
            { name: 'CHAD', emoji: '💪' },
            { name: 'NANCY', emoji: '📊' },
            { name: 'PAPACLAW', emoji: '👴' },
            { name: 'SNAPPY', emoji: '⚡' },
            { name: 'CORAL', emoji: '🌺' },
        ];

        let buys = 0;
        for (const l of lobsters) {
            const vote = l.name === 'CHAD' ? (Math.random() > 0.2 ? 'BUY' : 'SKIP') :
                          l.name === 'NANCY' ? (Math.random() > 0.7 ? 'BUY' : 'SKIP') :
                          l.name === 'PAPACLAW' ? (Math.random() > 0.8 ? 'ABSTAIN' : Math.random() > 0.5 ? 'BUY' : 'SKIP') :
                          Math.random() > 0.5 ? 'BUY' : 'SKIP';
            if (vote === 'BUY') buys++;
            logs.push({ id: id++, timestamp: ts(), type: 'vote', message: `${l.emoji} ${l.name}: ${vote}` });
        }

        const decision = buys >= 3 ? 'BUY' : 'SKIP';
        logs.push({ id: id++, timestamp: ts(), type: decision === 'BUY' ? 'buy' : 'skip', message: `COUNCIL DECISION: ${decision} on ${ticker} (${buys}-${5 - buys}) Score: ${score}` });

        if (decision === 'BUY') {
            const sol = (Math.random() * 0.2 + 0.05).toFixed(4);
            logs.push({ id: id++, timestamp: ts(), type: 'buy', message: `Bought ${sol} SOL of ${ticker} @ MC $${mc}K` });

            // Maybe sell later
            if (Math.random() > 0.3) {
                const pnl = (Math.random() * 80 - 30).toFixed(1);
                const isProfit = parseFloat(pnl) > 0;
                logs.push({ id: id++, timestamp: ts(), type: 'sell', message: `Sold ${ticker} — PnL: ${isProfit ? '+' : ''}${pnl}%` });
                logs.push({ id: id++, timestamp: ts(), type: isProfit ? 'profit' : 'loss', message: isProfit ? 'The tank celebrates! Lobster conga line!' : 'Another loss. Chad bangs the glass.' });
            }
        }

        logs.push({ id: id++, timestamp: ts(), type: 'narration', message: `The lobsters settle back into position, waiting for the next opportunity...` });
    }

    return logs;
}

export default function TerminalPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [autoScroll, setAutoScroll] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fakeLogs = generateFakeLogs();
        // Animate logs appearing one by one
        let i = 0;
        const interval = setInterval(() => {
            if (i < fakeLogs.length) {
                setLogs(prev => [...prev, fakeLogs[i]]);
                i++;
            } else {
                // After initial logs, add new ones periodically
                clearInterval(interval);

                // Also subscribe to real council_log
                const sb = getSupabase();
                if (sb) {
                    sb.from('council_log').select('*').order('created_at', { ascending: false }).limit(20).then(({ data }) => {
                        if (data && data.length > 0) {
                            const realLogs = data.reverse().map((d: any, idx: number) => ({
                                id: Date.now() + idx,
                                timestamp: new Date(d.created_at).toLocaleTimeString('en-US', { hour12: false }),
                                type: d.event_type === 'vote' ? 'vote' as const : 'system' as const,
                                message: d.message,
                            }));
                            setLogs(prev => [...prev, ...realLogs]);
                        }
                    });
                }
            }
        }, 150);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (autoScroll && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs, autoScroll]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Live Terminal
                </h1>
                <p className="text-[var(--text-muted)]">Real-time view of everything the bot is doing — votes, trades, tank narration.</p>
            </div>

            <div className="terminal">
                <div className="terminal-header">
                    <div className="terminal-dot" style={{ background: '#ff5f57' }} />
                    <div className="terminal-dot" style={{ background: '#ffbd2e' }} />
                    <div className="terminal-dot" style={{ background: '#28ca42' }} />
                    <span className="ml-4 text-xs text-gray-500 font-mono">lobster-tank — node src/index.js</span>
                    <div className="ml-auto flex items-center gap-2">
                        <button
                            onClick={() => setAutoScroll(!autoScroll)}
                            className="text-[10px] px-2 py-1 rounded font-mono"
                            style={{
                                background: autoScroll ? 'rgba(0,232,122,0.15)' : 'rgba(255,71,87,0.15)',
                                color: autoScroll ? 'var(--success)' : 'var(--danger)',
                            }}
                        >
                            {autoScroll ? 'AUTO-SCROLL ON' : 'AUTO-SCROLL OFF'}
                        </button>
                    </div>
                </div>

                <div ref={scrollRef} className="terminal-body font-mono" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {logs.map((log) => (
                        <div key={log.id} className="terminal-line flex gap-2 mb-0.5" style={{ fontSize: '13px' }}>
                            <span className="text-gray-600 select-none flex-shrink-0">{log.timestamp}</span>
                            <span className="flex-shrink-0 font-bold" style={{ color: TYPE_COLORS[log.type] || '#8baab8' }}>
                                {TYPE_BADGES[log.type] || '[ INFO  ]'}
                            </span>
                            <span style={{ color: log.type === 'narration' ? '#60a5fa' : log.type === 'error' ? '#ff4757' : '#e4f0f6' }}>
                                {log.type === 'narration' ? <em>{log.message}</em> : log.message}
                            </span>
                        </div>
                    ))}
                    <div className="flex items-center gap-1 mt-2">
                        <span className="text-[var(--accent)] animate-pulse">{'>'}</span>
                        <span className="w-2 h-4 bg-[var(--accent)] animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}
