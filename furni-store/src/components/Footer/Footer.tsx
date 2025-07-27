import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { Logo } from "../NavBar/Logo";

const footerLinks = [
  {
    title: "Features",
    to: "#",
  },
  {
    title: "FAQ",
    to: "/faq",
  },
  {
    title: "Help",
    to: "/help",
  },
  {
    title: "Privacy",
    to: "/privacy",
  },
];

const Footer = () => {
  return (
    <div className="min-w-screen flex flex-col py-8">
      <div className="grow bg-muted" />
      <footer>
        <div className="max-w-screen-xl mx-auto">
          <div className="h-full flex flex-col md:flex-row items-center md:items-start justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 gap-8 md:gap-0">
            <div className="w-full md:w-auto flex flex-col items-center md:items-start">
              {/* Logo */}
              <Logo />

              <ul className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4">
                {footerLinks.map(({ title, to }) => (
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

            {/* Subscribe Newsletter */}
            <div className="max-w-xs w-full flex flex-col items-center md:items-end">
              <h6 className="font-semibold">Stay up to date</h6>
              <form className="mt-6 flex flex-col sm:flex-row w-full gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full sm:w-auto"
                />
                <Button className="w-full sm:w-auto">Subscribe</Button>
              </form>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="h-full flex flex-col sm:flex-row items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 gap-2 sm:gap-0">
            {/* Copyright */}
            <span className="text-muted-foreground text-center sm:text-left">
              &copy; {new Date().getFullYear()}{" "}
              <Link to="/" target="_blank">
                Furti
              </Link>
              . All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
