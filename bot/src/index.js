import 'dotenv/config';
import { config } from './config.js';
import { logHeader, logInfo, logSuccess, logError, logWarning, logVote, logCouncilDecision, logTankNarration, logTankStatus, logToken } from './lib/logger.js';
import { supabase, updateSystemStatus, upsertToken, recordTrade, createPosition, getOpenPositions, closePosition, addCouncilLog, addHighlight, getLobsters, updateLobster } from './lib/supabase.js';
import { getTokenInfo, getSolPrice } from './lib/birdeye.js';
import { connectPumpPortal, subscribeNewTokens, loadWallet, getBalance, buyToken, sellToken, isWsConnected } from './lib/pumpportal.js';
import { analyzeWithCouncil } from './lib/claude.js';
import { calculateTankState, getReaction, getMoodModifier, adjustWaterLevel } from './lib/tank.js';
import { sleep, formatMarketCap } from './lib/utils.js';

// ═══════════════════════════════════════════════════════════════
// THE LOBSTER TANK - Main Bot
// ═══════════════════════════════════════════════════════════════

let tankState = {
    waterLevel: 75,
    state: 'STEADY_CURRENTS',
    balance: config.TRADING.STARTING_BALANCE,
    totalPnl: 0,
    todayPnL: 0,
    wins: 0,
    losses: 0,
    totalTrades: 0,
    escapeAttempts: 0,
    unanimousDecisions: 0,
    councilFights: 0,
    isRunning: true
};

let processingQueue = [];
let isProcessing = false;

// ═══════════════════════════════════════════════════════════════
// INIT LOBSTERS IN DATABASE
// ═══════════════════════════════════════════════════════════════
async function initLobsters() {
    const lobsters = [
        { id: 'chad', name: 'Chad', emoji: '💪', current_mood: 'pumped', total_votes: 0, correct_votes: 0, wrong_votes: 0, win_rate: 0, escape_attempts: 0 },
        { id: 'nancy', name: 'Nancy', emoji: '📊', current_mood: 'normal', total_votes: 0, correct_votes: 0, wrong_votes: 0, win_rate: 0, escape_attempts: 0 },
        { id: 'papaclaw', name: 'Papaclaw', emoji: '👴', current_mood: 'normal', total_votes: 0, correct_votes: 0, wrong_votes: 0, win_rate: 0, escape_attempts: 0 },
        { id: 'snappy', name: 'Snappy', emoji: '⚡', current_mood: 'normal', total_votes: 0, correct_votes: 0, wrong_votes: 0, win_rate: 0, escape_attempts: 0 },
        { id: 'coral', name: 'Coral', emoji: '🌺', current_mood: 'normal', total_votes: 0, correct_votes: 0, wrong_votes: 0, win_rate: 0, escape_attempts: 0 }
    ];
    for (const l of lobsters) {
        await updateLobster(l.id, l);
    }
    logSuccess('Council members initialized');
}

// ═══════════════════════════════════════════════════════════════
// PROCESS NEW TOKEN
// ═══════════════════════════════════════════════════════════════
async function processToken(tokenData) {
    const ca = tokenData.mint;
    if (!ca) return;

    try {
        // Get token info from Birdeye
        await sleep(3000); // Wait for data to populate
        const tokenInfo = await getTokenInfo(ca);
        if (!tokenInfo) { logWarning(`No data for ${ca.slice(0, 8)}...`); return; }

        // Quick filters
        if ((tokenInfo.mc || 0) < 5000) return; // Too small
        if ((tokenInfo.liquidity || 0) < 1000) return; // No liquidity

        const stateInfo = calculateTankState(tankState.waterLevel);
        const reaction = getReaction('onNewToken', stateInfo.name);

        logToken({ action: 'INFO', symbol: tokenInfo.symbol, name: tokenInfo.name, mc: tokenInfo.mc });
        logTankNarration(reaction);

        // Save token to DB
        await upsertToken({
            ca,
            name: tokenInfo.name,
            symbol: tokenInfo.symbol,
            logo: tokenInfo.logo,
            mc: tokenInfo.mc,
            liquidity: tokenInfo.liquidity,
            volume_24h: tokenInfo.volume24h,
            holders: tokenInfo.holders,
            price: tokenInfo.price
        });

        // Council votes via Claude
        logInfo(`Council assembling to vote on $${tokenInfo.symbol}...`);

        const analysis = await analyzeWithCouncil(tokenInfo, {
            state: tankState.state,
            waterLevel: tankState.waterLevel,
            todayPnL: tankState.todayPnL
        });

        // Log each vote
        for (const [name, vote] of Object.entries(analysis.votes || {})) {
            logVote(name, vote.vote, vote.reason);
        }

        // Log council decision
        logCouncilDecision(analysis.tally, analysis.decision, analysis.swingVoter);
        logTankNarration(analysis.tankNarration);

        if (analysis.chadOutburst) {
            logInfo(`💪 CHAD: "${analysis.chadOutburst}"`);
        }

        // Log to council_log
        await addCouncilLog({
            event_type: 'vote',
            message: `${analysis.decision} ${tokenInfo.symbol} (${analysis.tally}) - Score: ${analysis.score}`,
            tank_state: tankState.state,
            water_level: tankState.waterLevel,
            related_token: ca,
            vote_details: analysis.votes
        });

        // Update token with vote info
        await upsertToken({
            ca,
            council_score: analysis.score,
            vote_result: analysis.tally,
            chad_vote: analysis.votes?.chad?.vote,
            nancy_vote: analysis.votes?.nancy?.vote,
            papaclaw_vote: analysis.votes?.papaclaw?.vote,
            snappy_vote: analysis.votes?.snappy?.vote,
            coral_vote: analysis.votes?.coral?.vote,
            was_unanimous: analysis.unanimous
        });

        // Check for unanimous decision (highlight)
        if (analysis.unanimous) {
            tankState.unanimousDecisions++;
            tankState.waterLevel = adjustWaterLevel(tankState.waterLevel, 'unanimous');
            await addHighlight({
                highlight_type: 'unanimous_' + analysis.decision.toLowerCase(),
                title: `Unanimous ${analysis.decision} on $${tokenInfo.symbol}`,
                description: analysis.tankNarration,
                lobsters_involved: ['chad', 'nancy', 'papaclaw', 'snappy', 'coral'],
                tank_state: tankState.state,
                water_level_before: tankState.waterLevel
            });
        }

        // Execute trade if BUY
        if (analysis.decision === 'BUY' && analysis.score >= config.TRADING.MIN_SCORE_TO_BUY) {
            const modifier = getMoodModifier(tankState.state);
            const adjustedScore = analysis.score + (modifier.scoreThreshold || 0);

            if (adjustedScore >= config.TRADING.MIN_SCORE_TO_BUY) {
                const tradeAmount = tankState.balance * config.TRADING.MAX_TRADE_PERCENT * modifier.riskMultiplier;
                const finalAmount = Math.min(tradeAmount, tankState.balance * 0.8); // Never use more than 80%

                logToken({ action: 'BUY', symbol: tokenInfo.symbol, mc: tokenInfo.mc, sol: finalAmount });

                const buyReaction = getReaction('onBuy', tankState.state);
                logTankNarration(buyReaction);

                // Record trade (simulation or real)
                const trade = await recordTrade({
                    ca,
                    symbol: tokenInfo.symbol,
                    type: 'buy',
                    amount_sol: finalAmount,
                    price: tokenInfo.price,
                    mc_at_trade: tokenInfo.mc,
                    vote_breakdown: analysis.votes,
                    tank_state: tankState.state,
                    water_level: tankState.waterLevel,
                    deciding_lobster: analysis.swingVoter,
                    council_commentary: analysis.tankNarration,
                    was_chad_solo: tankState.state === 'RED_TIDE'
                });

                // Create position
                await createPosition({
                    ca,
                    symbol: tokenInfo.symbol,
                    entry_price: tokenInfo.price,
                    amount_sol: finalAmount,
                    status: 'open',
                    tank_state_at_entry: tankState.state
                });

                // Try real buy if wallet configured
                if (loadWallet()) {
                    await buyToken(ca, finalAmount, config.TRADING.SLIPPAGE);
                }

                tankState.totalTrades++;
            }
        } else {
            logToken({ action: 'SKIP', symbol: tokenInfo.symbol, mc: tokenInfo.mc, extra: `Score: ${analysis.score}` });
        }

        // Update system status
        tankState.state = calculateTankState(tankState.waterLevel).name;
        await syncTankStatus();

    } catch (e) {
        logError(`Process token error: ${e.message}`);
    }
}

// ═══════════════════════════════════════════════════════════════
// POSITION MONITOR
// ═══════════════════════════════════════════════════════════════
async function checkPositions() {
    try {
        const positions = await getOpenPositions();
        if (positions.length === 0) return;

        const solPrice = await getSolPrice();

        for (const pos of positions) {
            const currentInfo = await getTokenInfo(pos.ca);
            if (!currentInfo) continue;

            const pnlPercent = pos.entry_price > 0
                ? ((currentInfo.price - pos.entry_price) / pos.entry_price) * 100
                : 0;

            const modifier = getMoodModifier(tankState.state);
            const stopLoss = config.TRADING.BASE_STOP_LOSS;
            const takeProfit = config.TRADING.BASE_TAKE_PROFIT;

            let shouldSell = false;
            let sellReason = '';

            if (pnlPercent <= stopLoss) {
                shouldSell = true;
                sellReason = `Stop loss hit (${pnlPercent.toFixed(1)}%)`;
            } else if (pnlPercent >= takeProfit) {
                shouldSell = true;
                sellReason = `Take profit hit (${pnlPercent.toFixed(1)}%)`;
            }

            if (shouldSell) {
                const pnlSol = pos.amount_sol * (pnlPercent / 100);

                logToken({ action: 'SELL', symbol: pos.symbol, mc: currentInfo.mc, sol: pos.amount_sol + pnlSol, extra: sellReason });

                // Determine event type
                const isProfit = pnlPercent > 0;
                const isBig = Math.abs(pnlPercent) > 50;
                let event = isProfit ? (isBig ? 'bigWin' : 'profit') : (isBig ? 'bigLoss' : 'loss');

                const reaction = getReaction(isProfit ? (isBig ? 'onBigWin' : 'onProfit') : (isBig ? 'onBigLoss' : 'onLoss'), tankState.state);
                logTankNarration(reaction);

                // Update stats
                tankState.waterLevel = adjustWaterLevel(tankState.waterLevel, event);
                tankState.totalPnl += pnlSol;
                tankState.todayPnL += pnlPercent;
                tankState.balance += pnlSol;
                if (isProfit) tankState.wins++; else tankState.losses++;

                // Close position
                await closePosition(pos.id, pnlSol);

                // Record sell trade
                await recordTrade({
                    ca: pos.ca,
                    symbol: pos.symbol,
                    type: 'sell',
                    amount_sol: pos.amount_sol + pnlSol,
                    price: currentInfo.price,
                    mc_at_trade: currentInfo.mc,
                    pnl_percent: pnlPercent,
                    pnl_sol: pnlSol,
                    tank_state: tankState.state,
                    water_level: tankState.waterLevel,
                    council_commentary: reaction
                });

                // Big events become highlights
                if (isBig) {
                    await addHighlight({
                        highlight_type: isProfit ? 'big_win' : 'big_loss',
                        title: `${isProfit ? 'GOLDEN PLATE' : 'BURNT DISH'}: $${pos.symbol} ${pnlPercent > 0 ? '+' : ''}${pnlPercent.toFixed(1)}%`,
                        description: reaction,
                        tank_state: tankState.state,
                        water_level_before: tankState.waterLevel - (isProfit ? 15 : 20),
                        water_level_after: tankState.waterLevel
                    });
                }

                // Try real sell
                if (loadWallet()) {
                    await sellToken(pos.ca, 100, config.TRADING.SLIPPAGE);
                }
            }
        }
    } catch (e) {
        logError(`Position check error: ${e.message}`);
    }
}

// ═══════════════════════════════════════════════════════════════
// SYNC STATUS TO DB
// ═══════════════════════════════════════════════════════════════
async function syncTankStatus() {
    await updateSystemStatus({
        status: tankState.isRunning ? 'running' : 'stopped',
        water_level: tankState.waterLevel,
        tank_state: tankState.state,
        balance: tankState.balance,
        total_pnl: tankState.totalPnl,
        today_pnl: tankState.todayPnL,
        wins: tankState.wins,
        losses: tankState.losses,
        total_trades: tankState.totalTrades,
        escape_attempts: tankState.escapeAttempts,
        unanimous_decisions: tankState.unanimousDecisions,
        council_fights: tankState.councilFights,
        win_rate: tankState.totalTrades > 0 ? (tankState.wins / tankState.totalTrades) * 100 : 0
    });
}

// ═══════════════════════════════════════════════════════════════
// TOKEN QUEUE PROCESSOR
// ═══════════════════════════════════════════════════════════════
async function processQueue() {
    if (isProcessing || processingQueue.length === 0) return;
    isProcessing = true;

    while (processingQueue.length > 0) {
        const token = processingQueue.shift();
        await processToken(token);
        await sleep(2000); // Don't spam APIs
    }

    isProcessing = false;
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
async function main() {
    logHeader('🦞 THE LOBSTER TANK — Crustacean Democracy Trading Bot 🦞');

    logInfo('Initializing tank systems...');

    // Init lobsters in DB
    await initLobsters();

    // Load wallet (optional)
    loadWallet();

    // Get initial balance
    const realBalance = await getBalance();
    if (realBalance > 0) {
        tankState.balance = realBalance;
        logSuccess(`Wallet balance: ${realBalance.toFixed(4)} SOL`);
    } else {
        logInfo(`Simulation mode: ${tankState.balance} SOL`);
    }

    // Initial status
    tankState.state = calculateTankState(tankState.waterLevel).name;
    logTankStatus(tankState.state, tankState.waterLevel, tankState.totalPnl, tankState.balance);
    await syncTankStatus();

    // Connect PumpPortal
    connectPumpPortal({
        onToken: (data) => {
            processingQueue.push(data);
            processQueue();
        },
        onConnect: () => {
            subscribeNewTokens();
            logSuccess('Listening for new tokens...');
            logTankNarration('The tank hums to life. Five pairs of eyes scan the waters for opportunity.');
        },
        onDisconnect: () => {
            logWarning('Connection lost. The tank goes dark...');
        }
    });

    // Position checker interval
    setInterval(async () => {
        await checkPositions();
    }, config.TRADING.POSITION_CHECK_INTERVAL);

    // Status update interval
    setInterval(async () => {
        tankState.state = calculateTankState(tankState.waterLevel).name;
        logTankStatus(tankState.state, tankState.waterLevel, tankState.totalPnl, tankState.balance);
        await syncTankStatus();
    }, 60000);

    // Keep alive
    logSuccess('The Lobster Tank is LIVE. Tap the glass.');
    logTankNarration('Five lobsters. One tank. Zero financial literacy. Democracy begins.');
}

// Graceful shutdown
process.on('SIGINT', async () => {
    logWarning('Shutting down the tank...');
    tankState.isRunning = false;
    await syncTankStatus();
    process.exit(0);
});

main().catch(e => {
    logError(`Fatal: ${e.message}`);
    process.exit(1);
});
