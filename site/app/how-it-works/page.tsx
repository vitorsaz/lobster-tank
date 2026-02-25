'use client';
import { motion } from 'framer-motion';

const steps = [
    {
        step: 1,
        icon: '📡',
        title: 'Token Detection',
        description: 'The tank listens to PumpPortal\'s WebSocket for new tokens being created on PumpFun. Every new token triggers the council.',
        detail: 'PumpPortal sends real-time data about new token creations including the mint address, creator info, and initial liquidity.',
        color: '#00d4aa',
    },
    {
        step: 2,
        icon: '🔍',
        title: 'Data Collection',
        description: 'Birdeye API fetches comprehensive market data: market cap, liquidity, volume, holders count, top holder concentration, and more.',
        detail: 'We wait 3 seconds after detection for data to propagate, then fetch metadata and market data in parallel for speed.',
        color: '#3b82f6',
    },
    {
        step: 3,
        icon: '🧠',
        title: 'Council Analysis',
        description: 'Claude AI receives the token data and simulates each lobster analyzing it independently based on their unique personality.',
        detail: 'Each lobster has different criteria: Chad loves volume, Nancy checks safety scores, Coral reads vibes, Snappy flips a coin (basically), and Papaclaw compares to historical patterns.',
        color: '#a855f7',
    },
    {
        step: 4,
        icon: '🗳️',
        title: 'Democratic Vote',
        description: '5 votes are cast. 3 out of 5 needed for BUY. The deciding "swing vote" is tracked. Every vote includes a reason in character.',
        detail: 'If Papaclaw falls asleep (ABSTAIN), only 4 votes count and 3 are still needed. Unanimous decisions (5-0) are rare legendary events.',
        color: '#e84430',
    },
    {
        step: 5,
        icon: '⚡',
        title: 'Trade Execution',
        description: 'If approved AND the score meets the minimum threshold (adjusted by tank mood), the trade is executed via PumpPortal.',
        detail: 'Trade size is calculated based on balance percentage, modified by the tank state risk multiplier. In RED TIDE, Chad may bypass the vote entirely.',
        color: '#facc15',
    },
    {
        step: 6,
        icon: '📊',
        title: 'Position Monitoring',
        description: 'Open positions are checked every 30 seconds. Stop loss and take profit levels are dynamic based on the tank state.',
        detail: 'In REEF PARADISE, stop loss is wider (-20%) and take profit is higher (+40%). In CHOPPY WATERS, both tighten. In TANK BREACH, it\'s YOLO.',
        color: '#f472b6',
    },
    {
        step: 7,
        icon: '🌊',
        title: 'Tank Evolution',
        description: 'Every win raises water level, every loss drops it. The tank state changes dynamically, affecting all future decisions.',
        detail: 'The system is self-regulating: bad streaks make the tank more cautious (CHOPPY WATERS), but extreme losses make it YOLO (TANK BREACH). Recovery streaks restore order.',
        color: '#00d4aa',
    },
];

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.5 }
    }),
};

export default function HowItWorksPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    How It Works
                </h1>
                <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
                    From token detection to trade execution — the full lifecycle of crustacean democracy.
                </p>
            </div>

            {/* Visual Pipeline */}
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px" style={{ background: 'linear-gradient(180deg, var(--accent) 0%, var(--lobster) 50%, var(--accent) 100%)', opacity: 0.3 }} />

                <div className="space-y-12">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.step}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            variants={fadeInUp}
                            className={`relative flex items-start gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                        >
                            {/* Step number */}
                            <div className="absolute left-8 md:left-1/2 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold z-10 -translate-x-1/2"
                                style={{ background: `${step.color}20`, border: `2px solid ${step.color}`, color: step.color }}>
                                {step.step}
                            </div>

                            {/* Content */}
                            <div className={`ml-20 md:ml-0 md:w-[calc(50%-40px)] ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                                <div className="glass-card p-6 hover:border-opacity-50 transition-all" style={{ borderColor: `${step.color}30` }}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl">{step.icon}</span>
                                        <h3 className="text-lg font-bold" style={{ color: step.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                                            {step.title}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                                        {step.description}
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)] pt-3 mt-3">
                                        {step.detail}
                                    </p>
                                </div>
                            </div>

                            {/* Spacer for alternating layout */}
                            <div className="hidden md:block md:w-[calc(50%-40px)]" />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Architecture Diagram */}
            <div className="mt-20">
                <h2 className="text-2xl font-bold text-center mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Architecture
                </h2>
                <div className="glass-card p-8">
                    <pre className="text-[11px] md:text-xs font-mono text-[var(--accent)] leading-relaxed overflow-x-auto whitespace-pre">
{`
    PumpPortal WS              Birdeye API              Claude AI
         |                          |                       |
         v                          v                       v
  ┌─────────────┐          ┌──────────────┐        ┌──────────────┐
  │ New Token   │───────>  │ Market Data  │──────> │  Council     │
  │ Detection   │          │ Collection   │        │  Analysis    │
  └─────────────┘          └──────────────┘        └──────┬───────┘
                                                          |
                                                          v
                                                  ┌──────────────┐
                                                  │  5 Lobsters  │
                                                  │    VOTE      │
                                                  │  3/5 = BUY   │
                                                  └──────┬───────┘
                                                          |
                                     ┌────────────────────┼────────────────────┐
                                     v                    v                    v
                              ┌────────────┐     ┌──────────────┐     ┌──────────────┐
                              │   SKIP     │     │ EXECUTE BUY  │     │   Monitor    │
                              │   Token    │     │ via PumpPortal│     │  Positions   │
                              └────────────┘     └──────┬───────┘     └──────┬───────┘
                                                        |                    |
                                                        v                    v
                                                 ┌──────────────┐    ┌──────────────┐
                                                 │  Supabase    │    │ Stop Loss /  │
                                                 │  Database    │    │ Take Profit  │
                                                 └──────────────┘    └──────────────┘
                                                        |
                                                        v
                                                 ┌──────────────┐
                                                 │  Website     │
                                                 │  Dashboard   │ <── Realtime Updates
                                                 └──────────────┘
`}
                    </pre>
                </div>
            </div>
        </div>
    );
}
