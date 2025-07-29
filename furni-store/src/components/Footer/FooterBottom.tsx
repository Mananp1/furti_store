import { Separator } from "@/components/ui/separator";
import { type ReactNode } from "react";

interface FooterBottomProps {
  children: ReactNode;
}

export const FooterBottom = ({ children }: FooterBottomProps) => {
  return (
    <>
      <Separator className="my-4" />
      <div className="h-full flex flex-col sm:flex-row items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 gap-2 sm:gap-0">
        {children}
      </div>
    </>
  );
};
