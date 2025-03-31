
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { usePaperTrading } from "@/hooks/usePaperTrading";
import { Search } from "lucide-react";

export const PaperTradingActions = () => {
  const { toast } = useToast();
  const { placeBuyOrder, placeSellOrder, cashBalance } = usePaperTrading();
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [searchSymbol, setSearchSymbol] = useState("");
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");

  const handlePlaceOrder = () => {
    if (!symbol || !quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid symbol and quantity",
        variant: "destructive"
      });
      return;
    }

    try {
      if (orderType === "buy") {
        placeBuyOrder(symbol.toUpperCase(), Number(quantity));
        toast({
          title: "Order placed",
          description: `Buy order for ${quantity} shares of ${symbol.toUpperCase()} has been placed`,
        });
      } else {
        placeSellOrder(symbol.toUpperCase(), Number(quantity));
        toast({
          title: "Order placed",
          description: `Sell order for ${quantity} shares of ${symbol.toUpperCase()} has been placed`,
        });
      }
      setSymbol("");
      setQuantity("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for a stock..."
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">Cash Balance: <span className="font-medium">${cashBalance.toFixed(2)}</span></p>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={() => setOrderType("buy")}>Buy Stock</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buy Stock</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="symbol">Stock Symbol</Label>
                  <Input
                    id="symbol"
                    placeholder="e.g., AAPL"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Number of shares"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handlePlaceOrder}>Place Buy Order</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setOrderType("sell")}>Sell Stock</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sell Stock</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="symbol-sell">Stock Symbol</Label>
                  <Input
                    id="symbol-sell"
                    placeholder="e.g., AAPL"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity-sell">Quantity</Label>
                  <Input
                    id="quantity-sell"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Number of shares"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handlePlaceOrder}>Place Sell Order</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
