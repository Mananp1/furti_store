
import {
  CartLayout,
  CartItems,
  CartSummary,
  useCartLogic,
} from "@/components/Cart";

export function CartSheet() {
  const {
    cartItems,
    totalItems,
    subtotal,
    shippingCost,
    totalPrice,
    deliveryOption,
    session,
    handleRemoveItem,
    handleUpdateQuantity,
    handleDeliveryOptionChange,
    handleCheckout,
  } = useCartLogic();

  return (
    <CartLayout totalItems={totalItems}>
      <CartItems
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
      <CartSummary
        subtotal={subtotal}
        shippingCost={shippingCost}
        totalPrice={totalPrice}
        deliveryOption={deliveryOption}
        onDeliveryOptionChange={handleDeliveryOptionChange}
        onCheckout={handleCheckout}
        session={session}
      />
    </CartLayout>
  );
}
