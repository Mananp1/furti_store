import { type ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  imageSrc: string;
  imageAlt: string;
}

export const AuthLayout = ({
  children,
  imageSrc,
  imageAlt,
}: AuthLayoutProps) => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full h-full grid lg:grid-cols-2 p-4">
        <div className="max-w-xs m-auto w-full flex flex-col items-center">
          {children}
        </div>
        <div className="bg-muted hidden lg:block rounded-lg overflow-hidden mr-6 my-2">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
