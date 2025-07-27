import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./Logo";
import { NavMenu } from "./NavMenu";
import { CartSheet } from "@/components/Cart/CartSheet";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="px-4">
          <Logo />
          <NavMenu orientation="vertical" className="mt-12" />
        </div>
        {/* Cart */}
        <div className="flex gap-3 justify-center mt-8 mb-4">
          <CartSheet />
        </div>
      </SheetContent>
    </Sheet>
  );
};
