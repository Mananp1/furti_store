import { signOut } from "@/lib/auth-client";
import { toast } from "react-toastify";

export const useErrorLogic = () => {
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Failed to log out");
    }
  };

  return {
    handleLogout,
  };
};
