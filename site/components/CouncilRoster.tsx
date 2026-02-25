'use client';

const COUNCIL = [
    { id: 'chad', name: 'Chad', emoji: '💪', role: 'The Bull', color: '#e84430', bio: 'Always bullish. Always yelling. Never wrong (in his mind). Focuses on volume and momentum. Will fight anyone who says SKIP.', stats: 'Bias: BULLISH | Threshold: Low' },
    { id: 'nancy', name: 'Nancy', emoji: '📊', role: 'The Analyst', color: '#3b82f6', bio: 'Data-driven skeptic. Runs the numbers three times. Nobody listens to her charts but she\'s usually right. The voice of reason nobody asked for.', stats: 'Bias: BEARISH | Threshold: High' },
    { id: 'papaclaw', name: 'Papaclaw', emoji: '👴', role: 'The Veteran', color: '#a8a29e', bio: 'Old school lobster who\'s "seen it all." Speaks in cryptic proverbs. Sometimes falls asleep during votes. When he talks, it\'s wisdom. Usually.', stats: 'Bias: NEUTRAL | May ABSTAIN (sleeping)' },
    { id: 'snappy', name: 'Snappy', emoji: '⚡', role: 'The Chaos', color: '#facc15', bio: 'Pure ADHD energy. Changes vote 7 times before settling. Influenced by name coolness. Types faster than he thinks. The wildcard.', stats: 'Bias: CHAOTIC | Threshold: Random' },
    { id: 'coral', name: 'Coral', emoji: '🌺', role: 'The Swing Vote', color: '#f472b6', bio: 'Trades on vibes and aura. Consults the plastic plant. Surprisingly accurate. The deciding vote in most 2-2 splits. The universe speaks through her.', stats: 'Bias: VIBES | The Swing Vote' },
];

export default function CouncilRoster() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {COUNCIL.map((l) => (
                <div key={l.id} className="glass-card p-5 group hover:border-opacity-50 transition-all" style={{ borderColor: `${l.color}30` }}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${l.color}15`, border: `1px solid ${l.color}30` }}>
                            {l.emoji}
                        </div>
                        <div>
                            <h3 className="font-bold text-sm" style={{ color: l.color }}>{l.name}</h3>
                            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{l.role}</p>
                        </div>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">{l.bio}</p>
                    <div className="text-[10px] font-mono text-[var(--text-muted)] px-2 py-1 rounded" style={{ background: `${l.color}08` }}>
                        {l.stats}
                    </div>
                </div>
            ))}
        </div>
    );
}
