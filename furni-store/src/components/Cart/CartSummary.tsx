import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { toast } from "react-toastify";
import type { DeliveryOption } from "./useCartLogic";

interface CartSummaryProps {
  subtotal: number;
  shippingCost: number;
  totalPrice: number;
  deliveryOption: DeliveryOption;
  onDeliveryOptionChange: (option: DeliveryOption) => void;
  onCheckout: () => void;
  isProcessing?: boolean;
  session?: any;
}

export const CartSummary = ({
  subtotal,
  shippingCost,
  totalPrice,
  deliveryOption,
  onDeliveryOptionChange,
  onCheckout,
  isProcessing = false,
  session,
}: CartSummaryProps) => {
  const handleCheckout = () => {
    if (!session) {
      toast.error("Please sign in to proceed to checkout");
      return;
    }
    onCheckout();
  };

  return (
    <div className="border-t p-4 space-y-4">
      {/* Delivery Options or Login Prompt */}
      {session ? (
        // Logged in user - show delivery options
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Delivery Options</h4>
          <RadioGroup
            value={deliveryOption}
            onValueChange={(value) =>
              onDeliveryOptionChange(value as DeliveryOption)
            }
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="regular" id="regular" />
              <Label htmlFor="regular" className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span>Regular Delivery</span>
                  <span className="text-sm text-muted-foreground">
                    {subtotal >= 3000
                      ? "Free"
                      : subtotal >= 2000
                        ? "₹99"
                        : "₹199"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  3-5 business days
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="express" id="express" />
              <Label htmlFor="express" className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span>Express Delivery</span>
                  <span className="text-sm text-muted-foreground">
                    {subtotal >= 3000
                      ? "₹199"
                      : subtotal >= 2000
                        ? "₹299"
                        : "₹399"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  1-2 business days
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      ) : (
        // Non-logged in user - show login prompt
        <div className="border-2 border-yellow-400 rounded-lg p-4 bg-yellow-50 space-y-3">
          <div className="text-center">
            <h4 className="font-medium text-sm text-yellow-800 mb-2">
              Please Login to Continue
            </h4>
            <p className="text-xs text-yellow-700 mb-3">
              Sign in to select delivery options and proceed to checkout
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild className="flex-1">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" variant="outline" asChild className="flex-1">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      <Separator />

      {/* Price Breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal, "INR")}</span>
        </div>
        {session && (
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {shippingCost === 0
                ? "Free"
                : formatCurrency(shippingCost, "INR")}
            </span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>
            {session
              ? formatCurrency(totalPrice, "INR")
              : formatCurrency(subtotal, "INR")}
          </span>
        </div>
      </div>

      {/* Continue Shopping Button */}
      <Button variant="outline" className="w-full" asChild>
        <Link to="/products">Continue Shopping</Link>
      </Button>

      {/* Checkout Button */}
      <Button
        onClick={handleCheckout}
        disabled={isProcessing || !session}
        className="w-full"
      >
        {isProcessing
          ? "Processing..."
          : session
            ? "Proceed to Checkout"
            : "Sign In to Checkout"}
      </Button>
    </div>
  );
};
