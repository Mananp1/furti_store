import { type ReactNode } from "react";

interface ErrorContentProps {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}

export const ErrorContent = ({
  title,
  description,
  children,
  className = "",
}: ErrorContentProps) => {
  return (
    <div className={`text-center space-y-6 ${className}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{description}</p>
      </div>
      {children}
    </div>
  );
};
