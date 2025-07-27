import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { signOut } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function AlreadyLoggedIn() {
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Already Logged In
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            You are already logged in. Would you like to log out or continue to
            the home page?
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link to="/">Continue to Home</Link>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
