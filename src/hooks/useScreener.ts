
import { useScreenerFilters } from "./screener/useScreenerFilters";
import { useScreenerCalculations } from "./screener/useScreenerCalculations";
import { useScreenerSearch } from "./screener/useScreenerSearch";

export const useScreener = () => {
  const { filters, handleFilterChange } = useScreenerFilters();
  const { calculateADR } = useScreenerCalculations();
  const { results, isLoading, handleSearch } = useScreenerSearch(filters);

  return {
    filters,
    results,
    isLoading,
    handleFilterChange,
    calculateADR,
    handleSearch,
  };
};
