import WebSocket from 'ws';
import { Keypair, Connection, VersionedTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { config } from '../config.js';

const connection = new Connection(config.HELIUS_RPC);
let wallet = null;
let ws = null;
let isConnected = false;

export function loadWallet() {
    try {
        if (!config.WALLET_PRIVATE_KEY) {
            console.log('[WALLET] No wallet configured (simulation mode)');
            return null;
        }
        const pk = config.WALLET_PRIVATE_KEY.trim();
        let secretKey;
        if (pk.startsWith('[')) {
            secretKey = new Uint8Array(JSON.parse(pk));
        } else {
            secretKey = new Uint8Array(Buffer.from(pk, 'base64'));
        }
        wallet = Keypair.fromSecretKey(secretKey);
        console.log('[WALLET] Loaded:', wallet.publicKey.toBase58());
        return wallet;
    } catch (e) {
        console.error('[WALLET] Error:', e.message);
        return null;
    }
}

export function getWallet() { return wallet; }

export async function getBalance() {
    if (!wallet) return 0;
    try {
        const balance = await connection.getBalance(wallet.publicKey);
        return balance / LAMPORTS_PER_SOL;
    } catch (e) {
        console.error('[BALANCE] Error:', e.message);
        return 0;
    }
}

export function connectPumpPortal(callbacks = {}) {
    const { onToken, onTrade, onConnect, onDisconnect } = callbacks;
    console.log('[PUMPPORTAL] Connecting...');
    ws = new WebSocket(config.PUMPPORTAL_WS);

    ws.on('open', () => {
        isConnected = true;
        console.log('[PUMPPORTAL] Connected!');
        if (onConnect) onConnect();
    });

    ws.on('message', async (data) => {
        try {
            const msg = JSON.parse(data.toString());
            if (msg.txType === 'create' && msg.mint && onToken) onToken(msg);
            if ((msg.txType === 'buy' || msg.txType === 'sell') && onTrade) onTrade(msg);
        } catch {}
    });

    ws.on('close', () => {
        isConnected = false;
        console.log('[PUMPPORTAL] Disconnected. Reconnecting in 5s...');
        if (onDisconnect) onDisconnect();
        setTimeout(() => connectPumpPortal(callbacks), 5000);
    });

    ws.on('error', (e) => console.error('[PUMPPORTAL] Error:', e.message));
    return ws;
}

export function subscribeNewTokens() {
    if (ws && isConnected) {
        ws.send(JSON.stringify({ method: 'subscribeNewToken' }));
        console.log('[PUMPPORTAL] Subscribed to new tokens');
    }
}

export function subscribeToken(tokenAddress) {
    if (ws && isConnected) {
        ws.send(JSON.stringify({ method: 'subscribeTokenTrade', keys: [tokenAddress] }));
    }
}

export function isWsConnected() { return isConnected; }

export function closeWebSocket() {
    if (ws) { isConnected = false; ws.close(); ws = null; }
}

export async function buyToken(ca, amountSol, slippage = 15) {
    if (!wallet) { console.error('[BUY] No wallet'); return null; }
    try {
        const response = await fetch(config.PUMPPORTAL_TRADE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                publicKey: wallet.publicKey.toBase58(),
                action: 'buy', mint: ca,
                amount: amountSol * LAMPORTS_PER_SOL,
                denominatedInSol: 'true', slippage,
                priorityFee: 0.0005, pool: 'pump'
            })
        });
        if (response.status !== 200) { console.error('[BUY] Error:', await response.text()); return null; }
        const data = await response.arrayBuffer();
        const tx = VersionedTransaction.deserialize(new Uint8Array(data));
        tx.sign([wallet]);
        const signature = await connection.sendTransaction(tx);
        console.log('[BUY] TX:', signature);
        return signature;
    } catch (e) { console.error('[BUY] Error:', e.message); return null; }
}

export async function sellToken(ca, percentOrAmount = 100, slippage = 15) {
    if (!wallet) { console.error('[SELL] No wallet'); return null; }
    try {
        const amount = percentOrAmount === 100 ? 'all' : `${percentOrAmount}%`;
        const response = await fetch(config.PUMPPORTAL_TRADE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                publicKey: wallet.publicKey.toBase58(),
                action: 'sell', mint: ca, amount,
                denominatedInSol: 'false', slippage,
                priorityFee: 0.0005, pool: 'pump'
            })
        });
        if (response.status !== 200) { console.error('[SELL] Error:', await response.text()); return null; }
        const data = await response.arrayBuffer();
        const tx = VersionedTransaction.deserialize(new Uint8Array(data));
        tx.sign([wallet]);
        const signature = await connection.sendTransaction(tx);
        console.log('[SELL] TX:', signature);
        return signature;
    } catch (e) { console.error('[SELL] Error:', e.message); return null; }
}
