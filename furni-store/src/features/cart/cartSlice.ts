import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Product } from "@/components/Product/ProductCardBase";
import axios from "axios";

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/cart", {
        withCredentials: true,
      });
      return response.data.data.items;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch cart"
        );
      }
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch cart"
      );
    }
  }
);

export const addToCartAPI = createAsyncThunk(
  "cart/addToCartAPI",
  async (product: Product, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart/add",
        { product },
        { withCredentials: true }
      );
      return response.data.data.items;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to add to cart"
        );
      }
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to add to cart"
      );
    }
  }
);

export const updateCartItemAPI = createAsyncThunk(
  "cart/updateCartItemAPI",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/cart/update",
        { productId, quantity },
        { withCredentials: true }
      );
      return response.data.data.items;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update cart item"
        );
      }
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update cart item"
      );
    }
  }
);

export const removeFromCartAPI = createAsyncThunk(
  "cart/removeFromCartAPI",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/cart/remove/${productId}`,
        { withCredentials: true }
      );
      return response.data.data.items;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to remove from cart"
        );
      }
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to remove from cart"
      );
    }
  }
);

export const clearCartAPI = createAsyncThunk(
  "cart/clearCartAPI",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/api/cart/clear",
        {
          withCredentials: true,
        }
      );
      return response.data.data.items;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to clear cart"
        );
      }
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to clear cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Local actions for immediate UI updates
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item._id === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add to cart
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Update cart item
      .addCase(updateCartItemAPI.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCartAPI.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Clear cart
      .addCase(clearCartAPI.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
