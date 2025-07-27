import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

// All wishlist routes require authentication
router.use(authenticateUser);

// GET /api/wishlist - Get user's wishlist
router.get("/", getUserWishlist);

// POST /api/wishlist/add - Add item to wishlist
router.post("/add", addToWishlist);

// DELETE /api/wishlist/remove/:productId - Remove item from wishlist
router.delete("/remove/:productId", removeFromWishlist);

// DELETE /api/wishlist/clear - Clear entire wishlist
router.delete("/clear", clearWishlist);

export default router;
