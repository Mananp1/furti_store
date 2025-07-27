import { useState } from "react";
import { useWishlist } from "@/lib/hooks/useWishlist";
import {
  WishlistFilterSidebar,
  type SortOption,
} from "@/components/Whislist/WishlistFilterSidebar";
import { WishlistCard } from "@/components/Whislist/WishlistCard";

type Filters = {
  category: string[];
  material: string[];
};

export default function WishlistPage() {
  const [filters, setFilters] = useState<Filters>({
    category: [],
    material: [],
  });
  const [sort, setSort] = useState<SortOption>("default");

  // Get wishlist items from hook
  const { items: wishlistItems } = useWishlist();

  const filteredProducts = wishlistItems.filter((p) => {
    const matchesCategory =
      filters.category.length === 0 || filters.category.includes(p.category);
    const matchesMaterial =
      filters.material.length === 0 || filters.material.includes(p.material);
    return matchesCategory && matchesMaterial;
  });

  // Sort products according to sort option
  const sortedProducts = (() => {
    switch (sort) {
      case "title":
        return [...filteredProducts].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
      case "price-low-high":
        return [...filteredProducts].sort((a, b) => a.price - b.price);
      case "price-high-low":
        return [...filteredProducts].sort((a, b) => b.price - a.price);
      default:
        return filteredProducts;
    }
  })();

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r bg-white">
        <WishlistFilterSidebar
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          onSortChange={setSort}
        />
      </aside>
      <main className="flex-1 p-4">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center mx-auto">
          {wishlistItems.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
              Your wishlist is empty. Start adding some products!
            </div>
          )}
          {wishlistItems.length > 0 && sortedProducts.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
              No products match your current filters.
            </div>
          )}
          {sortedProducts.map((product) => (
            <div key={product._id} className="flex justify-center">
              <WishlistCard product={product} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
