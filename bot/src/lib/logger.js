import chalk from 'chalk';
import fs from 'fs';

if (!fs.existsSync('./logs')) fs.mkdirSync('./logs');
const logFileName = `./logs/${new Date().toISOString().split('T')[0]}.log`;
const logStream = fs.createWriteStream(logFileName, { flags: 'a' });

function saveToFile(message) {
    const clean = message.replace(/\x1b\[[0-9;]*m/g, '');
    logStream.write(clean + '\n');
}

function padRight(str, len) {
    str = String(str);
    return str.length >= len ? str.slice(0, len) : str + ' '.repeat(len - str.length);
}

function padLeft(str, len) {
    str = String(str);
    return str.length >= len ? str.slice(0, len) : ' '.repeat(len - str.length) + str;
}

function formatMC(value) {
    if (!value) return '0';
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
    return value.toFixed(2);
}

function formatPercent(value) {
    if (value === undefined || value === null) return '+0%';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(0)}%`;
}

function fmtSOL(value) { return (value || 0).toFixed(2); }
function timestamp() { return new Date().toLocaleTimeString('en-US', { hour12: false }); }

// Lobster emoji map
const LOBSTER_EMOJI = { chad: '💪', nancy: '📊', papaclaw: '👴', snappy: '⚡', coral: '🌺' };

export function logVote(lobsterName, vote, reason) {
    const emoji = LOBSTER_EMOJI[lobsterName] || '🦞';
    const voteColor = vote === 'BUY' ? chalk.bgGreen.black(` BUY  `) : vote === 'ABSTAIN' ? chalk.bgGray.white(` ZZZ  `) : chalk.bgRed.white(` SKIP `);
    const line = [
        chalk.gray(timestamp()),
        chalk.cyan('[VOTE]'),
        emoji,
        chalk.white(padRight(lobsterName.toUpperCase(), 10)),
        voteColor,
        chalk.gray('|'),
        chalk.white(reason)
    ].join(' ');
    console.log(line);
    saveToFile(line);
}

export function logCouncilDecision(tally, decision, swingVoter) {
    const badge = decision === 'BUY' ? chalk.bgGreen.black(` APPROVED `) : chalk.bgRed.white(` DENIED `);
    const line = [
        '',
        chalk.cyan('  ╔══════════════════════════════════════════╗'),
        chalk.cyan('  ║') + `  COUNCIL DECISION: ${badge} ${chalk.white(tally)}` + chalk.cyan('  ║'),
        swingVoter ? chalk.cyan('  ║') + `  Swing Vote: ${chalk.yellow(swingVoter)}` + ' '.repeat(Math.max(0, 26 - swingVoter.length)) + chalk.cyan('║') : '',
        chalk.cyan('  ╚══════════════════════════════════════════╝'),
        ''
    ].filter(Boolean).join('\n');
    console.log(line);
    saveToFile(line);
}

export function logTankNarration(narration) {
    const line = [
        chalk.gray(timestamp()),
        chalk.blue('[TANK]'),
        chalk.blueBright('🐠'),
        chalk.italic.blueBright(narration)
    ].join(' ');
    console.log(line);
    saveToFile(line);
}

export function logToken(data) {
    const { action, symbol, name, mc, mcChange, sol, vol5m, extra } = data;
    let badge;
    switch (action) {
        case 'BUY': badge = chalk.bgGreen.black(` BUY   `); break;
        case 'SELL': badge = chalk.bgRed.white(` SELL  `); break;
        case 'SKIP': badge = chalk.bgYellow.black(` SKIP  `); break;
        default: badge = chalk.bgBlue.white(` INFO  `);
    }
    const symColor = action === 'BUY' ? chalk.green : action === 'SELL' ? chalk.red : action === 'SKIP' ? chalk.yellow : chalk.white;
    const mcChgColor = (mcChange || 0) >= 0 ? chalk.green : chalk.red;
    const line = [
        chalk.gray(timestamp()),
        chalk.gray('[INFO]'),
        chalk.gray('[') + badge + chalk.gray(']'),
        symColor(padRight(symbol || name || '???', 14)),
        chalk.magenta('MC:'), chalk.white(padLeft(formatMC(mc), 9)),
        mcChgColor(padLeft(formatPercent(mcChange), 5)),
        sol !== undefined ? chalk.gray('|') + ' ' + chalk.cyan('SOL:') + ' ' + chalk.white(padLeft(fmtSOL(sol), 6)) : '',
        extra ? chalk.gray('| ' + extra) : ''
    ].filter(Boolean).join(' ');
    console.log(line);
    saveToFile(line);
}

export function logBuy(symbol, mc, sol, extra = '') {
    const line = [chalk.gray(timestamp()), chalk.gray('[INFO]'), chalk.bgGreen.black(' BUY   '), chalk.green(padRight(symbol, 14)), chalk.magenta('MC:'), chalk.white(formatMC(mc)), chalk.gray('|'), chalk.cyan('SOL:'), chalk.white(fmtSOL(sol)), extra ? chalk.gray('| ' + extra) : ''].join(' ');
    console.log(line); saveToFile(line);
}

export function logSell(symbol, mc, sol, pnl, extra = '') {
    const pnlColor = pnl >= 0 ? chalk.green : chalk.red;
    const line = [chalk.gray(timestamp()), chalk.gray('[INFO]'), chalk.bgRed.white(' SELL  '), chalk.red(padRight(symbol, 14)), chalk.magenta('MC:'), chalk.white(formatMC(mc)), chalk.gray('|'), chalk.cyan('PnL:'), pnlColor(formatPercent(pnl)), chalk.gray('|'), chalk.cyan('SOL:'), chalk.white(fmtSOL(sol)), extra ? chalk.gray('| ' + extra) : ''].join(' ');
    console.log(line); saveToFile(line);
}

export function logError(message) {
    const line = [chalk.gray(timestamp()), chalk.red('[ERROR]'), chalk.bgRed.white(' ERR   '), chalk.red(message)].join(' ');
    console.log(line); saveToFile(line);
}

export function logSuccess(message) {
    const line = [chalk.gray(timestamp()), chalk.green('[INFO]'), chalk.bgGreen.black('  OK   '), chalk.green(message)].join(' ');
    console.log(line); saveToFile(line);
}

export function logInfo(message) {
    const line = [chalk.gray(timestamp()), chalk.gray('[INFO]'), chalk.bgGray.white(' INFO  '), chalk.white(message)].join(' ');
    console.log(line); saveToFile(line);
}

export function logWarning(message) {
    const line = [chalk.gray(timestamp()), chalk.yellow('[WARN]'), chalk.bgYellow.black(' WARN  '), chalk.yellow(message)].join(' ');
    console.log(line); saveToFile(line);
}

export function logHeader(title) {
    console.log('');
    console.log(chalk.cyan('═'.repeat(70)));
    console.log(chalk.cyan('  ' + title));
    console.log(chalk.cyan('═'.repeat(70)));
    console.log('');
    saveToFile(`\n${'═'.repeat(70)}\n  ${title}\n${'═'.repeat(70)}\n`);
}

export function logTankStatus(state, waterLevel, pnl, balance) {
    const stateColors = {
        REEF_PARADISE: chalk.bgCyan.black,
        STEADY_CURRENTS: chalk.bgBlue.white,
        CHOPPY_WATERS: chalk.bgYellow.black,
        RED_TIDE: chalk.bgRed.white,
        TANK_BREACH: chalk.bgMagenta.white
    };
    const colorFn = stateColors[state] || chalk.bgGray.white;
    const pnlColor = pnl >= 0 ? chalk.green : chalk.red;
    console.log('');
    console.log(chalk.cyan('╔════════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║') + chalk.white('                     🦞 THE LOBSTER TANK 🦞                        ') + chalk.cyan('║'));
    console.log(chalk.cyan('╠════════════════════════════════════════════════════════════════════╣'));
    console.log(chalk.cyan('║') + `  State: ${colorFn(` ${state} `)}`.padEnd(78) + chalk.cyan('║'));
    console.log(chalk.cyan('║') + `  Water Level: ${chalk.blue('█'.repeat(Math.round(waterLevel / 5)))}${chalk.gray('░'.repeat(20 - Math.round(waterLevel / 5)))} ${chalk.white(waterLevel + '%')}`.padEnd(82) + chalk.cyan('║'));
    console.log(chalk.cyan('║') + `  Balance: ${chalk.white(fmtSOL(balance) + ' SOL')}`.padEnd(69) + chalk.cyan('║'));
    console.log(chalk.cyan('║') + `  PnL:     ${pnlColor((pnl >= 0 ? '+' : '') + fmtSOL(pnl) + ' SOL')}`.padEnd(78) + chalk.cyan('║'));
    console.log(chalk.cyan('╚════════════════════════════════════════════════════════════════════╝'));
    console.log('');
}
