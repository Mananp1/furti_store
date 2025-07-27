// src/components/WishlistCard.tsx
import { ProductCardBase, type Product } from "../Product/ProductCardBase";
import { useWishlist } from "@/lib/hooks/useWishlist";

export function WishlistCard({ product }: { product: Product }) {
  const { removeFromWishlist } = useWishlist();

  const handleRemoveFromWishlist = async () => {
    await removeFromWishlist(product._id);
  };

  return (
    <ProductCardBase
      product={product}
      showWishlistButton={true}
      showAddToCartButton={true}
      onWishlistClick={handleRemoveFromWishlist}
    />
  );
}
