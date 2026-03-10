import { pool } from "../db.js";

const superadminMiddleware = async (req, res, next) => {
    try {
        const userId = req.userId;

        const [users] = await pool.query(
            "SELECT role FROM users WHERE id = ?",
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const { role } = users[0];

        if (role !== "superadmin") {
            return res.status(403).json({ message: "Access denied. Superadmin only." });
        }

        next();
    } catch (error) {
        console.error("Superadmin Middleware Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default superadminMiddleware;
