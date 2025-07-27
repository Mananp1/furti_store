import Checkout from "@/pages/Checkout";
import NotAuthorizedPage from "@/pages/NotAuthorizedPage";
import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";

export const Route = createFileRoute("/checkout")({
  component: CheckoutRoute,
});

function CheckoutRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );
  }

  if (!session) {
    return <NotAuthorizedPage />;
  }

  return <Checkout />;
}
