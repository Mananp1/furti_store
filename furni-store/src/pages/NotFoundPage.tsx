import { ErrorPage } from "@/components/Error";

export default function NotFoundPage() {
  return (
    <ErrorPage
      type="not-found"
      title="404 Page Not Found"
      description="Sorry, we couldn't find the page you're looking for."
      actions={[
        {
          label: "Return to Home",
          href: "/",
          variant: "default",
        },
      ]}
    />
  );
}
