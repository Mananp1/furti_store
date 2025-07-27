import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addAddress,
  updateAddress,
  fetchUserProfile,
} from "@/features/user/userSlice";
import { INDIAN_STATES } from "@/lib/types/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { Edit, MapPin, Star } from "lucide-react";

interface AddressFormData {
  street: string;
  city: string;
  state: (typeof INDIAN_STATES)[number];
  zipCode: string;
  country: "India";
}

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

const AddressManagement = () => {
  const dispatch = useAppDispatch();
  const { profile, addressLoading, error } = useAppSelector(
    (state) => state.userState
  );
  const [isEditing, setIsEditing] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [formData, setFormData] = useState<AddressFormData>({
    street: "",
    city: "",
    state: "" as (typeof INDIAN_STATES)[number],
    zipCode: "",
    country: "India",
  });

  // Fetch user profile on component mount
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Update cities when state changes
  useEffect(() => {
    if (
      formData.state &&
      STATE_CITIES[formData.state as keyof typeof STATE_CITIES]
    ) {
      setCities(STATE_CITIES[formData.state as keyof typeof STATE_CITIES]);
    } else {
      setCities([]);
    }
  }, [formData.state]);

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      street: "",
      city: "",
      state: "" as (typeof INDIAN_STATES)[number],
      zipCode: "",
      country: "India",
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode
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
            address: formData,
          })
        ).unwrap();
        toast.success("Address updated successfully");
      } else {
        // Add new address (will be default)
        await dispatch(addAddress(formData)).unwrap();
        toast.success("Address added successfully");
      }
      resetForm();
    } catch (error) {
      toast.error(error as string);
    }
  };

  const handleEdit = () => {
    const existingAddress = profile?.addresses?.[0];
    if (existingAddress) {
      setFormData({
        street: existingAddress.street,
        city: existingAddress.city,
        state: existingAddress.state,
        zipCode: existingAddress.zipCode,
        country: existingAddress.country,
      });
      setIsEditing(true);
    }
  };

  const existingAddress = profile?.addresses?.[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Default Address</h3>
          <p className="text-sm text-muted-foreground">
            Manage your default delivery address
          </p>
        </div>
      </div>

      {/* Address Display Card */}
      {existingAddress && !isEditing && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
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
                onClick={handleEdit}
                disabled={addressLoading}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Address Form */}
      {(!existingAddress || isEditing) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {existingAddress ? "Edit Address" : "Add Default Address"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) =>
                      handleInputChange("street", e.target.value)
                    }
                    placeholder="Enter your street address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleInputChange("state", value)}
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
                    value={formData.city}
                    onValueChange={(value) => handleInputChange("city", value)}
                    disabled={!formData.state}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          formData.state
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
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
                    placeholder="Enter 6-digit PIN code"
                    pattern="[1-9][0-9]{5}"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={addressLoading}>
                  {existingAddress ? "Update Address" : "Add Address"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={addressLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default AddressManagement;
