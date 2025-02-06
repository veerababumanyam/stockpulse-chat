
import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
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

const SearchResults = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [stockData, setStockData] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

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
          
          try {
            const analysis = await OrchestratorAgent.orchestrateAnalysis(data);
            setAiAnalysis(analysis);
            console.log('AI Analysis:', analysis);
          } catch (error) {
            console.error('AI Analysis error:', error);
            toast({
              title: "AI Analysis Error",
              description: "Failed to generate AI analysis. Please try again.",
              variant: "destructive",
            });
          }

          const historicalResponse = await fetch(
            `https://financialmodelingprep.com/api/v3/historical-price-full/${data.quote.symbol}?apikey=${fmp}`
          );
          const historicalJson = await historicalResponse.json();
          if (historicalJson.historical) {
            setHistoricalData(historicalJson.historical.slice(0, 30).reverse());
          }
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

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-7">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="ai-analysis">Sentiment</TabsTrigger>
                <TabsTrigger value="valuation">Valuation</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <OverviewTab stockData={stockData} formatLargeNumber={formatLargeNumber} />
              </TabsContent>

              <TabsContent value="charts">
                <ChartsTab stockData={stockData} historicalData={historicalData} />
              </TabsContent>

              <TabsContent value="financials">
                <FinancialsTab stockData={stockData} />
              </TabsContent>

              <TabsContent value="ai-analysis">
                <AIAnalysisTab aiAnalysis={aiAnalysis} isLoading={isLoading} />
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

export default SearchResults;
