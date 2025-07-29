import { Link } from "@tanstack/react-router";

interface AuthFooterProps {
  type: "login" | "signup";
}

export const AuthFooter = ({ type }: AuthFooterProps) => {
  if (type === "login") {
    return (
      <div className="mt-8 space-y-4">
        <p className="text-sm text-center">
          Don&apos;t have an account?
          <Link to="/signup" className="ml-1 underline text-muted-foreground">
            Create account
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <p className="text-sm text-center">
        Already have an account?
        <Link to="/login" className="ml-1 underline text-muted-foreground">
          Sign in
        </Link>
      </p>
    </div>
  );
};
