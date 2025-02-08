
export type FilterValue = {
  min?: number;
  max?: number;
  value?: string | number;
};

export type FilterOption = {
  id: string;
  label: string;
  type: 'range' | 'select' | 'date' | 'pine';
  options?: { label: string; value: string }[];
  values?: FilterValue;
  category?: 'volatility' | 'momentum' | 'sentiment' | 'liquidity';
};

export type ADRCalculation = {
  adrLen: number;
  close: number;
  high: number;
  low: number;
};

export type ScreenerCategory = {
  id: string;
  label: string;
  description: string;
  icon: string;
};

export type ScreenerResult = {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  sector: string;
  marketCap: number;
  beta: number;
  volume: number;
  atr?: number;
  revenueGrowth?: number;
  eps?: number;
  peg?: number;
  roe?: number;
};

