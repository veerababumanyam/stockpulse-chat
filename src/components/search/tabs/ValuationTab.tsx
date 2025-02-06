
import React from "react";
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
  TableRow,
} from "@/components/ui/table";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

interface ValuationTabProps {
  stockData: any;
}

export const ValuationTab = ({ stockData }: ValuationTabProps) => {
  return (
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
  );
};
