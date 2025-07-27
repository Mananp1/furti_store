import Register from "@/pages/Signup";
import AlreadyLoggedIn from "@/pages/AlreadyLoggedIn";
import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";

export const Route = createFileRoute("/signup")({
  component: SignupRoute,
});

function SignupRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );
  }

  if (session) {
    return <AlreadyLoggedIn />;
  }

  return <Register />;
}
