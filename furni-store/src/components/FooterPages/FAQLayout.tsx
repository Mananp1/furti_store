import { type ReactNode } from "react";

interface FAQLayoutProps {
  children: ReactNode;
}

export const FAQLayout = ({ children }: FAQLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-xl">{children}</div>
    </div>
  );
};
