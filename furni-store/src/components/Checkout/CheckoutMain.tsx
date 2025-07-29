import { type ReactNode } from "react";

interface CheckoutMainProps {
  leftColumn: ReactNode;
  rightColumn: ReactNode;
}

export const CheckoutMain = ({
  leftColumn,
  rightColumn,
}: CheckoutMainProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Checkout Form */}
      <div className="lg:col-span-2 space-y-6">{leftColumn}</div>

      {/* Right Column - Order Summary */}
      <div className="lg:col-span-1">{rightColumn}</div>
    </div>
  );
};
