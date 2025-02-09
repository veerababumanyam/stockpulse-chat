
import { useState } from "react";
import { FilterOption } from "@/components/screener/types";
import { defaultFilters } from "@/components/screener/defaultFilters";

export const useScreenerFilters = () => {
  const [filters, setFilters] = useState<FilterOption[]>(defaultFilters);

  const handleFilterChange = (id: string, value: any) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.id === id ? { ...filter, values: value } : filter
      )
    );
  };

  return {
    filters,
    handleFilterChange,
  };
};
