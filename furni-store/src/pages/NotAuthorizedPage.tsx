import {
  ErrorLayout,
  ErrorIcon,
  ErrorContent,
  ErrorActions,
} from "@/components/Error";
import { LogIn } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function NotAuthorizedPage() {
  const actions = [
    {
      label: "Sign In",
      href: "/login",
      variant: "default" as const,
      icon: <LogIn className="w-4 h-4" />,
    },
    {
      label: "Back to Home",
      href: "/",
      variant: "outline" as const,
    },
  ];

  return (
    <ErrorLayout variant="centered">
      <div className="text-center max-w-md mx-auto px-4">
        <ErrorIcon type="unauthorized" />
        <ErrorContent
          title="Access Denied"
          description="You need to be signed in to access this page. Please log in to continue."
        >
          <ErrorActions actions={actions} />
          <p className="mt-8 text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up here
            </Link>
          </p>
        </ErrorContent>
      </div>
    </ErrorLayout>
  );
}
