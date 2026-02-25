'use client';
import { useState, useEffect } from 'react';

const LOBSTERS = [
    { id: 'chad', emoji: '🦞', name: 'Chad', x: 15, y: 65, color: '#e84430', trait: 'Always Bullish' },
    { id: 'nancy', emoji: '🦞', name: 'Nancy', x: 70, y: 45, color: '#3b82f6', trait: 'Data Analyst' },
    { id: 'papaclaw', emoji: '🦞', name: 'Papaclaw', x: 80, y: 75, color: '#a8a29e', trait: 'The Veteran' },
    { id: 'snappy', emoji: '🦞', name: 'Snappy', x: 40, y: 30, color: '#facc15', trait: 'Chaotic Energy' },
    { id: 'coral', emoji: '🦞', name: 'Coral', x: 55, y: 70, color: '#f472b6', trait: 'Vibes Only' },
];

export default function TankVisual({ waterLevel = 75, tankState = 'STEADY_CURRENTS' }: { waterLevel?: number; tankState?: string }) {
    const [positions, setPositions] = useState(LOBSTERS.map(l => ({ ...l, currentX: l.x, currentY: l.y })));

    // Animate lobster positions slightly
    useEffect(() => {
        const interval = setInterval(() => {
            setPositions(prev => prev.map(l => ({
                ...l,
                currentX: l.x + (Math.random() - 0.5) * 8,
                currentY: l.y + (Math.random() - 0.5) * 6,
            })));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const stateColors: Record<string, string> = {
        REEF_PARADISE: 'from-cyan-900/30 to-blue-900/50',
        STEADY_CURRENTS: 'from-blue-900/40 to-indigo-900/50',
        CHOPPY_WATERS: 'from-yellow-900/20 to-blue-900/50',
        RED_TIDE: 'from-red-900/30 to-blue-900/50',
        TANK_BREACH: 'from-purple-900/30 to-gray-900/50',
    };

    return (
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[var(--border)]" style={{ aspectRatio: '16/9', background: 'var(--bg-primary)' }}>
            {/* Water gradient */}
            <div className={`absolute inset-0 bg-gradient-to-b ${stateColors[tankState] || stateColors.STEADY_CURRENTS}`} />

            {/* Water level indicator */}
            <div className="absolute left-0 bottom-0 right-0 transition-all duration-1000" style={{ height: `${waterLevel}%`, background: 'linear-gradient(180deg, rgba(0,212,170,0.05) 0%, rgba(0,100,200,0.1) 100%)' }} />

            {/* Glass reflection */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/[0.04] to-transparent" />

            {/* Sand bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#c4a46a]/20 to-transparent" />

            {/* Castle */}
            <div className="absolute bottom-8 right-[15%] text-3xl opacity-40">🏰</div>

            {/* Plant */}
            <div className="absolute bottom-6 left-[20%] text-2xl opacity-30">🌿</div>

            {/* Lobsters */}
            {positions.map((l) => (
                <div
                    key={l.id}
                    className="absolute transition-all duration-[3s] ease-in-out cursor-pointer group"
                    style={{ left: `${l.currentX}%`, top: `${l.currentY}%`, transform: 'translate(-50%, -50%)' }}
                >
                    <div className="relative">
                        <span className="text-2xl block" style={{ filter: `hue-rotate(${l.id === 'nancy' ? '200deg' : l.id === 'coral' ? '300deg' : l.id === 'snappy' ? '50deg' : l.id === 'papaclaw' ? '30deg' : '0deg'})` }}>
                            {l.emoji}
                        </span>
                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap" style={{ background: `${l.color}30`, border: `1px solid ${l.color}50`, color: l.color }}>
                                {l.name} — {l.trait}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Tank state label */}
            <div className="absolute top-4 left-4">
                <div className={`tank-badge ${tankState.toLowerCase().replace('_', '-')}`}>
                    {tankState.replace('_', ' ')}
                </div>
            </div>

            {/* Water level % */}
            <div className="absolute top-4 right-4 text-xs font-mono text-[var(--text-muted)]">
                💧 {waterLevel}%
            </div>

            {/* Bubbles inside tank */}
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bubble"
                    style={{
                        left: `${10 + Math.random() * 80}%`,
                        bottom: '0',
                        width: `${3 + Math.random() * 8}px`,
                        height: `${3 + Math.random() * 8}px`,
                        animationDuration: `${6 + Math.random() * 10}s`,
                        animationDelay: `${Math.random() * 8}s`,
                    }}
                />
            ))}
        </div>
    );
}
