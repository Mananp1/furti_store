import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/NavBar/NavBar";
import NotFoundPage from "@/pages/NotFoundPage";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: () => <NotFoundPage />,
});
