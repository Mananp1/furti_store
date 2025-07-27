import { useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  OctagonAlert,
  User,
  MapPin,
  Bell,
  Shield,
  Trash2,
  Edit,
} from "lucide-react";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AddressManagement from "@/components/AddressManagement";

// Validation schema for profile form
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

export default function Settings() {
  const { data: session, isPending } = useSession();
  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);

  const {
    profile,
    isUpdating,
    isDeleting,
    updateProfile,
    deleteAccount,
    loadProfile,
  } = useUserProfile();

  // Load profile when component mounts
  useEffect(() => {
    if (session) {
      loadProfile();
    }
  }, [session, loadProfile]);

  // Form setup
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
    },
  });

  // Update form values when profile changes
  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
      });
    }
  }, [profile, form]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-2">Not Authorized</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to access your settings.
          </p>
          <Button asChild>
            <a href="/login">Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = (data: ProfileFormData) => {
    updateProfile(data);
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    deleteAccount();
  };

  const tabOptions = [
    { value: "account", label: "Account", icon: User },
    { value: "addresses", label: "Addresses", icon: MapPin },
    { value: "notifications", label: "Notifications", icon: Bell },
    { value: "privacy", label: "Privacy", icon: Shield },
  ];

  const getTabContent = (tabValue: string) => {
    switch (tabValue) {
      case "account":
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

                  {/* Edit Profile Form */}
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

                  {/* Display current profile info */}
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

            {/* Danger Zone */}
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
                          This action cannot be undone. This will permanently
                          delete your account and remove all your data from our
                          servers, including:
                        </AlertDialogDescription>
                        <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                          <li>• Your profile information</li>
                          <li>• All saved addresses</li>
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
                          onClick={handleDeleteAccount}
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

      case "addresses":
        return (
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">
                  Address Management
                </CardTitle>
                <CardDescription className="text-sm">
                  Manage your shipping and billing addresses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddressManagement />
              </CardContent>
            </Card>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-sm">
                  Choose how you want to be notified about updates and offers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 sm:py-8">
                  <Bell className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    Notification Settings Coming Soon
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Configure your email and push notification preferences.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">
                  Privacy & Security
                </CardTitle>
                <CardDescription className="text-sm">
                  Manage your privacy settings and account security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 sm:py-8">
                  <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    Privacy Settings Coming Soon
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Control your data privacy and security preferences.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Mobile Dropdown */}
        <div className="sm:hidden mb-6">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {tabOptions.find((tab) => tab.value === activeTab)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {tabOptions.map((tab) => {
                const Icon = tab.icon;
                return (
                  <SelectItem key={tab.value} value={tab.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden sm:block">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4 gap-1">
              {tabOptions.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div className="mt-6">{getTabContent(activeTab)}</div>
      </div>
    </div>
  );
}
