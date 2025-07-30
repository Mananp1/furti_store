import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { toast } from "react-toastify";

type FormData = {
  email: string;
};

export const useAuthLogic = (_type: "login" | "signup") => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true);
    const { email } = data;

    try {
      const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
      const callbackURL = `${baseUrl}/`;
      const errorCallbackURL = `${baseUrl}/login`;

      const result = await signIn.magicLink({
        email,
        callbackURL,
        newUserCallbackURL: callbackURL,
        errorCallbackURL,
      });

      if (result.error) {
        console.error("❌ Magic link error:", result.error);
        toast.error(result.error.message || "Failed to send magic link");
      } else {
        toast.success(
          "Magic link sent! Check your email (or console for development)."
        );
      }
    } catch (error: any) {
      console.error("❌ Magic link exception:", error);
      console.error("❌ Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      toast.error("Failed to send magic link");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleFormSubmit,
    isLoading,
  };
};
