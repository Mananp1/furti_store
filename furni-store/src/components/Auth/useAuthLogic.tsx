import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { toast } from "react-toastify";

type FormData = {
  email: string;
};

export const useAuthLogic = (type: "login" | "signup") => {
  const [isLoading, setIsLoading] = useState(false);
  

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true);
    const { email } = data;

    console.log("🚀 Starting magic link process for:", email);
    console.log("📧 Auth type:", type);
    console.log("🌐 Frontend URL:", window.location.origin);

    try {
      console.log("🔗 Calling signIn.magicLink...");

      const result = await signIn.magicLink({
        email,
        callbackURL: "http://localhost:5173/",
        newUserCallbackURL: "http://localhost:5173/",
        errorCallbackURL: "http://localhost:5173/login",
      });

      console.log("📧 Magic link result:", result);

      if (result.error) {
        console.error("❌ Magic link error:", result.error);
        toast.error(result.error.message || "Failed to send magic link");
      } else {
        console.log("✅ Magic link sent successfully");
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
      console.log("🏁 Magic link process completed");
    }
  };

  return {
    handleFormSubmit,
    isLoading,
  };
};
