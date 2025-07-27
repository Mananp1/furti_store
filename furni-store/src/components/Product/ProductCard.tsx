// src/components/ProductCard.tsx
import { ProductCardBase } from "./ProductCardBase";
import type { Product } from "./ProductCardBase";
import { useWishlist } from "@/lib/hooks/useWishlist";

export function ProductCard({ product }: { product: Product }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product._id);

  const toggleWishlist = async () => {
    if (isWishlisted) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product);
    }
  };

  return (
    <ProductCardBase
      product={product}
      showWishlistButton={true}
      showAddToCartButton={true}
      onWishlistClick={toggleWishlist}
    />
  );
}
