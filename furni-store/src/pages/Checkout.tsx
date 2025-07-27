import { useCart } from "@/lib/hooks/useCart";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchUserProfile,
  addAddress,
  updateAddress,
} from "@/features/user/userSlice";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Truck, Plus, Minus, Trash, MapPin, Edit, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { INDIAN_STATES } from "@/lib/types/products";
import { toast } from "react-toastify";

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

const Checkout = () => {
  const dispatch = useAppDispatch();
  const { profile, addressLoading } = useAppSelector(
    (state) => state.userState
  );
  const {
    items: cartItems,
    getTotalPrice,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const [shippingOption, setShippingOption] = useState<string>("regular");
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

  // Fetch user profile on component mount
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

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
    const existingAddress = profile?.addresses?.[0];
    if (existingAddress) {
      setAddressForm({
        street: existingAddress.street,
        city: existingAddress.city,
        state: existingAddress.state,
        zipCode: existingAddress.zipCode,
        country: existingAddress.country,
      });
    }
    setIsEditingAddress(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !addressForm.street ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.zipCode
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const existingAddress = profile?.addresses?.[0];

      if (existingAddress) {
        // Update existing address
        await dispatch(
          updateAddress({
            addressId: existingAddress._id,
            address: addressForm,
          })
        ).unwrap();
        toast.success("Address updated successfully");
      } else {
        // Add new address
        await dispatch(addAddress(addressForm)).unwrap();
        toast.success("Address added successfully");
      }
      setIsEditingAddress(false);
    } catch (error) {
      toast.error(error as string);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingAddress(false);
    // Reset form to current address
    const existingAddress = profile?.addresses?.[0];
    if (existingAddress) {
      setAddressForm({
        street: existingAddress.street,
        city: existingAddress.city,
        state: existingAddress.state,
        zipCode: existingAddress.zipCode,
        country: existingAddress.country,
      });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const existingAddress = profile?.addresses?.[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {existingAddress && !isEditingAddress ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                            <Star className="h-3 w-3 fill-current" />
                            Default Address
                          </span>
                        </div>
                        <p className="font-medium">{existingAddress.street}</p>
                        <p className="text-sm text-muted-foreground">
                          {existingAddress.city}, {existingAddress.state} -{" "}
                          {existingAddress.zipCode}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {existingAddress.country}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditAddress}
                        disabled={addressLoading}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="street">Street Address *</Label>
                        <Input
                          id="street"
                          value={addressForm.street}
                          onChange={(e) =>
                            handleAddressInputChange("street", e.target.value)
                          }
                          placeholder="Enter your street address"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Select
                          value={addressForm.state}
                          onValueChange={(value) =>
                            handleAddressInputChange("state", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                          <SelectContent>
                            {INDIAN_STATES.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Select
                          value={addressForm.city}
                          onValueChange={(value) =>
                            handleAddressInputChange("city", value)
                          }
                          disabled={!addressForm.state}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                addressForm.state
                                  ? "Select a city"
                                  : "Select state first"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode">PIN Code *</Label>
                        <Input
                          id="zipCode"
                          value={addressForm.zipCode}
                          onChange={(e) =>
                            handleAddressInputChange("zipCode", e.target.value)
                          }
                          placeholder="Enter 6-digit PIN code"
                          pattern="[1-9][0-9]{5}"
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button type="submit" disabled={addressLoading}>
                        {existingAddress ? "Update Address" : "Save Address"}
                      </Button>
                      {existingAddress && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={addressLoading}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Payment form will be implemented here...
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                                handleUpdateQuantity(
                                  item._id,
                                  item.quantity - 1
                                )
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
                                handleUpdateQuantity(
                                  item._id,
                                  item.quantity + 1
                                )
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

                  {/* Shipping Options */}
                  <div className="space-y-2 pt-4">
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

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${shippingCost.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button
                className="w-full"
                size="lg"
                disabled={!existingAddress || addressLoading}
              >
                {!existingAddress
                  ? "Add Address to Continue"
                  : "Complete Order (Coming Soon)"}
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
