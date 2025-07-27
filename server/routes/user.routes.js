import express from "express";
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteUserAccount,
  getStates,
  getCities,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication middleware to all user routes
router.use(authenticateUser);

// Profile routes
router.get("/profile", getUserProfile);
router.post("/profile", createUserProfile);
router.put("/profile", updateUserProfile);
router.delete("/profile", deleteUserAccount);

// Address routes (only one address allowed)
router.post("/addresses", addAddress);
router.put("/addresses/:addressId", updateAddress);

// Location data routes (no auth required for these)
router.get("/states", getStates);
router.get("/cities/:state", getCities);

export default router;
