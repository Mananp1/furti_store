import { WishlistCard } from "./WishlistCard";
import type { Product } from "@/lib/types/products";

interface WishlistGridProps {
  products: Product[];
  totalItems: number;
}

export const WishlistGrid = ({ products, totalItems }: WishlistGridProps) => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center mx-auto">
      {totalItems === 0 && (
        <div className="col-span-full text-center text-muted-foreground">
          Your wishlist is empty. Start adding some products!
        </div>
      )}
      {totalItems > 0 && products.length === 0 && (
        <div className="col-span-full text-center text-muted-foreground">
          No products match your current filters.
        </div>
      )}
      {products.map((product) => (
        <div key={product._id} className="flex justify-center">
          <WishlistCard product={product} />
        </div>
      ))}
    </div>
  );
};
