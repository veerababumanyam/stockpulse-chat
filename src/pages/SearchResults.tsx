
import { Navigation } from "@/components/Navigation";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { fetchStockData } from "@/utils/stockApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SearchResults = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [stockData, setStockData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');

    const fetchData = async () => {
      if (!query) return;

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

    fetchData();
  }, [location.search, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-20 p-4">
        <h1 className="text-4xl font-bold mb-6">Search Results</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : stockData ? (
          <Card>
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
        ) : (
          <p>No results found</p>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
