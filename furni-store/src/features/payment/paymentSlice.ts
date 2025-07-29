import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import {
  createStripePaymentIntent,
  createCashOnDeliveryOrder,
  getPaymentHistory,
  getPaymentByOrderId,
} from "@/lib/payment";

// Types
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

export interface Payment {
  _id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: "stripe" | "cash_on_delivery";
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  stripePaymentIntentId?: string;
  stripeClientSecret?: string;
  items: PaymentItem[];
  shippingAddress: ShippingAddress;
  customerDetails: CustomerDetails;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

interface PaymentState {
  payments: Payment[];
  currentPayment: Payment | null;
  loading: boolean;
  error: string | null;
  processing: boolean;
  paymentHistory: {
    payments: Payment[];
    totalPages: number;
    currentPage: number;
    total: number;
  } | null;
}

const initialState: PaymentState = {
  payments: [],
  currentPayment: null,
  loading: false,
  error: null,
  processing: false,
  paymentHistory: null,
};

// Async thunks
export const createStripePayment = createAsyncThunk(
  "payment/createStripePayment",
  async (paymentData: PaymentData, { rejectWithValue }) => {
    try {
      const response = await createStripePaymentIntent(paymentData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create payment");
    }
  }
);

export const createCODOrder = createAsyncThunk(
  "payment/createCODOrder",
  async (paymentData: PaymentData, { rejectWithValue }) => {
    try {
      const response = await createCashOnDeliveryOrder(paymentData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create COD order");
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  "payment/fetchPaymentHistory",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await getPaymentHistory(page, limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch payment history"
      );
    }
  }
);

export const fetchPaymentByOrderId = createAsyncThunk(
  "payment/fetchPaymentByOrderId",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await getPaymentByOrderId(orderId);
      return response.payment;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch payment");
    }
  }
);

// Slice
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.processing = action.payload;
    },
    updatePaymentStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: string }>
    ) => {
      const { orderId, status } = action.payload;
      const payment = state.payments.find((p) => p.orderId === orderId);
      if (payment) {
        payment.status = status as Payment["status"];
      }
      if (state.currentPayment?.orderId === orderId) {
        state.currentPayment.status = status as Payment["status"];
      }
      if (state.paymentHistory?.payments) {
        const historyPayment = state.paymentHistory.payments.find(
          (p) => p.orderId === orderId
        );
        if (historyPayment) {
          historyPayment.status = status as Payment["status"];
        }
      }
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
  },
  extraReducers: (builder) => {
    // Create Stripe Payment
    builder
      .addCase(createStripePayment.pending, (state) => {
        state.processing = true;
        state.error = null;
      })
      .addCase(createStripePayment.fulfilled, (state, action) => {
        state.processing = false;
        state.currentPayment = action.payload;
      })
      .addCase(createStripePayment.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload as string;
      });

    // Create COD Order
    builder
      .addCase(createCODOrder.pending, (state) => {
        state.processing = true;
        state.error = null;
      })
      .addCase(createCODOrder.fulfilled, (state, action) => {
        state.processing = false;
        state.currentPayment = action.payload;
      })
      .addCase(createCODOrder.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload as string;
      });

    // Fetch Payment History
    builder
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentHistory = action.payload;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Payment by Order ID
    builder
      .addCase(fetchPaymentByOrderId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentByOrderId.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(fetchPaymentByOrderId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setProcessing,
  updatePaymentStatus,
  clearCurrentPayment,
} = paymentSlice.actions;
export default paymentSlice.reducer;
