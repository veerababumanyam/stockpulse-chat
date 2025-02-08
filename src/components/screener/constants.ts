
import { ScreenerCategory } from "./types";

export const screenerCategories: ScreenerCategory[] = [
  {
    id: 'basics',
    label: 'Basic Metrics',
    description: 'Filter by basic stock metrics like price and market cap',
    icon: 'line-chart'
  },
  {
    id: 'fundamentals',
    label: 'Fundamental Analysis',
    description: 'Filter stocks based on fundamental metrics',
    icon: 'bar-chart'
  },
  {
    id: 'technicals',
    label: 'Technical Analysis',
    description: 'Filter based on technical indicators and analyst ratings',
    icon: 'trending-up'
  },
  {
    id: 'earnings',
    label: 'Earnings Calendar',
    description: 'Filter by recent and upcoming earnings dates',
    icon: 'dollar-sign'
  }
];

