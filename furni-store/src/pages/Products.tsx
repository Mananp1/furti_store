import {
  ProductsLayout,
  ProductsGrid,
  ProductsSidebar,
  useProductsLogic,
} from "@/components/Products";

export default function ProductsPage() {
  const {
    products,
    isLoading,
    isError,
    error,
    filters,
    setFilters,
    sort,
    setSort,
  } = useProductsLogic();

  return (
    <ProductsLayout
      sidebar={
        <ProductsSidebar
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          onSortChange={setSort}
        />
      }
      main={
        <ProductsGrid
          products={products}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      }
    />
  );
}
