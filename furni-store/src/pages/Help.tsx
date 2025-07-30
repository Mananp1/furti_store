import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { submitContactForm } from "@/lib/contact";
import {
  HelpLayout,
  HelpHeader,
  HelpForm,
  HelpFooter,
} from "@/components/FooterPages";

const Help = () => {
  const { data: session } = useSession();

  const handleSubmit = async (data: any) => {
    try {
      console.log("📧 Submitting contact form:", data);

      const response = await submitContactForm(data);

      if (response.success) {
        if (session?.user) {
          toast.success(
            "Message sent successfully. We'll respond to " +
              session.user.email +
              "."
          );
        } else {
          toast.success(
            "Message sent successfully. We'll respond to " + data.email + "."
          );
        }
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error: any) {
      console.error("❌ Contact form submission error:", error);
      toast.error(error.message || "Failed to send message. Please try again.");
    }
  };

  return (
    <HelpLayout>
      <HelpHeader />
      <HelpForm onSubmit={handleSubmit} submitButtonText="Send Message" />
      <HelpFooter />
    </HelpLayout>
  );
};

export default Help;
