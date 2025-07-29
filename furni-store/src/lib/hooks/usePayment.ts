import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createStripePayment,
  createCODOrder,
  updatePaymentStatus,
} from "@/features/payment/paymentSlice";
import { clearCartAPI } from "@/features/cart/cartSlice";
import type { PaymentData } from "@/features/payment/paymentSlice";

// Initialize Stripe (you'll need to add your publishable key to .env)
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY 
);

export const usePayment = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { processing, currentPayment, error } = useAppSelector(
    (state) => state.paymentState
  );

  // Handle Stripe payment
  const handleStripePayment = async (paymentData: PaymentData) => {
    try {
      console.log("💰 Creating Stripe payment intent...");
      console.log("📦 Payment data for Stripe:", paymentData);

      // Create payment intent using Redux
      const result = await dispatch(createStripePayment(paymentData)).unwrap();

      console.log("✅ Payment intent created:", result);

      // Load Stripe and redirect to payment
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Failed to load Stripe");
      }

      console.log("🎯 Redirecting to Stripe checkout...");

      // Redirect to Stripe Checkout using session ID
      const { error } = await stripe.redirectToCheckout({
        sessionId: result.sessionId,
      });

      if (error) {
        console.error("❌ Stripe redirect error:", error);
        toast.error(error.message || "Failed to redirect to payment");
        throw error;
      }

      return result;
    } catch (error: any) {
      console.error("❌ Stripe payment error:", error);
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(error.message || "Failed to process payment");
      throw error;
    }
  };

  // Handle Cash on Delivery
  const handleCashOnDelivery = async (paymentData: PaymentData) => {
    try {
      console.log("💵 Creating Cash on Delivery order...");
      console.log("📦 Payment data for COD:", paymentData);

      // Create COD order using Redux
      const result = await dispatch(createCODOrder(paymentData)).unwrap();

      console.log("✅ COD order created:", result);

      toast.success(`Order placed successfully! Order ID: ${result.orderId}`);

      // Clear cart after successful order
      await dispatch(clearCartAPI()).unwrap();
      console.log("🛒 Cart cleared after successful order");

      // Navigate to orders page
      navigate({ to: "/orders" });

      return result;
    } catch (error: any) {
      console.error("❌ COD order error:", error);
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(error.message || "Failed to place order");
      throw error;
    }
  };

  // Handle payment confirmation
  const handlePaymentConfirmation = async (
    _paymentIntentId: string,
    orderId: string
  ) => {
    try {
      console.log("✅ Confirming payment...");

      // Update payment status in Redux
      dispatch(updatePaymentStatus({ orderId, status: "completed" }));

      console.log("✅ Payment confirmed");
      toast.success("Payment confirmed successfully!");

      return { success: true };
    } catch (error: any) {
      console.error("❌ Payment confirmation error:", error);
      toast.error(error.message || "Failed to confirm payment");
      throw error;
    }
  };

  // Process payment based on method
  const processPayment = async (
    paymentMethod: string,
    paymentData: PaymentData
  ) => {
    try {
      console.log("🚀 Starting payment processing...");
      console.log("💳 Payment method:", paymentMethod);
      console.log("📦 Payment data:", paymentData);

      if (paymentMethod === "stripe") {
        console.log("💳 Processing Stripe payment...");
        return await handleStripePayment(paymentData);
      } else if (paymentMethod === "cod") {
        console.log("💵 Processing Cash on Delivery...");
        return await handleCashOnDelivery(paymentData);
      } else {
        throw new Error("Invalid payment method");
      }
    } catch (error) {
      console.error("❌ Payment processing error:", error);
      throw error;
    }
  };

  return {
    isProcessing: processing,
    paymentIntent: currentPayment,
    processPayment,
    handlePaymentConfirmation,
    error,
  };
};
