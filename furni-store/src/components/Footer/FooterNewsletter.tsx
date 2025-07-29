import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface FooterNewsletterProps {
  title?: string;
  placeholder?: string;
  buttonText?: string;
  onSubmit?: (email: string) => boolean;
}

export const FooterNewsletter = ({
  title = "Stay up to date",
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  onSubmit,
}: FooterNewsletterProps) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onSubmit) {
      const success = onSubmit(email);
      if (success) {
        setEmail("");
      }
    }
  };

  return (
    <div className="max-w-xs w-full flex flex-col items-center md:items-end">
      <h6 className="font-semibold">{title}</h6>
      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col sm:flex-row w-full gap-2"
      >
        <Input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full sm:w-auto"
        />
        <Button type="submit" className="w-full sm:w-auto">
          {buttonText}
        </Button>
      </form>
    </div>
  );
};
