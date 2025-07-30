import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { OctagonAlert, Edit, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";

const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface AccountTabProps {
  session: any;
  profile: any;
  isUpdating: boolean;
  isDeleting: boolean;
  onUpdateProfile: (data: ProfileFormData) => void;
  onDeleteAccount: () => void;
}

export const AccountTab = ({
  session,
  profile,
  isUpdating,
  isDeleting,
  onUpdateProfile,
  onDeleteAccount,
}: AccountTabProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
      });
    }
  }, [profile, form]);

  const handleUpdateProfile = (data: ProfileFormData) => {
    onUpdateProfile(data);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">
            Account Information
          </CardTitle>
          <CardDescription className="text-sm">
            View and manage your account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-all">
                {session.user.email}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Account Type</label>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {session.user.image ? "Google" : "Email"}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="font-medium text-sm sm:text-base">
                  Profile Information
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Update your personal information
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="mr-2 h-4 w-4" />
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </Button>
            </div>

            {isEditing && (
              <div className="p-4 border rounded-lg bg-muted/30">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleUpdateProfile)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your first name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
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
                                placeholder="Enter your last name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}

            {profile && !isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    First Name
                  </label>
                  <p className="text-sm mt-1">
                    {profile.firstName || "Not set"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Name
                  </label>
                  <p className="text-sm mt-1">
                    {profile.lastName || "Not set"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Member Since
                  </label>
                  <p className="text-sm mt-1">
                    {profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
            
      <Card className="border-destructive/20">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-destructive text-lg sm:text-xl">
            Danger Zone
          </CardTitle>
          <CardDescription className="text-sm">
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-destructive flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm sm:text-base">
                  Delete Account
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full sm:w-auto"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader className="items-center">
                  <AlertDialogTitle>
                    <div className="mb-2 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                      <OctagonAlert className="h-7 w-7 text-destructive" />
                    </div>
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-[15px] text-center">
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers,
                    including:
                  </AlertDialogDescription>
                  <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                    <li>• Your profile information</li>
                    <li>• Order history</li>
                    <li>• Wishlist items</li>
                    <li>• Account preferences</li>
                  </ul>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-2 sm:justify-center">
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({ variant: "destructive" })}
                    onClick={onDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
