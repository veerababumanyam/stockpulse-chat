
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Transaction, TransactionType } from "@/types/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
}

export const TransactionDialog = ({ open, onOpenChange, transaction }: TransactionDialogProps) => {
  const [formData, setFormData] = useState<Partial<Transaction>>(
    transaction || {
      type: 'buy',
      date: format(new Date(), 'yyyy-MM-dd'),
      shares: 0,
      pricePerShare: 0,
      fees: 0,
    }
  );

  const [date, setDate] = useState<Date | undefined>(
    transaction ? new Date(transaction.date) : new Date()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement transaction submission
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              value={formData.symbol || ''}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
              placeholder="e.g., AAPL"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: TransactionType) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    setFormData({ 
                      ...formData, 
                      date: newDate ? format(newDate, 'yyyy-MM-dd') : ''
                    });
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shares">Number of Shares</Label>
            <Input
              id="shares"
              type="number"
              step="0.0001"
              min="0"
              value={formData.shares || ''}
              onChange={(e) => setFormData({ ...formData, shares: parseFloat(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price per Share</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.pricePerShare || ''}
              onChange={(e) => setFormData({ ...formData, pricePerShare: parseFloat(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fees">Fees</Label>
            <Input
              id="fees"
              type="number"
              step="0.01"
              min="0"
              value={formData.fees || ''}
              onChange={(e) => setFormData({ ...formData, fees: parseFloat(e.target.value) })}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {transaction ? 'Update' : 'Add'} Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
