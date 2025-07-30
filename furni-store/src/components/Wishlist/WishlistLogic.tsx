import { useState } from "react";
import { useWishlist } from "@/lib/hooks/useWishlist";
import type { Filters } from "@/lib/types/products";
import type { SortOption } from "./WishlistFilterSidebar";

export const useWishlistLogic = () => {
  const [filters, setFilters] = useState<Filters>({
    category: [],
    material: [],
  });
  const [sort, setSort] = useState<SortOption>("default");

  const { items: wishlistItems } = useWishlist();

  const filteredProducts = wishlistItems.filter((p) => {
    const matchesCategory =
      filters.category.length === 0 || filters.category.includes(p.category);
    const matchesMaterial =
      filters.material.length === 0 || filters.material.includes(p.material);
    return matchesCategory && matchesMaterial;
  });
  
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

  return {
    products: sortedProducts,
    totalItems: wishlistItems.length,
    filters,
    setFilters,
    sort,
    setSort,
  };
};
