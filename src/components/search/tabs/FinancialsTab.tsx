
import React from "react";
import { formatPercentage, formatLargeNumber } from "@/utils/formatting";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface FinancialsTabProps {
  stockData: any;
}

export const FinancialsTab = ({ stockData }: FinancialsTabProps) => {
  return (
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
  );
};
