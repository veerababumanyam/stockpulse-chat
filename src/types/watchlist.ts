
export interface Alert {
  id: string;
  stockSymbol: string;
  price: number;
  type: 'above' | 'below';
  createdAt: string;
  isTriggered?: boolean;
  triggeredAt?: string;
}

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
