import { useState } from "react";
import { toast } from "react-toastify";

export const useFooterLogic = () => {
  const [email, setEmail] = useState("");

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

  const handleNewsletterSubmit = (email: string) => {
    if (!email) {
      toast.error("Please enter your email address");
      return false;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // TODO: Implement newsletter subscription logic
    toast.success("Thank you for subscribing!");
    return true;
  };

  return {
    footerLinks,
    email,
    setEmail,
    handleNewsletterSubmit,
  };
};
