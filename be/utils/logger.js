import { pool } from "../db.js";

export const logActivity = async (userId, action, details = "") => {
    if (!userId) return;

    try {
        await pool.query(
            "INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)",
            [userId, action, details]
        );
    } catch (error) {
        console.error("Failed to insert activity log:", error);
    }
};
