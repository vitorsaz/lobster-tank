'use client';
import { useMemo } from 'react';

export default function Bubbles() {
    const bubbles = useMemo(() =>
        Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            size: 4 + Math.random() * 20,
            duration: 8 + Math.random() * 15,
            delay: Math.random() * 10,
            opacity: 0.1 + Math.random() * 0.3,
        })),
    []);

    return (
        <div className="bubbles-container">
            {bubbles.map((b) => (
                <div
                    key={b.id}
                    className="bubble"
                    style={{
                        left: `${b.left}%`,
                        width: `${b.size}px`,
                        height: `${b.size}px`,
                        animationDuration: `${b.duration}s`,
                        animationDelay: `${b.delay}s`,
                        opacity: b.opacity,
                    }}
                />
            ))}
        </div>
    );
}
