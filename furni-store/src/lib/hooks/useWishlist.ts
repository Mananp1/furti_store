import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useSession } from "@/lib/auth-client";
import {
  fetchWishlist,
  addToWishlistAPI,
  removeFromWishlistAPI,
  setWishlistItems,
} from "@/features/wishlist/wishlistSlice";
import { toast } from "react-toastify";
import type { Product } from "@/components/Product/ProductCardBase";

export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { items, loading, error } = useAppSelector(
    (state) => state.wishlistState
  );

  // Load wishlist when user logs in
  useEffect(() => {
    if (session) {
      dispatch(fetchWishlist());
    } else {
      // Clear wishlist when user logs out
      dispatch(setWishlistItems([]));
    }
  }, [session, dispatch]);

  const addToWishlist = async (product: Product) => {
    if (!session) {
      toast.error("Please log in to add items to wishlist");
      return;
    }

    try {
      await dispatch(addToWishlistAPI(product)).unwrap();
      toast.success("Added to wishlist!");
    } catch {
      toast.error("Failed to add to wishlist");
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!session) {
      toast.error("Please log in to remove items from wishlist");
      return;
    }

    try {
      await dispatch(removeFromWishlistAPI(productId)).unwrap();
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove from wishlist");
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item._id === productId);
  };

  return {
    items,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isAuthenticated: !!session,
  };
};
