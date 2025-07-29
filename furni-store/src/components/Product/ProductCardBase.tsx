// src/components/Product/ProductCardBase.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/lib/hooks/useCart";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types/products";

interface ProductCardBaseProps {
  product: Product;
  showWishlistButton?: boolean;
  onWishlistClick?: (id: string) => void;
  showAddToCartButton?: boolean;
}

export function ProductCardBase({
  product,
  showWishlistButton = true,
  onWishlistClick,
  showAddToCartButton = true,
}: ProductCardBaseProps) {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const { addToCart } = useCart();
  const { isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product._id);

  const goToDetails = () => {
    navigate({
      to: "/products/$id",
      params: { id: product._id },
    });
  };

  const handleAddToCart = async () => {
    await addToCart(product);
  };

  return (
    <Card className="max-w-sm w-full flex flex-col overflow-hidden mx-auto pt-0 shadow-none">
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-64 w-full object-cover rounded-t-lg aspect-square"
        />
        {showWishlistButton && session && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={`absolute top-2 right-2 h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 ${
              isWishlisted
                ? "border-gray-800 text-gray-800 hover:bg-gray-50"
                : "border-gray-300 text-gray-600 hover:border-gray-800 hover:text-gray-800"
            }`}
            onClick={() => onWishlistClick?.(product._id)}
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
            />
          </Button>
        )}
      </div>

      <CardHeader>
        <h5 className="text-2xl font-bold tracking-tight">{product.title}</h5>
        <p className="text-sm text-muted-foreground">
          {product.category} &bull; {product.material}
        </p>
      </CardHeader>

      <CardContent className="flex justify-between items-center mt-auto">
        <span className="text-lg font-semibold">
          {formatCurrency(product.price, "INR")}
        </span>
        <div className="flex gap-2">
          {showAddToCartButton && (
            <Button variant="outline" onClick={handleAddToCart}>
              <ShoppingBag className="w-4 h-4 mr-1" />
              Add
            </Button>
          )}
          <Button variant="default" onClick={goToDetails}>
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
