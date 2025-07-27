import SingleProduct from "@/pages/SingleProduct";
import { createFileRoute } from "@tanstack/react-router";

// ✅ Then pass it to `createFileRoute`
export const Route = createFileRoute("/products/$id")({
  component: SingleProduct,
});
