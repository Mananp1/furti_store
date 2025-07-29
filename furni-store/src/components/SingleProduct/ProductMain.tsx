import { type ReactNode } from "react";

interface ProductMainProps {
  children: ReactNode;
}

export const ProductMain = ({ children }: ProductMainProps) => {
  return (
    <main className="max-w-5xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      {children}
    </main>
  );
};
