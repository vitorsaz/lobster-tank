'use client';
import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
    id: number;
    lobster: string;
    emoji: string;
    message: string;
    vote?: 'BUY' | 'SKIP' | 'ABSTAIN';
    color: string;
    timestamp: string;
}

// Lobster personas with ghetto american slang
const LOBSTER_SLANG = {
    chad: {
        emoji: '💪',
        color: '#e84430',
        name: 'CHAD',
        buyPhrases: [
            "YO THIS JOINT IS BUSSIN FR FR 🔥 BUY THAT JAWN RN",
            "bro i aint even cappin this token finna moon NO CAP",
            "AIGHT LISTEN UP this is the one fam, we eatin GOOD tonight",
            "sheeeeesh look at that volume bruh we gotta cop this NOW",
            "aye this ticker hittin different fr, im all in no questions",
            "we bout to be up crazy on this one trust the process dawg",
            "THIS IS IT CHIEF 🚀 if you aint buyin you tweakin",
            "the vibes is immaculate on this one, CLAWS IN LETS RIDE",
            "bruh this gonna make us all rich or whatever idgaf BUY",
            "on god this token valid af, dont be a whole goofy and skip",
        ],
        skipPhrases: [
            "aight even I gotta say this one lookin mad sus ngl",
            "nah this aint it chief... but fr tho maybe... NAH skip",
            "this token got me second guessin and I NEVER second guess smh",
        ],
    },
    nancy: {
        emoji: '📊',
        color: '#3b82f6',
        name: 'NANCY',
        buyPhrases: [
            "The data actually supports this. I can't believe I'm agreeing with Chad.",
            "Liquidity is solid, holders are distributed... fine. BUY. But don't say I didn't warn us.",
            "Against my better judgment, the fundamentals here are clean. Proceed.",
        ],
        skipPhrases: [
            "absolutely not. the liquidity ratio is abysmal and yall are delusional",
            "I ran the numbers three times. This is garbage. Pure, mathematical garbage.",
            "chad please shut up the data literally says this is a rug SKIP",
            "oh wow another token with 90% held by top 10 wallets how original 🙄",
            "the market cap to liquidity ratio is giving major rug energy, hard pass",
            "i swear if yall vote BUY on this i am leaving this tank for real",
            "every metric says SKIP but nobody listens to the one with a spreadsheet",
            "this is statistically identical to the last 5 rugs we got hit with SKIP",
        ],
    },
    papaclaw: {
        emoji: '👴',
        color: '#a8a29e',
        name: 'PAPACLAW',
        buyPhrases: [
            "...reminds me of a token back in the summer of '21... we ate good that month.",
            "*wakes up* ...hm? oh. yes. this one has that old school energy. buy.",
            "in my day we didn't have these fancy charts. we just FELT it. this feels right.",
        ],
        skipPhrases: [
            "i seen this exact same setup in 2022. we lost everything. skip.",
            "*yawns* ...this token? nah. seen it before. it ends badly. trust the old claw.",
            "zzzz... huh? oh we still talkin bout this? skip. *goes back to sleep*",
            "young crustaceans never learn... this is a trap. i can smell it in the water.",
            "back in my reef, tokens like this got you COOKED. literally. pass.",
        ],
        abstainPhrases: [
            "*snoring loudly* zzzzZZZZzzz... 💤",
            "i am too old for this nonsense. wake me when its over.",
            "*sleeping on the castle* ...the tide will decide...",
        ],
    },
    snappy: {
        emoji: '⚡',
        color: '#facc15',
        name: 'SNAPPY',
        buyPhrases: [
            "BUY wait no SELL wait no BUY yeah BUY I THINK maybe BUY FINAL ANSWER",
            "OOH SHINY NEW TOKEN I WANT IT I WANT IT I WANT IT",
            "ok so I was gonna say skip but then I looked at the name and its kinda cool so BUY",
            "CLAWS MOVING FASTER THAN MY BRAIN RN but yeah BUY I guess idk",
        ],
        skipPhrases: [
            "SKIP no wait BUY no wait yeah SKIP no... ok final answer SKIP maybe",
            "i changed my mind 7 times already but im going with SKIP this time FOR REAL",
            "something feels off about this one and by something I mean everything lol SKIP",
            "nah im not feelin this one wait actually... nah yeah skip im skippin",
        ],
    },
    coral: {
        emoji: '🌺',
        color: '#f472b6',
        name: 'CORAL',
        buyPhrases: [
            "i'm sensing... positive energy from this token. the aura is ✨ green ✨ BUY.",
            "the universe is telling me this one is blessed. my crystals agree. buy.",
            "this token has main character energy fr. the vibes are immaculate 🌊",
        ],
        skipPhrases: [
            "the energy on this one is giving... darkness. toxic aura. hard skip. 🚫",
            "my spiritual lobster intuition says NO. the vibes are rancid on this one.",
            "i asked the plastic plant and even IT said skip. the aura is off.",
            "this token's chakras are completely misaligned. negative energy. pass.",
            "something about this symbol gives me the ick. skip for vibes reasons.",
        ],
    },
};

function getTimeStr() {
    return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Generate a fake ticker discussion
function generateDiscussion(): ChatMessage[] {
    const tickers = ['$LOBSTER', '$CRAB', '$SHRIMP', '$REEF', '$CORAL', '$WHALE', '$FISH', '$TANK', '$CLAWS', '$OCEAN', '$TIDE', '$SHELL', '$WAVE', '$DEEP', '$KRILL', '$SQUID', '$NEMO'];
    const ticker = randomFrom(tickers);
    const mc = (Math.random() * 500 + 5).toFixed(0) + 'K';
    const messages: ChatMessage[] = [];
    let id = Date.now();

    // System message: new token
    messages.push({
        id: id++,
        lobster: 'system',
        emoji: '🗳️',
        message: `NEW TOKEN DETECTED: ${ticker} — MC: $${mc}`,
        color: 'var(--accent)',
        timestamp: getTimeStr(),
    });

    // Each lobster reacts
    const lobsters = ['chad', 'nancy', 'papaclaw', 'snappy', 'coral'] as const;
    const votes: Record<string, string> = {};

    for (const l of lobsters) {
        const profile = LOBSTER_SLANG[l];
        const isBuy = l === 'chad' ? Math.random() > 0.15 :
                       l === 'nancy' ? Math.random() > 0.7 :
                       l === 'papaclaw' ? (Math.random() > 0.3 ? (Math.random() > 0.2 ? false : null) : true) :
                       l === 'snappy' ? Math.random() > 0.5 :
                       Math.random() > 0.45;

        if (isBuy === null && l === 'papaclaw') {
            votes[l] = 'ABSTAIN';
            const papProfile = LOBSTER_SLANG.papaclaw;
            messages.push({
                id: id++, lobster: l, emoji: profile.emoji, color: profile.color,
                message: randomFrom(papProfile.abstainPhrases),
                vote: 'ABSTAIN', timestamp: getTimeStr(),
            });
        } else if (isBuy) {
            votes[l] = 'BUY';
            messages.push({
                id: id++, lobster: l, emoji: profile.emoji, color: profile.color,
                message: randomFrom(profile.buyPhrases).replace(/this token|this one|this/i, ticker),
                vote: 'BUY', timestamp: getTimeStr(),
            });
        } else {
            votes[l] = 'SKIP';
            messages.push({
                id: id++, lobster: l, emoji: profile.emoji, color: profile.color,
                message: randomFrom(profile.skipPhrases).replace(/this token|this one|this/i, ticker),
                vote: 'SKIP', timestamp: getTimeStr(),
            });
        }
    }

    // Tally
    const buys = Object.values(votes).filter(v => v === 'BUY').length;
    const skips = Object.values(votes).filter(v => v === 'SKIP').length;
    const abstains = Object.values(votes).filter(v => v === 'ABSTAIN').length;
    const decision = buys >= 3 ? 'BUY' : 'SKIP';

    messages.push({
        id: id++,
        lobster: 'system',
        emoji: decision === 'BUY' ? '✅' : '❌',
        message: `COUNCIL DECISION: ${decision} (${buys}-${skips}${abstains > 0 ? `, ${abstains} asleep` : ''})`,
        color: decision === 'BUY' ? 'var(--success)' : 'var(--danger)',
        timestamp: getTimeStr(),
    });

    return messages;
}

export default function LobsterChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial discussion
        const initial = generateDiscussion();
        setMessages(initial);

        // New discussion every 20-40 seconds
        const interval = setInterval(() => {
            const newDiscussion = generateDiscussion();
            setMessages(prev => [...prev.slice(-30), ...newDiscussion]); // Keep last 30 + new
        }, 20000 + Math.random() * 20000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="glass-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🗳️</span>
                    <span className="font-semibold text-sm">Council Chat — Live</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                    <span className="text-xs text-[var(--text-muted)]">live</span>
                </div>
            </div>

            <div ref={scrollRef} className="p-4 space-y-3 max-h-[500px] overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
                {messages.map((msg) => (
                    <div key={msg.id} className="chat-message">
                        {msg.lobster === 'system' ? (
                            <div className="text-center py-2">
                                <span className="text-xs font-mono px-3 py-1 rounded-full" style={{ background: 'rgba(0,212,170,0.1)', color: msg.color }}>
                                    {msg.emoji} {msg.message}
                                </span>
                            </div>
                        ) : (
                            <div className="flex gap-3 items-start">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: `${msg.color}20`, border: `1px solid ${msg.color}40` }}>
                                    {msg.emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold" style={{ color: msg.color }}>{LOBSTER_SLANG[msg.lobster as keyof typeof LOBSTER_SLANG]?.name || msg.lobster}</span>
                                        {msg.vote && (
                                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                                msg.vote === 'BUY' ? 'vote-buy' : msg.vote === 'ABSTAIN' ? 'vote-abstain' : 'vote-skip'
                                            }`}>
                                                {msg.vote}
                                            </span>
                                        )}
                                        <span className="text-[10px] text-[var(--text-muted)] font-mono">{msg.timestamp}</span>
                                    </div>
                                    <div className={`chat-bubble ${msg.lobster}`}>
                                        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{msg.message}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
