import express from "express";
import { pool } from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/**
 * GET /api/admin/notifications
 */
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
    const [rows] = await pool.query(`
    SELECT *
    FROM admin_notifications
    ORDER BY created_at DESC
    LIMIT 20
  `);

    res.json(rows);
});

/**
 * GET /api/admin/notifications/unread/count
 */
router.get(
    "/unread/count",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        const [[row]] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM admin_notifications
      WHERE is_read = false
    `);

        res.json({ total: row.total });
    }
);

/**
 * PUT /api/admin/notifications/:id/read
 */
router.put("/:id/read", authMiddleware, adminMiddleware, async (req, res) => {
    await pool.query(
        "UPDATE admin_notifications SET is_read = true WHERE id = ?",
        [req.params.id]
    );

    res.json({ message: "Marked as read" });
});

export default router;
