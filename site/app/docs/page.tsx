'use client';
import { useState } from 'react';

const sections = [
    {
        id: 'overview',
        title: 'Overview',
        icon: '🦞',
        content: `**The Lobster Tank** is an autonomous memecoin trading bot powered by a council of 5 lobsters, each with unique personalities and trading biases.

Every time a new token appears on PumpFun, the council convenes, debates, and votes. 3 out of 5 votes are needed to execute a trade. The tank's water level (sanity meter) affects how the lobsters behave — from peaceful cooperation to total chaos.

This is **crustacean democracy** in action.`
    },
    {
        id: 'council',
        title: 'The Council',
        icon: '🗳️',
        content: `The 5 lobsters each have distinct trading personalities:

**Chad 💪** — The eternal bull. Votes BUY on almost everything. High risk tolerance. Focuses on volume and momentum. Yells a lot.

**Nancy 📊** — The data analyst. Very skeptical. Only votes BUY on tokens with strong fundamentals: good liquidity, distributed holders, clean safety scores.

**Papaclaw 👴** — The veteran. Compares everything to historical patterns. Sometimes falls asleep during votes (ABSTAIN). When he speaks, it's wisdom.

**Snappy ⚡** — Pure chaos. Changes his mind constantly. Influenced by how cool the token name sounds. The wildcard.

**Coral 🌺** — Trades on vibes. Reads "energy" and "aura" of tokens. Often the swing vote in 2-2 splits. Surprisingly accurate.`
    },
    {
        id: 'voting',
        title: 'Voting System',
        icon: '📋',
        content: `Each token goes through the council voting process:

1. **Detection** — New token appears on PumpFun via WebSocket
2. **Data Gathering** — Birdeye API fetches market cap, liquidity, holders, etc.
3. **Council Analysis** — Claude AI simulates each lobster voting independently
4. **Vote Tally** — 3/5 majority needed for BUY
5. **Execution** — Trade executed if score meets threshold

**Vote Types:**
- **BUY** — Lobster thinks it's worth buying
- **SKIP** — Lobster thinks it's not worth it
- **ABSTAIN** — Papaclaw fell asleep (only Papaclaw can abstain)

**Special Events:**
- **Unanimous BUY (5-0)** — Legendary event, bonus water level
- **Unanimous SKIP (5-0)** — Strong consensus, token is avoided
- **Chad Solo (RED TIDE)** — When tank is in crisis, Chad may buy without a vote`
    },
    {
        id: 'tank-states',
        title: 'Tank States',
        icon: '🌊',
        content: `The tank's "water level" (0-100%) determines the overall state:

**🐠 REEF PARADISE (80-100%)** — Crystal clear waters. Lobsters cooperate. Trading is disciplined. Low risk.

**🌊 STEADY CURRENTS (60-79%)** — Normal operations. Healthy debates. Standard risk levels.

**🌊💨 CHOPPY WATERS (40-59%)** — Tension rising. More arguments. Conservative trading. Faster sell triggers.

**🔴 RED TIDE (20-39%)** — Crisis mode. Chad goes rogue. Nancy shuts down. Impulsive trading.

**💀 TANK BREACH (0-19%)** — Total chaos. Every lobster for themselves. YOLO trades. Snappy is on the keyboard.

**What affects water level:**
- Profit: +5%
- Loss: -8%
- Big Win: +15%
- Big Loss: -20%
- Unanimous vote: +5%
- Escape attempt: -10%`
    },
    {
        id: 'trading',
        title: 'Trading Config',
        icon: '⚙️',
        content: `**Base Configuration:**
- Starting Balance: 0.5 SOL
- Max Trade: 50% of balance
- Base Stop Loss: -20%
- Base Take Profit: +40%
- Min Score to Buy: 65/100
- Position Check: Every 30s
- Slippage: 15%

**Mood Modifiers:**
Each tank state modifies the base trading parameters:

| State | Risk Multiplier | Score Threshold |
|-------|----------------|-----------------|
| Reef Paradise | 1.1x | -5 |
| Steady Currents | 1.0x | 0 |
| Choppy Waters | 0.8x | +5 |
| Red Tide | 1.3x | -10 |
| Tank Breach | 1.5x | -20 |`
    },
    {
        id: 'apis',
        title: 'APIs & Data',
        icon: '🔌',
        content: `**Data Sources:**
- **PumpPortal WebSocket** — Real-time new token detection
- **Birdeye API** — Token metadata, market data, pricing
- **Helius RPC** — Solana blockchain operations
- **Claude AI** — Council analysis and voting simulation

**Database:**
- **Supabase** — PostgreSQL with real-time subscriptions
- Tables: system_status, lobsters, tokens, trades, positions, council_log, tank_highlights

**Trading:**
- **PumpPortal Trade API** — Buy/sell execution
- Supports both simulation mode (no wallet) and live trading`
    },
];

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState('overview');

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Documentation
                </h1>
                <p className="text-[var(--text-muted)]">Everything you need to know about The Lobster Tank.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
                {/* Sidebar */}
                <div className="lg:sticky lg:top-24 lg:self-start">
                    <nav className="space-y-1">
                        {sections.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                                    activeSection === s.id
                                        ? 'bg-[var(--glass)] text-[var(--accent)]'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass)]'
                                }`}
                            >
                                <span>{s.icon}</span>
                                {s.title}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="glass-card p-8">
                    {sections.filter(s => s.id === activeSection).map((s) => (
                        <div key={s.id}>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-3xl">{s.icon}</span>
                                <h2 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.title}</h2>
                            </div>
                            <div className="prose prose-invert max-w-none">
                                {s.content.split('\n\n').map((paragraph, i) => (
                                    <div key={i} className="mb-4">
                                        {paragraph.startsWith('|') ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr>
                                                            {paragraph.split('\n')[0].split('|').filter(Boolean).map((h, j) => (
                                                                <th key={j} className="text-left px-3 py-2 text-[var(--text-secondary)] border-b border-[var(--border)]">{h.trim()}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {paragraph.split('\n').slice(2).map((row, j) => (
                                                            <tr key={j}>
                                                                {row.split('|').filter(Boolean).map((cell, k) => (
                                                                    <td key={k} className="px-3 py-2 text-[var(--text-primary)] border-b border-[var(--border)] font-mono text-xs">{cell.trim()}</td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p className="text-[var(--text-secondary)] leading-relaxed text-sm" dangerouslySetInnerHTML={{
                                                __html: paragraph
                                                    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>')
                                                    .replace(/\n- /g, '<br/>• ')
                                                    .replace(/\n(\d+)\. /g, '<br/>$1. ')
                                                    .replace(/\n/g, '<br/>')
                                            }} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
