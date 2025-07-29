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


router.use(authenticateUser);


router.get("/profile", getUserProfile);
router.post("/profile", createUserProfile);
router.put("/profile", updateUserProfile);
router.delete("/profile", deleteUserAccount);


router.post("/addresses", addAddress);
router.put("/addresses/:addressId", updateAddress);

  
router.get("/states", getStates);
router.get("/cities/:state", getCities);

export default router;
