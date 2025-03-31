
export type PaperTradingTransactionType = 'buy' | 'sell';

export interface PaperTradingTransaction {
  id: string;
  symbol: string;
  shares: number;
  type: PaperTradingTransactionType;
  date: string;
  pricePerShare: number;
}

export interface PaperTradingPosition {
  symbol: string;
  shares: number;
  averageCost: number;
  currentPrice: number;
  currentValue: number;
  totalReturn: number;
  totalReturnPercentage: number;
}

export interface PaperTradingPortfolio {
  cash: number;
  positions: PaperTradingPosition[];
  value: number;
}
