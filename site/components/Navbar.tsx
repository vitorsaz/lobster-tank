'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
    { href: '/', label: 'Tank' },
    { href: '/terminal', label: 'Terminal' },
    { href: '/docs', label: 'Docs' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/code', label: 'The Code' },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)]" style={{ background: 'rgba(10, 22, 40, 0.85)', backdropFilter: 'blur(16px)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-3 group">
                        <span className="text-2xl">🦞</span>
                        <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                            THE LOBSTER TANK
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>
                            $TANK
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                    pathname === link.href
                                        ? 'text-[var(--accent)] bg-[var(--glass)]'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass)]'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <a href="https://x.com/LobsterTankBot" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                    </div>
                </div>

                {/* Mobile nav */}
                <div className="md:hidden flex overflow-x-auto gap-1 pb-2 -mx-4 px-4 scrollbar-hide">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                                pathname === link.href
                                    ? 'text-[var(--accent)] bg-[var(--glass)]'
                                    : 'text-[var(--text-muted)]'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
