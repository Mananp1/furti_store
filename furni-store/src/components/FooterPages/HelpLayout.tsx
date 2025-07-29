import { type ReactNode } from "react";

interface HelpLayoutProps {
  children: ReactNode;
}

export const HelpLayout = ({ children }: HelpLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center mt-6">
      <div className="max-w-sm w-full flex flex-col items-center border rounded-lg p-6">
        {children}
      </div>
    </div>
  );
};
