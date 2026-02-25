import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Bubbles from '@/components/Bubbles';

export const metadata: Metadata = {
    title: 'The Lobster Tank | $TANK — Crustacean Democracy Trading',
    description: '5 lobsters. 1 tank. 0 financial literacy. They vote on memecoins and somehow survive.',
    icons: { icon: '🦞' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                <Bubbles />
                <div className="caustics" />
                <Navbar />
                <main className="relative z-10 pt-16 min-h-screen">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
