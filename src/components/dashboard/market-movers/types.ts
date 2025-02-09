
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface MarketMoversProps {
  gainers: StockData[];
  losers: StockData[];
  isLoading: boolean;
}

export interface MarketMoverCardProps {
  title: string;
  stocks: StockData[];
  icon: any;
}

