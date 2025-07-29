import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();


router.use(authenticateUser);


router.get("/", getUserWishlist);


router.post("/add", addToWishlist);


router.delete("/remove/:productId", removeFromWishlist);


router.delete("/clear", clearWishlist);

export default router;
