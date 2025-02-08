
import { Navigation } from "@/components/Navigation";
import { PineFormula } from "@/components/screener/PineFormula";
import ScreenerHeader from "@/components/screener/ScreenerHeader";
import FilterCategorySection from "@/components/screener/FilterCategorySection";
import ScreenerActions from "@/components/screener/ScreenerActions";
import { screenerCategories } from "@/components/screener/constants";
import { useScreener } from "@/hooks/useScreener";

const Screener = () => {
  const {
    filters,
    results,
    isLoading,
    handleFilterChange,
    calculateADR,
    handleSearch,
  } = useScreener();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-20 p-4">
        <ScreenerHeader />
        <div className="space-y-6 mt-8">
          <ScreenerActions isLoading={isLoading} onSearch={handleSearch} />
          <div className="grid gap-6">
            {screenerCategories.map((category) => (
              <FilterCategorySection
                key={category.id}
                category={category}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            ))}
          </div>
          {results.length > 0 && (
            <div className="mt-8">
              <PineFormula onCalculate={calculateADR} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Screener;

