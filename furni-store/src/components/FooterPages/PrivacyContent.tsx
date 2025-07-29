import { type ReactNode } from "react";

interface PrivacyContentProps {
  children: ReactNode;
}

export const PrivacyContent = ({ children }: PrivacyContentProps) => {
  return (
    <div className="prose prose-gray max-w-none dark:prose-invert">
      {children}
    </div>
  );
};
