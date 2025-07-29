import axios from "axios";

// API base URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Payment types
export interface PaymentItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface PaymentData {
  items: PaymentItem[];
  shippingAddress: ShippingAddress;
  customerDetails: CustomerDetails;
  deliveryOption?: "regular" | "express";
}

// Create Stripe payment intent
export const createStripePaymentIntent = async (paymentData: PaymentData) => {
  try {
    console.log("🚀 Creating Stripe payment intent with data:", {
      itemsCount: paymentData.items.length,
      totalAmount: paymentData.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      hasShippingAddress: !!paymentData.shippingAddress,
      hasCustomerDetails: !!paymentData.customerDetails,
    });

    const amount = paymentData.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    console.log("💵 Calculated amount:", amount);

    const response = await axios.post(
      `${API_BASE_URL}/payments/create-payment-intent`,
      {
        amount,
        currency: "inr",
        items: paymentData.items,
        shippingAddress: paymentData.shippingAddress,
        customerDetails: paymentData.customerDetails,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Payment intent response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error creating payment intent:", error);
    console.error("❌ Error response:", error.response?.data);
    console.error("❌ Error status:", error.response?.status);

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to create payment intent");
    }
  }
};

// Create Cash on Delivery order
export const createCashOnDeliveryOrder = async (paymentData: PaymentData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payments/create-cod-order`,
      {
        items: paymentData.items,
        shippingAddress: paymentData.shippingAddress,
        customerDetails: paymentData.customerDetails,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error creating COD order:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create COD order"
    );
  }
};

// Confirm payment
export const confirmPayment = async (
  paymentIntentId: string,
  orderId: string
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payments/confirm-payment`,
      {
        paymentIntentId,
        orderId,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error confirming payment:", error);
    throw new Error(
      error.response?.data?.message || "Failed to confirm payment"
    );
  }
};

// Get payment history
export const getPaymentHistory = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/payments/history?page=${page}&limit=${limit}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fetching payment history:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch payment history"
    );
  }
};

// Get payment by order ID
export const getPaymentByOrderId = async (orderId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/payments/order/${orderId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fetching payment:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch payment");
  }
};

// Update payment status (for testing)
export const updatePaymentStatus = async (orderId: string, status: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payments/update-status`,
      {
        orderId,
        status,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error updating payment status:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update payment status"
    );
  }
};
