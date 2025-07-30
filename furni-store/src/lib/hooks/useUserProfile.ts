import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { clearProfile } from "@/features/user/userSlice";
import { signOut, deleteUser, useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { useNavigate } from "@tanstack/react-router";

interface ApiErrorResponse {
  message: string;
  data?: unknown;
}

export const userProfileKeys = {
  all: ["userProfile"] as const,
  profile: () => [...userProfileKeys.all, "profile"] as const,
};

export const useUserProfile = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: session } = useSession();

  const {
    data: profileData,
    isLoading: isFetching,
    error: fetchError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: userProfileKeys.profile(),
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/users/profile`,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    },
    enabled: !!session,
    retry: 1,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: {
      firstName?: string;
      lastName?: string;
    }) => {
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
    },
    onSuccess: (data) => {
      queryClient.setQueryData(userProfileKeys.profile(), data);
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

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/users/profile`,
        {
          withCredentials: true,
        }
      );

      const deleteResult = await deleteUser();

      return { profile: response.data, auth: deleteResult };
    },
    onSuccess: async () => {
      dispatch(clearProfile());

      queryClient.removeQueries({ queryKey: userProfileKeys.all });

      await signOut();

      toast.success("Account deleted successfully");

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

  const loadProfile = () => {
    refetchProfile();
  };

  const updateProfile = (profileData: {
    firstName?: string;
    lastName?: string;
  }) => {
    updateProfileMutation.mutate(profileData);
  };

  const deleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  return {
    profile: profileData,

    isLoading: isFetching,
    isUpdating: updateProfileMutation.isPending,
    isDeleting: deleteAccountMutation.isPending,

    error: fetchError,

    loadProfile,
    updateProfile,
    deleteAccount,

    updateProfileMutation,
    deleteAccountMutation,
  };
};
