import FAQ from "@/pages/FAQ";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
  component: FAQ,
});
