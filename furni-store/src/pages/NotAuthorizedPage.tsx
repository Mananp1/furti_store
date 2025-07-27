import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Lock, LogIn } from "lucide-react";

export default function NotAuthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to access this page. Please log in to
            continue.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link to="/" className="flex items-center justify-center">
              Back to Home
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
