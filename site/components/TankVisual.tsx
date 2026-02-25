'use client';
import { useState, useEffect } from 'react';

function LobsterSVG({ color, size = 60, flip = false }: { color: string; size?: number; flip?: boolean }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: flip ? 'scaleX(-1)' : undefined, filter: `drop-shadow(0 4px 12px ${color}40)` }}>
            <ellipse cx="50" cy="55" rx="18" ry="24" fill={color} opacity="0.9" />
            <ellipse cx="50" cy="55" rx="18" ry="24" fill="url(#ls)" />
            <ellipse cx="50" cy="78" rx="14" ry="6" fill={color} opacity="0.8" />
            <ellipse cx="50" cy="86" rx="11" ry="5" fill={color} opacity="0.7" />
            <ellipse cx="50" cy="92" rx="8" ry="4" fill={color} opacity="0.6" />
            <path d="M42 95 L50 98 L58 95 L55 92 L50 94 L45 92 Z" fill={color} opacity="0.7" />
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
                <radialGradient id="ls" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
    );
}

const LOBSTERS = [
    { id: 'chad', name: 'CHAD', color: '#e84430', x: 12, y: 52, size: 72, flip: false, badge: '💪', trait: 'Always Bullish' },
    { id: 'nancy', name: 'NANCY', color: '#3b82f6', x: 72, y: 38, size: 58, flip: true, badge: '📊', trait: 'Data Analyst' },
    { id: 'papaclaw', name: 'PAPACLAW', color: '#78716c', x: 80, y: 70, size: 52, flip: true, badge: '👴', trait: 'The Veteran' },
    { id: 'snappy', name: 'SNAPPY', color: '#eab308', x: 38, y: 26, size: 48, flip: false, badge: '⚡', trait: 'Chaos Agent' },
    { id: 'coral', name: 'CORAL', color: '#ec4899', x: 54, y: 65, size: 54, flip: true, badge: '🌺', trait: 'Vibes Only' },
];

export default function TankVisual({ waterLevel = 75, tankState = 'STEADY_CURRENTS' }: { waterLevel?: number; tankState?: string }) {
    const [offsets, setOffsets] = useState(LOBSTERS.map(() => ({ dx: 0, dy: 0 })));
    const [hovered, setHovered] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setOffsets(LOBSTERS.map(() => ({
                dx: (Math.random() - 0.5) * 10,
                dy: (Math.random() - 0.5) * 6,
            })));
        }, 2800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full rounded-3xl overflow-hidden" style={{ minHeight: '520px', background: 'linear-gradient(180deg, #04080f 0%, #081525 15%, #0c1e38 40%, #0a1a30 65%, #14180f 100%)', border: '2px solid rgba(30, 58, 95, 0.5)', boxShadow: '0 0 80px rgba(0, 100, 180, 0.08), inset 0 0 120px rgba(0, 50, 100, 0.1)' }}>

            {/* Water surface top */}
            <div className="absolute top-0 left-0 right-0 h-20 z-10" style={{ background: 'linear-gradient(180deg, rgba(0,160,220,0.05) 0%, transparent 100%)' }}>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.02) 70%, transparent 100%)', animation: 'waterShimmer 8s ease-in-out infinite' }} />
            </div>

            {/* Volumetric light rays */}
            <div className="absolute top-0 left-[18%] w-[180px] h-[450px] opacity-[0.035] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(180,220,255,1), transparent)', transform: 'skewX(-10deg)', filter: 'blur(35px)' }} />
            <div className="absolute top-0 left-[52%] w-[120px] h-[380px] opacity-[0.025] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(180,220,255,1), transparent)', transform: 'skewX(6deg)', filter: 'blur(28px)' }} />
            <div className="absolute top-0 right-[15%] w-[90px] h-[300px] opacity-[0.02] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(180,220,255,1), transparent)', transform: 'skewX(-3deg)', filter: 'blur(22px)' }} />

            {/* Sand bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(160,130,80,0.12) 30%, rgba(160,130,80,0.22) 70%, rgba(140,110,60,0.3) 100%)' }} />

            {/* Seaweed left */}
            <svg className="absolute bottom-0 left-[6%] opacity-30" width="45" height="160" viewBox="0 0 45 160" style={{ animation: 'float 6s ease-in-out infinite' }}>
                <path d="M22 160 Q18 120 22 80 Q26 50 19 15" stroke="#1a7050" strokeWidth="3" fill="none" />
                <path d="M22 160 Q28 125 22 90 Q16 60 25 25" stroke="#1a8050" strokeWidth="2.5" fill="none" />
                <path d="M22 160 Q12 130 18 95 Q24 65 14 30" stroke="#1a6040" strokeWidth="2" fill="none" />
                <ellipse cx="19" cy="15" rx="7" ry="14" fill="#1a7050" opacity="0.5" />
                <ellipse cx="25" cy="25" rx="6" ry="11" fill="#1a8050" opacity="0.4" />
                <ellipse cx="14" cy="30" rx="6" ry="12" fill="#1a6040" opacity="0.35" />
            </svg>

            {/* Seaweed right */}
            <svg className="absolute bottom-0 right-[10%] opacity-25" width="35" height="130" viewBox="0 0 35 130" style={{ animation: 'float 7s ease-in-out infinite', animationDelay: '1s' }}>
                <path d="M17 130 Q14 95 17 60 Q20 35 15 8" stroke="#2a8a5a" strokeWidth="2.5" fill="none" />
                <path d="M17 130 Q22 100 17 70 Q12 45 20 15" stroke="#2a7a5a" strokeWidth="2" fill="none" />
                <ellipse cx="15" cy="8" rx="6" ry="11" fill="#2a8a5a" opacity="0.4" />
                <ellipse cx="20" cy="15" rx="5" ry="9" fill="#2a7a5a" opacity="0.35" />
            </svg>

            {/* Coral reef left */}
            <svg className="absolute bottom-1 left-[30%] opacity-15" width="90" height="55" viewBox="0 0 90 55">
                <path d="M10 55 Q12 30 15 20 Q18 10 15 5 M15 20 Q20 15 25 20" stroke="#d97706" strokeWidth="2" fill="none" />
                <path d="M35 55 Q38 25 40 15 Q43 8 40 3 M40 25 Q45 18 48 25 M40 15 Q35 10 40 8" stroke="#dc2626" strokeWidth="2.5" fill="none" />
                <path d="M60 55 Q62 35 65 25 Q68 18 65 12 M65 30 Q70 22 73 30" stroke="#d97706" strokeWidth="2" fill="none" />
                <path d="M78 55 Q80 38 82 30 Q84 22 81 18" stroke="#ec4899" strokeWidth="1.8" fill="none" />
            </svg>

            {/* Castle decoration */}
            <svg className="absolute bottom-4 right-[20%] opacity-15" width="75" height="85" viewBox="0 0 75 85">
                <rect x="12" y="32" width="52" height="53" rx="2" fill="#3a4558" />
                <rect x="22" y="12" width="13" height="43" fill="#3a4558" />
                <rect x="40" y="17" width="13" height="38" fill="#3a4558" />
                <rect x="19" y="5" width="5" height="12" fill="#3a4558" />
                <rect x="25" y="5" width="5" height="12" fill="#3a4558" />
                <rect x="37" y="9" width="5" height="13" fill="#3a4558" />
                <rect x="43" y="9" width="5" height="13" fill="#3a4558" />
                <rect x="49" y="9" width="5" height="13" fill="#3a4558" />
                <rect x="30" y="58" width="15" height="27" rx="7.5" fill="#222c3a" />
            </svg>

            {/* Small fish swimming */}
            <svg className="absolute opacity-10" style={{ top: '15%', animation: 'fishSwim 20s linear infinite' }} width="20" height="12" viewBox="0 0 20 12">
                <path d="M0 6 Q5 0 10 6 Q5 12 0 6 M10 6 L16 2 L16 10 Z" fill="#60a5fa" />
            </svg>
            <svg className="absolute opacity-8" style={{ top: '35%', animation: 'fishSwim 25s linear infinite', animationDelay: '5s' }} width="16" height="10" viewBox="0 0 20 12">
                <path d="M0 6 Q5 0 10 6 Q5 12 0 6 M10 6 L16 2 L16 10 Z" fill="#34d399" />
            </svg>

            {/* The 5 Lobsters */}
            {LOBSTERS.map((l, i) => (
                <div
                    key={l.id}
                    className="absolute cursor-pointer z-20 group"
                    style={{
                        left: `${l.x + offsets[i].dx}%`,
                        top: `${l.y + offsets[i].dy}%`,
                        transform: 'translate(-50%, -50%)',
                        transition: 'left 2.8s ease-in-out, top 2.8s ease-in-out',
                    }}
                    onMouseEnter={() => setHovered(l.id)}
                    onMouseLeave={() => setHovered(null)}
                >
                    <div style={{ animation: `float ${3.5 + i * 0.6}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}>
                        <LobsterSVG color={l.color} size={l.size} flip={l.flip} />
                    </div>

                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <span className="text-[10px] font-bold font-mono tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm" style={{ color: l.color, background: `${l.color}12`, border: `1px solid ${l.color}25`, textShadow: `0 0 10px ${l.color}60` }}>
                            {l.badge} {l.name}
                        </span>
                    </div>

                    {hovered === l.id && (
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap z-30 animate-slide-up">
                            <div className="px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-md" style={{ background: 'rgba(10,22,40,0.9)', border: `1px solid ${l.color}40`, color: l.color, boxShadow: `0 8px 30px ${l.color}25` }}>
                                {l.trait}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Bubbles */}
            {Array.from({ length: 18 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        left: `${3 + Math.random() * 94}%`,
                        bottom: '-10px',
                        width: `${2 + Math.random() * 8}px`,
                        height: `${2 + Math.random() * 8}px`,
                        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), rgba(255,255,255,0.02))',
                        border: '1px solid rgba(255,255,255,0.05)',
                        animation: `bubbleRise ${6 + Math.random() * 14}s linear infinite`,
                        animationDelay: `${Math.random() * 12}s`,
                    }}
                />
            ))}

            {/* Tank state + water level */}
            <div className="absolute top-5 left-5 z-30">
                <div className={`tank-badge ${tankState.toLowerCase().replace(/_/g, '-')}`}>
                    {tankState.replace(/_/g, ' ')}
                </div>
            </div>
            <div className="absolute top-5 right-5 z-30">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono backdrop-blur-sm" style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)', color: 'var(--accent)' }}>
                    <span style={{ fontSize: '14px' }}>💧</span> {waterLevel}%
                </div>
            </div>

            {/* Glass highlight corner */}
            <div className="absolute top-0 left-0 w-1/4 h-1/4 opacity-[0.025] pointer-events-none rounded-tl-3xl" style={{ background: 'linear-gradient(135deg, white, transparent)' }} />
        </div>
    );
}
