import WishlistPage from "@/pages/Wishlist";
import NotAuthorizedPage from "@/pages/NotAuthorizedPage";
import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";

export const Route = createFileRoute("/wishlist")({
  component: WishlistRoute,
});

function WishlistRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );
  }

  if (!session) {
    return <NotAuthorizedPage />;
  }

  return <WishlistPage />;
}
