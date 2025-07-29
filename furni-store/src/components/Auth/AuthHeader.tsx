import { Logo } from "@/components/NavBar/Logo";

interface AuthHeaderProps {
  title: string;
}

export const AuthHeader = ({ title }: AuthHeaderProps) => {
  return (
    <>
      <Logo />
      <p className="mt-6 text-xl font-bold tracking-tight">{title}</p>
    </>
  );
};
