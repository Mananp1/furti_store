import { useSession } from "@/lib/auth-client";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { signOut } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { useState } from "react";

export const useNavBarLogic = () => {
  const { data: session, isPending } = useSession();
  const { profile } = useUserProfile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Failed to log out");
    }
  };

  const getDisplayName = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    if (profile?.firstName) {
      return profile.firstName;
    }
    if (session?.user.name && session.user.name !== session.user.email) {
      return session.user.name;
    }
    return session?.user.email?.split("@")[0] || "User";
  };

  return {
    session,
    isPending,
    profile,
    isDropdownOpen,
    setIsDropdownOpen,
    handleLogout,
    getDisplayName,
  };
};
