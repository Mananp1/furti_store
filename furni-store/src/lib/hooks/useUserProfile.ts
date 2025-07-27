import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { clearProfile } from "@/features/user/userSlice";
import { signOut, deleteUser } from "@/lib/auth-client";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { useNavigate } from "@tanstack/react-router";

// Type for API error response
interface ApiErrorResponse {
  message: string;
  data?: unknown;
}

// Query keys
export const userProfileKeys = {
  all: ["userProfile"] as const,
  profile: () => [...userProfileKeys.all, "profile"] as const,
};

// Custom hook for user profile management
export const useUserProfile = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch user profile
  const {
    data: profileData,
    isLoading: isFetching,
    error: fetchError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: userProfileKeys.profile(),
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    },
    enabled: false, // We'll manually trigger this
    retry: 1,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: {
      firstName?: string;
      lastName?: string;
    }) => {
      // First update the custom user profile
      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        profileData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Then update the Better Auth user's name
      if (profileData.firstName || profileData.lastName) {
        const fullName =
          `${profileData.firstName || ""} ${profileData.lastName || ""}`.trim();
        if (fullName) {
          // Note: updateUser is not available on the client side
          // The name will be updated when the user logs in again or we can make a server call
        }
      }

      return response.data.data;
    },
    onSuccess: (data) => {
      // Update the query cache
      queryClient.setQueryData(userProfileKeys.profile(), data);
      // Also invalidate the query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: userProfileKeys.profile() });
      toast.success("Profile updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof AxiosError
          ? (error.response?.data as ApiErrorResponse)?.message || error.message
          : error instanceof Error
            ? error.message
            : "Failed to update profile";
      toast.error(errorMessage);
    },
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      // First delete the user profile from our backend
      const response = await axios.delete(
        "http://localhost:5000/api/users/profile",
        {
          withCredentials: true,
        }
      );

      // Then delete the Better Auth user
      // According to Better Auth docs, this should work
      const deleteResult = await deleteUser();

      return { profile: response.data, auth: deleteResult };
    },
    onSuccess: async () => {
      // Clear profile from Redux
      dispatch(clearProfile());

      // Clear query cache
      queryClient.removeQueries({ queryKey: userProfileKeys.all });

      // Sign out the user
      await signOut();

      toast.success("Account deleted successfully");

      // Redirect to home page
      navigate({ to: "/" });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof AxiosError
          ? (error.response?.data as ApiErrorResponse)?.message || error.message
          : error instanceof Error
            ? error.message
            : "Failed to delete account";
      toast.error(errorMessage);
    },
  });

  // Load profile function
  const loadProfile = () => {
    refetchProfile();
  };

  // Update profile function
  const updateProfile = (profileData: {
    firstName?: string;
    lastName?: string;
  }) => {
    updateProfileMutation.mutate(profileData);
  };

  // Delete account function
  const deleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  return {
    // Data
    profile: profileData,

    // Loading states
    isLoading: isFetching,
    isUpdating: updateProfileMutation.isPending,
    isDeleting: deleteAccountMutation.isPending,

    // Errors
    error: fetchError,

    // Actions
    loadProfile,
    updateProfile,
    deleteAccount,

    // Mutations (for direct access if needed)
    updateProfileMutation,
    deleteAccountMutation,
  };
};
