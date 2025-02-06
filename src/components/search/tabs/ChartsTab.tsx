
import React from "react";
import { formatLargeNumber } from "@/utils/formatting";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  Legend,
  ComposedChart,
} from 'recharts';

interface ChartsTabProps {
  stockData: any;
  historicalData: any[];
}

export const ChartsTab = ({ stockData, historicalData }: ChartsTabProps) => {
  return (
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
  );
};
