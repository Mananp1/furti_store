import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Banknote } from "lucide-react";

interface CheckoutFormProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  children: React.ReactNode;
}

export const CheckoutForm = ({
  paymentMethod,
  setPaymentMethod,
  children,
}: CheckoutFormProps) => {
  return (
    <div className="space-y-6">
      {/* Address Section */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>

      {/* Payment Method Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stripe" id="stripe" />
              <Label
                htmlFor="stripe"
                className="flex items-center gap-2 cursor-pointer"
              >
                <CreditCard className="h-4 w-4" />
                Credit/Debit Card (Stripe)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cod" id="cod" />
              <Label
                htmlFor="cod"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Banknote className="h-4 w-4" />
                Cash on Delivery
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
};
