import { Link } from "@tanstack/react-router";

interface FooterCopyrightProps {
  companyName?: string;
  companyUrl?: string;
  additionalText?: string;
}

export const FooterCopyright = ({ 
  companyName = "Furti",
  companyUrl = "/",
  additionalText = "All rights reserved."
}: FooterCopyrightProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <span className="text-muted-foreground text-center sm:text-left">
      &copy; {currentYear}{" "}
      <Link to={companyUrl} target="_blank">
        {companyName}
      </Link>
      . {additionalText}
    </span>
  );
}; 