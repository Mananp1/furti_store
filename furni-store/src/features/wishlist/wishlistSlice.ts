import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/lib/types/products";
import axios from "axios";

type WishlistState = {
  items: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/wishlist`,
        {
          withCredentials: true,
        }
      );
      return response.data.data.items;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch wishlist"
        );
      }
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch wishlist"
      );
    }
  }
);

export const addToWishlistAPI = createAsyncThunk(
  "wishlist/addToWishlistAPI",
  async (product: Product, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/wishlist/add`,
        { product },
        { withCredentials: true }
      );
      return response.data.data.items;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to add to wishlist"
        );
      }
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to add to wishlist"
      );
    }
  }
);

export const removeFromWishlistAPI = createAsyncThunk(
  "wishlist/removeFromWishlistAPI",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/wishlist/remove/${productId}`,
        { withCredentials: true }
      );
      return response.data.data.items;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to remove from wishlist"
        );
      }
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to remove from wishlist"
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<Product>) {
      const exists = state.items.find(
        (item: Product) => item._id === action.payload._id
      );
      if (!exists) state.items.push(action.payload);
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item: Product) => item._id !== action.payload
      );
    },
    setWishlistItems: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToWishlistAPI.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromWishlistAPI.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { addToWishlist, removeFromWishlist, setWishlistItems } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
