import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Edit } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface AddressSectionProps {
  profile: any;
  isEditingAddress: boolean;
  onEditAddress: () => void;
  children?: React.ReactNode;
}

export const AddressSection = ({
  profile,
  isEditingAddress,
  onEditAddress,
  children,
}: AddressSectionProps) => {
  const isProfileIncomplete = !profile?.firstName || !profile?.lastName;

  const defaultAddress = profile?.addresses?.[0];

  if (isProfileIncomplete) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              Complete Your Profile
            </h3>
            <p className="text-orange-700 mb-4">
              Please complete your profile information in Settings first.
            </p>
            <Link to="/settings">
              <Button
                variant="outline"
                className="border-orange-300 text-orange-700"
              >
                Go to Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isEditingAddress) {
    return <div>{children}</div>;
  }

  return (
    <div className="space-y-4">
      {defaultAddress ? (
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">
                {defaultAddress.street}, {defaultAddress.city}
              </p>
              <p className="text-sm text-muted-foreground">
                {defaultAddress.state} {defaultAddress.zipCode}
              </p>
              <p className="text-sm text-muted-foreground">
                {defaultAddress.country}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onEditAddress}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      ) : (
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Address Added</h3>
          <p className="text-muted-foreground mb-4">
            Please add a shipping address to continue.
          </p>
          <Button onClick={onEditAddress}>Add Address</Button>
        </div>
      )}
    </div>
  );
};
