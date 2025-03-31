
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/utils/formatting";
import { usePaperTrading } from "@/hooks/usePaperTrading";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export const PaperTradingHistory = () => {
  const { transactions, isLoadingHistory } = usePaperTrading();

  if (isLoadingHistory) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price per Share</TableHead>
              <TableHead>Total Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                  No transaction history yet. Start trading to see your history here.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(new Date(transaction.date), "MMM d, yyyy HH:mm")}</TableCell>
                  <TableCell className={`font-medium ${transaction.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.type === 'buy' ? 'Buy' : 'Sell'}
                  </TableCell>
                  <TableCell>{transaction.symbol}</TableCell>
                  <TableCell>{transaction.shares}</TableCell>
                  <TableCell>{formatPrice(transaction.pricePerShare)}</TableCell>
                  <TableCell>{formatPrice(transaction.shares * transaction.pricePerShare)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
