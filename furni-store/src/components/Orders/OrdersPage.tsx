import { useSession } from "@/lib/auth-client";
import { formatCurrency } from "@/lib/utils";
import NotAuthorizedPage from "@/pages/NotAuthorizedPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Truck } from "lucide-react";
import { useSearch } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { useOrdersLogic } from "./useOrdersLogic";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  orderId: string;
  amount: number;
  status: string;
  paymentMethod: string;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
  createdAt: string;
}

export default function OrdersPage() {
  const { data: session, isPending } = useSession();
  const { paymentHistory, isLoading, error } = useOrdersLogic();
  const search = useSearch({ from: "/orders" });

  if (
    search &&
    typeof search === "object" &&
    "success" in search &&
    search.success === "true" &&
    session
  ) {
    toast.success("Payment successful! Your order has been placed.");
  }

  if (isPending || isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <NotAuthorizedPage />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Orders</h1>
          <Card>
            <CardContent className="p-6">
              <p className="text-destructive">
                Error loading orders: {error.message}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const orders = paymentHistory?.payments || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Orders</h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center">
                No orders found. Start shopping to see your order history here!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order: Order) => (
              <Card key={order.orderId}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.orderId}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        {formatCurrency(order.amount, "INR")}
                      </p>
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "default"
                            : order.status === "pending"
                              ? "secondary"
                              : order.status === "failed"
                                ? "destructive"
                                : "outline"
                        }
                        className="mt-2"
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item: OrderItem, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between items-center text-sm"
                          >
                            <span>
                              {item.name} × {item.quantity}
                            </span>
                            <span>
                              {formatCurrency(
                                item.price * item.quantity,
                                "INR"
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.shippingAddress && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          Shipping Address
                        </h4>
                        <div className="text-sm text-muted-foreground">
                          <p>{order.shippingAddress.street}</p>
                          <p>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}{" "}
                            {order.shippingAddress.zipCode}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Payment Method
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {order.paymentMethod === "stripe"
                            ? "Credit Card"
                            : "Cash on Delivery"}
                        </Badge>
                        {order.paymentMethod === "stripe" && (
                          <span className="text-sm text-muted-foreground">
                            via Stripe
                          </span>
                        )}
                      </div>
                    </div>
                        
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center text-sm">
                        <span>Subtotal</span>
                        <span>
                          {formatCurrency(
                            order.items.reduce(
                              (sum: number, item: OrderItem) =>
                                sum + item.price * item.quantity,
                              0
                            ),
                            "INR"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-1">
                        <span>Total</span>
                        <span className="font-semibold">
                          {formatCurrency(order.amount, "INR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
