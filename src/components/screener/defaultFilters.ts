
import { FilterOption } from "./types";

export const defaultFilters: FilterOption[] = [
  // Basic Filters
  {
    id: "market",
    label: "Market",
    type: "select",
    options: [{ label: "US", value: "us" }],
    category: 'basics'
  },
  {
    id: "index",
    label: "Index",
    type: "select",
    options: [
      { label: "S&P 500", value: "sp500" },
      { label: "NASDAQ", value: "nasdaq" },
      { label: "DOW", value: "dow" }
    ],
    category: 'basics'
  },
  {
    id: "price",
    label: "Price",
    type: "range",
    category: 'basics'
  },
  {
    id: "change",
    label: "Change %",
    type: "range",
    category: 'basics'
  },
  {
    id: "marketCap",
    label: "Market Cap",
    type: "range",
    category: 'basics'
  },
  // Fundamentals
  {
    id: "pe",
    label: "P/E",
    type: "range",
    category: 'fundamentals'
  },
  {
    id: "epsDilGrowth",
    label: "EPS dil growth",
    type: "range",
    category: 'fundamentals'
  },
  {
    id: "divYield",
    label: "Div yield %",
    type: "range",
    category: 'fundamentals'
  },
  {
    id: "sector",
    label: "Sector",
    type: "select",
    category: 'fundamentals',
    options: [
      { label: "Technology", value: "technology" },
      { label: "Healthcare", value: "healthcare" },
      { label: "Finance", value: "finance" },
      { label: "Consumer", value: "consumer" },
      { label: "Industrial", value: "industrial" }
    ],
  },
  {
    id: "revenueGrowth",
    label: "Revenue Growth %",
    type: "range",
    category: 'fundamentals'
  },
  {
    id: "peg",
    label: "PEG",
    type: "range",
    category: 'fundamentals'
  },
  {
    id: "roe",
    label: "ROE %",
    type: "range",
    category: 'fundamentals'
  },
  {
    id: "beta",
    label: "Beta",
    type: "range",
    category: 'fundamentals'
  },
  // Technical Indicators
  {
    id: "analystRating",
    label: "Analyst Rating",
    type: "select",
    category: 'technicals',
    options: [
      { label: "Strong Buy", value: "strong_buy" },
      { label: "Buy", value: "buy" },
      { label: "Hold", value: "hold" },
      { label: "Sell", value: "sell" },
    ],
  },
  {
    id: "performance",
    label: "Perf %",
    type: "range",
    category: 'technicals'
  },
  // Earnings
  {
    id: "recentEarnings",
    label: "Recent earnings date",
    type: "date",
    category: 'earnings'
  },
  {
    id: "upcomingEarnings",
    label: "Upcoming earnings date",
    type: "date",
    category: 'earnings'
  }
];
