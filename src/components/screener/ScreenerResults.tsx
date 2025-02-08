
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScreenerResult } from "./types";

interface ScreenerResultsProps {
  results: ScreenerResult[];
}

const ScreenerResults = ({ results }: ScreenerResultsProps) => {
  if (results.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Results</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Change %</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Market Cap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell className="font-medium">{stock.symbol}</TableCell>
                <TableCell>{stock.companyName}</TableCell>
                <TableCell>${stock.price.toFixed(2)}</TableCell>
                <TableCell className={stock.change > 0 ? "text-green-600" : "text-red-600"}>
                  {stock.change.toFixed(2)}%
                </TableCell>
                <TableCell>{stock.sector}</TableCell>
                <TableCell>${(stock.marketCap / 1e9).toFixed(2)}B</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ScreenerResults;

