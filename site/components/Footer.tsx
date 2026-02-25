'use client';

export default function Footer() {
    return (
        <footer className="border-t border-[var(--border)] mt-20" style={{ background: 'var(--bg-secondary)' }}>
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Main footer content - centered */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <svg width="32" height="32" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 8px rgba(232,68,48,0.4))' }}>
                            <ellipse cx="50" cy="55" rx="18" ry="22" fill="#e84430" opacity="0.9" />
                            <ellipse cx="50" cy="36" rx="13" ry="9" fill="#e84430" opacity="0.95" />
                            <path d="M34 46 Q24 40 20 35" stroke="#e84430" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <path d="M20 35 Q15 30 13 33 Q12 36 17 36 Q15 38 13 40 Q16 43 20 38" fill="#e84430" />
                            <path d="M66 46 Q76 40 80 35" stroke="#e84430" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <path d="M80 35 Q85 30 87 33 Q88 36 83 36 Q85 38 87 40 Q84 43 80 38" fill="#e84430" />
                        </svg>
                        <span className="font-bold text-2xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>The Lobster Tank</span>
                    </div>
                    <p className="text-base text-[var(--text-muted)] leading-relaxed max-w-md mx-auto">
                        5 lobsters. 1 tank. 0 financial literacy.<br />
                        Crustacean democracy at its finest.
                    </p>
                </div>

                {/* Navigation links - centered row */}
                <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
                    <a href="/" className="text-base text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Tank</a>
                    <span className="text-[var(--border)]">|</span>
                    <a href="/terminal" className="text-base text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Terminal</a>
                    <span className="text-[var(--border)]">|</span>
                    <a href="/docs" className="text-base text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Docs</a>
                    <span className="text-[var(--border)]">|</span>
                    <a href="/how-it-works" className="text-base text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">How It Works</a>
                    <span className="text-[var(--border)]">|</span>
                    <a href="/code" className="text-base text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">The Code</a>
                    <span className="text-[var(--border)]">|</span>
                    <a href="https://x.com/LobsterTankBot" target="_blank" rel="noopener noreferrer" className="text-base text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        Twitter
                    </a>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-[var(--border)] text-center">
                    <p className="text-sm text-[var(--text-muted)]">
                        Built by lobsters, for lobsters. Not financial advice. Don&apos;t tap the glass.
                    </p>
                </div>
            </div>
        </footer>
    );
}
