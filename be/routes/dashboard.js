import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { dashboardController } from "../controllers/dashboardController.js";

const router = express.Router();

// Middleware applied to all dashboard routes
router.use([authMiddleware, adminMiddleware]);

// --- Dashboard Endpoints ---

router.get("/stats", dashboardController.getStats);
router.get("/sales-chart", dashboardController.getSalesChart);
router.get("/top-products", dashboardController.getTopProducts);
router.get("/trending-products", dashboardController.getTrendingProducts);
router.get("/inventory-health", dashboardController.getInventoryHealth);
router.get("/order-status", dashboardController.getOrderStatus);
router.get("/pending-vs-completed", dashboardController.getPendingVsCompleted);

// --- Analytics & Actions ---
router.get("/search-analytics", dashboardController.getSearchAnalytics);
router.get("/fulfillment-priority", dashboardController.getFulfillmentPriority);
router.post("/apply-discount", dashboardController.applyDiscount);
router.get("/low-stock", dashboardController.getLowStockList);

export default router;
