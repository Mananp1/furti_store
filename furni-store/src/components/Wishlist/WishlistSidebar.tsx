import {
  WishlistFilterSidebar,
  type SortOption,
} from "./WishlistFilterSidebar";
import type { Filters } from "@/lib/types/products";

interface WishlistSidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const WishlistSidebar = ({
  filters,
  setFilters,
  sort,
  onSortChange,
}: WishlistSidebarProps) => {
  // Pass through props to WishlistFilterSidebar
  return (
    <WishlistFilterSidebar
      filters={filters}
      setFilters={setFilters}
      sort={sort}
      onSortChange={onSortChange}
    />
  );
};
