
import { ScreenerCategory } from "./types";

export const screenerCategories: ScreenerCategory[] = [
  {
    id: 'volatility',
    label: 'Volatility & Price Movement',
    description: 'Filter stocks based on volatility metrics and price action',
    icon: 'trending-up'
  },
  {
    id: 'momentum',
    label: 'Momentum & Growth',
    description: 'Find stocks with strong growth and momentum indicators',
    icon: 'line-chart'
  },
  {
    id: 'sentiment',
    label: 'Market Sentiment',
    description: 'Analyze market sentiment and analyst opinions',
    icon: 'bar-chart'
  },
  {
    id: 'liquidity',
    label: 'Liquidity & Stability',
    description: 'Filter by market cap and sector stability',
    icon: 'dollar-sign'
  }
];
