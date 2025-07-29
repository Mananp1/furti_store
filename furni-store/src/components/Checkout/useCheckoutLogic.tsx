import { useState, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useCart } from "@/lib/hooks/useCart";
import { usePayment } from "@/lib/hooks/usePayment";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { addAddress, updateAddress } from "@/features/user/userSlice";
import { INDIAN_STATES } from "@/lib/types/products";
import { toast } from "react-toastify";
import type { DeliveryOption } from "@/components/Cart/useCartLogic";

// Top 5 cities for each of the top 7 states
const STATE_CITIES = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Salem",
    "Tiruchirappalli",
  ],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  Karnataka: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
  Telangana: ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam"],
};

interface AddressFormData {
  street: string;
  city: string;
  state: (typeof INDIAN_STATES)[number];
  zipCode: string;
  country: "India";
}

export const useCheckoutLogic = () => {
  const dispatch = useAppDispatch();
  const { profile, isLoading: addressLoading } = useUserProfile();
  const {
    items: cartItems,
    getTotalPrice,
    updateQuantity,
    removeFromCart,
  } = useCart();
  // Add type annotation for cartItems
  type CartItem = {
    _id: string;
    title: string;
    price: number;
    quantity: number;
    images?: string[];
  };
  const typedCartItems = cartItems as CartItem[];
  const { isProcessing, processPayment } = usePayment();

  const [paymentMethod, setPaymentMethod] = useState<string>("stripe");
  const [deliveryOption, setDeliveryOption] =
    useState<DeliveryOption>("regular");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [addressForm, setAddressForm] = useState<AddressFormData>({
    street: "",
    city: "",
    state: "" as (typeof INDIAN_STATES)[number],
    zipCode: "",
    country: "India",
  });

  const subtotal = getTotalPrice();

  // Calculate shipping cost based on subtotal (INR)
  const getShippingCost = (option: DeliveryOption, total: number) => {
    if (option === "regular") {
      if (total >= 3000) return 0; // Free shipping over ₹3000
      if (total >= 2000) return 99; // ₹99 for orders ₹2000-2999
      return 199; // ₹199 for orders under ₹2000
    } else {
      // express delivery
      if (total >= 3000) return 199; // ₹199 for express over ₹3000
      if (total >= 2000) return 299; // ₹299 for express ₹2000-2999
      return 399; // ₹399 for express under ₹2000
    }
  };

  const shippingCost = getShippingCost(deliveryOption, subtotal);
  const totalPrice = subtotal + shippingCost;

  // Update cities when state changes
  useEffect(() => {
    if (
      addressForm.state &&
      STATE_CITIES[addressForm.state as keyof typeof STATE_CITIES]
    ) {
      setCities(STATE_CITIES[addressForm.state as keyof typeof STATE_CITIES]);
    } else {
      setCities([]);
    }
  }, [addressForm.state]);

  // Initialize address form with existing address
  useEffect(() => {
    const defaultAddress = profile?.addresses?.[0];
    if (defaultAddress && !isEditingAddress) {
      setAddressForm({
        street: defaultAddress.street || "",
        city: defaultAddress.city || "",
        state: defaultAddress.state || ("" as (typeof INDIAN_STATES)[number]),
        zipCode: defaultAddress.zipCode || "",
        country: "India",
      });
    }
  }, [profile?.addresses, isEditingAddress]);

  const handleAddressInputChange = (
    field: keyof AddressFormData,
    value: string
  ) => {
    setAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditAddress = () => {
    setIsEditingAddress(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (profile?.addresses?.[0]) {
        const addressId = profile.addresses[0]._id;
        await dispatch(
          updateAddress({ addressId, address: addressForm })
        ).unwrap();
        toast.success("Address updated successfully");
      } else {
        await dispatch(addAddress(addressForm)).unwrap();
        toast.success("Address added successfully");
      }
      setIsEditingAddress(false);
    } catch (error: unknown) {
      // Show real backend error message if available
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Failed to save address";
      toast.error(message);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingAddress(false);
    // Reset form to current address
    const defaultAddress = profile?.addresses?.[0];
    if (defaultAddress) {
      setAddressForm({
        street: defaultAddress.street || "",
        city: defaultAddress.city || "",
        state: defaultAddress.state || ("" as (typeof INDIAN_STATES)[number]),
        zipCode: defaultAddress.zipCode || "",
        country: "India",
      });
    }
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

  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
  };

  const handleDeliveryOptionChange = (option: DeliveryOption) => {
    setDeliveryOption(option);
  };

  const handlePlaceOrder = async () => {
    const defaultAddress = profile?.addresses?.[0];
    if (!defaultAddress) {
      toast.error("Please add a shipping address");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    console.log("🛒 Cart items:", cartItems);
    console.log("📍 Default address:", defaultAddress);
    console.log("👤 Profile:", profile);
    console.log("💳 Payment method:", paymentMethod);
    console.log("🚚 Delivery option:", deliveryOption);

    try {
      // Transform cart items to match payment API expected format
      const transformedItems = typedCartItems.map((item) => ({
        productId: item._id,
        name: item.title, // Transform title to name
        price: item.price,
        quantity: item.quantity,
        image: item.images?.[0] || "", // Transform images array to single image
      }));

      console.log("🔄 Transformed items:", transformedItems);

      const paymentData = {
        items: transformedItems,
        shippingAddress: defaultAddress,
        customerDetails: {
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone || "",
        },
        deliveryOption, // Include delivery option
      };

      console.log("💰 Payment data:", paymentData);

      await processPayment(paymentMethod, paymentData);
    } catch (error: unknown) {
      // Show real backend error message if available
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Failed to process payment";
      toast.error(message);
    }
  };

  const isProfileIncomplete = !profile?.firstName || !profile?.lastName;

  return {
    // State
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

    // Actions
    setPaymentMethod,
    handleAddressInputChange,
    handleEditAddress,
    handleSaveAddress,
    handleCancelEdit,
    handleUpdateQuantity,
    handleRemoveItem,
    handleDeliveryOptionChange,
    handlePlaceOrder,
  };
};
