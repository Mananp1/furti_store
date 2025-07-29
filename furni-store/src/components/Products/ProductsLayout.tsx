import { type ReactNode } from "react";

interface ProductsLayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
}

export const ProductsLayout = ({ sidebar, main }: ProductsLayoutProps) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r bg-white">
        {sidebar}
      </aside>
      <main className="flex-1 p-4">{main}</main>
    </div>
  );
};
