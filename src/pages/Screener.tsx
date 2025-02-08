
import { Navigation } from "@/components/Navigation";
import ScreenerHeader from "@/components/screener/ScreenerHeader";
import FilterCategorySection from "@/components/screener/FilterCategorySection";
import { screenerCategories } from "@/components/screener/constants";
import { useScreener } from "@/hooks/useScreener";

const Screener = () => {
  const { filters, handleFilterChange } = useScreener();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-20 p-4">
        <ScreenerHeader />
        <div className="space-y-6 mt-6">
          {screenerCategories.map((category) => (
            <FilterCategorySection
              key={category.id}
              category={category}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Screener;
