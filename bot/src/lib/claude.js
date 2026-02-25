import { config } from '../config.js';

const LOBSTER_PROFILES = {
    chad:     { bias: 'bullish',  buyThreshold: 45, emoji: '💪' },
    nancy:    { bias: 'bearish',  buyThreshold: 75, emoji: '📊' },
    papaclaw: { bias: 'neutral',  buyThreshold: 60, emoji: '👴' },
    snappy:   { bias: 'chaotic',  buyThreshold: null, emoji: '⚡' },
    coral:    { bias: 'vibes',    buyThreshold: 55, emoji: '🌺' }
};

function buildAnalysisPrompt(tokenInfo, tankState) {
    return `You are THE LOBSTER TANK — a council of 5 lobsters trapped in an aquarium that accidentally became a memecoin trading desk.

Tank State: ${tankState.state}
Water Level: ${tankState.waterLevel}%
Tank P&L Today: ${tankState.todayPnL > 0 ? '+' : ''}${tankState.todayPnL || 0}%

THE COUNCIL:
1. CHAD 💪 - Always bullish. Wants action. Focuses on volume and momentum.
2. NANCY 📊 - Data-driven skeptic. Focuses on safety, liquidity, holder distribution.
3. PAPACLAW 👴 - Old veteran. Moderate. Sometimes falls asleep (ABSTAIN). Speaks in proverbs.
4. SNAPPY ⚡ - Chaotic ADHD. Changes mind constantly. Influenced by name coolness.
5. CORAL 🌺 - Vibes-based trader. Reads narrative strength, community feel, aesthetics.

${tankState.state === 'RED_TIDE' ? 'WARNING: RED TIDE. Council is broken. Chad may act alone.' : ''}
${tankState.state === 'TANK_BREACH' ? 'CRITICAL: TANK BREACH. No council. Every lobster for themselves.' : ''}
${tankState.state === 'REEF_PARADISE' ? 'HARMONY: Council is in sync. High agreement expected.' : ''}

Analyze this token. Each lobster votes independently based on their personality:

Name: ${tokenInfo.name}
Symbol: ${tokenInfo.symbol}
Market Cap: $${(tokenInfo.mc || 0).toLocaleString()}
Liquidity: $${(tokenInfo.liquidity || 0).toLocaleString()}
Volume 24h: $${(tokenInfo.volume24h || 0).toLocaleString()}
Holders: ${tokenInfo.holders || 0}
Price: $${tokenInfo.price || 0}

RULES:
- CHAD: Low threshold. Almost always BUY. Yells something.
- NANCY: High threshold. Skeptical. Wants data.
- PAPACLAW: Moderate. 15% chance of ABSTAIN (sleeping). Cryptic wisdom.
- SNAPPY: Chaotic. 50/50 influenced by name coolness and random impulse.
- CORAL: Based on "vibes" - narrative strength, symbol aesthetics.
- 3/5 votes needed for BUY decision.

Respond ONLY in valid JSON (no markdown, no code blocks):
{
    "votes": {
        "chad":     { "vote": "BUY"|"SKIP", "reason": "1 sentence in character" },
        "nancy":    { "vote": "BUY"|"SKIP", "reason": "1 sentence in character" },
        "papaclaw": { "vote": "BUY"|"SKIP"|"ABSTAIN", "reason": "1 sentence in character" },
        "snappy":   { "vote": "BUY"|"SKIP", "reason": "1 sentence in character" },
        "coral":    { "vote": "BUY"|"SKIP", "reason": "1 sentence in character" }
    },
    "score": 0-100,
    "confidence": "low"|"medium"|"high",
    "tank_narration": "2-3 sentences nature documentary style about the scene during this vote",
    "chad_outburst": "what Chad yelled"
}`;
}

export async function analyzeWithCouncil(tokenInfo, tankState) {
    try {
        const prompt = buildAnalysisPrompt(tokenInfo, tankState);

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': config.CLAUDE_API_KEY,
                'content-type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1024,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        const data = await response.json();
        const text = data.content?.[0]?.text || '{}';

        // Extract JSON from response
        let jsonStr = text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) jsonStr = jsonMatch[0];

        const result = JSON.parse(jsonStr);

        // Calculate vote tally
        const votes = result.votes || {};
        let buyCount = 0;
        let skipCount = 0;
        let swingVoter = null;

        for (const [name, v] of Object.entries(votes)) {
            if (v.vote === 'BUY') buyCount++;
            else if (v.vote === 'SKIP') skipCount++;
        }

        // Determine swing voter (the 3rd BUY vote if approved)
        if (buyCount >= 3) {
            const buyVoters = Object.entries(votes)
                .filter(([, v]) => v.vote === 'BUY')
                .map(([name]) => name);
            // Coral is often swing, otherwise last voter
            swingVoter = buyVoters.includes('coral') ? 'coral' : buyVoters[buyVoters.length - 1];
        }

        const decision = buyCount >= 3 ? 'BUY' : 'SKIP';
        const abstains = Object.values(votes).filter(v => v.vote === 'ABSTAIN').length;
        const tally = `${buyCount}-${skipCount}${abstains > 0 ? ` (${abstains} asleep)` : ''}`;

        return {
            votes: result.votes,
            decision,
            tally,
            unanimous: buyCount === 5 || skipCount === 5,
            swingVoter,
            score: result.score || 50,
            confidence: result.confidence || 'medium',
            tankNarration: result.tank_narration || 'The lobsters deliberate in silence.',
            chadOutburst: result.chad_outburst || 'LFG!!!'
        };
    } catch (e) {
        console.error('[CLAUDE] Council analysis error:', e.message);
        return {
            votes: {
                chad: { vote: 'BUY', reason: 'ALWAYS BUY.' },
                nancy: { vote: 'SKIP', reason: 'Analysis failed. Too risky.' },
                papaclaw: { vote: 'ABSTAIN', reason: '*snoring*' },
                snappy: { vote: 'SKIP', reason: 'Wait what are we doing?' },
                coral: { vote: 'SKIP', reason: 'The vibes are... unclear.' }
            },
            decision: 'SKIP',
            tally: '1-3 (1 asleep)',
            unanimous: false,
            swingVoter: null,
            score: 0,
            confidence: 'low',
            tankNarration: 'The tank\'s analysis systems malfunctioned. Nancy sighs.',
            chadOutburst: 'THE COMPUTER BROKE BUT I STILL SAY BUY!!!'
        };
    }
}

export { LOBSTER_PROFILES };
