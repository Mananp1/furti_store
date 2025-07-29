import express from "express";
import {
  submitContactForm,
  getAllContacts,
  updateContactStatus,
} from "../controllers/contact.controller.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();


router.post("/submit", submitContactForm);


router.use(authenticateUser);


router.get("/", getAllContacts);


router.patch("/:contactId/status", updateContactStatus);

export default router;
