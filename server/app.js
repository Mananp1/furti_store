// src/app.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import { getConnectionStatus } from "./utils/db.js";
import { handleStripeWebhook } from "./controllers/payment.controller.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://furnishly.online",
      "https://www.furnishly.online",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Stripe webhook route (must be raw body - no JSON parsing)
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Better Auth routes (must be before JSON parsing)
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());

// API routes (with JSON parsing)
app.use("/api/payments", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/contact", contactRoutes);

app.get("/api/health", (req, res) => {
  const dbStatus = getConnectionStatus();
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: {
      connected: dbStatus.isConnected,
      readyState: dbStatus.readyState,
    },
    services: {
      auth: "running",
      payments: "running",
      products: "running",
    },
  });
});

app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// 404 handler
app.use("*", (req, res) => {
  console.log("❌ Route not found:", {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
  });
  res.status(404).json({
    error: "Route not found",
    message: `${req.method} ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Global error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});
