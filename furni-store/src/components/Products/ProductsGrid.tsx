import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types/products";

interface ProductsGridProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
}

export const ProductsGrid = ({
  products,
  isLoading,
  isError,
  error,
}: ProductsGridProps) => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center mx-auto">
      {isLoading && (
        <div className="col-span-full text-center">Loading products...</div>
      )}
      {isError && (
        <div className="col-span-full text-center text-red-500">
          Error: {error?.message || "Failed to load products."}
        </div>
      )}
      {!isLoading && !isError && products.length === 0 && (
        <div className="col-span-full text-center text-muted-foreground">
          No products found.
        </div>
      )}
      {products.map((product) => (
        <div key={product._id} className="flex justify-center">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};
