import {
  ErrorLayout,
  ErrorIcon,
  ErrorContent,
  ErrorActions,
} from "@/components/Error";
import { type ReactNode } from "react";

interface ErrorPageProps {
  type: "not-found" | "unauthorized" | "already-logged-in" | "generic";
  title: string;
  description: string;
  actions: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: "default" | "outline";
    icon?: ReactNode;
  }>;
  children?: ReactNode;
  layout?: "card" | "centered";
}

export const ErrorPage = ({
  type,
  title,
  description,
  actions,
  children,
  layout = "centered",
}: ErrorPageProps) => {
  return (
    <ErrorLayout variant={layout}>
      <ErrorIcon type={type} />
      <ErrorContent title={title} description={description}>
        <ErrorActions actions={actions} />
        {children}
      </ErrorContent>
    </ErrorLayout>
  );
};
