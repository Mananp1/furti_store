import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";
import NotAuthorizedPage from "@/pages/NotAuthorizedPage";

export const Route = createFileRoute("/orders")({
  component: OrdersRoute,
});

function OrdersRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );
  }

  if (!session) {
    return <NotAuthorizedPage />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Orders</h1>
        <div className="bg-card rounded-lg border p-6">
          <p className="text-muted-foreground">
            Orders page coming soon! This will show your order history and
            tracking information.
          </p>
        </div>
      </div>
    </div>
  );
}
