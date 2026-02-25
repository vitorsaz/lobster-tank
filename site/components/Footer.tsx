'use client';

export default function Footer() {
    return (
        <footer className="border-t border-[var(--border)] mt-20" style={{ background: 'var(--bg-secondary)' }}>
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🦞</span>
                            <span className="font-bold text-lg">The Lobster Tank</span>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                            5 lobsters. 1 tank. 0 financial literacy.<br />
                            Crustacean democracy at its finest.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-[var(--text-secondary)]">Navigate</h4>
                        <div className="flex flex-col gap-2">
                            <a href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Tank Dashboard</a>
                            <a href="/terminal" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Live Terminal</a>
                            <a href="/docs" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Documentation</a>
                            <a href="/how-it-works" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">How It Works</a>
                            <a href="/code" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">The Code</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-[var(--text-secondary)]">Community</h4>
                        <div className="flex flex-col gap-2">
                            <a href="https://x.com/LobsterTankBot" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Twitter / X</a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[var(--text-muted)]">
                        Built by lobsters, for lobsters. Not financial advice. Don&apos;t tap the glass.
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                        Powered by crustacean democracy 🗳️
                    </p>
                </div>
            </div>
        </footer>
    );
}
