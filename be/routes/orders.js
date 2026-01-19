import express from "express";
import { pool } from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/orders/my
 */
router.get("/my", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;

        const [orders] = await pool.query(
            `
            SELECT 
                id,
                total_price,
                status,
                created_at,
                cancel_request,
                cancel_by,
                cancel_reason
            FROM orders
            WHERE user_id = ?
            ORDER BY created_at DESC
            `,
            [userId]
        );

        res.json(orders);
    } catch (err) {
        console.error("Get my orders error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * PUT /api/orders/:id/request-cancel
 */
router.put("/:id/request-cancel", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const { reason } = req.body;
    const orderId = req.params.id;

    try {
        const [[order]] = await pool.query(
            "SELECT * FROM orders WHERE id = ? AND user_id = ?",
            [orderId, userId]
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (!["pending", "confirmed"].includes(order.status)) {
            return res.status(400).json({ message: "Không thể yêu cầu hủy" });
        }

        // Đánh dấu yêu cầu hủy
        await pool.query(
            `
            UPDATE orders
            SET cancel_request = true,
                cancel_by = 'user',
                cancel_reason = ?
            WHERE id = ?
            `,
            [reason || null, orderId]
        );

        // Thông báo admin
        await pool.query(
            `
            INSERT INTO admin_notifications (order_id, type, message)
            VALUES (?, ?, ?)
            `,
            [
                orderId,
                "cancel_request",
                `Đơn #${orderId} có yêu cầu hủy. Lý do: ${reason || "Không có"}`
            ]
        );

        res.json({ message: "Đã gửi yêu cầu hủy, chờ admin xử lý" });
    } catch (err) {
        console.error("Request cancel error:", err);
        res.status(500).json({ message: "Không thể gửi yêu cầu hủy" });
    }
});

export default router;
