
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BellPlus, ArrowUp, ArrowDown } from "lucide-react";

interface AlertInputProps {
  onAddAlert: (price: number, type: 'above' | 'below') => void;
}

export const AlertInput = ({ onAddAlert }: AlertInputProps) => {
  const [newAlertPrice, setNewAlertPrice] = useState("");
  const [newAlertType, setNewAlertType] = useState<'above' | 'below'>('above');

  const handleAddAlert = () => {
    const price = parseFloat(newAlertPrice);
    if (!isNaN(price) && price > 0) {
      onAddAlert(price, newAlertType);
      setNewAlertPrice("");
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        type="number"
        step="0.01"
        min="0"
        placeholder="Enter price..."
        value={newAlertPrice}
        onChange={(e) => setNewAlertPrice(e.target.value)}
      />
      <Button
        variant="outline"
        onClick={() => setNewAlertType(newAlertType === 'above' ? 'below' : 'above')}
      >
        {newAlertType === 'above' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
      </Button>
      <Button onClick={handleAddAlert}>
        <BellPlus className="h-4 w-4 mr-2" />
        Add
      </Button>
    </div>
  );
};
