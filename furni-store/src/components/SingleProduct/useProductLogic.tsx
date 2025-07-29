import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/lib/hooks/useCart";
import { useWishlist } from "@/lib/hooks/useWishlist";

const productSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  price: z.number(),
  currency: z.string().optional(),
  images: z.array(z.string()),
  category: z.string().optional(),
  material: z.string().optional(),
  dimensions: z.string().optional(),
  status: z.string().optional(),
  rating: z.number().optional(),
});

type Product = z.infer<typeof productSchema>;

export const useProductLogic = () => {
  const { id } = useParams({ strict: false }) as { id: string };
  const [quantity, setQuantity] = useState(1);
  const { data: session } = useSession();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/products/${id}`
      );
      if (!res.ok) throw new Error("Product not found");
      const json = await res.json();
      return productSchema.parse(json);
    },
    enabled: !!id,
  });

  const isWishlisted = product ? isInWishlist(product._id) : false;
  const isInStock = product?.status === "In Stock";

  const toggleWishlist = async () => {
    if (!product) return;

    if (isWishlisted) {
      await removeFromWishlist(product._id);
    } else {
      // Transform product to match Product type
      const wishlistProduct = {
        _id: product._id,
        title: product.title,
        category: product.category || "Uncategorized",
        material: product.material || "Unknown",
        price: product.price,
        images: product.images,
        description: product.description,
      };
      await addToWishlist(wishlistProduct);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    // Add the product to cart with the selected quantity
    const cartProduct = {
      _id: product._id,
      title: product.title,
      category: product.category || "Uncategorized",
      material: product.material || "Unknown",
      price: product.price,
      images: product.images,
      description: product.description,
    };

    // Add multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      await addToCart(cartProduct);
    }
  };

  return {
    product,
    isLoading,
    isError,
    quantity,
    setQuantity,
    session,
    isWishlisted,
    isInStock,
    toggleWishlist,
    handleAddToCart,
  };
};
