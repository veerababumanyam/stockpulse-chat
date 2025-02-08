
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/types/portfolio";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { formatPrice } from "@/utils/formatting";
import { format } from "date-fns";

interface TransactionListProps {
  onEdit: (transaction: Transaction) => void;
}

export const TransactionList = ({ onEdit }: TransactionListProps) => {
  // TODO: Replace with actual transactions data
  const transactions: Transaction[] = [];

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete transaction:', id);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Shares</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Fees</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{format(new Date(transaction.date), 'MMM d, yyyy')}</TableCell>
                <TableCell>{transaction.symbol}</TableCell>
                <TableCell className="capitalize">{transaction.type}</TableCell>
                <TableCell className="text-right">{transaction.shares}</TableCell>
                <TableCell className="text-right">{formatPrice(transaction.pricePerShare)}</TableCell>
                <TableCell className="text-right">
                  {formatPrice(transaction.shares * transaction.pricePerShare)}
                </TableCell>
                <TableCell className="text-right">{formatPrice(transaction.fees)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(transaction)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
