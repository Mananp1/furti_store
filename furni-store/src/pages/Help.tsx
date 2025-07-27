import { Logo } from "@/components/NavBar/Logo";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  message: z.string().min(5, "Tell us more..."),
});

const AboutPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      message: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Handle form submission here
    console.log("Form submitted:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-6">
      <div className="max-w-sm w-full flex flex-col items-center border rounded-lg p-6">
        <Logo />
        <p className="mt-4 mb-4 text-xl font-bold tracking-tight">
          Submit a Ticket
        </p>

        <Form {...form}>
          <form
            className="w-full space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
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
              Submit
            </Button>
          </form>
        </Form>

        <div className="mt-5 space-y-5">
          <p className="text-sm text-center">
            We will get back to you as soon as possible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
