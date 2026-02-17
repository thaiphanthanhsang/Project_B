import express from "express";
import { orderController } from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/orders
 * Place a new order
 */
router.post("/", authMiddleware, orderController.placeOrder);

/**
 * GET /api/orders/my
 * Get order history
 */
router.get("/my", authMiddleware, orderController.getMyOrders);

/**
 * GET /api/orders/:id
 * Get order details
 */
router.get("/:id", authMiddleware, orderController.getOrderDetails);

/**
 * PUT /api/orders/:id/cancel
 * Cancel order (User triggers)
 */
router.put("/:id/cancel", authMiddleware, orderController.cancelOrder);

/**
 * PUT /api/orders/:id/payment-status
 * Update payment status (Webhook/Admin)
 */
router.put("/:id/payment-status", authMiddleware, orderController.updatePaymentStatus);

export default router;
