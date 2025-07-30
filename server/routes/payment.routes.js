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

router.use(authenticateUser);

router.post("/create-payment-intent", createPaymentIntent);

router.post("/create-cod-order", createCashOnDeliveryOrder);

router.post("/confirm-payment", confirmPayment);

router.get("/history", getPaymentHistory);

router.get("/order/:orderId", getPaymentByOrderId);

router.post("/update-status", updatePaymentStatus);

router.get("/pending", getPendingPayments);

export default router;
