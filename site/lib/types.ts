export interface SystemStatus {
    id: number;
    status: string;
    water_level: number;
    tank_state: string;
    balance: number;
    total_pnl: number;
    today_pnl: number;
    wins: number;
    losses: number;
    total_trades: number;
    win_rate: number;
    escape_attempts: number;
    unanimous_decisions: number;
    council_fights: number;
    updated_at: string;
}

export interface Lobster {
    id: string;
    name: string;
    emoji: string;
    current_mood: string;
    total_votes: number;
    correct_votes: number;
    wrong_votes: number;
    win_rate: number;
    current_streak: number;
    best_call: string | null;
    worst_call: string | null;
    times_overruled: number;
    escape_attempts: number;
}

export interface Trade {
    id: number;
    ca: string;
    symbol: string;
    type: string;
    amount_sol: number;
    price: number;
    mc_at_trade: number;
    pnl_percent: number | null;
    pnl_sol: number | null;
    vote_breakdown: Record<string, { vote: string; reason: string }> | null;
    tank_state: string;
    water_level: number;
    deciding_lobster: string | null;
    council_commentary: string | null;
    was_chad_solo: boolean;
    created_at: string;
}

export interface CouncilLog {
    id: number;
    event_type: string;
    message: string;
    tank_state: string;
    water_level: number;
    related_token: string | null;
    vote_details: Record<string, { vote: string; reason: string }> | null;
    created_at: string;
}

export interface TankHighlight {
    id: number;
    highlight_type: string;
    title: string;
    description: string | null;
    tank_state: string;
    water_level_before: number | null;
    water_level_after: number | null;
    created_at: string;
}
