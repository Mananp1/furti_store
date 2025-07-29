import express from "express";
import {
  createPaymentIntent,
  createCashOnDeliveryOrder,
  confirmPayment,
  getPaymentHistory,
  getPaymentByOrderId,
  updatePaymentStatus,
  getPendingPayments,
} from "../controllers/payment.controller.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Protected routes (require authentication)
router.use(authenticateUser);

// Payment intent creation
router.post("/create-payment-intent", createPaymentIntent);

// Cash on delivery order creation
router.post("/create-cod-order", createCashOnDeliveryOrder);

// Payment confirmation
router.post("/confirm-payment", confirmPayment);

// Payment history
router.get("/history", getPaymentHistory);

// Get payment by order ID
router.get("/order/:orderId", getPaymentByOrderId);

// Update payment status
router.post("/update-status", updatePaymentStatus);

// Get pending payments
router.get("/pending", getPendingPayments);

export default router;
