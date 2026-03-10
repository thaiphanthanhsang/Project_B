import express from "express";
import { pool } from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";
import superadminMiddleware from "../middleware/superadminMiddleware.js";

const router = express.Router();

// GET /api/activities – Get all activity logs (Superadmin only)
router.get("/", [authMiddleware, superadminMiddleware], async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT a.id, a.action, a.details, a.created_at, u.name as admin_name, u.email as admin_email, u.role as admin_role
       FROM activity_logs a 
       JOIN users u ON a.user_id = u.id 
       ORDER BY a.created_at DESC 
       LIMIT 100`
        );
        res.json(rows);
    } catch (err) {
        console.error("Error fetching activity logs:", err.message);
        res.status(500).send("Server Error");
    }
});

export default router;
