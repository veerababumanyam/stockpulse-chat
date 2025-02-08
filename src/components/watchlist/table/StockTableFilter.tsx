
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface StockTableFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const StockTableFilter = ({ value, onChange }: StockTableFilterProps) => {
  return (
    <div className="flex items-center gap-2">
      <Search className="h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Filter by symbol, company, or sector..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};
