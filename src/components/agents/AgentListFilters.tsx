
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Filter, ArrowUp, ArrowDown, Search } from "lucide-react";

interface AgentListFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortField: "name" | "model";
  setSortField: (field: "name" | "model") => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (direction: "asc" | "desc") => void;
  activeFilter: boolean | null;
  setActiveFilter: (filter: boolean | null) => void;
}

export const AgentListFilters = ({
  searchQuery,
  setSearchQuery,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  activeFilter,
  setActiveFilter
}: AgentListFiltersProps) => {
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search agents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={activeFilter === true}
              onCheckedChange={() => setActiveFilter(activeFilter === true ? null : true)}
            >
              Active
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilter === false}
              onCheckedChange={() => setActiveFilter(activeFilter === false ? null : false)}
            >
              Inactive
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Select value={sortField} onValueChange={(value: "name" | "model") => setSortField(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="model">Model</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={toggleSortDirection}
          className="flex items-center gap-2"
        >
          {sortDirection === "asc" ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
