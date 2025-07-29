import { type ReactNode } from "react";

interface PrivacyLayoutProps {
  children: ReactNode;
}

export const PrivacyLayout = ({ children }: PrivacyLayoutProps) => {
  return (
    <>
      <div className="w-full py-6">
        <div className="container px-4 md:px-6">{children}</div>
      </div>
    </>
  );
};
