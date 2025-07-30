import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Address } from "@/lib/types/products";

// Types
export interface UserProfile {
  _id: string;
  authUserId: string;
  firstName?: string;
  lastName?: string;
  email: string;
  addresses: (Address & { _id: string })[];
  preferences: {
    emailNotifications: boolean;
    marketingEmails: boolean;
    orderUpdates: boolean;
  };
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  deleteLoading: boolean;
  addressLoading: boolean;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
  updateLoading: false,
  deleteLoading: false,
  addressLoading: false,
};

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/users/profile`,
        {
          withCredentials: true,
        }
      );

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch profile"
        );
      }
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch profile"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (
    profileData: { firstName?: string; lastName?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/users/profile`,
        profileData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to update profile";
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  }
);

export const addAddress = createAsyncThunk(
  "user/addAddress",
  async (address: Omit<Address, "isDefault">, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/users/addresses`,
        address,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to add address"
        );
      }
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to add address"
      );
    }
  }
);

export const updateAddress = createAsyncThunk(
  "user/updateAddress",
  async (
    { addressId, address }: { addressId: string; address: Partial<Address> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/users/addresses/${addressId}`,
        address,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update address"
        );
      }
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update address"
      );
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  "user/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/users/profile`,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to delete account"
        );
      }
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete account"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state) => {
        state.updateLoading = false;
      })

      .addCase(addAddress.pending, (state) => {
        state.addressLoading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addressLoading = false;
        if (state.profile) {
          state.profile.addresses = [action.payload];
        }
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.addressLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateAddress.pending, (state) => {
        state.addressLoading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.addressLoading = false;
        if (state.profile) {
          const index = state.profile.addresses.findIndex(
            (addr) => addr._id === action.payload._id
          );
          if (index !== -1) {
            state.profile.addresses[index] = action.payload;
          }
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.addressLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteUserAccount.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.deleteLoading = false;
        state.profile = null;
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearProfile } = userSlice.actions;
export default userSlice.reducer;
