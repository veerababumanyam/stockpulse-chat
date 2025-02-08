
import { FilterOption } from "./types";

export const defaultFilters: FilterOption[] = [
  // Base filters
  {
    id: "market",
    label: "Market",
    type: "select",
    options: [{ label: "US", value: "us" }],
    category: 'liquidity'
  },
  {
    id: "watchlist",
    label: "Watchlist",
    type: "select",
    options: [{ label: "My Watchlist", value: "my-watchlist" }],
    category: 'liquidity'
  },
  // Volatility & Price Movement
  {
    id: "atr",
    label: "ATR %",
    type: "range",
    category: 'volatility'
  },
  {
    id: "beta",
    label: "Beta",
    type: "range",
    category: 'volatility'
  },
  {
    id: "priceChange",
    label: "Price Change %",
    type: "range",
    category: 'volatility'
  },
  // Momentum & Growth
  {
    id: "revenueGrowth",
    label: "Revenue Growth %",
    type: "range",
    category: 'momentum'
  },
  {
    id: "eps",
    label: "EPS Growth %",
    type: "range",
    category: 'momentum'
  },
  {
    id: "peg",
    label: "PEG Ratio",
    type: "range",
    category: 'momentum'
  },
  {
    id: "roe",
    label: "ROE %",
    type: "range",
    category: 'momentum'
  },
  // Market Sentiment
  {
    id: "analystRating",
    label: "Analyst Rating",
    type: "select",
    category: 'sentiment',
    options: [
      { label: "Strong Buy", value: "strong_buy" },
      { label: "Buy", value: "buy" },
      { label: "Hold", value: "hold" },
      { label: "Sell", value: "sell" },
    ],
  },
  {
    id: "performance",
    label: "Performance",
    type: "select",
    category: 'sentiment',
    options: [
      { label: "Weekly", value: "weekly" },
      { label: "Monthly", value: "monthly" },
      { label: "Yearly", value: "yearly" },
    ],
  },
  // Liquidity & Stability
  {
    id: "marketCap",
    label: "Market Cap",
    type: "range",
    category: 'liquidity'
  },
  {
    id: "sector",
    label: "Sector",
    type: "select",
    category: 'liquidity',
    options: [
      { label: "Technology", value: "technology" },
      { label: "Healthcare", value: "healthcare" },
      { label: "Finance", value: "finance" },
    ],
  },
];
