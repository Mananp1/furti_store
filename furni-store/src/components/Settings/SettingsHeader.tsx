interface SettingsHeaderProps {
  title?: string;
  description?: string;
}

export const SettingsHeader = ({
  title = "Settings",
  description = "Manage your account settings and preferences",
}: SettingsHeaderProps) => {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground mt-2 text-sm sm:text-base">
        {description}
      </p>
    </div>
  );
};
