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

  const getShippingCost = (option: DeliveryOption, total: number) => {
    if (option === "regular") {
      if (total >= 3000) return 0;
      if (total >= 2000) return 99;
      return 199;
    } else {
      if (total >= 3000) return 199;
      if (total >= 2000) return 299;
      return 399;
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
