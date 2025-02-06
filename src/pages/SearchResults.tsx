
import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
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
  Cell
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

const SearchResults = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [stockData, setStockData] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
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
          // Fetch historical data
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

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toFixed(2);
  };

  const pieData = stockData ? [
    { name: 'Institutional', value: stockData.profile.institutionalOwnership || 0 },
    { name: 'Retail', value: 1 - (stockData.profile.institutionalOwnership || 0) }
  ] : [];

  const COLORS = ['#8B5CF6', '#D946EF'];

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
            <div className="flex flex-col md:flex-row justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold">{stockData.profile.companyName}</h1>
                <p className="text-xl text-muted-foreground">{stockData.quote.symbol}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <p className="text-3xl font-bold">${stockData.quote.price.toFixed(2)}</p>
                <p className={`text-lg ${getPriceChangeColor(stockData.quote.change)}`}>
                  {stockData.quote.change >= 0 ? '+' : ''}{stockData.quote.change.toFixed(2)}%
                </p>
              </div>
            </div>

            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {stockData.profile.description}
                      </p>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>Market Cap</TableCell>
                            <TableCell>{formatLargeNumber(stockData.quote.marketCap)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Volume</TableCell>
                            <TableCell>{formatLargeNumber(stockData.quote.volume)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>P/E Ratio</TableCell>
                            <TableCell>{stockData.quote.pe?.toFixed(2) || 'N/A'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>52W High</TableCell>
                            <TableCell>${stockData.quote.yearHigh?.toFixed(2)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>52W Low</TableCell>
                            <TableCell>${stockData.quote.yearLow?.toFixed(2)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Ownership Structure</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="charts">
                <Card>
                  <CardHeader>
                    <CardTitle>Price History</CardTitle>
                    <CardDescription>30-day price movement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicalData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(value) => new Date(value).toLocaleDateString()}
                          />
                          <YAxis domain={['auto', 'auto']} />
                          <Tooltip
                            labelFormatter={(value) => new Date(value).toLocaleDateString()}
                            formatter={(value: number) => ['$' + value.toFixed(2), 'Price']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="close" 
                            stroke="#8B5CF6" 
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financials">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Financial Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Metric</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Price to Book</TableCell>
                          <TableCell>{stockData.quote.priceToBook?.toFixed(2) || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Price to Sales</TableCell>
                          <TableCell>{stockData.quote.priceToSales?.toFixed(2) || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>EPS</TableCell>
                          <TableCell>${stockData.quote.eps?.toFixed(2) || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Dividend Yield</TableCell>
                          <TableCell>
                            {stockData.quote.dividendYield 
                              ? `${(stockData.quote.dividendYield * 100).toFixed(2)}%` 
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis">
                <Card>
                  <CardHeader>
                    <CardTitle>Trading Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Volume Analysis</h3>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={historicalData.slice(-10)}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="date" 
                                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                              />
                              <YAxis />
                              <Tooltip
                                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                                formatter={(value: number) => [formatLargeNumber(value), 'Volume']}
                              />
                              <Bar dataKey="volume" fill="#8B5CF6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
