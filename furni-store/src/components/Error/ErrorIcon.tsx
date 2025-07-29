import { AlertTriangle, Lock, User, Search } from "lucide-react";

type ErrorType = "not-found" | "unauthorized" | "already-logged-in" | "generic";

interface ErrorIconProps {
  type: ErrorType;
  size?: "sm" | "md" | "lg";
}

export const ErrorIcon = ({ type, size = "md" }: ErrorIconProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const iconClasses = sizeClasses[size];

  const getIcon = () => {
    switch (type) {
      case "not-found":
        return <Search className={iconClasses} />;
      case "unauthorized":
        return <Lock className={iconClasses} />;
      case "already-logged-in":
        return <User className={iconClasses} />;
      default:
        return <AlertTriangle className={iconClasses} />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "not-found":
        return "bg-blue-100 text-blue-600";
      case "unauthorized":
        return "bg-red-100 text-red-600";
      case "already-logged-in":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div
      className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${getBgColor()}`}
    >
      {getIcon()}
    </div>
  );
};
