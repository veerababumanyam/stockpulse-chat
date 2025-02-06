import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { fetchStockData } from "@/utils/stockApi";
import { CompanyHeader } from "@/components/search/CompanyHeader";
import { OverviewTab } from "@/components/search/OverviewTab";
import { AIAnalysisTab } from "@/components/search/AIAnalysisTab";
import { formatLargeNumber, formatPercentage, getPriceChangeColor, getRecommendationColor } from "@/utils/formatting";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { OrchestratorAgent } from "@/agents/OrchestratorAgent";

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
                <TabsTrigger value="valuation">Valuation</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <OverviewTab stockData={stockData} formatLargeNumber={formatLargeNumber} />
              </TabsContent>

              <TabsContent value="charts">
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Price History</CardTitle>
                      <CardDescription>30-day price and volume</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={historicalData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(value) => new Date(value).toLocaleDateString()}
                            />
                            <YAxis 
                              yAxisId="left"
                              domain={['auto', 'auto']}
                            />
                            <YAxis 
                              yAxisId="right"
                              orientation="right"
                              domain={['auto', 'auto']}
                            />
                            <Tooltip
                              labelFormatter={(value) => new Date(value).toLocaleDateString()}
                              formatter={(value: any, name: string) => [
                                name === 'Price' ? `$${value.toFixed(2)}` : formatLargeNumber(value),
                                name
                              ]}
                            />
                            <Legend />
                            <Area
                              yAxisId="right"
                              type="monotone"
                              dataKey="volume"
                              fill="#8884d8"
                              opacity={0.3}
                              name="Volume"
                            />
                            <Line 
                              yAxisId="left"
                              type="monotone" 
                              dataKey="close" 
                              stroke="#8B5CF6"
                              name="Price"
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {stockData.technical && stockData.technical.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Technical Indicators</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stockData.technical}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis domain={[0, 100]} />
                              <Tooltip />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="rsi" 
                                stroke="#8B5CF6" 
                                name="RSI"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="financials">
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Metric</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Industry Average</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Return on Equity (ROE)</TableCell>
                            <TableCell>{formatPercentage(stockData.metrics.roeTTM || 0)}</TableCell>
                            <TableCell>15%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Return on Assets (ROA)</TableCell>
                            <TableCell>{formatPercentage(stockData.metrics.roaTTM || 0)}</TableCell>
                            <TableCell>5%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Profit Margin</TableCell>
                            <TableCell>{formatPercentage(stockData.metrics.netProfitMarginTTM || 0)}</TableCell>
                            <TableCell>10%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Operating Margin</TableCell>
                            <TableCell>{formatPercentage(stockData.metrics.operatingProfitMarginTTM || 0)}</TableCell>
                            <TableCell>15%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Debt to Equity</TableCell>
                            <TableCell>{(stockData.metrics.debtToEquityTTM || 0).toFixed(2)}</TableCell>
                            <TableCell>1.5</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {stockData.earnings && stockData.earnings.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Earnings History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stockData.earnings.slice(0, 8).reverse()}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar 
                                dataKey="actualEarningResult" 
                                fill="#8B5CF6" 
                                name="Actual EPS"
                              />
                              <Bar 
                                dataKey="estimatedEarning" 
                                fill="#D946EF" 
                                name="Estimated EPS"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="valuation">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Valuation Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>P/E Ratio</TableCell>
                            <TableCell>{stockData.quote.pe?.toFixed(2) || 'N/A'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Price to Book</TableCell>
                            <TableCell>{stockData.quote.priceToBook?.toFixed(2) || 'N/A'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Price to Sales</TableCell>
                            <TableCell>{stockData.ratios?.priceToSalesRatioTTM?.toFixed(2) || 'N/A'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>EV/EBITDA</TableCell>
                            <TableCell>{stockData.ratios?.enterpriseValueMultipleTTM?.toFixed(2) || 'N/A'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>PEG Ratio</TableCell>
                            <TableCell>{stockData.ratios?.pegRatioTTM?.toFixed(2) || 'N/A'}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Growth Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={[{
                            'Revenue Growth': stockData.metrics.revenueGrowthTTM || 0,
                            'Earnings Growth': stockData.metrics.netIncomeGrowthTTM || 0,
                            'Asset Growth': stockData.metrics.totalAssetsGrowthTTM || 0,
                            'Dividend Growth': stockData.metrics.dividendGrowthTTM || 0,
                            'FCF Growth': stockData.metrics.freeCashFlowGrowthTTM || 0
                          }]}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="name" />
                            <PolarRadiusAxis />
                            <Radar
                              name="Growth Metrics"
                              dataKey="value"
                              stroke="#8B5CF6"
                              fill="#8B5CF6"
                              fillOpacity={0.6}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analysis">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stockData.upgrades && stockData.upgrades.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Analyst Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px]">
                          {stockData.upgrades.map((upgrade: any, index: number) => (
                            <div key={index} className="mb-4 p-4 border rounded">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-medium">{upgrade.gradingCompany}</p>
                                  <p className="text-sm text-muted-foreground">{upgrade.publishedDate}</p>
                                </div>
                                <Badge className={getRecommendationColor(upgrade.newGrade)}>
                                  {upgrade.newGrade}
                                </Badge>
                              </div>
                              <p className="text-sm">
                                Previous: {upgrade.previousGrade} → New: {upgrade.newGrade}
                              </p>
                            </div>
                          ))}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}

                  {stockData.insider && stockData.insider.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Insider Trading</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px]">
                          {stockData.insider.slice(0, 10).map((trade: any, index: number) => (
                            <div key={index} className="mb-4 p-4 border rounded">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-medium">{trade.reportingName}</p>
                                  <p className="text-sm text-muted-foreground">{trade.transactionDate}</p>
                                </div>
                                <Badge variant={trade.transactionType === 'Buy' ? 'default' : 'destructive'}>
                                  {trade.transactionType}
                                </Badge>
                              </div>
                              <p className="text-sm">
                                Shares: {formatLargeNumber(trade.transactionShares)} @ ${trade.transactionPrice}
                              </p>
                            </div>
                          ))}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="news">
                <Card>
                  <CardHeader>
                    <CardTitle>Latest News</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* News content would go here - requires additional API endpoint */}
                      <p className="text-muted-foreground">News feed integration coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai-analysis">
                <AIAnalysisTab aiAnalysis={aiAnalysis} isLoading={isLoading} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
