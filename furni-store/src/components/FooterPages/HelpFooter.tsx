interface HelpFooterProps {
  message?: string;
}

export const HelpFooter = ({
  message = "We will get back to you as soon as possible.",
}: HelpFooterProps) => {
  return (
    <div className="mt-5 space-y-5">
      <p className="text-sm text-center">{message}</p>
    </div>
  );
};
