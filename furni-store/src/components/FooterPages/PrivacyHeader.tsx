interface PrivacyHeaderProps {
  title?: string;
  lastUpdated?: string;
  description?: string;
}

export const PrivacyHeader = ({
  title = "Privacy Policy",
  lastUpdated = "March 14, 2024",
  description = 'Please read this Privacy Policy carefully before using the https://example.com website (the "Service") operated by Example Company ("us", "we", or "our").',
}: PrivacyHeaderProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p>
        Last updated: {lastUpdated}
        <br />
        <br />
        {description}
      </p>
    </div>
  );
};
