import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  clearCartAfterPayment,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/", getUserCart);

router.post("/add", addToCart);

router.put("/update", updateCartItem);

router.delete("/remove/:productId", removeFromCart);

router.delete("/clear", clearCart);

router.post("/clear-after-payment", clearCartAfterPayment);

export default router;
