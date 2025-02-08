
import { FilterOption, ScreenerCategory } from "./types";
import { FilterOptionComponent } from "./FilterOption";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, LineChart, BarChart3, DollarSign } from "lucide-react";

interface FilterCategorySectionProps {
  category: ScreenerCategory;
  filters: FilterOption[];
  onFilterChange: (id: string, value: any) => void;
}

const FilterCategorySection = ({ category, filters, onFilterChange }: FilterCategorySectionProps) => {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'volatility':
        return <TrendingUp className="h-5 w-5" />;
      case 'momentum':
        return <LineChart className="h-5 w-5" />;
      case 'sentiment':
        return <BarChart3 className="h-5 w-5" />;
      case 'liquidity':
        return <DollarSign className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const categoryFilters = filters.filter(filter => filter.category === category.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {getCategoryIcon(category.id)}
        <h2 className="text-2xl font-semibold">{category.label}</h2>
      </div>
      <p className="text-muted-foreground">{category.description}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categoryFilters.map((filter) => (
          <FilterOptionComponent
            key={filter.id}
            option={filter}
            onSelect={onFilterChange}
          />
        ))}
      </div>
      <Separator className="my-6" />
    </div>
  );
};

export default FilterCategorySection;

