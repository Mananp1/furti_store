import { type ReactNode } from "react";

interface FooterContentProps {
  children: ReactNode;
}

export const FooterContent = ({ children }: FooterContentProps) => {
  return (
    <div className="h-full flex flex-col md:flex-row items-center md:items-start justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 gap-8 md:gap-0">
      {children}
    </div>
  );
};
