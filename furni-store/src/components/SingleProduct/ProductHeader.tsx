import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface ProductHeaderProps {
  backUrl?: string;
  backText?: string;
}

export const ProductHeader = ({
  backUrl = "/products",
  backText = "Back to Products",
}: ProductHeaderProps) => {
  return (
    <div className="max-w-5xl mt-6 mx-auto px-4">
      <Button>
        <Link to={backUrl} className="flex items-center space-x-2">
          <ArrowLeft />
          <span>{backText}</span>
        </Link>
      </Button>
    </div>
  );
};
