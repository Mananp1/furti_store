import {
  CheckoutLayout,
  CheckoutMain,
  CheckoutForm,
  AddressSection,
  AddressForm,
  OrderSummary,
  useCheckoutLogic,
} from "@/components/Checkout";

const Checkout = () => {
  const {
    profile,
    cartItems,
    subtotal,
    shippingCost,
    totalPrice,
    paymentMethod,
    deliveryOption,
    isEditingAddress,
    cities,
    addressForm,
    isProcessing,
    addressLoading,
    isProfileIncomplete,

    setPaymentMethod,
    handleAddressInputChange,
    handleEditAddress,
    handleSaveAddress,
    handleCancelEdit,
    handleUpdateQuantity,
    handleRemoveItem,
    handleDeliveryOptionChange,
    handlePlaceOrder,
  } = useCheckoutLogic();

  return (
    <CheckoutLayout>
      <CheckoutMain
        leftColumn={
          <CheckoutForm
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          >
            <AddressSection
              profile={profile}
              isEditingAddress={isEditingAddress}
              onEditAddress={handleEditAddress}
            >
              <AddressForm
                addressForm={addressForm}
                cities={cities}
                onAddressInputChange={handleAddressInputChange}
                onSaveAddress={handleSaveAddress}
                onCancelEdit={handleCancelEdit}
                isLoading={addressLoading}
              />
            </AddressSection>
          </CheckoutForm>
        }
        rightColumn={
          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            shippingCost={shippingCost}
            totalPrice={totalPrice}
            deliveryOption={deliveryOption}
            onDeliveryOptionChange={handleDeliveryOptionChange}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onPlaceOrder={handlePlaceOrder}
            isProcessing={isProcessing}
            isProfileIncomplete={isProfileIncomplete}
          />
        }
      />
    </CheckoutLayout>
  );
};

export default Checkout;
