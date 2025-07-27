import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

// All cart routes require authentication
router.use(authenticateUser);

// GET /api/cart - Get user's cart
router.get("/", getUserCart);

// POST /api/cart/add - Add item to cart
router.post("/add", addToCart);

// PUT /api/cart/update - Update item quantity
router.put("/update", updateCartItem);

// DELETE /api/cart/remove/:productId - Remove item from cart
router.delete("/remove/:productId", removeFromCart);

// DELETE /api/cart/clear - Clear entire cart
router.delete("/clear", clearCart);

export default router;
