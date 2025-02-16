
export interface WatchlistStock {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  sector: string;
  aiAnalysis?: {
    signal: string;
    targetPrice: number;
    target24Price: number;
    lastUpdated: string;
  };
  alerts: Alert[];
}

export interface Stock {
  symbol: string;
  companyName: string;
}

export interface Alert {
  id: string;
  symbol: string;
  target_price: number;
  triggered: boolean;
  created_at?: string;
  user_id?: string;
}
