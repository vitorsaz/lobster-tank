import 'dotenv/config';

export const config = {
    // PumpPortal
    PUMPPORTAL_WS: 'wss://pumpportal.fun/api/data',
    PUMPPORTAL_TRADE: 'https://pumpportal.fun/api/trade-local',

    // Birdeye
    BIRDEYE_API_KEY: process.env.BIRDEYE_API_KEY,
    BIRDEYE_META: 'https://public-api.birdeye.so/defi/v3/token/meta-data/multiple',
    BIRDEYE_MARKET: 'https://public-api.birdeye.so/defi/v3/token/market-data/multiple',
    BIRDEYE_OVERVIEW: 'https://public-api.birdeye.so/defi/token_overview',
    BIRDEYE_PRICE: 'https://public-api.birdeye.so/defi/price',

    // Helius
    HELIUS_API_KEY: process.env.HELIUS_API_KEY,
    HELIUS_RPC: `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,
    HELIUS_API: 'https://api.helius.xyz/v0',

    // Claude
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,

    // Supabase
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,

    // Wallet
    WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY,

    // Server
    PORT: parseInt(process.env.PORT) || 3001,

    // Tank Trading Config
    TRADING: {
        STARTING_BALANCE: 0.5,
        MAX_TRADE_PERCENT: 0.5,
        BASE_STOP_LOSS: -20,
        BASE_TAKE_PROFIT: 40,
        MIN_SCORE_TO_BUY: 65,
        POSITION_CHECK_INTERVAL: 30000,
        SLIPPAGE: 15,
        VOTE_THRESHOLD: 3,
        UNANIMOUS_BONUS: 15
    }
};

// Validation
const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'BIRDEYE_API_KEY', 'HELIUS_API_KEY'];
const missing = required.filter(k => !config[k] && !process.env[k]);
if (missing.length > 0) {
    console.error('\x1b[31m[CONFIG] Missing:', missing.join(', '), '\x1b[0m');
    process.exit(1);
}
