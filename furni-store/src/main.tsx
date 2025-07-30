import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Provider } from "react-redux";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { store } from "./store/index";
import { routeTree } from "./routeTree.gen";
import "./index.css";


const router = createRouter({ routeTree });


declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000, 
      gcTime: 60 * 60 * 1000, 
      refetchOnWindowFocus: false, 
      refetchOnMount: false, 
      refetchOnReconnect: false, 
      refetchInterval: false, 
      retry: 1, 
    },
  },
});


const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={3000} />
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
