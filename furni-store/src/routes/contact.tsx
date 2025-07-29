import { createFileRoute } from "@tanstack/react-router";
import Help from "../pages/Help";

export const Route = createFileRoute("/contact")({
  component: Help,
});
