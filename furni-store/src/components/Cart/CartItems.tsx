import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CartItemsProps {
  cartItems: any[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  isProcessing?: boolean;
}

export const CartItems = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  isProcessing = false,
}: CartItemsProps) => {
  if (cartItems.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-4">
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center gap-3">
      
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
    </div>
  );
};
