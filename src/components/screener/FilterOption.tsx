
import React from "react";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FilterOption } from "./types";

interface FilterOptionProps {
  option: FilterOption;
  onSelect: (id: string, value: any) => void;
}

export const FilterOptionComponent: React.FC<FilterOptionProps> = ({
  option,
  onSelect,
}) => {
  if (option.type === 'range') {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">{option.label}</label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            className="w-full bg-background/50"
            onChange={(e) =>
              onSelect(option.id, {
                ...option.values,
                min: parseFloat(e.target.value),
              })
            }
            value={option.values?.min || ''}
          />
          <Input
            type="number"
            placeholder="Max"
            className="w-full bg-background/50"
            onChange={(e) =>
              onSelect(option.id, {
                ...option.values,
                max: parseFloat(e.target.value),
              })
            }
            value={option.values?.max || ''}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{option.label}</label>
      <Select
        onValueChange={(value) => onSelect(option.id, { value })}
      >
        <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm border-border/50 hover:bg-accent/10">
          <SelectValue placeholder={option.label} />
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectTrigger>
        <SelectContent className="bg-background/95 backdrop-blur-sm border-border/50">
          {option.options?.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
