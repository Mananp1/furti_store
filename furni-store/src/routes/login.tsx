import Login from "@/pages/Login";
import AlreadyLoggedIn from "@/pages/AlreadyLoggedIn";
import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({
  component: LoginRoute,
});

function LoginRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );
  }

  if (session) {
    return <AlreadyLoggedIn />;
  }

  return <Login />;
}
