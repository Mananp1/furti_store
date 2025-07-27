import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingBagIcon, Plus, Minus, Truck, Trash } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";

export function CartSheet() {
  const { data: session } = useSession();
  const {
    items: cartItems,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
  } = useCart();
  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();

  const [shippingOption, setShippingOption] = useState<string>("regular");

  // Calculate shipping cost based on subtotal
  const getShippingCost = (option: string, total: number) => {
    if (option === "regular") {
      if (total >= 3000) return 19.99;
      if (total >= 2000) return 29.99;
      return 39.99;
    } else {
      // express
      if (total >= 3000) return 29.99;
      if (total >= 2000) return 39.99;
      return 49.99;
    }
  };

  const shippingCost = getShippingCost(shippingOption, subtotal);
  const totalPrice = subtotal + shippingCost;

  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
  };

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!session) {
      toast.error("Please sign in to proceed to checkout");
      return;
    }
    // Proceed to checkout - this will be handled by the Link component
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="cursor-pointer relative"
        >
          <ShoppingBagIcon className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[350px] sm:w-[400px] md:w-[450px] flex flex-col p-0">
        <SheetHeader className="px-4 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBagIcon className="h-5 w-5" />
            Shopping Cart ({totalItems} items)
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center py-8">
              <ShoppingBagIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">
                Add some items to your cart to get started
              </p>
              <Button asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items - Scrollable Section */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 p-3 border rounded-lg"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item.category}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0"
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0"
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-black hover:text-black hover:bg-gray-100"
                            onClick={() => handleRemoveItem(item._id)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary - Fixed Bottom Section */}
            <div className="border-t bg-background">
              <div className="p-4 space-y-4">
                {/* Authentication Notice */}
                {!session && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Sign in required:</strong> You must be signed in
                      to proceed to checkout.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/login">Sign In</Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/signup">Sign Up</Link>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Shipping Options */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Shipping Method
                  </label>
                  <Select
                    value={shippingOption}
                    onValueChange={setShippingOption}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select shipping method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">
                        Regular Delivery - $
                        {getShippingCost("regular", subtotal).toFixed(2)}
                      </SelectItem>
                      <SelectItem value="express">
                        Express Delivery - $
                        {getShippingCost("express", subtotal).toFixed(2)}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Subtotal
                    </span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Shipping
                    </span>
                    <span className="text-sm">${shippingCost.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={!session}
                    asChild={session}
                  >
                    {session ? (
                      <Link to="/checkout" className="w-full">
                        Proceed to Checkout
                      </Link>
                    ) : (
                      <span>Sign In to Checkout</span>
                    )}
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
