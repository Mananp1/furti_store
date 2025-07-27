import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { NavMenu } from "./NavMenu";
import { Link } from "@tanstack/react-router";
import { NavigationSheet } from "./NavigationSheet";
import { CartSheet } from "@/components/Cart/CartSheet";
import { UserDropdown } from "./UserDropdown";

import { useSession } from "@/lib/auth-client";

const Navbar = () => {
  const { data: session, isPending } = useSession();

  return (
    <div className="min-w-screen bg-muted">
      <nav className="h-16 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Logo />
            <NavMenu className="hidden md:block" />
          </div>

          {/* Desktop actions only (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-3">
            {isPending ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : session ? (
              <UserDropdown />
            ) : (
              <>
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex cursor-pointer"
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button className="cursor-pointer">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}

            <CartSheet />
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center gap-2">
            {isPending ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : session ? (
              <UserDropdown />
            ) : (
              <>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" className="cursor-pointer">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
            <NavigationSheet />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
