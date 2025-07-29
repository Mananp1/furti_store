import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  message: z.string().min(5, "Tell us more..."),
});

type FormData = z.infer<typeof formSchema>;

interface HelpFormProps {
  onSubmit?: (data: FormData) => void;
  submitButtonText?: string;
}

export const HelpForm = ({
  onSubmit,
  submitButtonText = "Submit",
}: HelpFormProps) => {
  const { data: session, isPending } = useSession();

  const form = useForm<FormData>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      message: "",
    },
    resolver: zodResolver(formSchema),
  });

  // Auto-populate form fields when user is signed in
  useEffect(() => {
    if (session?.user && !isPending) {
      const userEmail = session.user.email || "";
      const userName = session.user.name || "";
      const nameParts = userName.split(" ");
      const userFirstName = nameParts[0] || "";
      const userLastName = nameParts.slice(1).join(" ") || "";

      form.setValue("email", userEmail);
      if (userFirstName) form.setValue("firstName", userFirstName);
      if (userLastName) form.setValue("lastName", userLastName);
    }
  }, [session, isPending, form]);

  const handleSubmit = (data: FormData) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      // Default behavior
      console.log("Form submitted:", data);
    }
  };

  return (
    <Form {...form}>
      <form
        className="w-full space-y-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {/* Auto-population notice for signed-in users */}
        {isPending && (
          <div className="p-3 bg-muted/50 border border-muted rounded-lg mb-4">
            <p className="text-sm text-muted-foreground">
              Loading your account information...
            </p>
          </div>
        )}

        {session?.user && !isPending && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg mb-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">
                Signed in as {session.user.email}
              </span>
            </p>
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Your email"
                  className="w-full"
                  readOnly={!!session?.user?.email}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-sm text-red-600 mt-1" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Your first name"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-sm text-red-600 mt-1" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Your last name"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-sm text-red-600 mt-1" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="col-span-12 flex flex-col items-start gap-2">
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us more..."
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage className="text-sm text-red-600 mt-1" />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-4 w-full">
          {submitButtonText}
        </Button>
      </form>
    </Form>
  );
};
