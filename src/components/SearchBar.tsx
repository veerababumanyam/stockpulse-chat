
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchStockData } from "@/utils/stockApi";

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stockData, setStockData] = useState<any>(null);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        toast({
          title: "API Key Missing",
          description: "Please set your FMP API key in the API Keys page",
          variant: "destructive",
        });
        return;
      }

      const { fmp } = JSON.parse(savedKeys);
      if (!fmp) {
        toast({
          title: "FMP API Key Missing",
          description: "Please set your FMP API key in the API Keys page",
          variant: "destructive",
        });
        return;
      }

      const data = await fetchStockData(query, fmp);
      
      if (data) {
        setStockData(data);
      } else {
        toast({
          title: "No results found",
          description: "Try searching with a different term",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch stock data. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search companies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 w-[300px]"
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </form>

      {stockData && (
        <Card className="absolute top-full mt-2 w-full z-50">
          <CardHeader>
            <CardTitle>{stockData.profile.companyName}</CardTitle>
            <CardDescription>{stockData.quote.symbol}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-lg font-semibold">${stockData.quote.price}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Change</p>
                <p className={`text-lg font-semibold ${stockData.quote.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stockData.quote.change}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

