
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { FilterOptionComponent } from "@/components/screener/FilterOption";
import { PineFormula } from "@/components/screener/PineFormula";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterOption, ADRCalculation } from "@/components/screener/types";
import { useToast } from "@/hooks/use-toast";

const defaultFilters: FilterOption[] = [
  {
    id: "market",
    label: "Market",
    type: "select",
    options: [{ label: "US", value: "us" }],
  },
  {
    id: "watchlist",
    label: "Watchlist",
    type: "select",
    options: [{ label: "My Watchlist", value: "my-watchlist" }],
  },
  {
    id: "index",
    label: "Index",
    type: "select",
    options: [
      { label: "S&P 500", value: "sp500" },
      { label: "NASDAQ", value: "nasdaq" },
    ],
  },
  {
    id: "price",
    label: "Price",
    type: "range",
  },
  {
    id: "change",
    label: "Change %",
    type: "range",
  },
  {
    id: "marketCap",
    label: "Market cap",
    type: "range",
  },
  {
    id: "pe",
    label: "P/E",
    type: "range",
  },
  {
    id: "eps",
    label: "EPS dil growth",
    type: "range",
  },
  {
    id: "dividend",
    label: "Div yield %",
    type: "range",
  },
  {
    id: "sector",
    label: "Sector",
    type: "select",
    options: [
      { label: "Technology", value: "technology" },
      { label: "Healthcare", value: "healthcare" },
      { label: "Finance", value: "finance" },
    ],
  },
  {
    id: "analystRating",
    label: "Analyst Rating",
    type: "select",
    options: [
      { label: "Strong Buy", value: "strong_buy" },
      { label: "Buy", value: "buy" },
      { label: "Hold", value: "hold" },
      { label: "Sell", value: "sell" },
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
    // This is a simplified calculation since we don't have historical data
    const adr = (high - low) / adrLen;
    const adrPercentage = (adr / close) * 100;

    toast({
      title: "ADR Calculation Results",
      description: `ADR: ${adr.toFixed(2)}, ADR Percentage: ${adrPercentage.toFixed(2)}%`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-20 p-4">
        <h1 className="text-4xl font-bold mb-6">Stock Screener</h1>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {filters.map((filter) => (
              <FilterOptionComponent
                key={filter.id}
                option={filter}
                onSelect={handleFilterChange}
              />
            ))}
            <Button
              variant="outline"
              className="w-full h-10 bg-background/50 backdrop-blur-sm border-border/50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Filter
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
