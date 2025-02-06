
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface OverviewTabProps {
  stockData: any;
  formatLargeNumber: (num: number) => string;
}

const COLORS = ['#8B5CF6', '#D946EF', '#EC4899', '#F43F5E', '#F97316'];

export const OverviewTab = ({ stockData, formatLargeNumber }: OverviewTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Company Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] rounded-md">
            <p className="text-sm text-muted-foreground">
              {stockData.profile.description}
            </p>
          </ScrollArea>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">CEO</p>
              <p className="text-sm text-muted-foreground">{stockData.profile.ceo}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Website</p>
              <a href={stockData.profile.website} target="_blank" rel="noopener noreferrer" 
                 className="text-sm text-blue-500 hover:text-blue-700">
                {stockData.profile.website}
              </a>
            </div>
            <div>
              <p className="text-sm font-medium">Employees</p>
              <p className="text-sm text-muted-foreground">{stockData.profile.fullTimeEmployees}</p>
            </div>
            <div>
              <p className="text-sm font-medium">IPO Date</p>
              <p className="text-sm text-muted-foreground">{stockData.profile.ipoDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Market Cap</p>
              <p className="text-sm text-muted-foreground">${formatLargeNumber(stockData.quote.marketCap)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">P/E Ratio</p>
              <p className="text-sm text-muted-foreground">{stockData.quote.pe?.toFixed(2) || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Beta</p>
              <p className="text-sm text-muted-foreground">{stockData.quote.beta?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">52 Week Range</p>
              <p className="text-sm text-muted-foreground">
                ${stockData.quote.yearLow?.toFixed(2)} - ${stockData.quote.yearHigh?.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Avg Volume</p>
              <p className="text-sm text-muted-foreground">{formatLargeNumber(stockData.quote.avgVolume)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Dividend Yield</p>
              <p className="text-sm text-muted-foreground">
                {stockData.quote.dividendYield 
                  ? `${(stockData.quote.dividendYield * 100).toFixed(2)}%` 
                  : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Institutional Ownership</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Institutional', value: stockData.profile.institutionalOwnership || 0 },
                    { name: 'Retail', value: 1 - (stockData.profile.institutionalOwnership || 0) }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${(value * 100).toFixed(1)}%`}
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
