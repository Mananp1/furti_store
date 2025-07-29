import { Link } from "@tanstack/react-router";
import { Logo } from "../NavBar/Logo";

interface FooterLink {
  title: string;
  to: string;
}

interface FooterLogoProps {
  links: FooterLink[];
}

export const FooterLogo = ({ links }: FooterLogoProps) => {
  return (
    <div className="w-full md:w-auto flex flex-col items-center md:items-start">
      {/* Logo */}
      <Logo />

      <ul className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4">
        {links.map(({ title, to }) => (
          <li key={title}>
            <Link
              to={to}
              className="text-muted-foreground hover:text-foreground"
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
