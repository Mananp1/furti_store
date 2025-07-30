import SingleProduct from "@/pages/SingleProduct";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/products/$id")({
  component: SingleProduct,
});
