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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof formSchema>;

interface AuthFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  submitButtonText: string;
  isLoading?: boolean;
}

export const AuthForm = ({
  onSubmit,
  submitButtonText,
  isLoading = false,
}: AuthFormProps) => {
  const form = useForm<FormData>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(formSchema),
    mode: "onChange", 
  });

  return (
    <div className="w-full mt-8">
      <Form {...form}>
        <form
          className="w-full space-y-6"
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
                    placeholder="Enter your email address"
                    className="w-full"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {submitButtonText}
          </Button>
        </form>
      </Form>
    </div>
  );
};
