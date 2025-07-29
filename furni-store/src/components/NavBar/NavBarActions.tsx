import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

interface NavBarActionsProps {
  isPending: boolean;
  session: any;
  size?: "default" | "sm";
  className?: string;
}

export const NavBarActions = ({
  isPending,
  session,
  size = "default",
  className = "",
}: NavBarActionsProps) => {
  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  if (session) {
    return null; // UserDropdown will be rendered separately
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button
        variant="outline"
        size={size}
        className={`${size === "default" ? "hidden sm:inline-flex" : ""} cursor-pointer`}
      >
        <Link to="/login">Sign In</Link>
      </Button>
      <Button size={size} className="cursor-pointer">
        <Link to="/signup">Sign Up</Link>
      </Button>
    </div>
  );
};
