
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimeSeriesForecasterAgent } from "@/agents/TimeSeriesForecasterAgent";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ChartData {
  date: string;
  price: number;
  prediction?: number;
}

export const PerformanceChart = ({ symbol }: { symbol: string }) => {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analysis = await TimeSeriesForecasterAgent.analyze(symbol);
        if (analysis.analysis?.forecast) {
          setData(analysis.analysis.forecast.map((point: any) => ({
            date: new Date(point.date).toLocaleDateString(),
            price: point.prediction,
            prediction: point.confidence > 0.7 ? point.prediction : undefined
          })));
        }
      } catch (error) {
        console.error('Error fetching performance data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch performance data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol, toast]);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Performance Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#8884d8" />
              <Line type="monotone" dataKey="prediction" stroke="#82ca9d" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
