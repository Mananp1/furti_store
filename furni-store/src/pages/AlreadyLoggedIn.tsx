import {
  ErrorLayout,
  ErrorCard,
  ErrorActions,
  useErrorLogic,
} from "@/components/Error";

export default function AlreadyLoggedIn() {
  const { handleLogout } = useErrorLogic();

  const actions = [
    {
      label: "Continue to Home",
      href: "/",
      variant: "default" as const,
    },
    {
      label: "Log Out",
      onClick: handleLogout,
      variant: "outline" as const,
    },
  ];

  return (
    <ErrorLayout variant="card">
      <ErrorCard title="Already Logged In">
        <p className="text-center text-gray-600">
          You are already logged in. Would you like to log out or continue to
          the home page?
        </p>
        <ErrorActions actions={actions} />
      </ErrorCard>
    </ErrorLayout>
  );
}
