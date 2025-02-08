
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { ScreenerResult } from "./types";

interface ScreenerResultsProps {
  results: ScreenerResult[];
}

const ScreenerResults = ({ results }: ScreenerResultsProps) => {
  if (results.length === 0) return null;

  return (
    <Card className="mt-8 bg-background/50 backdrop-blur-sm border-border/50 animate-fade-in">
      <div className="p-4 border-b border-border/50">
        <h2 className="text-2xl font-semibold">Screener Results</h2>
        <p className="text-sm text-muted-foreground">
          Found {results.length} stocks matching your criteria
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold">Symbol</TableHead>
              <TableHead className="font-bold">Company</TableHead>
              <TableHead className="font-bold text-right">Price</TableHead>
              <TableHead className="font-bold text-right">Change %</TableHead>
              <TableHead className="font-bold">Sector</TableHead>
              <TableHead className="font-bold text-right">Market Cap</TableHead>
              <TableHead className="font-bold text-right">Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((stock, index) => (
              <TableRow
                key={stock.symbol}
                className="hover:bg-accent/50 cursor-pointer transition-colors duration-200"
                style={{
                  animation: `fade-in 0.3s ease-out ${index * 0.05}s`,
                  opacity: 0,
                  animationFillMode: "forwards"
                }}
              >
                <TableCell className="font-medium">{stock.symbol}</TableCell>
                <TableCell>{stock.companyName}</TableCell>
                <TableCell className="text-right">
                  ${stock.price.toFixed(2)}
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    stock.change > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <span className="flex items-center justify-end gap-1">
                    {stock.change > 0 ? (
                      <ArrowUp className="h-4 w-4 transition-transform hover:translate-y-[-2px]" />
                    ) : (
                      <ArrowDown className="h-4 w-4 transition-transform hover:translate-y-[2px]" />
                    )}
                    {Math.abs(stock.change).toFixed(2)}%
                  </span>
                </TableCell>
                <TableCell>{stock.sector}</TableCell>
                <TableCell className="text-right">
                  ${(stock.marketCap / 1e9).toFixed(2)}B
                </TableCell>
                <TableCell className="text-right">
                  {(stock.volume / 1e6).toFixed(1)}M
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default ScreenerResults;

