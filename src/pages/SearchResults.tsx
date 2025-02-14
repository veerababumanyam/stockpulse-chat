
import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fetchStockData } from "@/utils/stockApi";
import { CompanyHeader } from "@/components/search/CompanyHeader";
import { OverviewTab } from "@/components/search/OverviewTab";
import { AIAnalysisTab } from "@/components/search/AIAnalysisTab";
import { ChartsTab } from "@/components/search/tabs/ChartsTab";
import { FinancialsTab } from "@/components/search/tabs/FinancialsTab";
import { ValuationTab } from "@/components/search/tabs/ValuationTab";
import { AnalysisTab } from "@/components/search/tabs/AnalysisTab";
import { NewsTab } from "@/components/search/tabs/NewsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { OrchestratorAgent } from "@/agents/OrchestratorAgent";
import { formatLargeNumber, getPriceChangeColor } from "@/utils/formatting";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Search } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";

const EmptySearchState = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      <Search className="h-12 w-12 text-muted-foreground/50" />
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Search for a Company</h2>
        <p className="text-muted-foreground max-w-md">
          Enter a company name or ticker symbol to view detailed financial analysis, charts, and AI-powered insights.
        </p>
      </div>
      <SearchBar />
    </div>
  );
};

const SearchResultsContent = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [stockData, setStockData] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');

    const fetchData = async () => {
      if (!query) {
        setError(null); // Clear error for empty search
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const savedKeys = localStorage.getItem('apiKeys');
        if (!savedKeys) {
          throw new Error("Please set your FMP API key in the API Keys page");
        }

        const { fmp } = JSON.parse(savedKeys);
        if (!fmp) {
          throw new Error("Please set your FMP API key in the API Keys page");
        }

        const data = await fetchStockData(query, fmp);
        if (!data) {
          throw new Error("No results found. Please try a different search term.");
        }
        
        setStockData(data);
          
        try {
          const analysis = await OrchestratorAgent.orchestrateAnalysis(data);
          setAiAnalysis(analysis);
          console.log('AI Analysis:', analysis);
        } catch (error) {
          console.error('AI Analysis error:', error);
          toast({
            title: "AI Analysis Error",
            description: error instanceof Error ? error.message : "Failed to generate AI analysis",
            variant: "destructive",
          });
        }

        const historicalResponse = await fetch(
          `https://financialmodelingprep.com/api/v3/historical-price-full/${data.quote.symbol}?apikey=${fmp}`
        );
        
        if (!historicalResponse.ok) {
          throw new Error("Failed to fetch historical data");
        }
        
        const historicalJson = await historicalResponse.json();
        if (historicalJson.historical) {
          setHistoricalData(historicalJson.historical.slice(0, 30).reverse());
        }
        
      } catch (error) {
        console.error("Search error:", error);
        setError(error instanceof Error ? error.message : "An unexpected error occurred");
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch stock data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [location.search, toast]);

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');

  if (!query) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto pt-20 p-4">
          <EmptySearchState />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto pt-20 p-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-8">
            <SearchBar />
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto pt-20 p-4">
          <Skeleton className="h-12 w-[250px] mb-6" />
          <Skeleton className="h-[200px] w-full mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px]" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-20 p-4">
        {stockData && (
          <>
            <CompanyHeader 
              profile={stockData.profile}
              quote={stockData.quote}
              getPriceChangeColor={getPriceChangeColor}
              formatLargeNumber={formatLargeNumber}
            />

            <Tabs defaultValue="ai-analysis" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-7">
                <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="valuation">Valuation</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
              </TabsList>

              <TabsContent value="ai-analysis">
                <AIAnalysisTab aiAnalysis={aiAnalysis} isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="overview">
                <OverviewTab stockData={stockData} formatLargeNumber={formatLargeNumber} />
              </TabsContent>

              <TabsContent value="charts">
                <ChartsTab stockData={stockData} historicalData={historicalData} />
              </TabsContent>

              <TabsContent value="financials">
                <FinancialsTab stockData={stockData} />
              </TabsContent>

              <TabsContent value="valuation">
                <ValuationTab stockData={stockData} />
              </TabsContent>

              <TabsContent value="analysis">
                <AnalysisTab stockData={stockData} />
              </TabsContent>

              <TabsContent value="news">
                <NewsTab />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
};

const SearchResults = () => {
  return (
    <ErrorBoundary>
      <SearchResultsContent />
    </ErrorBoundary>
  );
};

export default SearchResults;

