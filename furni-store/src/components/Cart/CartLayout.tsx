import { type ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBagIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CartLayoutProps {
  children: ReactNode;
  totalItems: number;
  trigger?: ReactNode;
}

export const CartLayout = ({
  children,
  totalItems,
  trigger,
}: CartLayoutProps) => {
  const defaultTrigger = (
    <Button size="icon" variant="outline" className="cursor-pointer relative">
      <ShoppingBagIcon className="h-5 w-5" />
      {totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {totalItems}
        </Badge>
      )}
    </Button>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>
      <SheetContent className="w-[350px] sm:w-[400px] md:w-[450px] flex flex-col p-0">
        <SheetHeader className="px-4 py-4 border-b flex-shrink-0">
          <SheetTitle>Shopping Cart ({totalItems} items)</SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex flex-col min-h-0">{children}</div>
      </SheetContent>
    </Sheet>
  );
};
