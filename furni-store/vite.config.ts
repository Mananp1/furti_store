import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:5001",
        changeOrigin: true,
        secure: process.env.NODE_ENV === "production",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["@tanstack/react-router"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-slot",
            "@radix-ui/react-tabs",
          ],
          icons: ["lucide-react"],
          utils: ["clsx", "tailwind-merge", "class-variance-authority"],
          redux: ["@reduxjs/toolkit", "react-redux"],
          query: ["@tanstack/react-query"],
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          shadcn: [
            "@/components/ui/button",
            "@/components/ui/card",
            "@/components/ui/input",
          ],
          cart: ["@/features/cart/cartSlice"],
          user: ["@/features/user/userSlice"],
          wishlist: ["@/features/wishlist/wishlistSlice"],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@tanstack/react-router",
      "@tanstack/react-query",
      "@reduxjs/toolkit",
      "react-redux",
      "react-hook-form",
      "zod",
      "lucide-react",
    ],
  },
});
