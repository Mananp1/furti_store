// routes/products.tsx or /pages/products.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import axios from "axios";
import {
  ProductFilterSidebar,
  type SortOption,
} from "@/components/Product/ProductFilterSidebar";
import { ProductCard } from "@/components/Product/ProductCard";

// Zod schema for a product
const productSchema = z.object({
  _id: z.string(),
  title: z.string(),
  category: z.string(),
  material: z.string(),
  price: z.number(),
  images: z.array(z.string()),
  description: z.string().optional(),
});
const productsSchema = z.array(productSchema);

type Product = z.infer<typeof productSchema>;
type Filters = {
  category: string[];
  material: string[];
};

export default function ProductsPage() {
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
      const response = await axios.get("http://localhost:5000/api/products");
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r bg-white">
        <ProductFilterSidebar
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          onSortChange={setSort}
        />
      </aside>
      <main className="flex-1 p-4">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center mx-auto">
          {isLoading && (
            <div className="col-span-full text-center">Loading products...</div>
          )}
          {isError && (
            <div className="col-span-full text-center text-red-500">
              Error: {error?.message || "Failed to load products."}
            </div>
          )}
          {!isLoading && !isError && sortedProducts.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
              No products found.
            </div>
          )}
          {sortedProducts.map((product) => (
            <div key={product._id} className="flex justify-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
