import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";

interface ProductActionsProps {
  isInStock: boolean;
  isWishlisted: boolean;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  showWishlistButton?: boolean;
}

export const ProductActions = ({
  isInStock,
  isWishlisted,
  onAddToCart,
  onToggleWishlist,
  showWishlistButton = true,
}: ProductActionsProps) => {
  return (
    <div className="flex gap-3 mt-6">
      <Button
        size="lg"
        className="flex items-center gap-2"
        disabled={!isInStock}
        variant={!isInStock ? "secondary" : undefined}
        onClick={onAddToCart}
      >
        <ShoppingCart className="w-5 h-5" /> Add to Cart
      </Button>

      {showWishlistButton && (
        <Button
          variant="outline"
          size="lg"
          className={`flex items-center gap-2 ${
            isWishlisted ? "border-red-500 bg-red-50" : ""
          }`}
          onClick={onToggleWishlist}
        >
          <Heart
            className={`w-5 h-5 ${
              isWishlisted ? "text-red-500 fill-current" : ""
            }`}
          />
          {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        </Button>
      )}
    </div>
  );
};
