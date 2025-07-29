import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import {
  SettingsLayout,
  SettingsHeader,
  SettingsTabs,
  AccountTab,
  useSettingsLogic,
} from "@/components/Settings";

export default function Settings() {
  const { data: session, isPending } = useSession();
  const { activeTab, setActiveTab, tabOptions } = useSettingsLogic();

  const { profile, isUpdating, isDeleting, updateProfile, deleteAccount } =
    useUserProfile();

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

  return (
    <SettingsLayout>
      <SettingsHeader />
      <SettingsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabOptions={tabOptions}
      />
      <div className="mt-6">
        <AccountTab
          session={session}
          profile={profile}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          onUpdateProfile={updateProfile}
          onDeleteAccount={deleteAccount}
        />
      </div>
    </SettingsLayout>
  );
}
