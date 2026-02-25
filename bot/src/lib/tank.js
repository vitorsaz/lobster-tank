/**
 * THE LOBSTER TANK - State Management & Reactions
 * Manages tank mood, water level, and lobster states
 */

// ═══════════════════════════════════════════════════════════════
// TANK STATES
// ═══════════════════════════════════════════════════════════════
export const TANK_STATES = {
    REEF_PARADISE:   { name: 'REEF_PARADISE',   range: [80, 100], emoji: '🐠✨', riskLevel: 'low' },
    STEADY_CURRENTS: { name: 'STEADY_CURRENTS', range: [60, 79],  emoji: '🌊',   riskLevel: 'medium-low' },
    CHOPPY_WATERS:   { name: 'CHOPPY_WATERS',   range: [40, 59],  emoji: '🌊💨', riskLevel: 'medium' },
    RED_TIDE:        { name: 'RED_TIDE',         range: [20, 39],  emoji: '🔴🦞', riskLevel: 'high' },
    TANK_BREACH:     { name: 'TANK_BREACH',      range: [0, 19],   emoji: '💀🐚', riskLevel: 'extreme' }
};

// ═══════════════════════════════════════════════════════════════
// MOOD MODIFIERS (affect trading)
// ═══════════════════════════════════════════════════════════════
export const MOOD_MODIFIERS = {
    REEF_PARADISE:   { riskMultiplier: 1.1, scoreThreshold: -5,  voteAgreement: 'high',   tradingSpeed: 'normal' },
    STEADY_CURRENTS: { riskMultiplier: 1.0, scoreThreshold: 0,   voteAgreement: 'normal', tradingSpeed: 'normal' },
    CHOPPY_WATERS:   { riskMultiplier: 0.8, scoreThreshold: 5,   voteAgreement: 'low',    tradingSpeed: 'slow' },
    RED_TIDE:        { riskMultiplier: 1.3, scoreThreshold: -10, voteAgreement: 'broken', tradingSpeed: 'impulsive' },
    TANK_BREACH:     { riskMultiplier: 1.5, scoreThreshold: -20, voteAgreement: 'none',   tradingSpeed: 'random' }
};

// ═══════════════════════════════════════════════════════════════
// REACTIONS
// ═══════════════════════════════════════════════════════════════
export const REACTIONS = {
    onNewToken: {
        REEF_PARADISE:   "🗳️ New token spotted. The council assembles calmly. Chad already voted BUY.",
        STEADY_CURRENTS: "🗳️ New token on the radar. Nancy is pulling up charts. Chad is stretching his claws.",
        CHOPPY_WATERS:   "🗳️ Another token?! Chad's screaming, Nancy's sighing, Snappy voted before reading the name.",
        RED_TIDE:        "🗳️ NEW TOKEN. Chad bought before the vote. Nancy is furious. Papaclaw didn't notice.",
        TANK_BREACH:     "🗳️ ...token detected. No one is at their voting stations. Snappy is on the keyboard."
    },
    onBuy: {
        REEF_PARADISE:   "✅ UNANIMOUS BUY. All claws raised. Even Papaclaw nodded. This is rare, folks.",
        STEADY_CURRENTS: "✅ BUY approved 3-2. Chad & Snappy bullish. Nancy voted SKIP but accepts democracy.",
        CHOPPY_WATERS:   "✅ BUY passed 3-2 after 47 minutes of screaming. Coral was the swing vote.",
        RED_TIDE:        "✅ Chad bought without asking. The council didn't vote. This is not democracy anymore.",
        TANK_BREACH:     "✅ Someone bought something. We're not sure who. Might have been Snappy on the keyboard."
    },
    onProfit: {
        REEF_PARADISE:   "💰 PROFIT! The tank celebrates! Lobster conga line! 🦞🦞🦞🦞🦞",
        STEADY_CURRENTS: "💰 Green trade! Chad flexes. Nancy says 'as predicted.' Good vibes.",
        CHOPPY_WATERS:   "💰 Profit?! The tank pauses mid-argument to celebrate briefly. Then resumes arguing.",
        RED_TIDE:        "💰 We... profited? HOW? Chad claims credit. Nancy claims credit. Fight continues but happier.",
        TANK_BREACH:     "💰 Profit detected. The lobsters slowly turn around. Is this... hope?"
    },
    onLoss: {
        REEF_PARADISE:   "📉 Small loss. Nancy adjusts the spreadsheet. Chad shrugs. 'Cost of business.'",
        STEADY_CURRENTS: "📉 Loss. Chad blames Nancy's data. Nancy blames Chad's impulse.",
        CHOPPY_WATERS:   "📉 LOSS. The water gets darker. Chad bangs the glass. Nancy silently updates her failure log.",
        RED_TIDE:        "📉 Another loss. Chad and Nancy aren't speaking. Snappy is vibrating.",
        TANK_BREACH:     "📉 Loss. No one reacts. The water is almost gone. Papaclaw floats."
    },
    onBigWin: {
        REEF_PARADISE:   "🎉🦞 MASSIVE WIN! THE TANK IS GOING CRAZY! Papaclaw DID A CARTWHEEL! HISTORY!",
        STEADY_CURRENTS: "🎉🦞 BIG WIN! Full tank party! Chad is doing laps! Nancy is SMILING!",
        CHOPPY_WATERS:   "🎉🦞 HUGE WIN! Everyone stops fighting to celebrate! GROUP PINCH!",
        RED_TIDE:        "🎉🦞 BIG WIN OUT OF NOWHERE! The red tide clears! Chad and Nancy HUG!",
        TANK_BREACH:     "🎉🦞 ...WHAT. BIG WIN. FROM THE DEPTHS. Water starts filling. The tank... HEALS?!"
    },
    onBigLoss: {
        REEF_PARADISE:   "💀 MASSIVE LOSS. Paradise shattered. Papaclaw opens one eye. 'Here we go again.'",
        STEADY_CURRENTS: "💀 BIG LOSS. Nancy shuts her laptop. Chad stares at the glass. Coral cries.",
        CHOPPY_WATERS:   "💀 DEVASTATING LOSS. All lobsters retreat to the castle. Emergency meeting.",
        RED_TIDE:        "💀 CATASTROPHIC LOSS. Chad rammed the glass. Nancy left her resignation in the sand.",
        TANK_BREACH:     "💀 ...the tank cracks more. Water drains. Coral whispers to the plant. It's over."
    }
};

// ═══════════════════════════════════════════════════════════════
// TANK STATE CALCULATOR
// ═══════════════════════════════════════════════════════════════
export function calculateTankState(waterLevel) {
    const wl = Math.max(0, Math.min(100, waterLevel));
    if (wl >= 80) return TANK_STATES.REEF_PARADISE;
    if (wl >= 60) return TANK_STATES.STEADY_CURRENTS;
    if (wl >= 40) return TANK_STATES.CHOPPY_WATERS;
    if (wl >= 20) return TANK_STATES.RED_TIDE;
    return TANK_STATES.TANK_BREACH;
}

export function getReaction(event, stateName) {
    return REACTIONS[event]?.[stateName] || 'The tank bubbles quietly.';
}

export function getMoodModifier(stateName) {
    return MOOD_MODIFIERS[stateName] || MOOD_MODIFIERS.STEADY_CURRENTS;
}

// Water level changes based on events
export function adjustWaterLevel(currentLevel, event) {
    const changes = {
        profit: +5,
        loss: -8,
        bigWin: +15,
        bigLoss: -20,
        streak: +3,
        losingStreak: -5,
        newToken: 0,
        escape: -10,
        unanimous: +5
    };
    const change = changes[event] || 0;
    return Math.max(0, Math.min(100, currentLevel + change));
}
