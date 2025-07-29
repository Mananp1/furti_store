import {
  WishlistLayout,
  WishlistGrid,
  WishlistSidebar,
  useWishlistLogic,
} from "@/components/Wishlist";

export default function WishlistPage() {
  const { products, totalItems, filters, setFilters, sort, setSort } =
    useWishlistLogic();

  return (
    <WishlistLayout
      sidebar={
        <WishlistSidebar
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          onSortChange={setSort}
        />
      }
      main={<WishlistGrid products={products} totalItems={totalItems} />}
    />
  );
}
