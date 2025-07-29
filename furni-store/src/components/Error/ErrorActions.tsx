import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { type ReactNode } from "react";

interface ActionButton {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "outline";
  icon?: ReactNode;
}

interface ErrorActionsProps {
  actions: ActionButton[];
  layout?: "vertical" | "horizontal";
  className?: string;
}

export const ErrorActions = ({
  actions,
  layout = "vertical",
  className = "",
}: ErrorActionsProps) => {
  const layoutClasses =
    layout === "horizontal" ? "flex gap-2" : "flex flex-col gap-2";

  return (
    <div className={`${layoutClasses} ${className}`}>
      {actions.map((action, index) => {
        const buttonContent = (
          <>
            {action.icon}
            {action.label}
          </>
        );

        if (action.href) {
          return (
            <Button key={index} variant={action.variant || "default"} asChild>
              <Link
                to={action.href}
                className="flex items-center justify-center gap-2"
              >
                {buttonContent}
              </Link>
            </Button>
          );
        }

        return (
          <Button
            key={index}
            variant={action.variant || "default"}
            onClick={action.onClick}
            className="flex items-center justify-center gap-2"
          >
            {buttonContent}
          </Button>
        );
      })}
    </div>
  );
};
