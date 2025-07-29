import { type ReactNode } from "react";

interface FooterLayoutProps {
  children: ReactNode;
}

export const FooterLayout = ({ children }: FooterLayoutProps) => {
  return (
    <div className="min-w-screen flex flex-col py-8">
      <div className="grow bg-muted" />
      <footer>
        <div className="max-w-screen-xl mx-auto">{children}</div>
      </footer>
    </div>
  );
};
