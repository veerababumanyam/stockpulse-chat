
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { FilterOptionComponent } from "@/components/screener/FilterOption";
import { PineFormula } from "@/components/screener/PineFormula";
import { Plus, TrendingUp, LineChart, BarChart3, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterOption, ADRCalculation, ScreenerCategory } from "@/components/screener/types";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const screenerCategories: ScreenerCategory[] = [
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

const defaultFilters: FilterOption[] = [
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

const Screener = () => {
  const [filters, setFilters] = useState<FilterOption[]>(defaultFilters);
  const { toast } = useToast();

  const handleFilterChange = (id: string, value: any) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.id === id ? { ...filter, values: value } : filter
      )
    );
  };

  const calculateADR = (values: ADRCalculation) => {
    const { adrLen, high, low, close } = values;
    const adr = (high - low) / adrLen;
    const adrPercentage = (adr / close) * 100;

    toast({
      title: "ADR Calculation Results",
      description: `ADR: ${adr.toFixed(2)}, ADR Percentage: ${adrPercentage.toFixed(2)}%`,
    });
  };

  const renderFiltersByCategory = (category: string) => {
    return filters
      .filter(filter => filter.category === category)
      .map((filter) => (
        <FilterOptionComponent
          key={filter.id}
          option={filter}
          onSelect={handleFilterChange}
        />
      ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-20 p-4">
        <h1 className="text-4xl font-bold mb-6">Stock Screener</h1>
        <div className="space-y-8">
          {screenerCategories.map((category) => (
            <div key={category.id} className="space-y-4">
              <div className="flex items-center gap-2">
                {category.id === 'volatility' && <TrendingUp className="h-5 w-5" />}
                {category.id === 'momentum' && <LineChart className="h-5 w-5" />}
                {category.id === 'sentiment' && <BarChart3 className="h-5 w-5" />}
                {category.id === 'liquidity' && <DollarSign className="h-5 w-5" />}
                <h2 className="text-2xl font-semibold">{category.label}</h2>
              </div>
              <p className="text-muted-foreground">{category.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {renderFiltersByCategory(category.id)}
              </div>
              <Separator className="my-6" />
            </div>
          ))}
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="bg-background/50 backdrop-blur-sm border-border/50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Filter
            </Button>
          </div>
          
          <div className="mt-8">
            <PineFormula onCalculate={calculateADR} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Screener;
