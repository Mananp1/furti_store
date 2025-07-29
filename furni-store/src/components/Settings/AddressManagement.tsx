import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserProfile } from "@/features/user/userSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Edit, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";

export default function AddressManagement() {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((state) => state.userState);
  const [addresses, setAddresses] = useState(profile?.addresses || []);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile?.addresses) {
      setAddresses(profile.addresses);
    }
  }, [profile]);

  const handleAddAddress = () => {
    toast.info(
      "Address management is available during checkout. Please add addresses when placing an order."
    );
  };

  const handleEditAddress = (_index: number) => {
    toast.info(
      "Address editing is available during checkout. Please edit addresses when placing an order."
    );
  };

  const handleDeleteAddress = (_index: number) => {
    toast.info(
      "Address deletion is available during checkout. Please manage addresses when placing an order."
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Addresses</h3>
        <Button onClick={handleAddAddress} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No addresses saved yet.</p>
              <p className="text-sm mt-1">
                Add your first address during checkout to save it for future
                orders.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {addresses.map((address, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <CardTitle className="text-base">
                      Address {index + 1}
                    </CardTitle>
                    {index === 0 && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAddress(index)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAddress(index)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm space-y-1">
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p>{address.country}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="text-xs text-muted-foreground mt-4">
        <p>
          💡 Tip: Addresses are automatically saved when you complete a
          purchase.
        </p>
        <p>You can manage them during the checkout process.</p>
      </div>
    </div>
  );
}
