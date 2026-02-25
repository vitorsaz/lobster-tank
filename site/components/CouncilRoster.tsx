'use client';

function LobsterSVGSmall({ color }: { color: string }) {
    return (
        <svg width="70" height="70" viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 4px 16px ${color}50)` }}>
            <ellipse cx="50" cy="55" rx="18" ry="24" fill={color} opacity="0.9" />
            <ellipse cx="50" cy="55" rx="18" ry="24" fill="url(#lsg)" />
            <ellipse cx="50" cy="78" rx="14" ry="6" fill={color} opacity="0.8" />
            <ellipse cx="50" cy="86" rx="11" ry="5" fill={color} opacity="0.7" />
            <ellipse cx="50" cy="34" rx="14" ry="10" fill={color} opacity="0.95" />
            <circle cx="42" cy="28" r="4" fill="#0a1628" />
            <circle cx="58" cy="28" r="4" fill="#0a1628" />
            <circle cx="43" cy="27" r="1.8" fill="white" />
            <circle cx="59" cy="27" r="1.8" fill="white" />
            <path d="M45 25 Q38 10 30 5" stroke={color} strokeWidth="1.5" fill="none" opacity="0.7" />
            <path d="M55 25 Q62 10 70 5" stroke={color} strokeWidth="1.5" fill="none" opacity="0.7" />
            <circle cx="30" cy="5" r="2" fill={color} opacity="0.5" />
            <circle cx="70" cy="5" r="2" fill={color} opacity="0.5" />
            <path d="M32 45 Q20 38 15 30" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M15 30 Q8 24 5 28 Q3 32 10 33 Q8 35 5 38 Q8 42 15 36 Q14 33 15 30" fill={color} />
            <path d="M68 45 Q80 38 85 30" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M85 30 Q92 24 95 28 Q97 32 90 33 Q92 35 95 38 Q92 42 85 36 Q86 33 85 30" fill={color} />
            <line x1="35" y1="55" x2="25" y2="65" stroke={color} strokeWidth="2" opacity="0.5" />
            <line x1="35" y1="62" x2="25" y2="72" stroke={color} strokeWidth="2" opacity="0.5" />
            <line x1="65" y1="55" x2="75" y2="65" stroke={color} strokeWidth="2" opacity="0.5" />
            <line x1="65" y1="62" x2="75" y2="72" stroke={color} strokeWidth="2" opacity="0.5" />
            <defs>
                <radialGradient id="lsg" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
    );
}

const COUNCIL = [
    {
        id: 'chad', name: 'Chad', role: 'The Bull', color: '#e84430',
        bio: 'Always bullish. Always yelling. Never wrong (in his mind). Focuses on volume and momentum. Will fight anyone who says SKIP.',
        bias: 'BULLISH', threshold: 'Low',
        catchphrase: '"if you aint buyin you tweakin"',
    },
    {
        id: 'nancy', name: 'Nancy', role: 'The Analyst', color: '#3b82f6',
        bio: "Data-driven skeptic. Runs the numbers three times. Nobody listens to her charts but she's usually right.",
        bias: 'BEARISH', threshold: 'High',
        catchphrase: '"the data literally says this is a rug"',
    },
    {
        id: 'papaclaw', name: 'Papaclaw', role: 'The Veteran', color: '#78716c',
        bio: "Old school lobster who's seen it all. Speaks in cryptic proverbs. Sometimes falls asleep during votes.",
        bias: 'NEUTRAL', threshold: 'May ABSTAIN',
        catchphrase: '"back in my reef, this got you COOKED"',
    },
    {
        id: 'snappy', name: 'Snappy', role: 'Chaos Agent', color: '#eab308',
        bio: 'Pure ADHD energy. Changes vote 7 times before settling. Influenced by name coolness. The wildcard nobody asked for.',
        bias: 'CHAOTIC', threshold: 'Random',
        catchphrase: '"BUY wait no SELL wait no BUY"',
    },
    {
        id: 'coral', name: 'Coral', role: 'The Swing Vote', color: '#ec4899',
        bio: "Trades on vibes and aura. Consults the plastic plant. Surprisingly accurate. The deciding vote in most 2-2 splits.",
        bias: 'VIBES', threshold: 'Swing',
        catchphrase: '"the aura is immaculate"',
    },
];

export default function CouncilRoster() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {COUNCIL.map((l, i) => (
                <div
                    key={l.id}
                    className="glass-card group relative overflow-hidden transition-all duration-500 hover:scale-[1.03]"
                    style={{ borderColor: `${l.color}20` }}
                >
                    {/* Top glow bar */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${l.color}, transparent)` }} />

                    {/* Background glow on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 30%, ${l.color}10, transparent 70%)` }} />

                    <div className="relative p-6 text-center">
                        {/* Lobster SVG */}
                        <div className="flex justify-center mb-4" style={{ animation: `float ${3.5 + i * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}>
                            <LobsterSVGSmall color={l.color} />
                        </div>

                        {/* Name + Role */}
                        <h3 className="text-lg font-black tracking-tight mb-0.5" style={{ color: l.color, fontFamily: "'Space Grotesk', sans-serif" }}>{l.name}</h3>
                        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em] font-bold mb-3">{l.role}</p>

                        {/* Bio */}
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">{l.bio}</p>

                        {/* Catchphrase */}
                        <p className="text-[10px] italic text-[var(--text-muted)] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{l.catchphrase}</p>

                        {/* Bias badge */}
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full" style={{ background: `${l.color}12`, color: l.color, border: `1px solid ${l.color}25` }}>
                                {l.bias}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
