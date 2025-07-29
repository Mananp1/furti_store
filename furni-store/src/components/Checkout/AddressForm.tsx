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
import { INDIAN_STATES } from "@/lib/types/products";

interface AddressFormData {
  street: string;
  city: string;
  state: (typeof INDIAN_STATES)[number];
  zipCode: string;
  country: "India";
}

interface AddressFormProps {
  addressForm: AddressFormData;
  cities: string[];
  onAddressInputChange: (field: keyof AddressFormData, value: string) => void;
  onSaveAddress: (e: React.FormEvent) => void;
  onCancelEdit: () => void;
  isLoading?: boolean;
}

export const AddressForm = ({
  addressForm,
  cities,
  onAddressInputChange,
  onSaveAddress,
  onCancelEdit,
  isLoading = false,
}: AddressFormProps) => {
  return (
    <form onSubmit={onSaveAddress} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State */}
        <div className="md:col-span-2">
          <Label htmlFor="state">State *</Label>
          <Select
            value={addressForm.state}
            onValueChange={(value) => onAddressInputChange("state", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your state" />
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

        {/* City */}
        <div className="md:col-span-2">
          <Label htmlFor="city">City *</Label>
          <Select
            value={addressForm.city}
            onValueChange={(value) => onAddressInputChange("city", value)}
            disabled={!addressForm.state}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your city" />
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

        {/* Street Address */}
        <div className="md:col-span-2">
          <Label htmlFor="street">Street Address *</Label>
          <Input
            id="street"
            value={addressForm.street}
            onChange={(e) => onAddressInputChange("street", e.target.value)}
            placeholder="Enter your street address"
            required
          />
        </div>

        {/* ZIP Code */}
        <div>
          <Label htmlFor="zipCode">ZIP Code *</Label>
          <Input
            id="zipCode"
            value={addressForm.zipCode}
            onChange={(e) => onAddressInputChange("zipCode", e.target.value)}
            placeholder="Enter ZIP code"
            pattern="[0-9]{6}"
            title="Please enter a valid 6-digit ZIP code"
            required
          />
        </div>

        {/* Country */}
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={addressForm.country}
            disabled
            className="bg-gray-50"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Address"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancelEdit}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
