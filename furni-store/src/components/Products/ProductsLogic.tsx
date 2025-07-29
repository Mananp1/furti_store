import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { productsSchema } from "@/lib/types/products";
import type { Product, Filters } from "@/lib/types/products";
import type { SortOption } from "./ProductFilterSidebar";

export const useProductsLogic = () => {
  const [filters, setFilters] = useState<Filters>({
    category: [],
    material: [],
  });
  const [sort, setSort] = useState<SortOption>("default");

  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/products`
      );
      // Validate with Zod
      return productsSchema.parse(response.data);
    },
  });

  const filteredProducts = products.filter((p) => {
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

  return {
    products: sortedProducts,
    isLoading,
    isError,
    error,
    filters,
    setFilters,
    sort,
    setSort,
  };
};
