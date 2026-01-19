import { pool } from "../db.js";

const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.userId;

    const [rows] = await pool.query("SELECT role FROM users WHERE id = ?", [
      userId,
    ]);

    if (rows.length === 0 || rows[0].role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin privileges required." });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Server error while checking admin rights" });
  }
};

export default adminMiddleware;
