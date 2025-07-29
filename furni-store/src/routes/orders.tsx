import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "@/components/Orders";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});
