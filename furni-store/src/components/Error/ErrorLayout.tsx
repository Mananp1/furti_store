import { type ReactNode } from "react";

interface ErrorLayoutProps {
  children: ReactNode;
  variant?: "card" | "centered";
}

export const ErrorLayout = ({
  children,
  variant = "centered",
}: ErrorLayoutProps) => {
  if (variant === "card") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {children}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-12">
      {children}
    </div>
  );
};
