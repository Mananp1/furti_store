import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency formatting utility
export const formatCurrency = (amount: number, currency: string = "INR") => {
  if (currency === "INR") {
    return `₹${amount.toFixed(2)}`;
  }
  return `$${amount.toFixed(2)}`;
};
