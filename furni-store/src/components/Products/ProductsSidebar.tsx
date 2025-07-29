import {
  ProductFilterSidebar,
  type Filters,
  type SortOption,
} from "./ProductFilterSidebar";

interface ProductsSidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const ProductsSidebar = ({
  filters,
  setFilters,
  sort,
  onSortChange,
}: ProductsSidebarProps) => {
  // Pass through props to ProductFilterSidebar
  return (
    <ProductFilterSidebar
      filters={filters}
      setFilters={setFilters}
      sort={sort}
      onSortChange={onSortChange}
    />
  );
};
