
import { FilterOption, ScreenerCategory } from "./types";
import { FilterOptionComponent } from "./FilterOption";
import { Card } from "@/components/ui/card";
import { TrendingUp, LineChart, BarChart3, DollarSign } from "lucide-react";

interface FilterCategorySectionProps {
  category: ScreenerCategory;
  filters: FilterOption[];
  onFilterChange: (id: string, value: any) => void;
}

const FilterCategorySection = ({
  category,
  filters,
  onFilterChange,
}: FilterCategorySectionProps) => {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "basics":
        return <LineChart className="h-5 w-5" />;
      case "fundamentals":
        return <BarChart3 className="h-5 w-5" />;
      case "technicals":
        return <TrendingUp className="h-5 w-5" />;
      case "earnings":
        return <DollarSign className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const categoryFilters = filters.filter(
    (filter) => filter.category === category.id
  );

  return (
    <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          {getCategoryIcon(category.id)}
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{category.label}</h2>
          <p className="text-sm text-muted-foreground">{category.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categoryFilters.map((filter) => (
          <FilterOptionComponent
            key={filter.id}
            option={filter}
            onSelect={onFilterChange}
          />
        ))}
      </div>
    </Card>
  );
};

export default FilterCategorySection;
