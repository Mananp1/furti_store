import { Logo } from "./Logo";
import { NavMenu } from "./NavMenu";
import { UserDropdown } from "./UserDropdown";
import { NavBarActions } from "./NavBarActions";
import { CartSheet } from "@/components/Cart/CartSheet";
import { NavigationSheet } from "./NavigationSheet";

interface NavBarMainProps {
  isPending: boolean;
  session: any;
}

export const NavBarMain = ({ isPending, session }: NavBarMainProps) => {
  return (
    <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-8">
        <Logo />
        <NavMenu className="hidden md:block" />
      </div>

      {/* Desktop actions only (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-3">
        <NavBarActions isPending={isPending} session={session} size="default" />
        {session && <UserDropdown />}
        <CartSheet />
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex items-center gap-2">
        <NavBarActions isPending={isPending} session={session} size="sm" />
        {session && <UserDropdown />}
        <NavigationSheet />
      </div>
    </div>
  );
};
