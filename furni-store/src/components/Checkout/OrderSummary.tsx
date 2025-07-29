import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Trash } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { DeliveryOption } from "@/components/Cart/useCartLogic";

interface OrderSummaryProps {
  cartItems: any[];
  subtotal: number;
  shippingCost: number;
  totalPrice: number;
  deliveryOption: DeliveryOption;
  onDeliveryOptionChange: (option: DeliveryOption) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onPlaceOrder: () => void;
  isProcessing: boolean;
  isProfileIncomplete: boolean;
}

export const OrderSummary = ({
  cartItems,
  subtotal,
  shippingCost,
  totalPrice,
  deliveryOption,
  onDeliveryOptionChange,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  isProcessing,
  isProfileIncomplete,
}: OrderSummaryProps) => {
  if (cartItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item._id} className="flex items-center gap-3">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={item.images?.[0] || "/placeholder-image.jpg"}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-md"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{item.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(item.price, "INR")} × {item.quantity}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                  disabled={isProcessing}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                  disabled={isProcessing}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveItem(item._id)}
                  disabled={isProcessing}
                  className="ml-2"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Delivery Options */}
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
              <RadioGroupItem value="regular" id="checkout-regular" />
              <Label
                htmlFor="checkout-regular"
                className="flex-1 cursor-pointer"
              >
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
              <RadioGroupItem value="express" id="checkout-express" />
              <Label
                htmlFor="checkout-express"
                className="flex-1 cursor-pointer"
              >
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

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal, "INR")}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {shippingCost === 0
                ? "Free"
                : formatCurrency(shippingCost, "INR")}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(totalPrice, "INR")}</span>
          </div>
        </div>

        {/* Continue Shopping Button */}
        <Button variant="outline" className="w-full" asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>

        {/* Place Order Button */}
        <Button
          onClick={onPlaceOrder}
          disabled={isProcessing || isProfileIncomplete}
          className="w-full"
        >
          {isProcessing
            ? "Processing..."
            : isProfileIncomplete
              ? "Complete Profile to Continue"
              : "Complete Order"}
        </Button>
      </CardContent>
    </Card>
  );
};
