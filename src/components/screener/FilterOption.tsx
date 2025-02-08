
import React from "react";
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
        <label className="text-sm font-medium text-muted-foreground">
          {option.label}
        </label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            className="w-full bg-background"
            onChange={(e) =>
              onSelect(option.id, {
                ...option.values,
                min: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            value={option.values?.min ?? ''}
          />
          <Input
            type="number"
            placeholder="Max"
            className="w-full bg-background"
            onChange={(e) =>
              onSelect(option.id, {
                ...option.values,
                max: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            value={option.values?.max ?? ''}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {option.label}
      </label>
      <Select
        onValueChange={(value) => onSelect(option.id, { value })}
        value={option.values?.value}
      >
        <SelectTrigger className="w-full bg-background hover:bg-accent/10">
          <SelectValue placeholder={`Select ${option.label}`} />
        </SelectTrigger>
        <SelectContent className="bg-background border-border/50">
          {option.options?.map((opt) => (
            <SelectItem 
              key={opt.value} 
              value={opt.value}
              className="hover:bg-accent/10"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
