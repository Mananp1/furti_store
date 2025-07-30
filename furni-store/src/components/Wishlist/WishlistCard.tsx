import { ProductCardBase } from "../Product";
import { useWishlist } from "@/lib/hooks/useWishlist";
import type { Product } from "@/lib/types/products";

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
