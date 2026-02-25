'use client';
import { motion } from 'framer-motion';

const codeBlocks = [
    {
        title: 'Council Voting (Claude AI)',
        file: 'bot/src/lib/claude.js',
        description: 'Each lobster is simulated by Claude AI with unique personality traits. The prompt describes each lobster\'s bias and they vote independently.',
        language: 'javascript',
        code: `// Each lobster votes based on their personality
const LOBSTER_PROFILES = {
    chad:     { bias: 'bullish',  buyThreshold: 45 },  // Always BUY
    nancy:    { bias: 'bearish',  buyThreshold: 75 },  // Data only
    papaclaw: { bias: 'neutral',  buyThreshold: 60 },  // Old school
    snappy:   { bias: 'chaotic',  buyThreshold: null }, // Random
    coral:    { bias: 'vibes',    buyThreshold: 55 },   // Feelings
};

// Claude simulates all 5 voting independently
const result = await analyzeWithCouncil(tokenInfo, tankState);
// result.votes = { chad: {vote:'BUY'}, nancy: {vote:'SKIP'}, ... }
// result.tally = "3-2"
// result.decision = "BUY" or "SKIP"`
    },
    {
        title: 'Tank State System',
        file: 'bot/src/lib/tank.js',
        description: 'Water level determines tank mood. Events raise or lower water level, which changes how lobsters trade.',
        language: 'javascript',
        code: `// Water level -> Tank State
function calculateTankState(waterLevel) {
    if (wl >= 80) return 'REEF_PARADISE';    // Harmony
    if (wl >= 60) return 'STEADY_CURRENTS';  // Normal
    if (wl >= 40) return 'CHOPPY_WATERS';    // Tense
    if (wl >= 20) return 'RED_TIDE';         // Crisis
    return 'TANK_BREACH';                    // Chaos
}

// Events affect water level
// profit: +5  |  loss: -8  |  bigWin: +15
// bigLoss: -20  |  unanimous: +5  |  escape: -10

// Mood affects trading
REEF_PARADISE:  { riskMultiplier: 1.1 }  // Confident
RED_TIDE:       { riskMultiplier: 1.3 }  // Impulsive
TANK_BREACH:    { riskMultiplier: 1.5 }  // YOLO`
    },
    {
        title: 'PumpPortal WebSocket',
        file: 'bot/src/lib/pumpportal.js',
        description: 'Real-time connection to PumpFun for new token detection. Auto-reconnects on disconnect.',
        language: 'javascript',
        code: `// Connect to PumpPortal for real-time token data
connectPumpPortal({
    onToken: (data) => {
        // New token created on PumpFun
        processingQueue.push(data);
        processQueue(); // Council assembles
    },
    onConnect: () => {
        subscribeNewTokens();
        // "The tank hums to life..."
    },
    onDisconnect: () => {
        // Auto-reconnect in 5 seconds
        setTimeout(() => connectPumpPortal(callbacks), 5000);
    }
});`
    },
    {
        title: 'Trade Execution',
        file: 'bot/src/index.js',
        description: 'When council approves, trade amount is calculated based on balance, mood modifiers, and risk level.',
        language: 'javascript',
        code: `// Council voted BUY — execute trade
if (analysis.decision === 'BUY' && analysis.score >= MIN_SCORE) {
    const modifier = getMoodModifier(tankState.state);
    const tradeAmount = balance * MAX_TRADE_PERCENT * modifier.riskMultiplier;
    const finalAmount = Math.min(tradeAmount, balance * 0.8);

    // Execute via PumpPortal
    await buyToken(ca, finalAmount, SLIPPAGE);

    // Record in Supabase with full vote breakdown
    await recordTrade({
        ca, symbol, type: 'buy',
        amount_sol: finalAmount,
        vote_breakdown: analysis.votes,
        deciding_lobster: analysis.swingVoter,
        council_commentary: analysis.tankNarration,
    });
}`
    },
    {
        title: 'Real-time Dashboard',
        file: 'site/app/page.tsx',
        description: 'Next.js site with Supabase real-time subscriptions. Data updates live without page refresh.',
        language: 'typescript',
        code: `// Subscribe to real-time tank status updates
useEffect(() => {
    const sb = getSupabase();
    const channel = sb.channel('tank-status')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'system_status',
            filter: 'id=eq.1'
        }, (payload) => {
            // Tank visual updates in real-time
            setStatus(payload.new as SystemStatus);
        })
        .subscribe();

    return () => { sb.removeChannel(channel); };
}, []);`
    },
    {
        title: 'Lobster Chat Generator',
        file: 'site/components/LobsterChat.tsx',
        description: 'Each lobster speaks with unique slang and personality. Chat is generated from actual vote data or simulated for demo.',
        language: 'typescript',
        code: `// Chad always speaks in caps with ghetto slang
chad: {
    buyPhrases: [
        "YO THIS JOINT IS BUSSIN FR FR BUY THAT JAWN RN",
        "sheeeeesh look at that volume bruh we gotta cop NOW",
        "THIS IS IT CHIEF if you aint buyin you tweakin",
    ],
}

// Nancy is the skeptic
nancy: {
    skipPhrases: [
        "the data literally says this is a rug SKIP",
        "oh wow another 90% top 10 wallets how original",
    ],
}

// Coral trades on vibes
coral: {
    buyPhrases: [
        "the universe says this one is blessed. my crystals agree.",
    ],
}`
    },
];

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function CodePage() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    The Code
                </h1>
                <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
                    Under the hood of crustacean democracy. Every line of code that makes 5 lobsters trade memecoins.
                </p>
            </div>

            {/* Tech Stack */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                {[
                    { name: 'Node.js', desc: 'Bot runtime', icon: '🟢' },
                    { name: 'Next.js', desc: 'Dashboard', icon: '▲' },
                    { name: 'Claude AI', desc: 'Council brain', icon: '🧠' },
                    { name: 'Supabase', desc: 'Database + Realtime', icon: '⚡' },
                    { name: 'Solana', desc: 'Blockchain', icon: '◎' },
                    { name: 'PumpPortal', desc: 'Token data + Trading', icon: '🔌' },
                    { name: 'Birdeye', desc: 'Market data', icon: '🦅' },
                    { name: 'Tailwind', desc: 'Styling', icon: '🎨' },
                ].map((tech) => (
                    <div key={tech.name} className="glass-card p-4 text-center">
                        <span className="text-2xl block mb-2">{tech.icon}</span>
                        <p className="text-sm font-bold">{tech.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{tech.desc}</p>
                    </div>
                ))}
            </div>

            {/* Code Blocks */}
            <div className="space-y-8">
                {codeBlocks.map((block, i) => (
                    <motion.div
                        key={block.title}
                        custom={i}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <div className="glass-card overflow-hidden">
                            <div className="p-6 border-b border-[var(--border)]">
                                <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                    {block.title}
                                </h3>
                                <p className="text-xs text-[var(--text-muted)] font-mono mb-2">{block.file}</p>
                                <p className="text-sm text-[var(--text-secondary)]">{block.description}</p>
                            </div>
                            <div className="p-6" style={{ background: '#0a0e17' }}>
                                <pre className="text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre">
                                    <code className="text-[var(--text-secondary)]">
                                        {block.code.split('\n').map((line, j) => {
                                            // Basic syntax highlighting
                                            let highlighted = line
                                                .replace(/(\/\/.+)/g, '<span style="color:#4a6a7a">$1</span>')
                                                .replace(/('.*?'|".*?")/g, '<span style="color:#00d4aa">$1</span>')
                                                .replace(/\b(const|let|var|function|if|return|await|async|export)\b/g, '<span style="color:#c084fc">$1</span>')
                                                .replace(/\b(true|false|null|undefined)\b/g, '<span style="color:#fbbf24">$1</span>')
                                                .replace(/(\d+\.?\d*)/g, '<span style="color:#f472b6">$1</span>');
                                            return <span key={j} dangerouslySetInnerHTML={{ __html: highlighted + '\n' }} />;
                                        })}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* File Structure */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold text-center mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Project Structure
                </h2>
                <div className="glass-card p-8">
                    <pre className="text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
{`lobster-tank/
├── bot/                          # Trading bot (Node.js)
│   ├── src/
│   │   ├── index.js              # Main entry — orchestrates everything
│   │   ├── config.js             # Environment variables + trading config
│   │   └── lib/
│   │       ├── claude.js         # Council AI — 5 lobsters vote via Claude
│   │       ├── tank.js           # Tank state machine + mood modifiers
│   │       ├── pumpportal.js     # WebSocket + buy/sell execution
│   │       ├── birdeye.js        # Market data (MC, liquidity, holders)
│   │       ├── supabase.js       # Database CRUD operations
│   │       ├── logger.js         # Colorful terminal logs
│   │       └── utils.js          # Retry logic, formatters, helpers
│   └── .env                      # API keys (never committed)
│
├── site/                         # Dashboard (Next.js + Tailwind)
│   ├── app/
│   │   ├── page.tsx              # Main dashboard — tank visual + chat
│   │   ├── terminal/page.tsx     # Live terminal feed
│   │   ├── docs/page.tsx         # Documentation
│   │   ├── how-it-works/page.tsx # Visual pipeline explanation
│   │   └── code/page.tsx         # This page — code walkthrough
│   ├── components/
│   │   ├── TankVisual.tsx        # Animated aquarium with 5 lobsters
│   │   ├── LobsterChat.tsx       # Live chat — lobsters discuss tickers
│   │   ├── CouncilRoster.tsx     # Meet the council members
│   │   └── StatsGrid.tsx         # Trading statistics
│   └── lib/
│       ├── supabase.ts           # Lazy-init Supabase client
│       └── types.ts              # TypeScript interfaces
│
└── supabase/
    ├── schema.sql                # Database schema
    └── fix_realtime.sql          # Enable realtime subscriptions`}
                    </pre>
                </div>
            </div>
        </div>
    );
}
