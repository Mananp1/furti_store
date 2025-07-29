import { useState } from "react";
import { useCart } from "@/lib/hooks/useCart";
import { useSession } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";

export type DeliveryOption = "regular" | "express";

export const useCartLogic = () => {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const [deliveryOption, setDeliveryOption] =
    useState<DeliveryOption>("regular");

  const {
    items: cartItems,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
  } = useCart();

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();

  // Calculate shipping cost based on subtotal (INR)
  const getShippingCost = (option: DeliveryOption, total: number) => {
    if (option === "regular") {
      if (total >= 3000) return 0; // Free shipping over ₹3000
      if (total >= 2000) return 99; // ₹99 for orders ₹2000-2999
      return 199; // ₹199 for orders under ₹2000
    } else {
      // express delivery
      if (total >= 3000) return 199; // ₹199 for express over ₹3000
      if (total >= 2000) return 299; // ₹299 for express ₹2000-2999
      return 399; // ₹399 for express under ₹2000
    }
  };

  const shippingCost = session ? getShippingCost(deliveryOption, subtotal) : 0;
  const totalPrice = session ? subtotal + shippingCost : subtotal;

  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
  };

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleDeliveryOptionChange = (option: DeliveryOption) => {
    setDeliveryOption(option);
  };

  const handleCheckout = () => {
    if (!session) {
      toast.error("Please sign in to proceed to checkout");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    // Pass delivery option to checkout
    navigate({
      to: "/checkout",
      search: { delivery: deliveryOption },
    });
  };

  return {
    // State
    cartItems,
    totalItems,
    subtotal,
    shippingCost,
    totalPrice,
    deliveryOption,
    session,

    // Actions
    handleRemoveItem,
    handleUpdateQuantity,
    handleDeliveryOptionChange,
    handleCheckout,
  };
};
