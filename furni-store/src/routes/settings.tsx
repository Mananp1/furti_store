import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";
import NotAuthorizedPage from "@/pages/NotAuthorizedPage";
import Settings from "@/pages/Settings";

export const Route = createFileRoute("/settings")({
  component: SettingsRoute,
});

function SettingsRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );
  }

  if (!session) {
    return <NotAuthorizedPage />;
  }

  return <Settings />;
}
 