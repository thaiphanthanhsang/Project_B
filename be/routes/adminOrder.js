import express from "express";
import { pool } from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/**
 * GET /api/admin/orders
 * Lấy danh sách đơn hàng
 */
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [orders] = await pool.query(`
      SELECT 
        o.id,
        o.full_name,
        o.phone,
        o.total_price,
        o.status,
        o.created_at
      FROM orders o
      ORDER BY o.created_at DESC
    `);

        res.json(orders);
    } catch (err) {
        console.error("Admin get orders error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * GET /api/admin/orders/pending/count
 * Đếm số đơn chờ xử lý
 */
router.get(
    "/pending/count",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const [[result]] = await pool.query(`
          SELECT COUNT(*) AS total
          FROM orders
          WHERE status IN ('pending', 'confirmed')
        `);

            res.json({ total: result.total });
        } catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * GET /api/admin/orders/:id
 * Lấy chi tiết đơn hàng
 */
router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const orderId = req.params.id;

        const [items] = await pool.query(
            `
      SELECT 
        oi.id,
        oi.product_id,
        p.name,
        oi.color,
        oi.size,
        oi.quantity,
        oi.price
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = ?
      `,
            [orderId]
        );

        res.json({ items });
    } catch (err) {
        console.error("Admin get order detail error:", err);
        res.status(500).json({ message: "Server error" });
    }
});


router.put("/:id/cancel", authMiddleware, adminMiddleware, async (req, res) => {
    const orderId = req.params.id;
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const [[order]] = await conn.query(
            "SELECT * FROM orders WHERE id = ? FOR UPDATE",
            [orderId]
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status === "cancelled") {
            return res.status(400).json({ message: "Đơn đã bị hủy" });
        }

        // Hoàn kho
        const [items] = await conn.query(
            "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
            [orderId]
        );

        for (const item of items) {
            await conn.query(
                "UPDATE products SET quantity = quantity + ? WHERE id = ?",
                [item.quantity, item.product_id]
            );
        }

        // HỦY ĐƠN – FIX LOGIC QUAN TRỌNG 
        await conn.query(
            `
            UPDATE orders
            SET status = 'cancelled',
                cancel_request = false,
                cancel_by = 'admin',
                cancelled_at = NOW()
            WHERE id = ?
            `,
            [orderId]
        );

        await conn.commit();
        res.json({ message: "Admin đã hủy đơn thành công" });
    } catch (err) {
        await conn.rollback();
        console.error("Admin cancel order error:", err);
        res.status(500).json({ message: "Hủy đơn thất bại" });
    } finally {
        conn.release();
    }
});



/**
 * PUT /api/admin/orders/:id/status
 * Cập nhật trạng thái đơn
 */
router.put(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        const { status: newStatus } = req.body;
        const orderId = req.params.id;

        const conn = await pool.getConnection();

        try {
            await conn.beginTransaction();

            // 1. Lấy trạng thái hiện tại của đơn
            const [[order]] = await conn.query(
                "SELECT status FROM orders WHERE id = ? FOR UPDATE",
                [orderId]
            );

            if (!order) {
                throw new Error("Order not found");
            }

            const currentStatus = order.status;

            // 2. KHÓA TRẠNG THÁI KHÔNG HỢP LỆ
            if (currentStatus === "completed") {
                throw new Error("Completed order cannot be changed");
            }

            if (currentStatus === "cancelled") {
                throw new Error("Order already cancelled");
            }

            // 3. HỦY ĐƠN → HOÀN KHO
            if (newStatus === "cancelled") {
                // Lấy các item trong đơn
                const [items] = await conn.query(
                    "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
                    [orderId]
                );

                // Trả kho
                for (const item of items) {
                    await conn.query(
                        `
              UPDATE products
              SET quantity = quantity + ?
              WHERE id = ?
              `,
                        [item.quantity, item.product_id]
                    );
                }
            }

            // 4. Cập nhật trạng thái đơn
            await conn.query(
                "UPDATE orders SET status = ? WHERE id = ?",
                [newStatus, orderId]
            );

            await conn.commit();
            res.json({ message: "Order status updated successfully" });
        } catch (err) {
            await conn.rollback();
            console.error(err);
            res.status(400).json({ message: err.message });
        } finally {
            conn.release();
        }
    }
);


export default router;
