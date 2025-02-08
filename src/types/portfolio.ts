
export type TransactionType = 'buy' | 'sell';

export interface Transaction {
  id: string;
  symbol: string;
  shares: number;
  type: TransactionType;
  date: string;
  pricePerShare: number;
  fees: number;
}

export interface PortfolioPosition {
  symbol: string;
  shares: number;
  averageCost: number;
  currentPrice: number;
  currentValue: number;
  totalReturn: number;
  totalReturnPercentage: number;
}

export interface PortfolioMetrics {
  totalValue: number;
  totalCost: number;
  totalReturn: number;
  totalReturnPercentage: number;
  positions: PortfolioPosition[];
}
