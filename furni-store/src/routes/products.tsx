
import ProductsPage from "@/pages/Products";
import { Outlet, useParams } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products")({
  component: ProductsLayout,
});

function ProductsLayout() {
  const { id } = useParams({ strict: false });
  return <div>{id ? <Outlet /> : <ProductsPage />}</div>;
}
