import express from "express";
import { createOrder, getMyOrders, updateOrderStatus, cancelOrder } from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js"; // assume you have middleware

const router = express.Router();

// User routes
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.put("/:id/cancel", protect, cancelOrder);

// Admin routes
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;