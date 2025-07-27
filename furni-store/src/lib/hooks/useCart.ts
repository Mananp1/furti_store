import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useSession } from "@/lib/auth-client";
import {
  fetchCart,
  addToCartAPI,
  updateCartItemAPI,
  removeFromCartAPI,
  clearCartAPI,
  setCartItems,
} from "@/features/cart/cartSlice";
import { toast } from "react-toastify";
import type { Product } from "@/components/Product/ProductCardBase";

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { items, loading, error } = useAppSelector((state) => state.cartState);

  // Load cart when user logs in
  useEffect(() => {
    if (session) {
      dispatch(fetchCart());
    } else {
      // Clear cart when user logs out
      dispatch(setCartItems([]));
    }
  }, [session, dispatch]);

  const addToCart = async (product: Product) => {
    if (!session) {
      toast.error("Please log in to add items to cart");
      return;
    }

    try {
      await dispatch(addToCartAPI(product)).unwrap();
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!session) {
      toast.error("Please log in to update cart");
      return;
    }

    try {
      await dispatch(updateCartItemAPI({ productId, quantity })).unwrap();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!session) {
      toast.error("Please log in to remove items from cart");
      return;
    }

    try {
      await dispatch(removeFromCartAPI(productId)).unwrap();
      toast.success("Removed from cart");
    } catch {
      toast.error("Failed to remove from cart");
    }
  };

  const clearCart = async () => {
    if (!session) {
      toast.error("Please log in to clear cart");
      return;
    }

    try {
      await dispatch(clearCartAPI()).unwrap();
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return {
    items,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isAuthenticated: !!session,
  };
};
