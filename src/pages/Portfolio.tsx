
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/portfolio/Overview";
import { TransactionList } from "@/components/portfolio/TransactionList";
import { TransactionDialog } from "@/components/portfolio/TransactionDialog";
import { useState } from "react";
import { Transaction } from "@/types/portfolio";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Portfolio = () => {
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setIsTransactionDialogOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-20 p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Portfolio</h1>
          <Button onClick={handleAddTransaction}>
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        </div>

        <Overview />

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList onEdit={handleEditTransaction} />
          </CardContent>
        </Card>

        <TransactionDialog 
          open={isTransactionDialogOpen} 
          onOpenChange={setIsTransactionDialogOpen}
          transaction={selectedTransaction}
        />
      </main>
    </div>
  );
};

export default Portfolio;
