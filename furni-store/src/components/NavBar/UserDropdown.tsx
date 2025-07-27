import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { useUserProfile } from "@/lib/hooks/useUserProfile";

import {
  ChevronDown,
  User,
  Settings,
  LogOut,
  Heart,
  ShoppingCart,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, isPending } = useSession();

  const { profile } = useUserProfile();

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    try {
      // Don't clear cart/wishlist on logout - let them persist
      await signOut();
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Failed to log out");
    }
  };

  // Get display name
  const getDisplayName = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    if (profile?.firstName) {
      return profile.firstName;
    }
    // Fallback to Better Auth user's name if set
    if (session.user.name && session.user.name !== session.user.email) {
      return session.user.name;
    }
    // Fallback to email if no name is set
    return session.user.email?.split("@")[0] || "User";
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 h-auto p-2 hover:bg-accent"
        >
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-sm font-medium leading-none">
              {getDisplayName()}
            </span>
            <span className="text-xs text-muted-foreground leading-none">
              {session.user.email}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {getDisplayName()}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/wishlist" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Wishlist
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/checkout" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Checkout
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/orders" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Orders
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
