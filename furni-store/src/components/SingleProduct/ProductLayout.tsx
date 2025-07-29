import { type ReactNode } from "react";

interface ProductLayoutProps {
  children: ReactNode;
}

export const ProductLayout = ({ children }: ProductLayoutProps) => {
  return <>{children}</>;
};
